// Unit tests for: getCategories

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  getAllCategories = jest.fn();
}

describe('LawController.getCategories() getCategories method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return categories successfully', async () => {
      // Arrange: Mock the service to return a list of categories
      const mockCategories = [
        { id: 1, name: 'Category1' },
        { id: 2, name: 'Category2' },
      ];
      mockLawService.getAllCategories.mockResolvedValue(
        mockCategories as any as never,
      );

      // Act: Call the getCategories method
      const result = await lawController.getCategories();

      // Assert: Verify the response
      expect(result).toEqual({
        message: 'success',
        data: mockCategories,
      });
      expect(mockLawService.getAllCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if no categories are found', async () => {
      // Arrange: Mock the service to return an empty array
      mockLawService.getAllCategories.mockResolvedValue([] as any as never);

      // Act & Assert: Call the getCategories method and expect a NotFoundException
      await expect(lawController.getCategories()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.getAllCategories).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange: Mock the service to throw an error
      mockLawService.getAllCategories.mockRejectedValue(
        new Error('Service error') as never,
      );

      // Act & Assert: Call the getCategories method and expect an error
      await expect(lawController.getCategories()).rejects.toThrow(
        'Service error',
      );
      expect(mockLawService.getAllCategories).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: getCategories
