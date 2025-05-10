// Unit tests for: getLawsWithLongNames

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  aggregate: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Test suite for getLawsWithLongNames
describe('LawService.getLawsWithLongNames() getLawsWithLongNames method', () => {
  let service: LawService;
  let mockHttpService: HttpService;
  let mockLawModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockHttpService = {} as any;
    mockLawModel = {
      aggregate: jest.fn(),
    } as any;
    mockConnection = {} as any;
    mockMapper = {} as any;

    service = new LawService(
      mockHttpService as any,
      mockLawModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy Paths', () => {
    it('should return laws with names longer than 300 characters', async () => {
      // Arrange
      const mockLaws = [
        {
          _id: '1',
          name: 'A'.repeat(301),
          baseUrl: 'http://law1.com',
          nameLength: 301,
        },
        {
          _id: '2',
          name: 'B'.repeat(302),
          baseUrl: 'http://law2.com',
          nameLength: 302,
        },
      ];
      mockLawModel.aggregate.mockResolvedValue(mockLaws as any as never);

      // Act
      const result = await service.getLawsWithLongNames();

      // Assert
      expect(result).toEqual(mockLaws);
      expect(mockLawModel.aggregate).toHaveBeenCalledWith([
        { $addFields: { nameLength: { $strLenCP: '$name' } } },
        { $match: { nameLength: { $gt: 300 }, isDeleted: false } },
        { $project: { _id: 1, name: 1, baseUrl: 1, nameLength: 1 } },
        { $limit: 10 },
        { $sort: { nameLength: -1 } },
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should return an empty array if no laws have names longer than 300 characters', async () => {
      // Arrange
      mockLawModel.aggregate.mockResolvedValue([] as any as never);

      // Act
      const result = await service.getLawsWithLongNames();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle errors gracefully and return an empty array', async () => {
      // Arrange
      mockLawModel.aggregate.mockRejectedValue(
        new Error('Database error') as never,
      );

      // Act
      const result = await service.getLawsWithLongNames();

      // Assert
      expect(result).toEqual([]);
    });
  });
});

// End of unit tests for: getLawsWithLongNames
