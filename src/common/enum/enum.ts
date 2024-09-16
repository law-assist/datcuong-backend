export enum Field {
  BoMayHanhChinh = 'Bộ máy hành chính',
  TaiChinhNhaNuoc = 'Tài chính nhà nước',
  VanHoaXaHoi = 'Văn hóa - Xã hội',
  TaiNguyenMoiTruong = 'Tài nguyên - Môi trường',
  ThuongMai = 'Thương mại',
  XayDungDoThi = 'Xây dựng - Đô thị',
  BatDongSan = 'Bất động sản',
  TheThaoYTe = 'Thể thao - Y tế',
  ThuePhiLePhi = 'Thuế - Phí - Lệ Phí',
  GiaoDuc = 'Giáo dục',
  GiaoThongVanTai = 'Giao thông - Vận tải',
  LaoDongTienLuong = 'Lao động - Tiền lương',
  DoanhNghiep = 'Doanh nghiệp',
  DauTu = 'Đầu tư',
  CongNgheThongTin = 'Công nghệ thông tin',
  XuatNhapKhau = 'Xuất nhập khẩu',
  LinhVucKhac = 'Lĩnh vực khác',
  TienTeNganHang = 'Tiền tệ - Ngân hàng',
  QuyenDanSu = 'Quyền dân sự',
  BaoHiem = 'Bảo hiểm',
  DichVuPhapLy = 'Dịch vụ pháp lý',
  ViPhamHanhChinh = 'Vi phạm hành chính',
  ThuTucTotung = 'Thủ tục Tố tụng',
  KeToanKiemToan = 'Kế toán - Kiểm toán',
  TrachNhiemHinhSu = 'Trách nhiệm hình sự',
  SoHuuTriTue = 'Sở hữu trí tuệ',
  ChungKhoan = 'Chứng khoán',
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  LAWYER = 'lawyer',
  BANNED = 'banned',
}

export enum UserStatus {
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  BANNED = 'banned',
}

export enum RequestStatus {
  STARTING = 'starting',
  REJECT = 'reject',
  END = 'end',
  PENDING = 'pending',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'pdf/word',
}

export enum RelationType {
  REPLACE = 'replace',
  REFERENCE = 'reference',
  INSTRUCT = 'instruct',
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
