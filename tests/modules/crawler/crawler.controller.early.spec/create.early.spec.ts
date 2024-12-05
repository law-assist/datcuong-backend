// Unit tests for: create

import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerController } from '../../../../src/modules/crawler/crawler.controller';
import { CrawlerService } from '../../../../src/modules/crawler/crawler.service';
import { CreateCrawlerDto } from '../../../../src/modules/crawler/dto/create-crawler.dto';

// Mock class for CrawlerService
class MockCrawlerService {
  crawler = jest.fn();
}

describe('CrawlerController.create() create method', () => {
  let crawlerController: CrawlerController;
  let mockCrawlerService: MockCrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlerController],
      providers: [
        {
          provide: CrawlerService,
          useClass: MockCrawlerService,
        },
      ],
    }).compile();

    crawlerController = module.get<CrawlerController>(CrawlerController);
    mockCrawlerService = module.get<CrawlerService>(CrawlerService) as any;
  });

  describe('Happy paths', () => {
    it('should call crawlerService.crawler with the correct URL', async () => {
      // Arrange: Set up the test data and mock behavior
      const createCrawlerDto: CreateCrawlerDto = { url: 'http://example.com' };
      mockCrawlerService.crawler.mockReturnValue('Crawling started' as any);

      // Act: Call the method under test
      const result = await crawlerController.create(createCrawlerDto);

      // Assert: Verify the expected behavior
      expect(mockCrawlerService.crawler).toHaveBeenCalledWith(
        'http://example.com',
      );
      expect(result).toBe('Crawling started');
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid URL gracefully', async () => {
      // Arrange: Set up the test data and mock behavior
      const createCrawlerDto: CreateCrawlerDto = { url: 'invalid-url' };
      mockCrawlerService.crawler.mockImplementation(() => {
        throw new Error('Invalid URL');
      });

      // Act & Assert: Call the method and expect an error
      await expect(crawlerController.create(createCrawlerDto)).rejects.toThrow(
        'Invalid URL',
      );
    });

    it('should handle service errors gracefully', async () => {
      // Arrange: Set up the test data and mock behavior
      const createCrawlerDto: CreateCrawlerDto = { url: 'http://example.com' };
      mockCrawlerService.crawler.mockRejectedValue(
        new Error('Service error') as never,
      );

      // Act & Assert: Call the method and expect an error
      await expect(crawlerController.create(createCrawlerDto)).rejects.toThrow(
        'Service error',
      );
    });
  });
});

// End of unit tests for: create
