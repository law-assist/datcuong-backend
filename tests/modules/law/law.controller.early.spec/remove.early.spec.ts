// Unit tests for: remove

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  public remove = jest.fn();
}

describe('LawController.remove() remove method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should successfully remove a law by id', async () => {
      // Arrange
      const lawId = '123';
      mockLawService.remove.mockResolvedValue({
        message: 'Law removed successfully',
      } as any);

      // Act
      const result = await lawController.remove(lawId);

      // Assert
      expect(mockLawService.remove).toHaveBeenCalledWith(lawId);
      expect(result).toEqual({ message: 'Law removed successfully' });
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if law does not exist', async () => {
      // Arrange
      const lawId = 'non-existent-id';
      mockLawService.remove.mockRejectedValue(
        new NotFoundException('law_not_found') as never,
      );

      // Act & Assert
      await expect(lawController.remove(lawId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.remove).toHaveBeenCalledWith(lawId);
    });

    it('should handle invalid id format gracefully', async () => {
      // Arrange
      const invalidId = '';
      mockLawService.remove.mockRejectedValue(
        new NotFoundException('law_not_found') as never,
      );

      // Act & Assert
      await expect(lawController.remove(invalidId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.remove).toHaveBeenCalledWith(invalidId);
    });
  });
});

// End of unit tests for: remove
