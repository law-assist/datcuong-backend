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

  describe('Happy paths', () => {
    it('should return tokens and user data on successful sign in', async () => {
      // Arrange
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
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockUserService.getUser.mockResolvedValue(readUserDto as any as never);
      jest
        .spyOn(authService, 'getTokens' as any)
        .mockResolvedValue(tokens as any as never);

      // Act
      const result = await authService.signIn(userDto);

      // Assert
      expect(result).toEqual({
        data: {
          user: {
            _id: readUserDto._id,
            fullName: readUserDto.fullName,
            email: readUserDto.email,
            role: readUserDto.role,
            phoneNumber: readUserDto.phoneNumber,
            status: readUserDto.status,
            field: readUserDto.fields,
            avatarUrl: readUserDto.avatarUrl,
          },
          tokens,
        },
        message: 'login_success',
        status: 'success',
        statusCode: 200,
      });
    });
  });

  describe('Edge cases', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'Password1',
      };

      mockUserService.getUser.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(authService.signIn(userDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Arrange
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'WrongPassword1',
      };

      mockUserService.getUser.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(authService.signIn(userDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

// End of unit tests for: signIn
