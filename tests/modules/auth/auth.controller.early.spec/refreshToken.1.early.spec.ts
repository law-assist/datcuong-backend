// Unit tests for: refreshToken

import { BadRequestException } from '@nestjs/common';
import { AuthController } from '../../../../src/modules/auth/auth.controller';

// Mock for AuthService
class MockAuthService {
  public getTokens = jest.fn();
}

describe('AuthController.refreshToken() refreshToken method', () => {
  let authController: AuthController;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockAuthService = new MockAuthService() as any;
    authController = new AuthController(mockAuthService as any);
  });

  describe('Happy paths', () => {
    it('should return tokens successfully when valid user is provided', async () => {
      // Arrange
      const mockUser = { id: 1, name: 'Test User' };
      const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };
      mockAuthService.getTokens.mockResolvedValue(mockTokens as any as never);

      // Act
      const result = await authController.refreshToken(mockUser as any);

      // Assert
      expect(result).toEqual({
        data: mockTokens,
        message: 'refresh_token_success',
        status: 'success',
      });
      expect(mockAuthService.getTokens).toHaveBeenCalledWith({
        user: mockUser,
      });
    });
  });

  describe('Edge cases', () => {
    it('should throw BadRequestException when tokens are not returned', async () => {
      // Arrange
      const mockUser = { id: 1, name: 'Test User' };
      mockAuthService.getTokens.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(
        authController.refreshToken(mockUser as any),
      ).rejects.toThrow(new BadRequestException('refresh_token_failed'));
      expect(mockAuthService.getTokens).toHaveBeenCalledWith({
        user: mockUser,
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const mockUser = { id: 1, name: 'Test User' };
      mockAuthService.getTokens.mockRejectedValue(
        new Error('Unexpected error') as never,
      );

      // Act & Assert
      await expect(
        authController.refreshToken(mockUser as any),
      ).rejects.toThrow(new Error('Unexpected error'));
      expect(mockAuthService.getTokens).toHaveBeenCalledWith({
        user: mockUser,
      });
    });
  });
});

// End of unit tests for: refreshToken
