// Unit tests for: search

import { NotFoundException } from '@nestjs/common';
import { LawQuery } from 'src/common/types';
import { LawController } from '../../../../src/modules/law/law.controller';

// Mock for LawService
class MockLawService {
  searchLaw = jest.fn();
}

describe('LawController.search() search method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return a success message and data when searchLaw returns results', async () => {
      // Arrange
      const mockQuery: LawQuery = {
        name: 'Test Law',
        field: 'Test Field',
        category: 'Test Category',
        department: 'Test Department',
        year: '2023',
        page: 1,
        size: 10,
      };
      const mockResult = [{ id: 1, name: 'Test Law' }];
      mockLawService.searchLaw.mockResolvedValue(mockResult as any as never);

      // Act
      const result = await lawController.search(mockQuery);

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResult,
      });
      expect(mockLawService.searchLaw).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when searchLaw returns null', async () => {
      // Arrange
      const mockQuery: LawQuery = {
        name: 'Nonexistent Law',
        field: 'Test Field',
        category: 'Test Category',
        department: 'Test Department',
        year: '2023',
        page: 1,
        size: 10,
      };
      mockLawService.searchLaw.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(lawController.search(mockQuery)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.searchLaw).toHaveBeenCalledWith(mockQuery);
    });

    it('should handle empty query gracefully', async () => {
      // Arrange
      const mockResult = [{ id: 1, name: 'Default Law' }];
      mockLawService.searchLaw.mockResolvedValue(mockResult as any as never);

      // Act
      const result = await lawController.search();

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResult,
      });
      expect(mockLawService.searchLaw).toHaveBeenCalledWith(undefined);
    });
  });
});

// End of unit tests for: search
