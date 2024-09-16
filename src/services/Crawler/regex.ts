
// const khoanRegex = /^(\d+)\./;
// const diemRegex = /^([a-zA-Z])\)/;
// const diemRegex = /^([\p{L}])\)/u;
// const chuongRegex = /^Chương (I{1,3}|IV|V|VI{0,3}|IX|X)\b/;

const phanRegex = /^Phần thứ (\d|(mười một)|(mười hai)|(mười ba)|(mười bốn)|(mười lăm)|(mười sáu)|(mười bảy)|(mười tám)|(mười chín)|(hai mươi)|nhất|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)/i;

const chuongRegex = /^Chương (?:[1-9]\d*|X{0,3}(IX|IV|V?I{0,3}))\b/;

const mucRegex = /^Mục (\d+)(\.|:)/;

const tieuMucRegex = /^Tiểu mục (\d+)(\.|:)/;

const dieuRegex = /^Điều (\d+)\./;

const diemRegex1 = /^(\d+\.\d+)\./;
const diemRegex2 = /^([\p{L}])\)/u;

const khoanRegex = /^(\d+)\./;

const isOpen = /^[“"]/;
const isClose = /\.("|”)\.?$/;


export { phanRegex, chuongRegex, mucRegex, tieuMucRegex, dieuRegex, khoanRegex, diemRegex1, diemRegex2, isOpen, isClose};