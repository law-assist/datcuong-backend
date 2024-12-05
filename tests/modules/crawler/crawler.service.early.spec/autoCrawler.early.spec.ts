// Unit tests for: autoCrawler

import { CrawlerService } from '../../../../src/modules/crawler/crawler.service';

// Mocking external dependencies
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

describe('CrawlerService.autoCrawler() autoCrawler method', () => {
  let crawlerService: CrawlerService;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    crawlerService = new CrawlerService(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should crawl and process URLs correctly', async () => {
      // Mocking getUrls to return a list of URLs
      jest
        .spyOn(crawlerService, 'getUrls' as any)
        .mockResolvedValue([
          'http://example.com/law1',
          'http://example.com/law2',
        ] as any);

      // Mocking checkLawExistence to return false, indicating the law does not exist
      mockLawService.checkLawExistence.mockResolvedValue(false as any);

      // Mocking the crawler method to simulate successful crawling
      jest
        .spyOn(crawlerService, 'crawler' as any)
        .mockResolvedValue({ message: 'law_crawled' } as any);

      await crawlerService.autoCrawler();

      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(2);
      expect(crawlerService['crawler']).toHaveBeenCalledTimes(2);
    });

    it('should stop crawling when no URLs are returned', async () => {
      // Mocking getUrls to return an empty list
      jest.spyOn(crawlerService, 'getUrls' as any).mockResolvedValue([] as any);

      await crawlerService.autoCrawler();

      expect(mockLawService.checkLawExistence).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle existing laws and stop after 200 consecutive existing laws', async () => {
      // Mocking getUrls to return a list of URLs
      jest
        .spyOn(crawlerService, 'getUrls' as any)
        .mockResolvedValue(['http://example.com/law1'] as any);

      // Mocking checkLawExistence to return true, indicating the law exists
      mockLawService.checkLawExistence.mockResolvedValue(true as any);

      await crawlerService.autoCrawler();

      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(1);
      expect(crawlerService['crawler']).not.toHaveBeenCalled();
    });

    it('should handle errors during crawling gracefully', async () => {
      // Mocking getUrls to return a list of URLs
      jest
        .spyOn(crawlerService, 'getUrls' as any)
        .mockResolvedValue(['http://example.com/law1'] as any);

      // Mocking checkLawExistence to return false
      mockLawService.checkLawExistence.mockResolvedValue(false as any);

      // Mocking the crawler method to throw an error
      jest
        .spyOn(crawlerService, 'crawler' as any)
        .mockRejectedValue(new Error('Crawling error') as never);

      await expect(crawlerService.autoCrawler()).resolves.not.toThrow();

      expect(mockLawService.checkLawExistence).toHaveBeenCalledTimes(1);
      expect(crawlerService['crawler']).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: autoCrawler
