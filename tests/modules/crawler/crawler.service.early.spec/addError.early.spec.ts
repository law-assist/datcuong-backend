// Unit tests for: addError

import * as fs from 'fs';
import { CrawlerService } from '../../../../src/modules/crawler/crawler.service';

// Mocking the necessary modules
jest.mock('fs');
jest.mock('../../../../src/modules/crawler/helper', () => {
  const actual = jest.requireActual('../../../../src/modules/crawler/helper');
  return {
    ...actual,
    stringToDate: jest.fn(),
  };
});

// Mock LawService class
class MockLawService {
  public checkLawExistence = jest.fn();
  public create = jest.fn();
}

describe('CrawlerService.addError() addError method', () => {
  let service: CrawlerService;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService() as any;
    service = new CrawlerService(mockLawService as any);
  });

  describe('Happy Paths', () => {
    it('should add a URL to the error list successfully', async () => {
      // Arrange
      const url = 'http://example.com';
      const existingErrors = ['http://existing-error.com'];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(existingErrors),
      );
      const writeFileSyncMock = (
        fs.writeFileSync as jest.Mock
      ).mockImplementation();

      // Act
      await service.addError(url);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith('./err.json', 'utf8');
      expect(writeFileSyncMock).toHaveBeenCalledWith(
        './err.json',
        JSON.stringify([...existingErrors, url]),
        'utf8',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle an empty error list file gracefully', async () => {
      // Arrange
      const url = 'http://example.com';
      (fs.readFileSync as jest.Mock).mockReturnValue('');
      const writeFileSyncMock = (
        fs.writeFileSync as jest.Mock
      ).mockImplementation();

      // Act
      await service.addError(url);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith('./err.json', 'utf8');
      expect(writeFileSyncMock).toHaveBeenCalledWith(
        './err.json',
        JSON.stringify([url]),
        'utf8',
      );
    });

    it('should handle a non-existent error list file gracefully', async () => {
      // Arrange
      const url = 'http://example.com';
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });
      const writeFileSyncMock = (
        fs.writeFileSync as jest.Mock
      ).mockImplementation();

      // Act
      await service.addError(url);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith('./err.json', 'utf8');
      expect(writeFileSyncMock).toHaveBeenCalledWith(
        './err.json',
        JSON.stringify([url]),
        'utf8',
      );
    });
  });
});

// End of unit tests for: addError
