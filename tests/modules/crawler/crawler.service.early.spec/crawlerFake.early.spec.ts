// Unit tests for: crawlerFake

import { BadRequestException } from '@nestjs/common';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { CrawlerService } from '../../../../src/modules/crawler/crawler.service';

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

class MockLawService {
  public create = jest.fn();
  public checkLawExistence = jest.fn();
}

describe('CrawlerService.crawlerFake() crawlerFake method', () => {
  let service: CrawlerService;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    service = new CrawlerService(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should successfully crawl and create a law', async () => {
      // Arrange
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          content: jest.fn().mockResolvedValue('<html></html>'),
          waitForSelector: jest.fn(),
          click: jest.fn(),
        }),
        close: jest.fn(),
      };
      (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser as any);

      const mockCheerioLoad = jest.fn().mockReturnValue({
        text: jest.fn().mockReturnValue('Some Text'),
        next: jest
          .fn()
          .mockReturnValue({ text: jest.fn().mockReturnValue('Some Text') }),
      });
      (cheerio.load as jest.Mock).mockImplementation(mockCheerioLoad);

      (mockLawService.create as jest.Mock).mockResolvedValue({ id: 1 });

      // Act
      const result = await service.crawlerFake('http://example.com');

      // Assert
      expect(result).toEqual({ message: 'law_crawled', data: { id: 1 } });
      expect(mockLawService.create).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle no content gracefully', async () => {
      // Arrange
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          content: jest.fn().mockResolvedValue(''),
          waitForSelector: jest.fn(),
          click: jest.fn(),
        }),
        close: jest.fn(),
      };
      (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser as any);

      // Act & Assert
      await expect(service.crawlerFake('http://example.com')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle duplicate law error', async () => {
      // Arrange
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          content: jest.fn().mockResolvedValue('<html></html>'),
          waitForSelector: jest.fn(),
          click: jest.fn(),
        }),
        close: jest.fn(),
      };
      (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser as any);

      (mockLawService.create as jest.Mock).mockRejectedValue(
        new Error('duplicate pdfUrl'),
      );

      // Act & Assert
      await expect(service.crawlerFake('http://example.com')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: crawlerFake
