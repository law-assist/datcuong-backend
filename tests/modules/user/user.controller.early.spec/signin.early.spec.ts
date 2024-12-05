// Unit tests for: signin

import { NotFoundException } from '@nestjs/common';
import { UserDto } from '../../../../src/modules/auth/dto/user.dto';
import { UserController } from '../../../../src/modules/user/user.controller';

// Mock class for UserService
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

  describe('Happy paths', () => {
    it('should return success message and user data when user is found', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'Password1',
      };
      const mockUserData = { id: '123', email: 'test@example.com' };
      mockUserService.getUser.mockResolvedValue(mockUserData as any);

      // Act
      const result = await userController.signin(userDto);

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockUserData,
      });
      expect(mockUserService.getUser).toHaveBeenCalledWith(
        userDto.email,
        userDto.password,
      );
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'notfound@example.com',
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

    it('should handle invalid email format gracefully', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'invalid-email',
        password: 'Password1',
      };

      // Act & Assert
      await expect(userController.signin(userDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.getUser).toHaveBeenCalledWith(
        userDto.email,
        userDto.password,
      );
    });

    it('should handle invalid password format gracefully', async () => {
      // Arrange
      const userDto: UserDto = { email: 'test@example.com', password: 'short' };

      // Act & Assert
      await expect(userController.signin(userDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.getUser).toHaveBeenCalledWith(
        userDto.email,
        userDto.password,
      );
    });
  });
});

// End of unit tests for: signin
