// Unit tests for: createUser

import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../../../../src/modules/user/dto/create-user.dto';
import { UserService } from '../../../../src/modules/user/user.service';
import { Role } from 'src/common/enum';

// Mock interfaces and classes
interface MockModel {
  create: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Mock ObjectId
jest.mock('mongodb', () => ({
  ObjectId: jest.fn().mockImplementation((id) => id),
}));

describe('UserService.createUser() createUser method', () => {
  let userService: UserService;
  let mockUserModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockUserModel = {
      create: jest.fn(),
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
    it('should create a user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        role: Role.USER,
      };
      const createdUser = { ...createUserDto, _id: 'someId' };
      mockUserModel.create.mockResolvedValue(createdUser as any);

      // Act
      const result = await userService.createUser(createUserDto);

      // Assert
      expect(result).toEqual(createdUser);
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('Edge cases', () => {
    it('should throw BadRequestException if email already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        role: Role.USER,
      };
      const error = { keyPattern: { email: 1 } };
      mockUserModel.create.mockRejectedValue(error as never);

      // Act & Assert
      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException('email_exist'),
      );
    });

    it('should throw BadRequestException if phone number already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        password: 'securePassword123',
        role: Role.USER,
      };
      const error = { keyPattern: { phoneNumber: 1 } };
      mockUserModel.create.mockRejectedValue(error as never);

      // Act & Assert
      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException('phone_number_exist'),
      );
    });

    it('should return undefined if an unknown error occurs', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        role: Role.USER,
      };
      const error = new Error('Unknown error');
      mockUserModel.create.mockRejectedValue(error as never);

      // Act
      await expect(userService.createUser(createUserDto)).rejects.toThrow();
    });
  });
});

// End of unit tests for: createUser
