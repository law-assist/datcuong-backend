// Unit tests for: validate

import { Request } from 'express';
import { RefreshTokenStrategy } from '../../../../../src/modules/auth/strategies/refreshToken.strategy';

describe('RefreshTokenStrategy.validate() validate method', () => {
  let refreshTokenStrategy: RefreshTokenStrategy;

  beforeEach(() => {
    refreshTokenStrategy = new RefreshTokenStrategy();
  });

  describe('Happy paths', () => {
    it('should return payload with refreshToken when Authorization header is present', () => {
      // Arrange: Set up a mock request with a valid Authorization header
      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer validRefreshToken'),
      } as unknown as Request;
      const mockPayload = { userId: 1, username: 'testUser' };

      // Act: Call the validate method
      const result = refreshTokenStrategy.validate(mockRequest, mockPayload);

      // Assert: Ensure the result includes the payload and refreshToken
      expect(result).toEqual({
        ...mockPayload,
        refreshToken: 'validRefreshToken',
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle missing Authorization header gracefully', () => {
      // Arrange: Set up a mock request without an Authorization header
      const mockRequest = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as Request;
      const mockPayload = { userId: 1, username: 'testUser' };

      // Act: Call the validate method
      const result = refreshTokenStrategy.validate(mockRequest, mockPayload);

      // Assert: Ensure the result includes the payload with an undefined refreshToken
      expect(result).toEqual({
        ...mockPayload,
        refreshToken: undefined,
      });
    });

    it('should handle Authorization header without Bearer prefix', () => {
      // Arrange: Set up a mock request with an invalid Authorization header
      const mockRequest = {
        get: jest.fn().mockReturnValue('InvalidToken'),
      } as unknown as Request;
      const mockPayload = { userId: 1, username: 'testUser' };

      // Act: Call the validate method
      const result = refreshTokenStrategy.validate(mockRequest, mockPayload);

      // Assert: Ensure the result includes the payload with the entire header as refreshToken
      expect(result).toEqual({
        ...mockPayload,
        refreshToken: 'InvalidToken',
      });
    });

    it('should trim spaces around the token in Authorization header', () => {
      // Arrange: Set up a mock request with spaces around the token
      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer   spacedToken   '),
      } as unknown as Request;
      const mockPayload = { userId: 1, username: 'testUser' };

      // Act: Call the validate method
      const result = refreshTokenStrategy.validate(mockRequest, mockPayload);

      // Assert: Ensure the result includes the payload with a trimmed refreshToken
      expect(result).toEqual({
        ...mockPayload,
        refreshToken: 'spacedToken',
      });
    });
  });
});

// End of unit tests for: validate
