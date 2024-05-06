// import { ObjectId } from "mongodb";

export interface context{
    name: string;
    title: string;
    content: (string | context)[]; //lv 2 (Khoản) or lv 3 (Điểm)
    tag?: string | "";
}

export interface noiDungVanBan{
    header: any[]
    description: string[]
    mainContext: context[]
    footer: any[]
    extend: any[]
}

export interface LawModel{
    link: any;
    tenVanBan: any
    sohieu: any
    loaiVanBan: any
    coQuanBanHanh: any
    topic: any
    ngayBanHanh: any
    noiDungVanBan: any
    ngayThem: any, // Thêm ngày tạo vào dữ liệu thu thập
}

export interface Law {
    // _id: ObjectId;
    category: string; // loại văn bản
    department: string; // cơ quan ban hành
    name: string; // tên văn bản
    pdf_link: string; // đường dẫn tệp pdf
    created_at: Date; // ngày tạo
    updated_at: Date; // ngày cập nhật/chỉnh sửa văn bản
    number_doc: string; // số hiệu văn bản
    date_approved: string; // ngày ban hành
    field: string; // lĩnh vực, ngành
    content: { // nội dung văn bản
      header: string[]; // từ đầu đến ngày tháng năm //tbody
      description: string[]; // từ tên đến phần căn cứ
      mainContext: context[]; // lv1: Chuong, muc, dieu
      footer: string[]; // từ phần chữ ký //tbody
      extend: string[]; // Phụ lục nếu có đến hết
    };
    relatedLaws?: LawRelation[];
  }

// interface LawRelation{

// }

interface LawRelation {
    srcDir: string[]; //['dieu2', 'khoan1', 'index'] search context.name la dieu2 sau do contex.content.name la khoan 1
    desDir: string[]; //['LawID','dieu2', 'khoan2', 'index']
    typeRelation: any; //enum type
    note: string | "";
    created_at: Date;
    updated_at: Date;
}