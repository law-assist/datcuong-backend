// Unit tests for: getTokens

import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../../src/modules/auth/auth.service';

// Mock classes
class MockUserService {
  // Define any necessary mock methods or properties here
}

class MockJwtService {
  signAsync = jest.fn();
}

class MockConfigService {
  // Define any necessary mock methods or properties here
}

describe('AuthService.getTokens() getTokens method', () => {
  let authService: AuthService;
  let mockUserService: MockUserService;
  let mockJwtService: MockJwtService;
  let mockConfigService: MockConfigService;

  beforeEach(() => {
    mockUserService = new MockUserService() as any;
    mockJwtService = new MockJwtService() as any;
    mockConfigService = new MockConfigService() as any;

    authService = new AuthService(
      mockUserService as any,
      mockJwtService as any,
      mockConfigService as any,
    );
  });

  describe('Happy paths', () => {
    it('should return tokens when payload is valid', async () => {
      // Arrange
      const payload = {
        user: {
          _id: 'userId',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
          phoneNumber: '1234567890',
          status: 'active',
          field: 'IT',
          avatarUrl: 'http://example.com/avatar.jpg',
        },
      };

      const expectedAccessToken = 'access-token';
      const expectedRefreshToken = 'refresh-token';

      mockJwtService.signAsync
        .mockResolvedValueOnce(expectedAccessToken as any as never)
        .mockResolvedValueOnce(expectedRefreshToken as any as never);

      // Act
      const tokens = await authService.getTokens(payload);

      // Assert
      expect(tokens).toEqual({
        accessToken: expectedAccessToken,
        refreshToken: expectedRefreshToken,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing user in payload gracefully', async () => {
      // Arrange
      const payload = {};

      // Act & Assert
      await expect(authService.getTokens(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle jwtService signAsync failure', async () => {
      // Arrange
      const payload = {
        user: {
          _id: 'userId',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
          phoneNumber: '1234567890',
          status: 'active',
          field: 'IT',
          avatarUrl: 'http://example.com/avatar.jpg',
        },
      };

      mockJwtService.signAsync.mockRejectedValueOnce(
        new Error('JWT Error') as never,
      );

      // Act & Assert
      await expect(authService.getTokens(payload)).rejects.toThrow('JWT Error');
    });
  });
});

// End of unit tests for: getTokens
