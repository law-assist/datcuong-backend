// Unit tests for: findAll

import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  findAll = jest.fn();
}

describe('LawController.findAll() findAll method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy Paths', () => {
    it('should return a list of laws when findAll is called', async () => {
      // Arrange
      const mockLaws = [
        { id: 1, name: 'Law 1' },
        { id: 2, name: 'Law 2' },
      ];
      mockLawService.findAll.mockReturnValue(mockLaws as any);

      // Act
      const result = await lawController.findAll();

      // Assert
      expect(result).toEqual(mockLaws);
      expect(mockLawService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should return an empty array if no laws are found', async () => {
      // Arrange
      mockLawService.findAll.mockReturnValue([] as any);

      // Act
      const result = await lawController.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockLawService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const errorMessage = 'Unexpected error';
      mockLawService.findAll.mockRejectedValue(
        new Error(errorMessage) as never,
      );

      // Act & Assert
      await expect(lawController.findAll()).rejects.toThrow(errorMessage);
      expect(mockLawService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: findAll
