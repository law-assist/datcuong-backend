// Unit tests for: register

import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserController } from '../user.controller';

// Mock class for UserService
class MockUserService {
  createUser = jest.fn();
}

describe('UserController.register() register method', () => {
  let userController: UserController;
  let mockUserService: MockUserService;

  beforeEach(() => {
    mockUserService = new MockUserService();
    userController = new UserController(mockUserService as any);
  });

  describe('Happy Path', () => {
    it('should successfully register a user', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        phoneNumber: '1234567890',
        dob: new Date('1990-01-01'),
        address: '123 Main St',
        role: 'USER',
      } as any;

      const expectedResponse = { id: 'user123', ...userDto };
      mockUserService.createUser.mockResolvedValue(expectedResponse as any);

      // Act
      const result = await userController.register(userDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockUserService.createUser).toHaveBeenCalledWith(userDto);
    });
  });

  describe('Edge Cases', () => {
    it('should throw BadRequestException if user creation fails', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'securePassword123',
      } as any;

      mockUserService.createUser.mockRejectedValue(
        new BadRequestException('User creation failed') as never,
      );

      // Act & Assert
      await expect(userController.register(userDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserService.createUser).toHaveBeenCalledWith(userDto);
    });

    it('should handle missing optional fields gracefully', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        fullName: 'Alice Smith',
        email: 'alice.smith@example.com',
        password: 'securePassword123',
      } as any;

      const expectedResponse = { id: 'user456', ...userDto };
      mockUserService.createUser.mockResolvedValue(expectedResponse as any);

      // Act
      const result = await userController.register(userDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockUserService.createUser).toHaveBeenCalledWith(userDto);
    });
  });
});

// End of unit tests for: register
