// Unit tests for: stringToDate

import { stringToDate } from '../../../../../src/modules/crawler/helper/index';

// Import the function to be tested
describe('stringToDate() stringToDate method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should convert a valid date string "01/01/2020" to a Date object', () => {
      const dateString = '01/01/2020';
      const expectedDate = new Date('2020-01-01');
      expect(stringToDate(dateString)).toEqual(expectedDate);
    });

    it('should convert a valid date string "31/12/1999" to a Date object', () => {
      const dateString = '31/12/1999';
      const expectedDate = new Date('1999-12-31');
      expect(stringToDate(dateString)).toEqual(expectedDate);
    });

    it('should convert a valid date string "15/08/1947" to a Date object', () => {
      const dateString = '15/08/1947';
      const expectedDate = new Date('1947-08-15');
      expect(stringToDate(dateString)).toEqual(expectedDate);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an invalid date string "32/01/2020" by returning an Invalid Date', () => {
      const dateString = '32/01/2020';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle an invalid date string "00/01/2020" by returning an Invalid Date', () => {
      const dateString = '00/01/2020';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle an invalid date string "29/02/2019" (non-leap year) by returning an Invalid Date', () => {
      const dateString = '29/02/2019';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle an empty string by returning an Invalid Date', () => {
      const dateString = '';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle a malformed date string "2020/01/01" by returning an Invalid Date', () => {
      const dateString = '2020/01/01';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle a date string with missing parts "01/2020" by returning an Invalid Date', () => {
      const dateString = '01/2020';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle a date string with extra parts "01/01/2020/extra" by returning an Invalid Date', () => {
      const dateString = '01/01/2020/extra';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });
  });
});

// End of unit tests for: stringToDate
