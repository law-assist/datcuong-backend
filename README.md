# LVTN VBPL Backend

Backend API cho hệ thống tra cứu Văn bản Pháp luật (VBPL) Việt Nam — được xây dựng như đồ án tốt nghiệp.

---

## Mục lục

- [Tổng quan dự án](#tổng-quan-dự-án)
- [Tech Stack](#tech-stack)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn chạy local](#hướng-dẫn-chạy-local)
- [Biến môi trường](#biến-môi-trường)
- [API Endpoints](#api-endpoints)
- [Ghi chú bổ sung](#ghi-chú-bổ-sung)

---

## Tổng quan dự án

Hệ thống cung cấp backend cho ứng dụng tra cứu và liên kết văn bản pháp luật Việt Nam. Dữ liệu được thu thập tự động (crawl) từ trang **thuvienphapluat.vn**, chuẩn hóa thành cấu trúc có phân cấp (phần → chương → mục → điều → khoản → điểm), lưu vào MongoDB, và được phục vụ qua REST API.

**Chức năng chính:**

- **Thu thập dữ liệu (Crawler):** Tự động crawl văn bản pháp luật từ thuvienphapluat.vn bằng Puppeteer + Cheerio, phân tích cú pháp văn bản thành cấu trúc dữ liệu có thứ bậc.
- **Tìm kiếm văn bản:** Full-text search theo tên, lĩnh vực, loại văn bản, cơ quan ban hành, năm ban hành, có phân trang.
- **Liên kết tham chiếu tự động:** Tích hợp với microservice AI bên ngoài để tự động phát hiện và lưu quan hệ tham chiếu giữa các văn bản.
- **Xác thực người dùng:** Hệ thống đăng ký/đăng nhập với JWT (access token 1 giờ + refresh token 7 ngày).
- **Hỏi đáp luật sư:** Người dùng gửi yêu cầu tư vấn pháp lý; luật sư phản hồi trong hệ thống.

**Kiến trúc tổng quan:**

```
Client ──► NestJS REST API ──► MongoDB
                │
                └──► AI Microservice (reference matching)
                └──► thuvienphapluat.vn (Puppeteer crawler)
```

---

## Tech Stack

### Runtime & Framework

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Node.js | ≥18 | Runtime |
| NestJS | ^10.0.0 | Application framework |
| TypeScript | ^5.1.3 | Ngôn ngữ lập trình |

### Database

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| MongoDB | — | Cơ sở dữ liệu chính |
| Mongoose | ^7.6.3 | ODM cho MongoDB |

### Xác thực & Bảo mật

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| @nestjs/passport | ^10.0.3 | Passport.js integration |
| passport-jwt | ^4.0.1 | JWT authentication strategy |
| @nestjs/jwt | ^10.2.0 | JWT token service |
| cookie-parser | ^1.4.6 | Cookie parsing |
| Node.js crypto | (built-in) | SHA-256 password hashing |

### Crawler & HTML Parsing

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Puppeteer | ^21.5.2 | Headless Chromium — crawl trang động |
| Cheerio | ^1.0.0-rc.12 | HTML parsing |
| Axios | ^1.6.1 | HTTP client |

### Data Mapping & Validation

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| @automapper/nestjs | ^8.2.1 | DTO ↔ Entity mapping |
| @automapper/classes | ^8.2.1 | Class-based strategy |
| class-validator | ^0.14.0 | Validation decorators |
| class-transformer | ^0.5.1 | Object transformation |

### Tiện ích

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| moment-timezone | ^0.5.43 | Xử lý múi giờ (Asia/Ho_Chi_Minh) |
| @nestjs/swagger | ^7.1.17 | Swagger UI tại `/api` |
| @nestjs/config | ^3.1.1 | Quản lý biến môi trường |

### Dev Tools

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Jest + ts-jest | ^29.x | Unit test & E2E test |
| ESLint + Prettier | ^8.x / ^3.x | Linting & formatting |
| Supertest | ^6.3.3 | HTTP integration testing |

### DevOps & Deployment

| Công nghệ | Mục đích |
|---|---|
| Docker (node:24-alpine + Chromium) | Containerization |
| GitHub Actions | CI/CD tự động build & push Docker image |
| Docker Hub | Container registry (`kanghcmut/lvtn-backend-app`) |

---

## Cấu trúc dự án

```
datcuong-backend/
├── .github/
│   └── workflows/
│       ├── Dockerfile          # Dockerfile dùng cho CI/CD (inject secrets qua ARG)
│       └── main.yml            # GitHub Actions pipeline
├── src/
│   ├── main.ts                 # Bootstrap app, cấu hình CORS, Swagger, timezone
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts       # Health-check endpoint
│   ├── app.service.ts
│   ├── common/                 # Infrastructure dùng chung toàn app
│   │   ├── base/
│   │   │   └── base.schema.ts  # Abstract schema: createdAt, updatedAt, isDeleted
│   │   ├── const/
│   │   │   └── index.ts        # Danh sách loại văn bản ưu tiên, từ khóa bỏ qua
│   │   ├── crypto.ts           # hashPassword() — SHA-256
│   │   ├── decorators/
│   │   │   ├── filter.decorator.ts      # @FilteringParams()
│   │   │   ├── pagination.decorator.ts  # @PaginationParams()
│   │   │   ├── roles.decorator.ts       # @Public(), @Roles()
│   │   │   └── user.decorator.ts        # @User() — lấy user từ JWT payload
│   │   ├── enum/
│   │   │   └── index.ts        # Các enum: Field, Department, Category, Role, ...
│   │   ├── error/
│   │   │   ├── all-exception.filter.ts  # Global catch-all exception filter
│   │   │   ├── http-exception.filter.ts # HTTP exception filter
│   │   │   └── uuidError.ts             # Validate MongoDB ObjectId length
│   │   ├── guards/
│   │   │   ├── auth.guard.ts   # JWT authentication guard (global)
│   │   │   └── role.guard.ts   # Role-based authorization guard (global)
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts  # Chuẩn hóa response format
│   │   └── types/
│   │       └── index.d.ts      # TypeScript interfaces: LawContent, LawQuery, ...
│   ├── configs/
│   │   └── db.ts               # TypeORM config (legacy, không dùng)
│   ├── constants/
│   │   └── constants.ts        # Hằng số chung
│   ├── helpers/
│   │   └── index.ts            # removeVietnameseTones(), generateVerificationCode()
│   ├── providers/
│   │   ├── filters.provider.ts # Đăng ký global exception filters
│   │   └── guards.provider.ts  # Đăng ký global guards
│   ├── templates/
│   │   └── confirmation.hbs    # Handlebars email template (chưa kết nối)
│   └── modules/
│       ├── auth/               # Xác thực: đăng nhập, đăng ký, refresh token
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── dto/
│       │   └── strategies/     # Passport JWT strategies (access + refresh)
│       ├── crawler/            # Thu thập văn bản từ thuvienphapluat.vn
│       │   ├── crawler.module.ts
│       │   ├── crawler.controller.ts
│       │   ├── crawler.service.ts
│       │   ├── helper/
│       │   │   ├── index.ts    # stringToDate()
│       │   │   └── regex.ts    # Regex nhận diện cấu trúc văn bản luật
│       │   └── urls.json       # Danh sách URL crawl (module-local)
│       ├── law/                # CRUD + tìm kiếm văn bản pháp luật
│       │   ├── law.module.ts
│       │   ├── law.controller.ts
│       │   ├── law.service.ts
│       │   ├── dto/
│       │   ├── entities/
│       │   │   └── law.schema.ts      # Mongoose schema cho Law
│       │   └── profile/
│       │       └── field.profile.ts   # AutoMapper profile
│       ├── request/            # Hỏi đáp tư vấn luật sư
│       │   ├── request.module.ts
│       │   ├── request.controller.ts
│       │   ├── request.service.ts
│       │   ├── dto/
│       │   └── entities/
│       │       └── request.schema.ts
│       └── user/               # Quản lý người dùng
│           ├── user.module.ts
│           ├── user.controller.ts
│           ├── user.service.ts
│           ├── dto/
│           ├── entities/
│           │   └── user.schema.ts
│           └── profile/
│               └── user.profile.ts    # AutoMapper profile
├── test/
│   ├── app.e2e-spec.ts         # E2E test
│   └── jest-e2e.json
├── tests/                      # Unit tests (~80 spec files, cấu trúc mirror src/)
├── Dockerfile                  # Production Docker image (node:24-alpine + Chromium)
├── err.json                    # Danh sách URL crawl lỗi (dùng cho retry)
├── jest.config.json            # Jest config cho thư mục tests/
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── urls.json                   # Danh sách hàng nghìn URL văn bản (~13 MB)
```

---

## Hướng dẫn chạy local

### Điều kiện tiên quyết

- **Node.js** v18 trở lên
- **npm** v9 trở lên
- **MongoDB** đang chạy (local hoặc MongoDB Atlas)
- **Google Chrome / Chromium** (Puppeteer tự tải về khi cài npm nếu không có sẵn)

### 1. Clone repository

```bash
git clone <repository-url>
cd datcuong-backend
```

### 2. Cài đặt dependencies

```bash
npm install --legacy-peer-deps
```

> **Lưu ý:** Flag `--legacy-peer-deps` là bắt buộc do một số dependency có xung đột peer deps.

### 3. Tạo file `.env`

Tạo file `.env` ở thư mục gốc (xem chi tiết ở phần [Biến môi trường](#biến-môi-trường)):

```env
MONGODB_URI=mongodb://localhost:27017/law_linking
JWT_SECRET=your_super_secret_key_at_least_32_chars
PORT=5000
AI_HOST=http://localhost:8000/reference_matching/id_input
```

### 4. Chạy ứng dụng

**Development (hot-reload):**

```bash
npm run start:dev
```

**Production build:**

```bash
npm run build
npm run start:prod
```

Ứng dụng sẽ khởi động tại `http://localhost:5000` (hoặc port đã cấu hình).

Swagger UI có thể truy cập tại: `http://localhost:5000/api`

### 5. Chạy tests

**Unit tests (thư mục `tests/`):**

```bash
npm run test:normal
```

**E2E tests (thư mục `test/`):**

```bash
npm run test:e2e
```

**Tất cả tests:**

```bash
npm test
```

**Test với coverage:**

```bash
npm run test:cov
```

### 6. Linting và formatting

```bash
# Kiểm tra lỗi lint
npm run lint

# Format code
npm run format
```

---

## Biến môi trường

| Biến | Mô tả | Bắt buộc | Ví dụ |
|---|---|---|---|
| `MONGODB_URI` | MongoDB connection string | ✅ | `mongodb://localhost:27017/law_linking` |
| `JWT_SECRET` | Khóa bí mật để ký JWT token | ✅ | `my_very_secret_key_123` |
| `PORT` | Port HTTP server lắng nghe | ❌ | `5000` (mặc định) |
| `AI_HOST` | URL của AI microservice dùng để matching tham chiếu | ❌ | `http://localhost:8000/reference_matching/id_input` |
| `NODE_ENV` | Môi trường chạy; ảnh hưởng đến cấu hình Puppeteer | ❌ | `production` |
| `PUPPETEER_EXECUTABLE_PATH` | Đường dẫn tới Chromium trong production/Docker | ❌ | `/usr/bin/chromium-browser` |
| `CRAWLED` | Offset bắt đầu khi resume bulk crawl từ `urls.json` | ❌ | `1000` |

> **Lưu ý Docker:** File `Dockerfile` đã set sẵn `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser` và `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`. Khi chạy local, Puppeteer sẽ tự tải Chromium về trong bước `npm install`.

---

## API Endpoints

Tất cả response đều được chuẩn hóa qua `ResponseInterceptor`:

```json
{
  "statusCode": 200,
  "reqId": "uuid",
  "message": "success",
  "data": { ... }
}
```

Tất cả response lỗi có cấu trúc:

```json
{
  "data": null,
  "statusCode": 400,
  "message": "error description",
  "timestamp": "..."
}
```

---

### Auth (`/auth`)

| Method | Endpoint | Auth | Mô tả | Request Body |
|---|---|---|---|---|
| POST | `/auth/login` | Public | Đăng nhập, trả về access + refresh token | `{ email, password }` |
| POST | `/auth/register` | Public | Đăng ký tài khoản mới | `{ fullName, email, password, phoneNumber?, dob?, address?, role? }` |
| GET | `/auth/refresh-token` | Bearer token | Làm mới token bằng refresh token hiện tại | — |

**Ví dụ response đăng nhập thành công:**

```json
{
  "data": {
    "user": { "fullName": "Nguyen Van A", "email": "a@example.com", "role": "user" },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

**Validation password:** tối thiểu 6 ký tự, tối đa 30 ký tự, phải chứa ít nhất 1 chữ hoa và 1 chữ số.

---

### User (`/user`)

| Method | Endpoint | Auth / Role | Mô tả | Request Body |
|---|---|---|---|---|
| GET | `/user/user-profile` | Bearer token | Lấy thông tin profile của user hiện tại (ẩn password) | — |
| POST | `/user/signin` | ADMIN | Đăng nhập kiểm tra trực tiếp (admin) | `{ email, password }` |
| POST | `/user/signup` | ADMIN | Tạo tài khoản (admin only) | `{ fullName, email, password, ... }` |
| PATCH | `/user/update` | Bearer token | Cập nhật thông tin user | `{ fullName?, phoneNumber?, dob?, address?, avatarUrl?, fields? }` |

---

### Law (`/law`)

| Method | Endpoint | Auth / Role | Mô tả |
|---|---|---|---|
| GET | `/law` | ADMIN | Lấy toàn bộ văn bản (phân trang) |
| GET | `/law/search` | Bearer token | Tìm kiếm văn bản pháp luật |
| GET | `/law/search-ref` | Bearer token | Điều hướng vào nội dung cụ thể của văn bản theo path |
| GET | `/law/custom-law` | Bearer token | Tìm văn bản sửa đổi bổ sung |
| GET | `/law/reference-auto` | Bearer token | Kích hoạt AI matching tham chiếu cho toàn bộ văn bản |
| GET | `/law/long-name` | ADMIN | Liệt kê văn bản có tên >300 ký tự |
| GET | `/law/reference-manual/:id` | Bearer token | Kích hoạt AI matching cho một văn bản |
| GET | `/law/last-law` | Public | Văn bản mới được thêm gần nhất |
| GET | `/law/verify-law` | ADMIN | Xóa văn bản có nội dung rỗng |
| GET | `/law/rename-law` | ADMIN | Batch rename văn bản từ trường description |
| GET | `/law/categories` | ADMIN | Liệt kê các loại văn bản đang có trong DB |
| GET | `/law/departments` | ADMIN | Liệt kê các cơ quan ban hành đang có trong DB |
| GET | `/law/:id` | Bearer token | Lấy chi tiết một văn bản theo ID |
| POST | `/law/search-name` | Bearer token | Tìm văn bản theo tên chính xác | 
| POST | `/law/search-url` | Bearer token | Tìm văn bản theo URL gốc |
| POST | `/law` | ADMIN | Tạo mới một văn bản |
| POST | `/law/depatment` | ADMIN | Soft-delete văn bản theo từ khóa cơ quan ban hành |
| PATCH | `/law/soft-delete` | Bearer token | Soft-delete văn bản không thuộc danh sách ưu tiên |
| PATCH | `/law/:id` | Bearer token | Cập nhật văn bản |
| DELETE | `/law/:id` | Bearer token | Xóa vĩnh viễn văn bản |

**Query params cho `GET /law/search`:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `keyword` | string | Từ khóa tìm kiếm full-text |
| `year` | number | Năm ban hành |
| `field` | string (enum `Field`) | Lĩnh vực pháp luật (ví dụ: `"Lao động - Tiền lương"`) |
| `category` | string (enum `Category`) | Loại văn bản (ví dụ: `"Luật"`, `"Nghị định"`) |
| `department` | string | Cơ quan ban hành |
| `page` | number | Số trang (bắt đầu từ 1) |
| `size` | number | Số kết quả mỗi trang (tối đa 100) |

**Query params cho `GET /law/search-ref`:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `id` | string | MongoDB ObjectId của văn bản |
| `LawRef` | string | Đường dẫn phân cấp vào nội dung, dạng chuỗi có dấu phẩy, ví dụ `"2,1,3"` |

---

### Crawler (`/crawler`)

> Tất cả endpoint đều yêu cầu role **ADMIN**.

| Method | Endpoint | Mô tả | Request Body |
|---|---|---|---|
| POST | `/crawler/url` | Crawl một URL cụ thể | `{ url: "https://thuvienphapluat.vn/van-ban/..." }` |
| GET | `/crawler/auto` | Tự động crawl từ trang tìm kiếm của thuvienphapluat.vn | — |
| GET | `/crawler/auto/all` | Bulk crawl toàn bộ từ file `urls.json` | — |
| GET | `/crawler/auto/all-fake` | Retry các URL từ `err.json` (crawl lần trước lỗi) | — |

---

### Request — Tư vấn luật sư (`/request`)

| Method | Endpoint | Auth / Role | Mô tả | Request Body |
|---|---|---|---|---|
| POST | `/request` | Bearer token | Tạo yêu cầu tư vấn pháp lý | `{ title, content, field, media? }` |
| POST | `/request/response/:id` | LAWYER | Luật sư gửi phản hồi cho yêu cầu | `{ content, media? }` |
| GET | `/request` | ADMIN | Lấy tất cả yêu cầu | — |
| GET | `/request/user` | Bearer token | Danh sách yêu cầu của user hiện tại (phân trang) | — |
| GET | `/request/user/:id` | Bearer token | Chi tiết một yêu cầu của user | — |
| GET | `/request/lawyer` | LAWYER | Danh sách yêu cầu dành cho luật sư (phân trang) | — |
| GET | `/request/lawyer/:id` | LAWYER | Chi tiết yêu cầu dành cho luật sư | — |
| PATCH | `/request/:id` | ADMIN | Cập nhật yêu cầu | — |
| DELETE | `/request/:id` | ADMIN | Xóa yêu cầu | — |

---

## Ghi chú bổ sung

### Triển khai (Deployment)

**Chạy bằng Docker:**

```bash
docker build -t lvtn-vbpl-backend .
docker run -p 5000:29001 \
  -e MONGODB_URI="mongodb://host:27017/law_linking" \
  -e JWT_SECRET="your_secret" \
  lvtn-vbpl-backend
```

**Dùng Docker Compose (cùng với frontend):**

Tham khảo hướng dẫn deploy đầy đủ (tải image từ Docker Hub):

```bash
# Tạo thư mục
mkdir datntvpl && cd datntvpl

# Kéo images
sudo docker pull kanghcmut/lvtn-frontend-app:latest
sudo docker pull kanghcmut/lvtn-backend-app:latest

# Tạo docker-compose.yml và .env, sau đó:
sudo docker compose up
```

- Frontend port: `3000`
- Backend port: `5000`
- Dùng HTTP (không phải HTTPS)

**GitHub Actions CI/CD:**

Pipeline `.github/workflows/main.yml` tự động kích hoạt khi push lên nhánh `main`:

1. Build Docker image đa kiến trúc (`linux/amd64`, `linux/arm64`)
2. Inject `AI_HOST`, `MONGODB_URI` qua build args
3. Inject `JWT_SECRET` qua Docker build secret (không lộ trong logs)
4. Push lên Docker Hub với tag `prod-latest`

> Pipeline chạy trên **self-hosted runner** — cần đảm bảo runner đang hoạt động trước khi push.

---

### Phân quyền

Hệ thống có 4 role:

| Role | Mô tả |
|---|---|
| `user` | Người dùng thường — tra cứu văn bản, gửi yêu cầu tư vấn |
| `lawyer` | Luật sư — phản hồi yêu cầu tư vấn |
| `admin` | Quản trị viên — crawl dữ liệu, xóa văn bản, quản lý hệ thống |
| `banned` | Tài khoản bị khóa |

Guard được đăng ký global: **tất cả endpoint đều yêu cầu xác thực** trừ khi được đánh dấu `@Public()`. Hiện tại chỉ có `POST /auth/login`, `POST /auth/register`, và `GET /law/last-law` là public.

---

### Cấu trúc nội dung văn bản pháp luật

Mỗi văn bản trong MongoDB có trường `content` được phân tích từ HTML gốc theo cấu trúc:

```
content
├── header[]       — Thông tin tiêu đề (cơ quan ban hành, số hiệu...)
├── description[]  — Căn cứ ban hành
├── mainContent[]  — Nội dung chính:
│     Phần → Chương → Mục → Tiểu mục → Điều → Khoản → Điểm
├── footer[]       — Chữ ký, nơi ban hành, điều khoản thi hành
└── extend[]       — Phụ lục, biểu mẫu đính kèm
```

Crawler dùng **state-machine** kết hợp các regex tiếng Việt (trong `crawler/helper/regex.ts`) để nhận diện từng cấp: `Phần thứ nhất...`, `Chương I`, `Mục 1.`, `Điều 1.`, `1.` (khoản), `a)` (điểm). Cả hai phương thức crawl (`crawler` và `crawlerFake`) hoạt động giống nhau nhưng khác nhau về cách traverse DOM — `crawlerFake` xử lý trường hợp nội dung lồng sâu hơn trong cây HTML.

---

### Tích hợp AI Microservice

Khi tạo văn bản mới hoặc gọi endpoint `reference-manual/:id` / `reference-auto`, service POST `{ id }` đến `AI_HOST` để phát hiện các văn bản liên quan (tham chiếu, sửa đổi, hướng dẫn). Kết quả AI trả về được lưu vào trường `relationLaws[]` của document Law trong MongoDB.

Microservice AI cần được deploy riêng. Mặc định trỏ đến `http://localhost:8000/reference_matching/id_input`.

---

### Soft Delete

`BaseSchema` (`src/common/base/base.schema.ts`) implement soft delete qua trường `isDeleted`. Khi gọi `findOneAndDelete` hoặc `deleteOne` qua Mongoose pre-hook, document không bị xóa vật lý mà chỉ được set `isDeleted = true`. Các query thông thường cần tự lọc theo `isDeleted: false`.

---

### Các điểm cần lưu ý

**Bảo mật:**
- Mật khẩu được hash bằng **SHA-256 không có salt** (`src/common/crypto.ts`). Đây là cách tiếp cận đơn giản, nên cân nhắc dùng `bcrypt` hoặc `argon2` cho môi trường production thực tế.
- **CORS** đang mở cho tất cả origins — nên giới hạn lại cho production.

**Bugs đã biết:**
- `getAllLawyerRequests`: Filter theo `userResponseId` bị comment out nên endpoint trả về toàn bộ yêu cầu thay vì chỉ của luật sư đó.
- `sendResponse`: Điều kiện kiểm tra dùng `!document &&` thay vì `!document ||` — không ảnh hưởng luồng chính nhưng sẽ không throw lỗi đúng khi document không tìm thấy.

**Code legacy:**
- `TypeORM` (`src/configs/db.ts`) là cấu hình còn sót lại, không được dùng — ứng dụng chỉ dùng Mongoose.
- File `urls.json` ở thư mục gốc (~13 MB) chứa hàng nghìn URL văn bản dùng cho bulk crawl.

---

### Conventions phát triển

- Tất cả module đều có: `dto/` (Data Transfer Objects), `entities/` (Mongoose schemas), test tương ứng trong `tests/modules/<module>/`.
- Tên file test: `<ClassName>.early.spec/<methodName>.early.spec.ts` — được tạo bởi công cụ sinh test tự động.
- Timezone mặc định: `Asia/Ho_Chi_Minh` (set tại `main.ts`).
- URI versioning được bật nhưng chưa sử dụng version prefix — các endpoint dùng đường dẫn trực tiếp.
- AutoMapper (`@automapper/nestjs`) được dùng để map giữa Mongoose document và DTO cho module `user` và `law`.
