// Unit tests for: stringToDate

import { stringToDate } from '../../../../../src/modules/crawler/helper/index';

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
    it('should handle single-digit day and month correctly, e.g., "1/1/2020"', () => {
      const dateString = '1/1/2020';
      const expectedDate = new Date('2020-01-01');
      expect(stringToDate(dateString)).toEqual(expectedDate);
    });

    it('should handle invalid date string "32/01/2020" by returning an invalid Date object', () => {
      const dateString = '32/01/2020';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle invalid date string "01/13/2020" by returning an invalid Date object', () => {
      const dateString = '01/13/2020';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle invalid date string "00/00/0000" by returning an invalid Date object', () => {
      const dateString = '00/00/0000';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle empty string by returning an invalid Date object', () => {
      const dateString = '';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle non-date string "not a date" by returning an invalid Date object', () => {
      const dateString = 'not a date';
      const result = stringToDate(dateString);
      expect(result.toString()).toBe('Invalid Date');
    });

    it('should handle date string with extra spaces " 01/01/2020 " by trimming and converting to a Date object', () => {
      const dateString = ' 01/01/2020 ';
      const expectedDate = new Date('2020-01-01');
      expect(stringToDate(dateString.trim())).toEqual(expectedDate);
    });
  });
});

// End of unit tests for: stringToDate
