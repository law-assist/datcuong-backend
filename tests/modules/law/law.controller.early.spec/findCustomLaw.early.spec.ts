// Unit tests for: findCustomLaw

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  public getCustomLaws = jest.fn();
}

describe('LawController.findCustomLaw() findCustomLaw method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return a success message and data when custom laws are found', async () => {
      // Arrange
      const mockData = [{ id: 1, name: 'Custom Law 1' }];
      mockLawService.getCustomLaws.mockResolvedValue(mockData as any as never);

      // Act
      const result = await lawController.findCustomLaw();

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockData,
      });
      expect(mockLawService.getCustomLaws).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when no custom laws are found', async () => {
      // Arrange
      mockLawService.getCustomLaws.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(lawController.findCustomLaw()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.getCustomLaws).toHaveBeenCalled();
    });

    it('should throw NotFoundException when getCustomLaws returns an empty array', async () => {
      // Arrange
      mockLawService.getCustomLaws.mockResolvedValue([] as any as never);

      // Act & Assert
      await expect(lawController.findCustomLaw()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.getCustomLaws).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: findCustomLaw
