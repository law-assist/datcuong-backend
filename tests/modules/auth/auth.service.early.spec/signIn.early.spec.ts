// Unit tests for: signIn

import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../../src/modules/auth/auth.service';
import { UserDto } from '../../../../src/modules/auth/dto/user.dto';
import { ReadUserDto } from '../../../../src/modules/user/dto/read-user.dto';

// Mock classes
class MockUserService {
  getUser = jest.fn();
}

class MockJwtService {
  signAsync = jest.fn();
}

class MockConfigService {}

// Test suite
describe('AuthService.signIn() signIn method', () => {
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
  it('should return tokens and user data on successful sign in', async () => {
    const userDto: UserDto = {
      email: 'test@example.com',
      password: 'Password1',
    };

    const readUserDto: ReadUserDto = {
      _id: 'userId',
      fullName: 'Test User',
      email: 'test@example.com',
      role: 'user',
      phoneNumber: '1234567890',
      status: 'active',
      fields: [],
      avatarUrl: 'http://example.com/avatar.png',
    };

    mockUserService.getUser.mockResolvedValue(readUserDto as any as never);
    mockJwtService.signAsync.mockResolvedValue('token' as any as never);

    const result = await authService.signIn(userDto);

    expect(result).toEqual({
      data: {
        user: {
          _id: 'userId',
          fullName: 'Test User',
          email: 'test@example.com',
          role: 'user',
          phoneNumber: '1234567890',
          status: 'active',
          field: [],
          avatarUrl: 'http://example.com/avatar.png',
        },
        tokens: {
          accessToken: 'token',
          refreshToken: 'token',
        },
      },
      message: 'login_success',
      status: 'success',
      statusCode: 200,
    });
  });

  // Edge case test
  it('should throw UnauthorizedException if user is not found', async () => {
    const userDto: UserDto = {
      email: 'test@example.com',
      password: 'Password1',
    };

    mockUserService.getUser.mockResolvedValue(null as any as never);

    await expect(authService.signIn(userDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  // Edge case test
  it('should throw UnauthorizedException if password is incorrect', async () => {
    const userDto: UserDto = {
      email: 'test@example.com',
      password: 'WrongPassword1',
    };

    const readUserDto: ReadUserDto = {
      _id: 'userId',
      fullName: 'Test User',
      email: 'test@example.com',
      role: 'user',
      phoneNumber: '1234567890',
      status: 'active',
      fields: [],
      avatarUrl: 'http://example.com/avatar.png',
    };

    mockUserService.getUser.mockResolvedValue(readUserDto as any as never);

    await expect(authService.signIn(userDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

// End of unit tests for: signIn
