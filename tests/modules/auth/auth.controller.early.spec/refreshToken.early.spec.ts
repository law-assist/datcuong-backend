// Unit tests for: refreshToken

import { BadRequestException } from '@nestjs/common';
import { AuthController } from '../../../../src/modules/auth/auth.controller';

// Mock AuthService
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
    it('should return tokens and success message when tokens are retrieved successfully', async () => {
      // Arrange
      const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };
      mockAuthService.getTokens.mockResolvedValue(mockTokens as any as never);

      // Act
      const result = await authController.refreshToken({ id: 1 } as any);

      // Assert
      expect(result).toEqual({
        data: mockTokens,
        message: 'refresh_token_success',
        status: 'success',
      });
      expect(mockAuthService.getTokens).toHaveBeenCalledWith({
        user: { id: 1 },
      });
    });
  });

  describe('Edge cases', () => {
    it('should throw BadRequestException when tokens are not retrieved', async () => {
      // Arrange
      mockAuthService.getTokens.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(
        authController.refreshToken({ id: 1 } as any),
      ).rejects.toThrow(BadRequestException);
      expect(mockAuthService.getTokens).toHaveBeenCalledWith({
        user: { id: 1 },
      });
    });

    it('should handle unexpected user object structure gracefully', async () => {
      // Arrange
      const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };
      mockAuthService.getTokens.mockResolvedValue(mockTokens as any as never);

      // Act
      const result = await authController.refreshToken({
        unexpected: 'structure',
      } as any);

      // Assert
      expect(result).toEqual({
        data: mockTokens,
        message: 'refresh_token_success',
        status: 'success',
      });
      expect(mockAuthService.getTokens).toHaveBeenCalledWith({
        user: { unexpected: 'structure' },
      });
    });
  });
});

// End of unit tests for: refreshToken
