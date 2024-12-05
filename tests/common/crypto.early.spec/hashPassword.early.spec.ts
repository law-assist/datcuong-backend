// Unit tests for: hashPassword

import { hashPassword } from '../../../src/common/crypto';

describe('hashPassword() hashPassword method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a SHA-256 hash for a given password', () => {
      // Test to ensure the function returns a valid SHA-256 hash for a typical password
      const password = 'mySecurePassword123';
      const hashedPassword = hashPassword(password);
      expect(hashedPassword).toHaveLength(64); // SHA-256 hash length in hex is 64 characters
    });

    it('should return consistent hash for the same password', () => {
      // Test to ensure the function returns the same hash for the same input
      const password = 'consistentPassword';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      expect(hash1).toBe(hash2);
    });

    it('should return different hashes for different passwords', () => {
      // Test to ensure different inputs produce different hashes
      const password1 = 'passwordOne';
      const password2 = 'passwordTwo';
      const hash1 = hashPassword(password1);
      const hash2 = hashPassword(password2);
      expect(hash1).not.toBe(hash2);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an empty string as input', () => {
      // Test to ensure the function can handle an empty string
      const password = '';
      const hashedPassword = hashPassword(password);
      expect(hashedPassword).toHaveLength(64); // Even an empty string should produce a valid hash
    });

    it('should handle very long passwords', () => {
      // Test to ensure the function can handle very long strings
      const password = 'a'.repeat(1000); // A string of 1000 'a' characters
      const hashedPassword = hashPassword(password);
      expect(hashedPassword).toHaveLength(64);
    });

    it('should handle passwords with special characters', () => {
      // Test to ensure the function can handle special characters
      const password = '!@#$%^&*()_+{}:"<>?';
      const hashedPassword = hashPassword(password);
      expect(hashedPassword).toHaveLength(64);
    });

    it('should handle passwords with unicode characters', () => {
      // Test to ensure the function can handle unicode characters
      const password = '密码123';
      const hashedPassword = hashPassword(password);
      expect(hashedPassword).toHaveLength(64);
    });
  });
});

// End of unit tests for: hashPassword
