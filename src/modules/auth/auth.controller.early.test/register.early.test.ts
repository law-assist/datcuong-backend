// Unit tests for: register

import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthController } from '../auth.controller';
import { Role } from 'src/common/enum/enum';

// Mock AuthService
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

  describe('Happy Path', () => {
    it('should successfully register a user', async () => {
      // Arrange: Set up the mock to return a successful response
      const userDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        phoneNumber: '1234567890',
        dob: new Date('1990-01-01'),
        address: '123 Main St',
        role: Role.USER,
      };
      const expectedResponse = { id: 1, ...userDto };
      mockAuthService.signUp.mockResolvedValue(expectedResponse as any);

      // Act: Call the register method
      const result = await authController.register(userDto);

      // Assert: Verify the result
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(userDto);
    });
  });

  describe('Edge Cases', () => {
    it('should throw BadRequestException if signUp fails', async () => {
      // Arrange: Set up the mock to throw an error
      const userDto: CreateUserDto = {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'securePassword123',
        phoneNumber: '0987654321',
        dob: new Date('1992-02-02'),
        address: '456 Elm St',
        role: Role.USER,
      };
      mockAuthService.signUp.mockRejectedValue(
        new Error('Sign up failed') as never,
      );

      // Act & Assert: Call the register method and expect an exception
      await expect(authController.register(userDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(userDto);
    });

    it('should handle missing optional fields gracefully', async () => {
      // Arrange: Set up the mock to return a successful response
      const userDto: CreateUserDto = {
        fullName: 'Alice Smith',
        email: 'alice.smith@example.com',
        password: 'securePassword123',
      };
      const expectedResponse = { id: 2, ...userDto };
      mockAuthService.signUp.mockResolvedValue(expectedResponse as any);

      // Act: Call the register method
      const result = await authController.register(userDto);

      // Assert: Verify the result
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(userDto);
    });
  });
});

// End of unit tests for: register
