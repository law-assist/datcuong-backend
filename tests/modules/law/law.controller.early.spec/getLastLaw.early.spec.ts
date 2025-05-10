// Unit tests for: getLastLaw

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  getLastLaw = jest.fn();
}

describe('LawController.getLastLaw() getLastLaw method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy Paths', () => {
    it('should return the last law successfully', async () => {
      // Arrange: Mock the service to return a valid law object
      const mockLaw = { id: '1', name: 'Mock Law' };
      mockLawService.getLastLaw.mockResolvedValue(mockLaw as any);

      // Act: Call the getLastLaw method
      const result = await lawController.getLastLaw();

      // Assert: Verify the response structure and content
      expect(result).toEqual({
        message: 'success',
        data: mockLaw,
      });
      expect(mockLawService.getLastLaw).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when no law is found', async () => {
      // Arrange: Mock the service to return null
      mockLawService.getLastLaw.mockResolvedValue(null as any);

      // Act & Assert: Call the getLastLaw method and expect an exception
      await expect(lawController.getLastLaw()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.getLastLaw).toHaveBeenCalledTimes(1);
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange: Mock the service to throw an error
      mockLawService.getLastLaw.mockRejectedValue(
        new Error('Unexpected error') as never,
      );

      // Act & Assert: Call the getLastLaw method and expect an exception
      await expect(lawController.getLastLaw()).rejects.toThrow(
        'Unexpected error',
      );
      expect(mockLawService.getLastLaw).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: getLastLaw
