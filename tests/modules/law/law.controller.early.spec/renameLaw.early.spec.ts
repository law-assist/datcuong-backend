// Unit tests for: renameLaw

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  renameLaw = jest.fn();
}

describe('LawController.renameLaw() renameLaw method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy Paths', () => {
    it('should return success message and data when renameLaw is successful', async () => {
      // Arrange
      const mockData = { renamed: true };
      mockLawService.renameLaw.mockResolvedValue(mockData as any as never);

      // Act
      const result = await lawController.renameLaw();

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockData,
      });
      expect(mockLawService.renameLaw).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when renameLaw returns null', async () => {
      // Arrange
      mockLawService.renameLaw.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(lawController.renameLaw()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.renameLaw).toHaveBeenCalled();
    });

    it('should throw NotFoundException when renameLaw throws an error', async () => {
      // Arrange
      mockLawService.renameLaw.mockRejectedValue(
        new Error('Unexpected error') as never,
      );

      // Act & Assert
      await expect(lawController.renameLaw()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.renameLaw).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: renameLaw
