// Unit tests for: signIn

import { BadRequestException } from '@nestjs/common';
import { AuthController } from '../../../../src/modules/auth/auth.controller';
import { UserDto } from '../../../../src/modules/auth/dto/user.dto';

// Mock AuthService
class MockAuthService {
  signIn = jest.fn();
}

describe('AuthController.signIn() signIn method', () => {
  let authController: AuthController;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockAuthService = new MockAuthService() as any;
    authController = new AuthController(mockAuthService as any);
  });

  describe('Happy Paths', () => {
    it('should return a valid token when signIn is successful', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'Password1',
      };
      const expectedToken = { accessToken: 'valid-token' };
      mockAuthService.signIn.mockResolvedValue(expectedToken as any);

      // Act
      const result = await authController.signIn(userDto);

      // Assert
      expect(result).toEqual(expectedToken);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(userDto);
    });
  });

  describe('Edge Cases', () => {
    it('should throw BadRequestException when signIn fails', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'Password1',
      };
      mockAuthService.signIn.mockRejectedValue(
        new BadRequestException('Invalid credentials') as never,
      );

      // Act & Assert
      await expect(authController.signIn(userDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(userDto);
    });

    it('should handle invalid email format gracefully', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'invalid-email',
        password: 'Password1',
      };

      // Act & Assert
      await expect(authController.signIn(userDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle password not meeting criteria', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'short',
      };

      // Act & Assert
      await expect(authController.signIn(userDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

// End of unit tests for: signIn
