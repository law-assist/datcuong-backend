// Unit tests for: findAll

import { CrawlerController } from '../../../../src/modules/crawler/crawler.controller';

class MockCrawlerService {
  public crawlerAll = jest.fn();
}

describe('CrawlerController.findAll() findAll method', () => {
  let crawlerController: CrawlerController;
  let mockCrawlerService: MockCrawlerService;

  beforeEach(() => {
    mockCrawlerService = new MockCrawlerService();
    crawlerController = new CrawlerController(mockCrawlerService as any);
  });

  describe('Happy Paths', () => {
    it('should return a list of crawled items when service returns data', async () => {
      // Arrange: Mock the service to return a list of items
      const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      mockCrawlerService.crawlerAll.mockResolvedValue(mockData as any as never);

      // Act: Call the findAll method
      const result = await crawlerController.findAll();

      // Assert: Verify the result matches the mock data
      expect(result).toEqual(mockData);
      expect(mockCrawlerService.crawlerAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty list returned by the service', async () => {
      // Arrange: Mock the service to return an empty list
      mockCrawlerService.crawlerAll.mockResolvedValue([] as any as never);

      // Act: Call the findAll method
      const result = await crawlerController.findAll();

      // Assert: Verify the result is an empty list
      expect(result).toEqual([]);
      expect(mockCrawlerService.crawlerAll).toHaveBeenCalledTimes(1);
    });

    it('should handle service throwing an error', async () => {
      // Arrange: Mock the service to throw an error
      const errorMessage = 'Service error';
      mockCrawlerService.crawlerAll.mockRejectedValue(
        new Error(errorMessage) as never,
      );

      // Act & Assert: Call the findAll method and expect an error to be thrown
      await expect(crawlerController.findAll()).rejects.toThrow(errorMessage);
      expect(mockCrawlerService.crawlerAll).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: findAll
