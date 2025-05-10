// Unit tests for: register

import { BadRequestException } from '@nestjs/common';
import { Role } from 'src/common/enum';
import { CreateUserDto } from '../../../../src/modules/user/dto/create-user.dto';
import { UserController } from '../../../../src/modules/user/user.controller';

class MockUserService {
  createUser = jest.fn();
}

describe('UserController.register() register method', () => {
  let userController: UserController;
  let mockUserService: MockUserService;

  beforeEach(() => {
    mockUserService = new MockUserService() as any;
    userController = new UserController(mockUserService as any);
  });

  describe('Happy paths', () => {
    it('should successfully register a user and return a success message', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        dob: new Date('1990-01-01'),
        address: '123 Main St',
        password: 'securePassword123',
        role: Role.USER,
      };
      const expectedResponse = {
        message: 'user_created',
        data: { id: '123', ...createUserDto },
      };
      mockUserService.createUser.mockReturnValue(expectedResponse.data as any);

      // Act
      const result = userController.register(createUserDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('Edge cases', () => {
    it('should throw BadRequestException if email or phone number already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        phoneNumber: '0987654321',
        dob: new Date('1992-02-02'),
        address: '456 Elm St',
        password: 'anotherSecurePassword123',
        role: Role.USER,
      };
      mockUserService.createUser.mockReturnValue(null as any);

      // Act & Assert
      expect(() => userController.register(createUserDto)).toThrow(
        BadRequestException,
      );
      expect(() => userController.register(createUserDto)).toThrow(
        'email_or_phone_exist',
      );
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });
});

// End of unit tests for: register
