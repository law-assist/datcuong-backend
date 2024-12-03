// Unit tests for: findLongNameAll

import { LawController } from '../law.controller';

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
      mockLawService.getLawsWithLongNames.mockResolvedValue(
        mockData as any as never,
      );

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
    it('should return a success message with empty data when no laws with long names are found', async () => {
      // Arrange
      mockLawService.getLawsWithLongNames.mockResolvedValue([] as any as never);

      // Act
      const result = await lawController.findLongNameAll();

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: [],
      });
      expect(mockLawService.getLawsWithLongNames).toHaveBeenCalled();
    });

    it('should handle errors thrown by the service gracefully', async () => {
      // Arrange
      mockLawService.getLawsWithLongNames.mockRejectedValue(
        new Error('Service error') as never,
      );

      // Act & Assert
      await expect(lawController.findLongNameAll()).rejects.toThrow(
        'Service error',
      );
      expect(mockLawService.getLawsWithLongNames).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: findLongNameAll
