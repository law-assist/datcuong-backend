// Unit tests for: canActivate

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../../../src/common/enum';
import { RoleGuard } from '../../../../src/common/guards/role.guard';

describe('RoleGuard.canActivate() canActivate method', () => {
  let roleGuard: RoleGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    jwtService = new JwtService({});
    reflector = new Reflector();
    roleGuard = new RoleGuard(jwtService, reflector);
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn(),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  });

  describe('Happy paths', () => {
    it('should return true if no roles are required', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      // Act
      const result = await roleGuard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true if user has the required role', async () => {
      // Arrange
      const mockToken = 'valid.token';
      const mockPayload = { user: { role: Role.ADMIN } };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
      jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
        getRequest: () => ({
          headers: { authorization: `Bearer ${mockToken}` },
        }),
      });
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      // Act
      const result = await roleGuard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should throw UnauthorizedException if no token is provided', async () => {
      // Arrange
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
      jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
        getRequest: () => ({
          headers: {},
        }),
      });

      // Act & Assert
      await expect(roleGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      // Arrange
      const mockToken = 'invalid.token';
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
      jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
        getRequest: () => ({
          headers: { authorization: `Bearer ${mockToken}` },
        }),
      });
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(roleGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return false if user does not have the required role', async () => {
      // Arrange
      const mockToken = 'valid.token';
      const mockPayload = { user: { role: Role.USER } };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
      jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
        getRequest: () => ({
          headers: { authorization: `Bearer ${mockToken}` },
        }),
      });
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      // Act
      const result = await roleGuard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: canActivate
