// Unit tests for: validate

import { AccessTokenStrategy } from '../../../../../src/modules/auth/strategies/accessToken.strategy';

describe('AccessTokenStrategy.validate() validate method', () => {
  let accessTokenStrategy: AccessTokenStrategy;

  beforeEach(() => {
    accessTokenStrategy = new AccessTokenStrategy();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return the payload when a valid payload is provided', () => {
      // Arrange: Create a valid payload
      const payload = { sub: '1234567890', username: 'testuser' };

      // Act: Call the validate method
      const result = accessTokenStrategy.validate(payload);

      // Assert: Ensure the result is the same as the payload
      expect(result).toEqual(payload);
    });

    it('should return the payload with additional properties', () => {
      // Arrange: Create a payload with additional properties
      const payload = {
        sub: '1234567890',
        username: 'testuser',
        role: 'admin',
      };

      // Act: Call the validate method
      const result = accessTokenStrategy.validate(payload);

      // Assert: Ensure the result is the same as the payload
      expect(result).toEqual(payload);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an empty object if an empty object is provided', () => {
      // Arrange: Create an empty payload
      const payload = {};

      // Act: Call the validate method
      const result = accessTokenStrategy.validate(payload);

      // Assert: Ensure the result is the same as the payload
      expect(result).toEqual(payload);
    });

    it('should return null if null is provided', () => {
      // Arrange: Set payload to null
      const payload = null;

      // Act: Call the validate method
      const result = accessTokenStrategy.validate(payload);

      // Assert: Ensure the result is null
      expect(result).toBeNull();
    });

    it('should return undefined if undefined is provided', () => {
      // Arrange: Set payload to undefined
      const payload = undefined;

      // Act: Call the validate method
      const result = accessTokenStrategy.validate(payload);

      // Assert: Ensure the result is undefined
      expect(result).toBeUndefined();
    });

    it('should handle non-object payloads gracefully', () => {
      // Arrange: Create a non-object payload
      const payload = 'stringPayload';

      // Act: Call the validate method
      const result = accessTokenStrategy.validate(payload);

      // Assert: Ensure the result is the same as the payload
      expect(result).toEqual(payload);
    });
  });
});

// End of unit tests for: validate
