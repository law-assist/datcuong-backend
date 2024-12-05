// Unit tests for: refreshToken

import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../../src/modules/auth/auth.service';
import { ReadUserDto } from '../../../../src/modules/user/dto/read-user.dto';

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
      const mockUser: ReadUserDto = {
        _id: 'user-id',
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
      const result = await authService.refreshToken('user-id');

      // Assert
      expect(result).toEqual({
        accessToken: 'mockToken',
        refreshToken: 'mockToken',
      });
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('user-id');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      mockUserService.getUserProfile.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(authService.refreshToken('invalid-user-id')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith(
        'invalid-user-id',
      );
    });

    it('should handle jwtService signAsync errors gracefully', async () => {
      // Arrange
      const mockUser: ReadUserDto = {
        _id: 'user-id',
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
      mockJwtService.signAsync.mockRejectedValue(
        new Error('JWT Error') as never,
      );

      // Act & Assert
      await expect(authService.refreshToken('user-id')).rejects.toThrow(
        'JWT Error',
      );
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('user-id');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: refreshToken
