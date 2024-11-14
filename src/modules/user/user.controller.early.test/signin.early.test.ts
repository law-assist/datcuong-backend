// Unit tests for: signin

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserDto } from '../../auth/dto/user.dto';
import { UserController } from '../user.controller';

// Mock UserService
class MockUserService {
  getUser = jest.fn();
}

describe('UserController.signin() signin method', () => {
  let userController: UserController;
  let mockUserService: MockUserService;

  beforeEach(() => {
    mockUserService = new MockUserService() as any;
    userController = new UserController(mockUserService as any);
  });

  describe('Happy Path', () => {
    it('should return user data when valid email and password are provided', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'Password1',
      };
      const expectedUser = { id: '123', email: 'test@example.com' };
      mockUserService.getUser.mockResolvedValue(expectedUser as any);

      // Act
      const result = await userController.signin(userDto);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserService.getUser).toHaveBeenCalledWith(
        userDto.email,
        userDto.password,
      );
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'nonexistent@example.com',
        password: 'Password1',
      };
      mockUserService.getUser.mockResolvedValue(null as any);

      // Act & Assert
      await expect(userController.signin(userDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.getUser).toHaveBeenCalledWith(
        userDto.email,
        userDto.password,
      );
    });

    it('should throw BadRequestException when email is invalid', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'invalid-email',
        password: 'Password1',
      };

      // Act & Assert
      await expect(userController.signin(userDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when password does not meet criteria', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'short',
      };

      // Act & Assert
      await expect(userController.signin(userDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

// End of unit tests for: signin
