export function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD') // Normalize Unicode into decomposed form (NFD)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function generateVerificationCode() {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}
