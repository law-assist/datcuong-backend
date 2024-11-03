// Unit tests for: signUp

import { BadRequestException } from '@nestjs/common';
import { hashPassword } from 'src/common/crypto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../auth.service';

// Mock classes
class MockUserService {
  createUser = jest.fn();
}

class MockJwtService {}

class MockConfigService {}

describe('AuthService.signUp() signUp method', () => {
  let authService: AuthService;
  let mockUserService: MockUserService;
  let mockJwtService: MockJwtService;
  let mockConfigService: MockConfigService;

  beforeEach(() => {
    mockUserService = new MockUserService() as any;
    mockJwtService = new MockJwtService() as any;
    mockConfigService = new MockConfigService() as any;
    authService = new AuthService(
      mockUserService as any,
      mockJwtService as any,
      mockConfigService as any,
    );
  });

  describe('Happy Path', () => {
    it('should successfully create a new user and return success message', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        dob: new Date(),
        address: '123 Main St',
        role: 'USER',
      } as any;

      mockUserService.createUser.mockResolvedValue({
        _id: 'userId123',
        ...createUserDto,
      } as any);

      // Act
      const result = await authService.signUp(createUserDto);

      // Assert
      expect(result).toEqual({
        message: 'user_created',
        status: 'success',
        statusCode: 201,
      });
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashPassword(createUserDto.password),
      });
    });
  });

  describe('Edge Cases', () => {
    it('should throw BadRequestException if user creation fails', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      } as any;

      mockUserService.createUser.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.signUp(createUserDto)).rejects.toThrow(
        new BadRequestException('user_create_failed'),
      );
    });

    it('should handle missing optional fields gracefully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        fullName: 'Alice Smith',
        email: 'alice.smith@example.com',
        password: 'password123',
      } as any;

      mockUserService.createUser.mockResolvedValue({
        _id: 'userId456',
        ...createUserDto,
      } as any);

      // Act
      const result = await authService.signUp(createUserDto);

      // Assert
      expect(result).toEqual({
        message: 'user_created',
        status: 'success',
        statusCode: 201,
      });
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashPassword(createUserDto.password),
      });
    });
  });
});

// End of unit tests for: signUp
