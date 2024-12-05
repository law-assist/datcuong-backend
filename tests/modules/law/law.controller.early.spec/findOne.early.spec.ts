// Unit tests for: findOne

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  findOne = jest.fn();
}

describe('LawController.findOne() findOne method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy Paths', () => {
    it('should return law data when a valid ID is provided', async () => {
      const mockLawData = { id: '1', name: 'Law 1' };
      mockLawService.findOne.mockResolvedValue(mockLawData as any);

      const result = await lawController.findOne('1');
      expect(result).toEqual({
        message: 'success',
        data: mockLawData,
      });
      expect(mockLawService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when no law is found for the given ID', async () => {
      mockLawService.findOne.mockResolvedValue(null);

      await expect(lawController.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.findOne).toHaveBeenCalledWith('999');
    });

    it('should handle unexpected errors gracefully', async () => {
      mockLawService.findOne.mockRejectedValue(new Error('Unexpected error'));

      await expect(lawController.findOne('1')).rejects.toThrow(
        'Unexpected error',
      );
      expect(mockLawService.findOne).toHaveBeenCalledWith('1');
    });
  });
});

// End of unit tests for: findOne
