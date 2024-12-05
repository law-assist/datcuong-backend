// Unit tests for: checkLawExistence

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  findOne: jest.Mock;
}

class MockLaw {
  baseUrl: string = 'http://example.com/law';
}

class MockConnection {}

interface MockMapper {}

// Test suite for checkLawExistence method
describe('LawService.checkLawExistence() checkLawExistence method', () => {
  let lawService: LawService;
  let mockHttpService: HttpService;
  let mockLawModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockHttpService = {} as any;
    mockLawModel = {
      findOne: jest.fn(),
    } as any;
    mockConnection = {} as any;
    mockMapper = {} as any;

    lawService = new LawService(
      mockHttpService as any,
      mockLawModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should return true if the law exists', async () => {
      // Arrange: Mock the findOne method to return a law
      mockLawModel.findOne.mockResolvedValue(new MockLaw() as any);

      // Act: Call the checkLawExistence method
      const result = await lawService.checkLawExistence(
        'http://example.com/law',
      );

      // Assert: Expect the result to be true
      expect(result).toBe(true);
      expect(mockLawModel.findOne).toHaveBeenCalledWith({
        baseUrl: 'http://example.com/law',
      });
    });

    it('should return false if the law does not exist', async () => {
      // Arrange: Mock the findOne method to return null
      mockLawModel.findOne.mockResolvedValue(null);

      // Act: Call the checkLawExistence method
      const result = await lawService.checkLawExistence(
        'http://example.com/nonexistent',
      );

      // Assert: Expect the result to be false
      expect(result).toBe(false);
      expect(mockLawModel.findOne).toHaveBeenCalledWith({
        baseUrl: 'http://example.com/nonexistent',
      });
    });
  });

  describe('Edge cases', () => {
    it('should throw an error if there is a database error', async () => {
      // Arrange: Mock the findOne method to throw an error
      mockLawModel.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert: Expect the method to throw an error
      await expect(
        lawService.checkLawExistence('http://example.com/error'),
      ).rejects.toThrow('Failed to check law existence: Database error');
    });

    it('should handle empty URL input gracefully', async () => {
      // Arrange: Mock the findOne method to return null
      mockLawModel.findOne.mockResolvedValue(null);

      // Act: Call the checkLawExistence method with an empty URL
      const result = await lawService.checkLawExistence('');

      // Assert: Expect the result to be false
      expect(result).toBe(false);
      expect(mockLawModel.findOne).toHaveBeenCalledWith({ baseUrl: '' });
    });
  });
});

// End of unit tests for: checkLawExistence
