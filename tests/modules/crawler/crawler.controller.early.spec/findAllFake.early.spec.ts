// Unit tests for: findAllFake

import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerController } from '../../../../src/modules/crawler/crawler.controller';
import { CrawlerService } from '../../../../src/modules/crawler/crawler.service';

class MockCrawlerService {
  public crawlerAllFake = jest.fn();
}

describe('CrawlerController.findAllFake() findAllFake method', () => {
  let crawlerController: CrawlerController;
  let mockCrawlerService: MockCrawlerService;

  beforeEach(async () => {
    mockCrawlerService = new MockCrawlerService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlerController],
      providers: [
        {
          provide: CrawlerService,
          useValue: mockCrawlerService as any,
        },
      ],
    }).compile();

    crawlerController = module.get<CrawlerController>(CrawlerController);
  });

  describe('Happy paths', () => {
    it('should return a list of fake crawlers', async () => {
      // Arrange: Set up the mock to return a list of fake crawlers
      const fakeCrawlers = [
        { id: 1, name: 'Fake Crawler 1' },
        { id: 2, name: 'Fake Crawler 2' },
      ];
      mockCrawlerService.crawlerAllFake.mockReturnValue(fakeCrawlers as any);

      // Act: Call the findAllFake method
      const result = await crawlerController.findAllFake();

      // Assert: Verify the result matches the expected fake crawlers
      expect(result).toEqual(fakeCrawlers);
      expect(mockCrawlerService.crawlerAllFake).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle an empty list of fake crawlers', async () => {
      // Arrange: Set up the mock to return an empty list
      mockCrawlerService.crawlerAllFake.mockReturnValue([] as any);

      // Act: Call the findAllFake method
      const result = await crawlerController.findAllFake();

      // Assert: Verify the result is an empty list
      expect(result).toEqual([]);
      expect(mockCrawlerService.crawlerAllFake).toHaveBeenCalledTimes(1);
    });

    it('should handle an error thrown by the service', async () => {
      // Arrange: Set up the mock to throw an error
      const errorMessage = 'Service error';
      mockCrawlerService.crawlerAllFake.mockRejectedValue(
        new Error(errorMessage) as never,
      );

      // Act & Assert: Call the findAllFake method and expect an error to be thrown
      await expect(crawlerController.findAllFake()).rejects.toThrow(
        errorMessage,
      );
      expect(mockCrawlerService.crawlerAllFake).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: findAllFake
