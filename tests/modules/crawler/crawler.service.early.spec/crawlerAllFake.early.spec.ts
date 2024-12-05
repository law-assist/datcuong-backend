// Unit tests for: crawlerAllFake

import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { CrawlerService } from '../../../../src/modules/crawler/crawler.service';

// Mocking necessary modules and functions
jest.mock('puppeteer');
jest.mock('fs');
jest.mock('axios');
jest.mock('cheerio');
jest.mock('../../../../src/modules/crawler/helper', () => {
  const actual = jest.requireActual('../../../../src/modules/crawler/helper');
  return {
    ...actual,
    stringToDate: jest.fn(),
  };
});

// Mock LawService class
class MockLawService {
  checkLawExistence = jest.fn();
  create = jest.fn();
}

describe('CrawlerService.crawlerAllFake() crawlerAllFake method', () => {
  let service: CrawlerService;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    service = new CrawlerService(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should process all URLs and create laws when they do not exist', async () => {
      // Arrange
      const urls = ['http://example.com/law1', 'http://example.com/law2'];
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(JSON.stringify(urls) as any);
      mockLawService.checkLawExistence.mockResolvedValue(false as any);
      mockLawService.create.mockResolvedValue({ id: 1 } as any);

      // Act
      await service.crawlerAllFake();

      // Assert
      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(
        urls.length,
      );
      expect(mockLawService.create).toHaveBeenCalledTimes(urls.length);
    });
  });

  describe('Edge cases', () => {
    it('should skip URLs that already exist', async () => {
      // Arrange
      const urls = ['http://example.com/law1', 'http://example.com/law2'];
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(JSON.stringify(urls) as any);
      mockLawService.checkLawExistence.mockResolvedValue(true as any);

      // Act
      await service.crawlerAllFake();

      // Assert
      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(
        urls.length,
      );
      expect(mockLawService.create).not.toHaveBeenCalled();
    });

    it('should handle errors during law creation gracefully', async () => {
      // Arrange
      const urls = ['http://example.com/law1'];
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(JSON.stringify(urls) as any);
      mockLawService.checkLawExistence.mockResolvedValue(false as any);
      mockLawService.create.mockRejectedValue(
        new BadRequestException('Failed to create law') as never,
      );

      // Act & Assert
      await expect(service.crawlerAllFake()).resolves.not.toThrow();
      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(
        urls.length,
      );
      expect(mockLawService.create).toHaveBeenCalledTimes(urls.length);
    });

    it('should handle empty URL list gracefully', async () => {
      // Arrange
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify([]) as any);

      // Act
      await service.crawlerAllFake();

      // Assert
      expect(mockLawService.checkLawExistence).not.toHaveBeenCalled();
      expect(mockLawService.create).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: crawlerAllFake
