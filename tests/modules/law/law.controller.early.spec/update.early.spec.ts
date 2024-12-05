// Unit tests for: update

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockUpdateLawDto {
  public title: string = 'Mock Title';
  public description: string = 'Mock Description';
}

class MockLawService {
  update = jest.fn();
}

describe('LawController.update() update method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should update a law successfully', async () => {
      // Arrange
      const mockId = '123';
      const mockUpdateLawDto = new MockUpdateLawDto() as any;
      const expectedResult = { id: mockId, ...mockUpdateLawDto };
      mockLawService.update.mockResolvedValue(expectedResult as any);

      // Act
      const result = await lawController.update(mockId, mockUpdateLawDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockLawService.update).toHaveBeenCalledWith(
        mockId,
        mockUpdateLawDto,
      );
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if law not found', async () => {
      // Arrange
      const mockId = 'non-existent-id';
      const mockUpdateLawDto = new MockUpdateLawDto() as any;
      mockLawService.update.mockRejectedValue(
        new NotFoundException('law_not_found') as never,
      );

      // Act & Assert
      await expect(
        lawController.update(mockId, mockUpdateLawDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockLawService.update).toHaveBeenCalledWith(
        mockId,
        mockUpdateLawDto,
      );
    });

    it('should handle empty update data gracefully', async () => {
      // Arrange
      const mockId = '123';
      const mockUpdateLawDto = {} as any;
      const expectedResult = { id: mockId, ...mockUpdateLawDto };
      mockLawService.update.mockResolvedValue(expectedResult as any);

      // Act
      const result = await lawController.update(mockId, mockUpdateLawDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockLawService.update).toHaveBeenCalledWith(
        mockId,
        mockUpdateLawDto,
      );
    });
  });
});

// End of unit tests for: update
