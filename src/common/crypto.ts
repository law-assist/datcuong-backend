import { createHash } from 'crypto';

export const hashPassword = (password: string): string => {
  const hash = createHash('sha256'); // You can use any hash algorithm you prefer
  hash.update(password);
  return hash.digest('hex'); // Output as hexadecimal string
};
