import { ObjectId } from "mongodb";

export interface content{
    name: string;
    title: string;
    content: any[];
    tag: any;
}

export interface noiDungVanBan{
    header: any[]
    description: any[]
    mainContext: content[]
    footer: any[]
}

export interface LawModel{
    link: any;
    tenVanBan: any
    sohieu: any
    loaiVanBan: any
    coQuanBanHanh: any
    ngayBanHanh: any
    noiDungVanBan: any
    ngayThem: any, // Thêm ngày tạo vào dữ liệu thu thập
}