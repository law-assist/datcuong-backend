// Unit tests for: register

import { BadRequestException } from '@nestjs/common';
import { AuthController } from '../../../../src/modules/auth/auth.controller';
import { CreateUserDto } from '../../../../src/modules/user/dto/create-user.dto';

// Mock for AuthService
class MockAuthService {
  signUp = jest.fn();
}

describe('AuthController.register() register method', () => {
  let authController: AuthController;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    authController = new AuthController(mockAuthService as any);
  });

  describe('Happy paths', () => {
    it('should successfully register a user with valid data', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        phoneNumber: '1234567890',
        dob: new Date('1990-01-01'),
        address: '123 Main St',
        role: 'user',
      };
      const expectedResponse = { id: 'user-id', ...userDto };
      mockAuthService.signUp.mockResolvedValue(expectedResponse as any);

      // Act
      const result = await authController.register(userDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(userDto);
    });
  });

  describe('Edge cases', () => {
    it('should throw BadRequestException if signUp fails', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'securePassword123',
      };
      mockAuthService.signUp.mockRejectedValue(
        new Error('sign_up_failed') as never,
      );

      // Act & Assert
      await expect(authController.register(userDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(userDto);
    });

    it('should handle missing optional fields gracefully', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        fullName: 'Alice Smith',
        email: 'alice.smith@example.com',
        password: 'securePassword123',
      };
      const expectedResponse = { id: 'user-id', ...userDto };
      mockAuthService.signUp.mockResolvedValue(expectedResponse as any);

      // Act
      const result = await authController.register(userDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(userDto);
    });
  });
});

// End of unit tests for: register
