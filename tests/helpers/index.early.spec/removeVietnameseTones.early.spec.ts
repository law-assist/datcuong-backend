// Unit tests for: removeVietnameseTones

import { removeVietnameseTones } from '../../../src/helpers/index';

// src/helpers/index.test.ts
describe('removeVietnameseTones() removeVietnameseTones method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should remove tones from a Vietnamese string', () => {
      const input = 'Tiếng Việt có dấu';
      const expectedOutput = 'Tieng Viet co dau';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });

    it('should handle strings without Vietnamese tones', () => {
      const input = 'Hello World';
      const expectedOutput = 'Hello World';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });

    it('should convert "đ" to "d" and "Đ" to "D"', () => {
      const input = 'đi Đà Nẵng';
      const expectedOutput = 'di Da Nang';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });

    it('should handle mixed case strings with Vietnamese tones', () => {
      const input = 'Cà Phê Sữa Đá';
      const expectedOutput = 'Ca Phe Sua Da';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an empty string when input is an empty string', () => {
      const input = '';
      const expectedOutput = '';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });

    it('should handle strings with only Vietnamese tones', () => {
      const input = 'áàảãạâấầẩẫậăắằẳẵặ';
      const expectedOutput = 'aaaaaaaaaaa';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });

    it('should handle strings with only special characters', () => {
      const input = '!@#$%^&*()_+';
      const expectedOutput = '!@#$%^&*()_+';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });

    it('should handle strings with numbers and Vietnamese tones', () => {
      const input = '1234 Đà Lạt 5678';
      const expectedOutput = '1234 Da Lat 5678';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });

    it('should handle strings with mixed content', () => {
      const input = 'Café số 1, đường Đinh Tiên Hoàng';
      const expectedOutput = 'Cafe so 1, duong Dinh Tien Hoang';
      expect(removeVietnameseTones(input)).toBe(expectedOutput);
    });
  });
});

// End of unit tests for: removeVietnameseTones
