// Unit tests for: crawlerAll

import * as fs from 'fs';
import { CrawlerService } from '../../../../src/modules/crawler/crawler.service';

// Mocking necessary modules
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

// Mock LawService
class MockLawService {
  checkLawExistence = jest.fn();
  create = jest.fn();
}

describe('CrawlerService.crawlerAll() crawlerAll method', () => {
  let crawlerService: CrawlerService;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    crawlerService = new CrawlerService(mockLawService as any);
  });

  describe('Happy Paths', () => {
    it('should process all URLs and create laws when they do not exist', async () => {
      // Arrange
      const urls = ['http://example.com/law1', 'http://example.com/law2'];
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(JSON.stringify(urls) as any);
      mockLawService.checkLawExistence.mockResolvedValue(false as any);
      mockLawService.create.mockResolvedValue({ id: 1 } as any);
      jest.spyOn(crawlerService, 'crawler' as any).mockResolvedValue(undefined);

      // Act
      await crawlerService.crawlerAll();

      // Assert
      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(
        urls.length,
      );
      expect(mockLawService.create).toHaveBeenCalledTimes(urls.length);
    });
  });

  describe('Edge Cases', () => {
    it('should skip URLs that already exist', async () => {
      // Arrange
      const urls = ['http://example.com/law1', 'http://example.com/law2'];
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(JSON.stringify(urls) as any);
      mockLawService.checkLawExistence.mockResolvedValue(true as any);

      // Act
      await crawlerService.crawlerAll();

      // Assert
      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(
        urls.length,
      );
      expect(mockLawService.create).not.toHaveBeenCalled();
    });

    it('should handle errors during crawling gracefully', async () => {
      // Arrange
      const urls = ['http://example.com/law1'];
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(JSON.stringify(urls) as any);
      mockLawService.checkLawExistence.mockResolvedValue(false as any);
      jest
        .spyOn(crawlerService, 'crawler' as any)
        .mockRejectedValue(new Error('Crawling error'));

      // Act
      await crawlerService.crawlerAll();

      // Assert
      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(
        urls.length,
      );
      expect(mockLawService.create).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: crawlerAll
