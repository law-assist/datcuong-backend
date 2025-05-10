// Unit tests for: update

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserController } from '../../../../src/modules/user/user.controller';

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
  let mockUser: any;

  beforeEach(() => {
    mockUserService = new MockUserService() as any;
    userController = new UserController(mockUserService as any);
    mockUpdateUserDto = new MockUpdateUserDto() as any;
    mockUser = { _id: '12345' };
  });

  describe('Happy paths', () => {
    it('should return a success message when user is updated successfully', async () => {
      // Arrange
      mockUserService.updateUser.mockResolvedValue(
        'user_updated' as any as never,
      );

      // Act
      const result = await userController.update(
        mockUpdateUserDto as any,
        mockUser as any,
      );

      // Assert
      expect(result).toEqual({ message: 'user_updated' });
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        mockUser._id,
        mockUpdateUserDto,
      );
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      mockUserService.updateUser.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(
        userController.update(mockUpdateUserDto as any, mockUser as any),
      ).resolves.toThrow(NotFoundException);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        mockUser._id,
        mockUpdateUserDto,
      );
    });

    it('should throw BadRequestException when update returns an error message', async () => {
      // Arrange
      const errorMessage = 'invalid_data';
      mockUserService.updateUser.mockResolvedValue(
        errorMessage as any as never,
      );

      // Act & Assert
      await expect(
        userController.update(mockUpdateUserDto as any, mockUser as any),
      ).rejects.toThrow(BadRequestException);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        mockUser._id,
        mockUpdateUserDto,
      );
    });
  });
});

// End of unit tests for: update
