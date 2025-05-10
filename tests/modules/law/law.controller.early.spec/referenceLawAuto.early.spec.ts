// Unit tests for: referenceLawAuto

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  public referenceLawAuto = jest.fn();
}

describe('LawController.referenceLawAuto() referenceLawAuto method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return success message and data when referenceLawAuto returns data', async () => {
      // Arrange: Mock the service to return some data
      const mockData = { id: 1, name: 'Sample Law' };
      mockLawService.referenceLawAuto.mockResolvedValue(mockData as any);

      // Act: Call the method
      const result = await lawController.referenceLawAuto();

      // Assert: Check if the result is as expected
      expect(result).toEqual({
        message: 'success',
        data: mockData,
      });
      expect(mockLawService.referenceLawAuto).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when referenceLawAuto returns null', async () => {
      // Arrange: Mock the service to return null
      mockLawService.referenceLawAuto.mockResolvedValue(null as any);

      // Act & Assert: Call the method and expect an exception
      await expect(lawController.referenceLawAuto()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.referenceLawAuto).toHaveBeenCalled();
    });

    it('should throw NotFoundException when referenceLawAuto returns undefined', async () => {
      // Arrange: Mock the service to return undefined
      mockLawService.referenceLawAuto.mockResolvedValue(undefined as any);

      // Act & Assert: Call the method and expect an exception
      await expect(lawController.referenceLawAuto()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.referenceLawAuto).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: referenceLawAuto
