// Unit tests for: updateUser

import { ObjectId } from 'mongodb';
import { UserService } from '../../../../src/modules/user/user.service';

// Mock classes and interfaces
class MockUpdateUserDto {
  public name: string = 'Test User';
  public email: string = 'test@example.com';
}

interface MockModel {
  updateOne: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

describe('UserService.updateUser() updateUser method', () => {
  let userService: UserService;
  let mockUserModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockUserModel = {
      updateOne: jest.fn(),
    };

    mockConnection = new MockConnection();
    mockMapper = {} as any;

    userService = new UserService(
      mockUserModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy Paths', () => {
    it('should update a user successfully', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto = new MockUpdateUserDto();
      mockUserModel.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      } as any);

      // Act
      const result = await userService.updateUser(userId, updateUserDto as any);

      // Assert
      expect(result).toBe('user_updated');
      expect(mockUserModel.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(userId) },
        updateUserDto,
      );
    });

    it('should return "user_not_updated" if no changes were made', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto = new MockUpdateUserDto();
      mockUserModel.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      } as any);

      // Act
      const result = await userService.updateUser(userId, updateUserDto as any);

      // Assert
      expect(result).toBe('user_not_updated');
    });
  });

  describe('Edge Cases', () => {
    it('should return undefined if user is not found', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto = new MockUpdateUserDto();
      mockUserModel.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      } as any);

      // Act
      const result = await userService.updateUser(userId, updateUserDto as any);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle email conflict error', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto = new MockUpdateUserDto();
      mockUserModel.updateOne.mockRejectedValue({
        keyPattern: { email: 1 },
      } as never);

      // Act
      const result = await userService.updateUser(userId, updateUserDto as any);

      // Assert
      expect(result).toBe('email_exist');
    });

    it('should handle phone number conflict error', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto = new MockUpdateUserDto();
      mockUserModel.updateOne.mockRejectedValue({
        keyPattern: { phoneNumber: 1 },
      } as never);

      // Act
      const result = await userService.updateUser(userId, updateUserDto as any);

      // Assert
      expect(result).toBe('phone_number_exist');
    });

    it('should handle general update failure', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto = new MockUpdateUserDto();
      mockUserModel.updateOne.mockRejectedValue(
        new Error('Some error') as never,
      );

      // Act
      const result = await userService.updateUser(userId, updateUserDto as any);

      // Assert
      expect(result).toBe('user_update_failed');
    });
  });
});

// End of unit tests for: updateUser
