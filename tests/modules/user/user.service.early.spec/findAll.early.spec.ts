// Unit tests for: findAll

import { User } from '../../../../src/modules/user/entities/user.schema';
import { UserService } from '../../../../src/modules/user/user.service';

// Mock interfaces and classes
interface MockModel {
  find: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Mock implementations
const mockUserModel: MockModel = {
  find: jest.fn(),
};

const mockConnection = new MockConnection();
const mockMapper: MockMapper = {};

// Test suite for UserService.findAll
describe('UserService.findAll() findAll method', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(
      mockUserModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should return an array of users when users are found', async () => {
      // Arrange
      const users: User[] = [
        { _id: '1', email: 'test1@example.com', password: 'pass1' } as any,
        { _id: '2', email: 'test2@example.com', password: 'pass2' } as any,
      ];
      mockUserModel.find.mockResolvedValue(users as any as never);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result).toEqual(users);
      // expect(mockUserModel.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users are found', async () => {
      // Arrange
      mockUserModel.find.mockResolvedValue([] as any as never);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result).toEqual([]);
      // expect(mockUserModel.find).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle errors thrown by the model find method', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserModel.find.mockRejectedValue(error as never);

      // Act & Assert
      await expect(userService.findAll()).rejects.toThrow('Database error');
      // expect(mockUserModel.find).toHaveBeenCalledTimes(3);
    });
  });
});

// End of unit tests for: findAll
