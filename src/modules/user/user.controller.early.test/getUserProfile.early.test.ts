// Unit tests for: getUserProfile

import { NotFoundException } from '@nestjs/common';
import { UserController } from '../user.controller';

// Mock UserService
class MockUserService {
  getUserProfile = jest.fn();
}

describe('UserController.getUserProfile() getUserProfile method', () => {
  let userController: UserController;
  let mockUserService: MockUserService;

  beforeEach(() => {
    mockUserService = new MockUserService() as any;
    userController = new UserController(mockUserService as any);
  });

  describe('Happy Path', () => {
    it('should return user profile when user is found', async () => {
      // Arrange
      const mockUser = { _id: '123', name: 'John Doe' };
      mockUserService.getUserProfile.mockResolvedValue(mockUser as any);

      // Act
      const result = await userController.getUserProfile({ _id: '123' } as any);

      // Assert
      expect(result).toEqual({
        message: 'user_profile',
        data: mockUser,
      });
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('123');
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      mockUserService.getUserProfile.mockResolvedValue(null as any);

      // Act & Assert
      await expect(
        userController.getUserProfile({ _id: '123' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('123');
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      mockUserService.getUserProfile.mockRejectedValue(
        new Error('Unexpected error') as never,
      );

      // Act & Assert
      await expect(
        userController.getUserProfile({ _id: '123' } as any),
      ).rejects.toThrow('Unexpected error');
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('123');
    });
  });
});

// End of unit tests for: getUserProfile
