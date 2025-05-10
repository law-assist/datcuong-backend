// Unit tests for: remove

import { CrawlerController } from '../../../../src/modules/crawler/crawler.controller';

class MockCrawlerService {
  remove = jest.fn();
}

describe('CrawlerController.remove() remove method', () => {
  let crawlerController: CrawlerController;
  let mockCrawlerService: MockCrawlerService;

  beforeEach(() => {
    mockCrawlerService = new MockCrawlerService() as any;
    crawlerController = new CrawlerController(mockCrawlerService as any);
  });

  describe('Happy paths', () => {
    it('should call remove method of CrawlerService with correct id', async () => {
      // Arrange
      const id = '123';
      mockCrawlerService.remove.mockResolvedValue(id as any as never);

      // Act
      const result = await crawlerController.remove(id);

      // Assert
      expect(mockCrawlerService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe(id);
    });
  });

  describe('Edge cases', () => {
    it('should handle non-string id gracefully', async () => {
      // Arrange
      const id = 123; // non-string id
      mockCrawlerService.remove.mockResolvedValue(
        id.toString() as any as never,
      );

      // Act
      const result = await crawlerController.remove(id as any);

      // Assert
      expect(mockCrawlerService.remove).toHaveBeenCalledWith(id.toString());
      expect(result).toBe(id.toString());
    });

    it('should handle empty string id', async () => {
      // Arrange
      const id = '';
      mockCrawlerService.remove.mockResolvedValue(id as any as never);

      // Act
      const result = await crawlerController.remove(id);

      // Assert
      expect(mockCrawlerService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe(id);
    });

    it('should handle null id', async () => {
      // Arrange
      const id = null;
      mockCrawlerService.remove.mockResolvedValue('' as any as never);

      // Act
      const result = await crawlerController.remove(id as any);

      // Assert
      expect(mockCrawlerService.remove).toHaveBeenCalledWith('');
      expect(result).toBe('');
    });

    it('should handle undefined id', async () => {
      // Arrange
      const id = undefined;
      mockCrawlerService.remove.mockResolvedValue('' as any as never);

      // Act
      const result = await crawlerController.remove(id as any);

      // Assert
      expect(mockCrawlerService.remove).toHaveBeenCalledWith('');
      expect(result).toBe('');
    });

    it('should handle service throwing an error', async () => {
      // Arrange
      const id = '123';
      const errorMessage = 'Service error';
      mockCrawlerService.remove.mockRejectedValue(
        new Error(errorMessage) as never,
      );

      // Act & Assert
      await expect(crawlerController.remove(id)).rejects.toThrow(errorMessage);
    });
  });
});

// End of unit tests for: remove
