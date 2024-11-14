// Unit tests for: update

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserController } from '../user.controller';

// Mock classes
class MockUpdateUserDto {
  // Define properties as needed for testing
  public name: string = 'Test User';
  public email: string = 'test@example.com';
}

class MockUserService {
  updateUser = jest.fn();
}

describe('UserController.update() update method', () => {
  let userController: UserController;
  let mockUserService: MockUserService;
  let mockUpdateUserDto: MockUpdateUserDto;

  beforeEach(() => {
    mockUserService = new MockUserService() as any;
    userController = new UserController(mockUserService as any);
    mockUpdateUserDto = new MockUpdateUserDto() as any;
  });

  describe('Happy Path', () => {
    it('should return a success message when user is updated successfully', async () => {
      // Arrange
      const userId = '123';
      const user = { _id: userId };
      mockUserService.updateUser.mockResolvedValue(
        'user_updated' as any as never,
      );

      // Act
      const result = await userController.update(
        mockUpdateUserDto as any,
        user as any,
      );

      // Assert
      expect(result).toEqual({ message: 'user_updated' });
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        userId,
        mockUpdateUserDto,
      );
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      const userId = '123';
      const user = { _id: userId };
      mockUserService.updateUser.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(
        userController.update(mockUpdateUserDto as any, user as any),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        userId,
        mockUpdateUserDto,
      );
    });

    it('should throw BadRequestException when update fails with a specific message', async () => {
      // Arrange
      const userId = '123';
      const user = { _id: userId };
      const errorMessage = 'invalid_data';
      mockUserService.updateUser.mockResolvedValue(
        errorMessage as any as never,
      );

      // Act & Assert
      await expect(
        userController.update(mockUpdateUserDto as any, user as any),
      ).rejects.toThrow(BadRequestException);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        userId,
        mockUpdateUserDto,
      );
    });
  });
});

// End of unit tests for: update
