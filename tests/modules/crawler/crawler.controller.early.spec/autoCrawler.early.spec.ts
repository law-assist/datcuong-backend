// Unit tests for: autoCrawler

import { CrawlerController } from '../../../../src/modules/crawler/crawler.controller';

class MockCrawlerService {
  autoCrawler = jest.fn();
}

describe('CrawlerController.autoCrawler() autoCrawler method', () => {
  let crawlerController: CrawlerController;
  let mockCrawlerService: MockCrawlerService;

  beforeEach(() => {
    mockCrawlerService = new MockCrawlerService() as any;
    crawlerController = new CrawlerController(mockCrawlerService as any);
  });

  describe('Happy Paths', () => {
    it('should return data when autoCrawler is successful', async () => {
      // Arrange: Set up the mock to return a successful response
      const mockData = { success: true, data: [] };
      mockCrawlerService.autoCrawler.mockResolvedValue(
        mockData as any as never,
      );

      // Act: Call the autoCrawler method
      const result = await crawlerController.autoCrawler();

      // Assert: Verify the result matches the expected output
      expect(result).toEqual(mockData);
      expect(mockCrawlerService.autoCrawler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors thrown by autoCrawler gracefully', async () => {
      // Arrange: Set up the mock to throw an error
      const mockError = new Error('Crawler error');
      mockCrawlerService.autoCrawler.mockRejectedValue(mockError as never);

      // Act & Assert: Call the autoCrawler method and expect it to throw
      await expect(crawlerController.autoCrawler()).rejects.toThrow(
        'Crawler error',
      );
      expect(mockCrawlerService.autoCrawler).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if autoCrawler returns undefined', async () => {
      // Arrange: Set up the mock to return undefined
      mockCrawlerService.autoCrawler.mockResolvedValue(
        undefined as any as never,
      );

      // Act: Call the autoCrawler method
      const result = await crawlerController.autoCrawler();

      // Assert: Verify the result is an empty array
      expect(result).toEqual([]);
      expect(mockCrawlerService.autoCrawler).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: autoCrawler
