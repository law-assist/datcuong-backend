// Unit tests for: signUp

import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../../../../src/modules/auth/auth.service';
import { CreateUserDto } from '../../../../src/modules/user/dto/create-user.dto';

// Mock classes
class MockUserService {
  createUser = jest.fn();
}

class MockJwtService {
  signAsync = jest.fn();
}

class MockConfigService {}

// Test suite for AuthService's signUp method
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

  // Happy path test
  it('should successfully create a new user and return success message', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      role: 'user',
    };

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
      password: expect.any(String), // Password should be hashed
    });
  });

  // Edge case test: User creation fails
  it('should throw BadRequestException if user creation fails', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'anotherSecurePassword123',
      role: 'user',
    };

    mockUserService.createUser.mockResolvedValue(null as any);

    // Act & Assert
    await expect(authService.signUp(createUserDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockUserService.createUser).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.any(String), // Password should be hashed
    });
  });

  // Edge case test: Invalid input data
  it('should handle invalid input data gracefully', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      fullName: '',
      email: 'invalid-email',
      password: '',
      role: 'user',
    };

    mockUserService.createUser.mockResolvedValue(null as any);

    // Act & Assert
    await expect(authService.signUp(createUserDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});

// End of unit tests for: signUp
