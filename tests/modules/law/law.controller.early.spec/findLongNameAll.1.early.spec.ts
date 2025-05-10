// Unit tests for: findLongNameAll

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

// Mock LawService
class MockLawService {
  public getLawsWithLongNames = jest.fn();
}

describe('LawController.findLongNameAll() findLongNameAll method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy Paths', () => {
    it('should return a success message and data when laws with long names are found', async () => {
      // Arrange
      const mockData = [{ id: 1, name: 'A very long law name' }];
      mockLawService.getLawsWithLongNames.mockResolvedValue(mockData as any);

      // Act
      const result = await lawController.findLongNameAll();

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockData,
      });
      expect(mockLawService.getLawsWithLongNames).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when no laws with long names are found', async () => {
      // Arrange
      mockLawService.getLawsWithLongNames.mockResolvedValue(null as any);

      // Act & Assert
      await expect(lawController.findLongNameAll()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.getLawsWithLongNames).toHaveBeenCalled();
    });

    it('should handle empty array response gracefully', async () => {
      // Arrange
      mockLawService.getLawsWithLongNames.mockResolvedValue([] as any);

      // Act
      const result = await lawController.findLongNameAll();

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: [],
      });
      expect(mockLawService.getLawsWithLongNames).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: findLongNameAll
