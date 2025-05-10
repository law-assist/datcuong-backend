// Unit tests for: searchUrl

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCrawlerDto } from '../../../../src/modules/crawler/dto/create-crawler.dto';
import { LawController } from '../../../../src/modules/law/law.controller';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock class for LawService
class MockLawService {
  findByUrl = jest.fn();
}

describe('LawController.searchUrl() searchUrl method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LawController],
      providers: [
        {
          provide: LawService,
          useClass: MockLawService,
        },
      ],
    }).compile();

    lawController = module.get<LawController>(LawController);
    mockLawService = module.get<LawService>(LawService) as any;
  });

  describe('Happy paths', () => {
    it('should return success message and data when a valid URL is provided', async () => {
      // Arrange
      const mockUrl = 'http://valid-url.com';
      const mockResponse = { id: 1, url: mockUrl };
      mockLawService.findByUrl.mockResolvedValue(mockResponse as any);

      const req: CreateCrawlerDto = { url: mockUrl };

      // Act
      const result = await lawController.searchUrl(req);

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
      expect(mockLawService.findByUrl).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when no law is found for the given URL', async () => {
      // Arrange
      const mockUrl = 'http://non-existent-url.com';
      mockLawService.findByUrl.mockResolvedValue(null);

      const req: CreateCrawlerDto = { url: mockUrl };

      // Act & Assert
      await expect(lawController.searchUrl(req)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.findByUrl).toHaveBeenCalledWith(mockUrl);
    });

    it('should handle invalid URL format gracefully', async () => {
      // Arrange
      const invalidUrl = 'invalid-url';
      const req: CreateCrawlerDto = { url: invalidUrl };

      // Act & Assert
      await expect(lawController.searchUrl(req)).rejects.toThrow();
      expect(mockLawService.findByUrl).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: searchUrl
