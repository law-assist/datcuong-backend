// Unit tests for: create

import { LawController } from '../../../../src/modules/law/law.controller';

class MockCreateLawDto {
  public title: string = 'Sample Law';
  public description: string = 'This is a sample law description';
}

class MockLawService {
  create = jest.fn();
}

describe('LawController.create() create method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should successfully create a law', async () => {
      // Arrange
      const mockCreateLawDto = new MockCreateLawDto() as any;
      const expectedResult = { id: '1', ...mockCreateLawDto };
      mockLawService.create.mockResolvedValue(expectedResult as any);

      // Act
      const result = await lawController.create(mockCreateLawDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockLawService.create).toHaveBeenCalledWith(mockCreateLawDto);
    });
  });

  describe('Edge cases', () => {
    it('should handle service throwing an error', async () => {
      // Arrange
      const mockCreateLawDto = new MockCreateLawDto() as any;
      const errorMessage = 'Error creating law';
      mockLawService.create.mockRejectedValue(new Error(errorMessage) as never);

      // Act & Assert
      await expect(lawController.create(mockCreateLawDto)).rejects.toThrow(
        errorMessage,
      );
      expect(mockLawService.create).toHaveBeenCalledWith(mockCreateLawDto);
    });

    it('should handle empty CreateLawDto', async () => {
      // Arrange
      const mockCreateLawDto = {} as any;
      const expectedResult = { id: '1', ...mockCreateLawDto };
      mockLawService.create.mockResolvedValue(expectedResult as any);

      // Act
      const result = await lawController.create(mockCreateLawDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockLawService.create).toHaveBeenCalledWith(mockCreateLawDto);
    });
  });
});

// End of unit tests for: create
