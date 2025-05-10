// Unit tests for: softDelete

import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  public softDeleteUnnecessaryLaws = jest.fn();
}

describe('LawController.softDelete() softDelete method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy Paths', () => {
    it('should successfully soft delete unnecessary laws', async () => {
      // Arrange
      mockLawService.softDeleteUnnecessaryLaws.mockResolvedValue(undefined);

      // Act
      const result = await lawController.softDelete();

      // Assert
      expect(result).toEqual({ message: 'success' });
      expect(mockLawService.softDeleteUnnecessaryLaws).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors thrown by the service gracefully', async () => {
      // Arrange
      const errorMessage = 'Unexpected error';
      mockLawService.softDeleteUnnecessaryLaws.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(lawController.softDelete()).rejects.toThrowError(
        errorMessage,
      );
      expect(mockLawService.softDeleteUnnecessaryLaws).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: softDelete
