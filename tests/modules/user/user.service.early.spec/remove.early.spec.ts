// Unit tests for: remove

import { UserService } from '../../../../src/modules/user/user.service';

// Mock interfaces and classes
interface MockModel {
  findByIdAndDelete: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Test suite for the remove method
describe('UserService.remove() remove method', () => {
  let userService: UserService;
  let mockUserModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    // Initialize mocks
    mockUserModel = {
      findByIdAndDelete: jest.fn(),
    };

    mockConnection = new MockConnection();
    mockMapper = {} as MockMapper;

    // Initialize UserService with mocks
    userService = new UserService(
      mockUserModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should successfully remove a user by id', async () => {
      // Arrange: Mock the findByIdAndDelete method to return a user object
      const mockUser = { _id: 'someId', name: 'John Doe' };
      mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser as any);

      // Act: Call the remove method
      const result = await userService.remove('someId');

      // Assert: Ensure the method returns the deleted user
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('someId');
    });
  });

  describe('Edge cases', () => {
    it('should return null if no user is found with the given id', async () => {
      // Arrange: Mock the findByIdAndDelete method to return null
      mockUserModel.findByIdAndDelete.mockResolvedValue(null as any);

      // Act: Call the remove method
      const result = await userService.remove('nonExistentId');

      // Assert: Ensure the method returns null
      expect(result).toBeNull();
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(
        'nonExistentId',
      );
    });

    it('should handle errors thrown by the database operation', async () => {
      // Arrange: Mock the findByIdAndDelete method to throw an error
      const error = new Error('Database error');
      mockUserModel.findByIdAndDelete.mockRejectedValue(error as never);

      // Act & Assert: Ensure the method throws the error
      await expect(userService.remove('someId')).rejects.toThrow(
        'Database error',
      );
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('someId');
    });
  });
});

// End of unit tests for: remove
