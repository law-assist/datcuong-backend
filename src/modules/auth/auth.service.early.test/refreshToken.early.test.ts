// Unit tests for: refreshToken

import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

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

  describe('Happy Path', () => {
    it('should return tokens when user is found', async () => {
      // Arrange: Mock user data and token generation
      const mockUser = {
        _id: 'user123',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        phoneNumber: '1234567890',
        status: 'active',
        field: 'IT',
        avatarUrl: 'http://example.com/avatar.jpg',
      };
      mockUserService.getUserProfile.mockResolvedValue(
        mockUser as any as never,
      );
      mockJwtService.signAsync.mockResolvedValue(
        'mockAccessToken' as any as never,
      );

      // Act: Call the refreshToken method
      const tokens = await authService.refreshToken('user123');

      // Assert: Verify the tokens are returned correctly
      expect(tokens).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockAccessToken',
      });
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('user123');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange: Mock user not found
      mockUserService.getUserProfile.mockResolvedValue(null as any as never);

      // Act & Assert: Call the refreshToken method and expect an exception
      await expect(authService.refreshToken('invalidUserId')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith(
        'invalidUserId',
      );
    });

    it('should handle token generation failure gracefully', async () => {
      // Arrange: Mock user data and token generation failure
      const mockUser = {
        _id: 'user123',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        phoneNumber: '1234567890',
        status: 'active',
        field: 'IT',
        avatarUrl: 'http://example.com/avatar.jpg',
      };
      mockUserService.getUserProfile.mockResolvedValue(
        mockUser as any as never,
      );
      mockJwtService.signAsync.mockRejectedValue(
        new Error('Token generation failed') as never,
      );

      // Act & Assert: Call the refreshToken method and expect an exception
      await expect(authService.refreshToken('user123')).rejects.toThrow(
        'Token generation failed',
      );
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('user123');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: refreshToken
