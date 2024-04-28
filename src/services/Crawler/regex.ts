
// const chuongRegex = /^Chương (I{1,3}|IV|V|VI{0,3}|IX|X)\b/;
const chuongRegex = /^Chương (?:[1-9]\d*|X{0,3}(IX|IV|V?I{0,3}))\b/;

const mucRegex = /^Mục (\d+)\./;
const dieuRegex = /^Điều (\d+)\./;
// const khoanRegex = /^(\d+)\./;

// const diemRegex = /^([a-zA-Z])\)/;
// const diemRegex = /^([\p{L}])\)/u;
const diemRegex1 = /^(\d+\.\d+)\./;
const diemRegex2 = /^([\p{L}])\)/u;

const khoanRegex = /^(\d+)\./;

const isOpen = /^[“"]/;
const isClose = /["”]\.$/;


export { chuongRegex, mucRegex, dieuRegex, khoanRegex, diemRegex1, diemRegex2, isOpen, isClose};