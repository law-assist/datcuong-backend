# Sử dụng Node.js v24 official runtime image hỗ trợ đa kiến trúc (x64, arm64)
FROM node:24-alpine

# FROM node:21-alpine 

# Cài đặt các dependencies cần thiết cho Puppeteer hoặc Chrome
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  libx11 \
  libxcomposite \
  libxdamage \
  libxrandr \
  libxtst \
  libxshmfence \
  alsa-lib \
  libvpx \
  libwebp \
  xvfb-run \
  dumb-init

# Thiết lập các biến môi trường cho Puppeteer và Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

# Setup các biến môi trường
ARG AI_HOST
ARG MONGODB_URI

# Lấy các biến môi trường từ Github Action
ENV AI_HOST=${AI_HOST}
ENV MONGODB_URI=${MONGODB_URI}

# Lấy secret từ Github
RUN --mount=type=secret,id=JWT_SECRET,env=JWT_SECRET

# Đảm bảo binary Chromium có quyền thực thi
RUN chmod 755 /usr/bin/chromium-browser

# Tạo user không đặc quyền
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads /app \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

# Chuyển sang user không đặc quyền
USER pptruser

# Tạo thư mục ứng dụng
WORKDIR /app

# Copy file package.json và package-lock.json
COPY --chown=pptruser:pptruser package*.json ./

# Cài đặt dependencies ứng dụng
RUN npm install --legacy-peer-deps

# Copy mã nguồn ứng dụng
COPY --chown=pptruser:pptruser . .

# Build ứng dụng (tạo thư mục 'dist')
RUN npm run build
# Mở port ứng dụng
ENV PORT=29001
EXPOSE 29001

# Khởi chạy server với build production
CMD ["node", "dist/src/main.js"]
