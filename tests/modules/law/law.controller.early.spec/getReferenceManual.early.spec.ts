// Unit tests for: getReferenceManual

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  referenceLawManual = jest.fn();
}

describe('LawController.getReferenceManual() getReferenceManual method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return the reference manual data when a valid ID is provided', async () => {
      // Arrange
      const mockData = { id: '123', name: 'Sample Law' };
      mockLawService.referenceLawManual.mockResolvedValue(
        mockData as any as never,
      );

      // Act
      const result = await lawController.getReferenceManual('123');

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockData,
      });
      expect(mockLawService.referenceLawManual).toHaveBeenCalledWith('123');
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when no data is found for the given ID', async () => {
      // Arrange
      mockLawService.referenceLawManual.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(
        lawController.getReferenceManual('invalid-id'),
      ).rejects.toThrow(NotFoundException);
      expect(mockLawService.referenceLawManual).toHaveBeenCalledWith(
        'invalid-id',
      );
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      mockLawService.referenceLawManual.mockRejectedValue(
        new Error('Unexpected error') as never,
      );

      // Act & Assert
      await expect(lawController.getReferenceManual('123')).rejects.toThrow(
        'Unexpected error',
      );
      expect(mockLawService.referenceLawManual).toHaveBeenCalledWith('123');
    });
  });
});

// End of unit tests for: getReferenceManual
