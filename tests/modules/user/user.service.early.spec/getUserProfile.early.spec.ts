// Unit tests for: getUserProfile

import { ObjectId } from 'mongodb';
import { UserService } from '../../../../src/modules/user/user.service';

// Mock interfaces and classes
interface MockModel {
  findOne: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Mock data
const mockUser = {
  _id: new ObjectId('507f1f77bcf86cd799439011'),
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  role: 'user',
  phoneNumber: '1234567890',
  status: 'active',
  fields: [],
  avatarUrl: 'http://example.com/avatar.jpg',
};

describe('UserService.getUserProfile() getUserProfile method', () => {
  let userService: UserService;
  let mockUserModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockUserModel = {
      findOne: jest.fn(),
    };

    mockConnection = new MockConnection();
    mockMapper = {} as MockMapper;

    userService = new UserService(
      mockUserModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should return user profile when a valid ID is provided', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(mockUser as any);

      // Act
      const result = await userService.getUserProfile(
        '507f1f77bcf86cd799439011',
      );

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith(
        { _id: new ObjectId('507f1f77bcf86cd799439011') },
        { password: 0 },
      );
    });
  });

  describe('Edge cases', () => {
    it('should return null when no user is found with the given ID', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);

      // Act
      const result = await userService.getUserProfile(
        '507f1f77bcf86cd799439011',
      );

      // Assert
      expect(result).toBeNull();
      expect(mockUserModel.findOne).toHaveBeenCalledWith(
        { _id: new ObjectId('507f1f77bcf86cd799439011') },
        { password: 0 },
      );
    });

    it('should handle invalid ObjectId format gracefully', async () => {
      // Arrange
      const invalidId = 'invalid-object-id';

      // Act & Assert
      await expect(
        userService.getUserProfile(invalidId),
      ).rejects.toThrowError();
    });
  });
});

// End of unit tests for: getUserProfile
