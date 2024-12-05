// Unit tests for: getUser

import { ReadUserDto } from '../../../../src/modules/user/dto/read-user.dto';
import { User } from '../../../../src/modules/user/entities/user.schema';
import { UserService } from '../../../../src/modules/user/user.service';

// Mock classes and interfaces
interface MockModel {
  findOne: jest.Mock;
}

class MockUser {}

class MockConnection {}

interface MockMapper {
  map: jest.Mock;
}

// Test suite for getUser method
describe('UserService.getUser() getUser method', () => {
  let userService: UserService;
  let mockUserModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockUserModel = {
      findOne: jest.fn(),
    };

    mockConnection = new MockConnection() as any;
    mockMapper = {
      map: jest.fn(),
    };

    userService = new UserService(
      mockUserModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  // Happy path test: should return a mapped user when email and password match
  it('should return a mapped user when email and password match', async () => {
    const mockUser = new MockUser() as any;
    const mockReadUserDto = new ReadUserDto() as any;

    mockUserModel.findOne.mockResolvedValue(mockUser);
    mockMapper.map.mockReturnValue(mockReadUserDto);

    const result = await userService.getUser('test@example.com', 'password123');

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(mockMapper.map).toHaveBeenCalledWith(mockUser, User, ReadUserDto);
    expect(result).toBe(mockReadUserDto);
  });

  // Edge case test: should return null when no user is found
  it('should return null when no user is found', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    const result = await userService.getUser(
      'nonexistent@example.com',
      'wrongpassword',
    );

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    });
    expect(result).toBeNull();
  });

  // Edge case test: should handle errors thrown by the model
  it('should handle errors thrown by the model', async () => {
    const error = new Error('Database error');
    mockUserModel.findOne.mockRejectedValue(error);

    await expect(
      userService.getUser('error@example.com', 'password'),
    ).rejects.toThrow('Database error');
  });
});

// End of unit tests for: getUser
