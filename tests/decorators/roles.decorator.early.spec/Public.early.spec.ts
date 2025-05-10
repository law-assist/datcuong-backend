// Unit tests for: Public

import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, Public } from '../../../src/decorators/roles.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Public() Public method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should set metadata with IS_PUBLIC_KEY to true', () => {
      // Arrange
      const expectedKey = IS_PUBLIC_KEY;
      const expectedValue = true;

      // Act
      Public();

      // Assert
      expect(SetMetadata).toHaveBeenCalledWith(expectedKey, expectedValue);
    });
  });

  describe('Edge Cases', () => {
    it('should handle being called multiple times correctly', () => {
      // Arrange
      const expectedKey = IS_PUBLIC_KEY;
      const expectedValue = true;

      // Act
      Public();
      Public();

      // Assert
      expect(SetMetadata).toHaveBeenCalledTimes(2);
      expect(SetMetadata).toHaveBeenNthCalledWith(
        1,
        expectedKey,
        expectedValue,
      );
      expect(SetMetadata).toHaveBeenNthCalledWith(
        2,
        expectedKey,
        expectedValue,
      );
    });

    it('should not throw an error when called without context', () => {
      // Arrange & Act
      const callPublic = () => Public();

      // Assert
      expect(callPublic).not.toThrow();
    });
  });
});

// End of unit tests for: Public
