// Unit tests for: searchRef

import { NotFoundException } from '@nestjs/common';
import { RefQuery } from 'src/common/types';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  searchLawRef = jest.fn();
}

describe('LawController.searchRef() searchRef method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return a success message and data when searchLawRef returns data', async () => {
      // Arrange
      const query: RefQuery = {
        lawId: '1',
        LawRef: 'ref',
        index: 0,
        classification: 1,
        type: 'type',
      };
      const expectedData = { id: '1', name: 'Sample Law' };
      mockLawService.searchLawRef.mockResolvedValue(
        expectedData as any as never,
      );

      // Act
      const result = await lawController.searchRef(query);

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: expectedData,
      });
      expect(mockLawService.searchLawRef).toHaveBeenCalledWith(query);
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when searchLawRef returns null', async () => {
      // Arrange
      const query: RefQuery = {
        lawId: '1',
        LawRef: 'ref',
        index: 0,
        classification: 1,
        type: 'type',
      };
      mockLawService.searchLawRef.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(lawController.searchRef(query)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.searchLawRef).toHaveBeenCalledWith(query);
    });

    it('should throw NotFoundException when searchLawRef returns undefined', async () => {
      // Arrange
      const query: RefQuery = {
        lawId: '1',
        LawRef: 'ref',
        index: 0,
        classification: 1,
        type: 'type',
      };
      mockLawService.searchLawRef.mockResolvedValue(undefined as any as never);

      // Act & Assert
      await expect(lawController.searchRef(query)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.searchLawRef).toHaveBeenCalledWith(query);
    });
  });
});

// End of unit tests for: searchRef
