// Unit tests for: crawler

import { BadRequestException } from '@nestjs/common';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
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
  create = jest.fn();
  checkLawExistence = jest.fn();
}

describe('CrawlerService.crawler() crawler method', () => {
  let service: CrawlerService;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    service = new CrawlerService(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should successfully crawl and create a law', async () => {
      // Arrange
      const mockUrl = 'http://example.com';
      const mockPageContent =
        '<html><body><td>Số hiệu:</td><td>123</td></body></html>';
      const mockLaw = { id: 1, name: 'Test Law' };

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          content: jest.fn().mockResolvedValue(mockPageContent),
          waitForSelector: jest.fn(),
          click: jest.fn(),
        }),
        close: jest.fn(),
      } as any);

      (cheerio.load as jest.Mock).mockReturnValue({
        text: jest.fn().mockReturnValue('Test Law'),
        next: jest
          .fn()
          .mockReturnValue({ text: jest.fn().mockReturnValue('123') }),
      });

      (mockLawService.create as jest.Mock).mockResolvedValue(mockLaw as any);

      // Act
      const result = await service.crawler(mockUrl);

      // Assert
      expect(result).toEqual({ message: 'law_crawled', data: mockLaw });
      expect(mockLawService.create).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle missing page content gracefully', async () => {
      // Arrange
      const mockUrl = 'http://example.com';

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          content: jest.fn().mockResolvedValue(null),
        }),
        close: jest.fn(),
      } as any);

      // Act & Assert
      await expect(service.crawler(mockUrl)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle duplicate law error', async () => {
      // Arrange
      const mockUrl = 'http://example.com';
      const duplicateError = new Error('duplicate pdfUrl');

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          content: jest.fn().mockResolvedValue('<html></html>'),
        }),
        close: jest.fn(),
      } as any);

      (mockLawService.create as jest.Mock).mockRejectedValue(
        duplicateError as never,
      );

      // Act & Assert
      await expect(service.crawler(mockUrl)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

// End of unit tests for: crawler
