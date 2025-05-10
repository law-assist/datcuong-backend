// Unit tests for: getDepartments

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

// Mock for LawService
class MockLawService {
  getAllDepartments = jest.fn();
}

describe('LawController.getDepartments() getDepartments method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return a list of departments when service returns data', async () => {
      // Arrange
      const departments = [
        { id: 1, name: 'Department A' },
        { id: 2, name: 'Department B' },
      ];
      mockLawService.getAllDepartments.mockResolvedValue(
        departments as any as never,
      );

      // Act
      const result = await lawController.getDepartments();

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: departments,
      });
      expect(mockLawService.getAllDepartments).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when service returns null', async () => {
      // Arrange
      mockLawService.getAllDepartments.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(lawController.getDepartments()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.getAllDepartments).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when service returns an empty array', async () => {
      // Arrange
      mockLawService.getAllDepartments.mockResolvedValue([] as any as never);

      // Act & Assert
      await expect(lawController.getDepartments()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.getAllDepartments).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: getDepartments
