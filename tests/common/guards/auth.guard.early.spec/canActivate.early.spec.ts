// Unit tests for: canActivate

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../../../src/common/guards/auth.guard';

jest.mock('@nestjs/core');
jest.mock('@nestjs/jwt');

describe('AuthGuard.canActivate() canActivate method', () => {
  let authGuard: AuthGuard;
  let reflector: Reflector;
  let jwtService: JwtService;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    jwtService = new JwtService();
    authGuard = new AuthGuard(jwtService, reflector);
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: {} }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  });

  describe('Happy paths', () => {
    it('should return true if the route is public', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      // Act
      const result = await authGuard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true and set user on request if token is valid', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const mockToken = 'valid.token.here';
      const mockPayload = { userId: 1, role: 'user' };
      context.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: `Bearer ${mockToken}` },
      });
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      // Act
      const result = await authGuard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(context.switchToHttp().getRequest().user).toEqual(mockPayload);
    });
  });

  describe('Edge cases', () => {
    it('should throw UnauthorizedException if no token is provided', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      // Act & Assert
      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const mockToken = 'invalid.token.here';
      context.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: `Bearer ${mockToken}` },
      });
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return undefined if authorization header is malformed', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      context.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: 'MalformedHeader' },
      });

      // Act & Assert
      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

// End of unit tests for: canActivate
