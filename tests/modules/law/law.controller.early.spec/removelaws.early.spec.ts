// Unit tests for: removelaws

import { NotFoundException } from '@nestjs/common';
import { ReqDto } from '../../../../src/modules/law/dto/req.dto';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  public softDeleteLawByDepartment = jest.fn();
}

describe('LawController.removelaws() removelaws method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should successfully remove laws by department', async () => {
      // Arrange
      const reqDto: ReqDto = { word: 'Finance' };
      mockLawService.softDeleteLawByDepartment.mockResolvedValue(
        undefined as any,
      );

      // Act
      const result = await lawController.removelaws(reqDto);

      // Assert
      expect(mockLawService.softDeleteLawByDepartment).toHaveBeenCalledWith(
        'Finance',
      );
      expect(result).toEqual({ message: 'success' });
    });
  });

  describe('Edge cases', () => {
    it('should handle when no department is provided', async () => {
      // Arrange
      const reqDto: ReqDto = { word: '' };
      mockLawService.softDeleteLawByDepartment.mockResolvedValue(
        undefined as any,
      );

      // Act
      const result = await lawController.removelaws(reqDto);

      // Assert
      expect(mockLawService.softDeleteLawByDepartment).toHaveBeenCalledWith('');
      expect(result).toEqual({ message: 'success' });
    });

    it('should handle when department does not exist', async () => {
      // Arrange
      const reqDto: ReqDto = { word: 'NonExistentDepartment' };
      mockLawService.softDeleteLawByDepartment.mockRejectedValue(
        new NotFoundException('law_not_found') as never,
      );

      // Act & Assert
      await expect(lawController.removelaws(reqDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.softDeleteLawByDepartment).toHaveBeenCalledWith(
        'NonExistentDepartment',
      );
    });
  });
});

// End of unit tests for: removelaws
