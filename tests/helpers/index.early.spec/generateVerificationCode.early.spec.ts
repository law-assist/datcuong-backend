// Unit tests for: generateVerificationCode

import { generateVerificationCode } from '../../../src/helpers/index';

// src/helpers/index.test.ts
describe('generateVerificationCode() generateVerificationCode method', () => {
  describe('Happy Paths', () => {
    it('should generate a 6-digit string', () => {
      // Test to ensure the generated code is a string of 6 digits
      const code = generateVerificationCode();
      expect(code).toMatch(/^\d{6}$/);
    });

    it('should generate different codes on subsequent calls', () => {
      // Test to ensure that two subsequent calls generate different codes
      const code1 = generateVerificationCode();
      const code2 = generateVerificationCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('Edge Cases', () => {
    it('should always generate a number between 100000 and 999999', () => {
      // Test to ensure the generated number is always within the 6-digit range
      for (let i = 0; i < 1000; i++) {
        // Run multiple times to check randomness
        const code = generateVerificationCode();
        const numericCode = parseInt(code, 10);
        expect(numericCode).toBeGreaterThanOrEqual(100000);
        expect(numericCode).toBeLessThanOrEqual(999999);
      }
    });

    it('should handle the randomness correctly', () => {
      // Test to ensure that the randomness is handled correctly
      // This is more of a statistical test to ensure distribution
      const codes = new Set();
      for (let i = 0; i < 1000; i++) {
        codes.add(generateVerificationCode());
      }
      // Expect a high number of unique codes to ensure randomness
      expect(codes.size).toBeGreaterThan(900);
    });
  });
});

// End of unit tests for: generateVerificationCode
