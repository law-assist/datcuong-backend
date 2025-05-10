// Unit tests for: UuidException

import { HttpException } from '@nestjs/common';
import { UuidException } from '../../../../src/common/error/uuidError';

describe('UuidException() UuidException method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should not throw an exception for a valid 24-character string', async () => {
      // Arrange
      const validId = '123456789012345678901234';

      // Act & Assert
      await expect(UuidException(validId)).resolves.not.toThrow();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw an HttpException for a string shorter than 24 characters', async () => {
      // Arrange
      const shortId = '12345678901234567890123'; // 23 characters

      // Act & Assert
      await expect(UuidException(shortId)).rejects.toThrow(HttpException);
      await expect(UuidException(shortId)).rejects.toThrow(
        'Invalid id format, id must be must be a 24 character hex string',
      );
    });

    it('should throw an HttpException for a string longer than 24 characters', async () => {
      // Arrange
      const longId = '1234567890123456789012345'; // 25 characters

      // Act & Assert
      await expect(UuidException(longId)).rejects.toThrow(HttpException);
      await expect(UuidException(longId)).rejects.toThrow(
        'Invalid id format, id must be must be a 24 character hex string',
      );
    });

    it('should throw an HttpException for an empty string', async () => {
      // Arrange
      const emptyId = '';

      // Act & Assert
      await expect(UuidException(emptyId)).rejects.toThrow(HttpException);
      await expect(UuidException(emptyId)).rejects.toThrow(
        'Invalid id format, id must be must be a 24 character hex string',
      );
    });

    it('should throw an HttpException for a string with special characters', async () => {
      // Arrange
      const specialCharId = '12345678901234567890!@#$';

      // Act & Assert
      await expect(UuidException(specialCharId)).rejects.toThrow(HttpException);
      await expect(UuidException(specialCharId)).rejects.toThrow(
        'Invalid id format, id must be must be a 24 character hex string',
      );
    });
  });
});

// End of unit tests for: UuidException
