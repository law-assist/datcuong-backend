// Unit tests for: Roles

import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/enum';
import { Roles, ROLES_KEY } from '../../../src/decorators/roles.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Roles() Roles method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should call SetMetadata with the correct key and roles when a single role is provided', () => {
      // Test to ensure SetMetadata is called with the correct key and a single role
      Roles(Role.ADMIN);
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [Role.ADMIN]);
    });

    it('should call SetMetadata with the correct key and roles when multiple roles are provided', () => {
      // Test to ensure SetMetadata is called with the correct key and multiple roles
      Roles(Role.ADMIN, Role.USER);
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [
        Role.ADMIN,
        Role.USER,
      ]);
    });

    it('should call SetMetadata with the correct key and an empty array when no roles are provided', () => {
      // Test to ensure SetMetadata is called with the correct key and an empty array when no roles are provided
      Roles();
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, []);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle roles with similar names correctly', () => {
      // Test to ensure roles with similar names are handled correctly
      Roles(Role.ADMIN, Role.USER, Role.LAWYER, Role.BANNED);
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [
        Role.ADMIN,
        Role.USER,
        Role.LAWYER,
        Role.BANNED,
      ]);
    });

    it('should not throw an error when called with undefined roles', () => {
      // Test to ensure no error is thrown when called with undefined roles
      expect(() => Roles(undefined as any)).not.toThrow();
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [undefined]);
    });

    it('should handle roles with mixed valid and undefined values', () => {
      // Test to ensure mixed valid and undefined roles are handled correctly
      Roles(Role.ADMIN, undefined as any, Role.USER);
      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [
        Role.ADMIN,
        undefined,
        Role.USER,
      ]);
    });
  });
});

// End of unit tests for: Roles
