// Unit tests for: searchName

import { NotFoundException } from '@nestjs/common';
import { ReqDto } from '../../../../src/modules/law/dto/req.dto';
import { LawController } from '../../../../src/modules/law/law.controller';

// Mock LawService
class MockLawService {
  findByName = jest.fn();
}

describe('LawController.searchName() searchName method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return success message and data when law is found', async () => {
      // Arrange
      const reqDto: ReqDto = { word: 'someLawName' };
      const mockResponse = { id: 1, name: 'someLawName' };
      mockLawService.findByName.mockResolvedValue(mockResponse as any);

      // Act
      const result = await lawController.searchName(reqDto);

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
      expect(mockLawService.findByName).toHaveBeenCalledWith(reqDto.word);
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when law is not found', async () => {
      // Arrange
      const reqDto: ReqDto = { word: 'nonExistentLawName' };
      mockLawService.findByName.mockResolvedValue(null as any);

      // Act & Assert
      await expect(lawController.searchName(reqDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.findByName).toHaveBeenCalledWith(reqDto.word);
    });

    it('should handle empty word in request gracefully', async () => {
      // Arrange
      const reqDto: ReqDto = { word: '' };
      mockLawService.findByName.mockResolvedValue(null as any);

      // Act & Assert
      await expect(lawController.searchName(reqDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.findByName).toHaveBeenCalledWith(reqDto.word);
    });

    it('should handle special characters in word', async () => {
      // Arrange
      const reqDto: ReqDto = { word: '!@#$%^&*()' };
      const mockResponse = { id: 2, name: '!@#$%^&*()' };
      mockLawService.findByName.mockResolvedValue(mockResponse as any);

      // Act
      const result = await lawController.searchName(reqDto);

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
      expect(mockLawService.findByName).toHaveBeenCalledWith(reqDto.word);
    });
  });
});

// End of unit tests for: searchName
