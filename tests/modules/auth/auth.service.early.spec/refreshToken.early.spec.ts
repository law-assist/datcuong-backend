// Unit tests for: refreshToken

import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../../src/modules/auth/auth.service';

// Mock classes
class MockUserService {
  getUserProfile = jest.fn();
}

class MockJwtService {
  signAsync = jest.fn();
}

class MockConfigService {}

// Test suite for AuthService's refreshToken method
describe('AuthService.refreshToken() refreshToken method', () => {
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
    it('should return tokens when user is found', async () => {
      // Arrange
      const mockUser = {
        _id: 'userId',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        phoneNumber: '1234567890',
        status: 'active',
        fields: [],
        avatarUrl: 'http://example.com/avatar.jpg',
      };
      mockUserService.getUserProfile.mockResolvedValue(
        mockUser as any as never,
      );
      mockJwtService.signAsync.mockResolvedValue('mockToken' as any as never);

      // Act
      const result = await authService.refreshToken('userId');

      // Assert
      expect(result).toEqual({
        accessToken: 'mockToken',
        refreshToken: 'mockToken',
      });
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('userId');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      mockUserService.getUserProfile.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(authService.refreshToken('invalidUserId')).rejects.toThrow(
        new UnauthorizedException('user_not_found'),
      );
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith(
        'invalidUserId',
      );
    });
  });
});

// End of unit tests for: refreshToken
