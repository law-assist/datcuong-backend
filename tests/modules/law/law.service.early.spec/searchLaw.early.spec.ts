// Unit tests for: searchLaw

import { HttpService } from '@nestjs/axios';
import { LawQuery } from 'src/common/types';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock classes and interfaces
interface MockModel {
  aggregate: jest.Mock;
}

class MockLaw {
  public _id: string = 'mockId';
  public name: string = 'mockName';
  public category: string = 'mockCategory';
  public department: string = 'mockDepartment';
  public dateApproved: Date = new Date();
  public fields: string[] = ['mockField'];
  public numberDoc: string = 'mockNumberDoc';
  public isDeleted: boolean = false;
}

class MockConnection {}

interface MockMapper {}

describe('LawService.searchLaw() searchLaw method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockHttpService: HttpService;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockModel = {
      aggregate: jest.fn(),
    };

    mockHttpService = {} as any;
    mockConnection = new MockConnection() as any;
    mockMapper = {} as any;

    service = new LawService(
      mockHttpService as any,
      mockModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should return paginated laws when query is provided', async () => {
      const mockQuery: LawQuery = {
        name: 'test',
        field: 'testField',
        category: 'testCategory',
        department: 'testDepartment',
        year: '2023',
        page: 1,
        size: 10,
      };

      const mockResult = [
        {
          metadata: [{ total: 1 }],
          data: [new MockLaw()],
        },
      ];

      mockModel.aggregate.mockResolvedValue(mockResult as any as never);

      const result = await service.searchLaw(mockQuery);

      expect(result).toEqual({
        page: 1,
        total: 1,
        laws: [new MockLaw()],
      });
    });

    it('should return empty laws when no match is found', async () => {
      const mockQuery: LawQuery = {
        name: 'nonexistent',
        field: '',
        category: '',
        department: '',
        year: '',
        page: 1,
        size: 10,
      };

      const mockResult = [
        {
          metadata: [{ total: 0 }],
          data: [],
        },
      ];

      mockModel.aggregate.mockResolvedValue(mockResult as any as never);

      const result = await service.searchLaw(mockQuery);

      expect(result).toEqual({
        page: 1,
        total: 0,
        laws: [],
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty query gracefully', async () => {
      const mockResult = [
        {
          metadata: [{ total: 1 }],
          data: [new MockLaw()],
        },
      ];

      mockModel.aggregate.mockResolvedValue(mockResult as any as never);

      const result = await service.searchLaw();

      expect(result).toEqual({
        page: 1,
        total: 1,
        laws: [new MockLaw()],
      });
    });

    it('should handle errors during aggregation', async () => {
      mockModel.aggregate.mockRejectedValue(new Error('Aggregation error'));

      await expect(service.searchLaw()).rejects.toThrow(
        'An error occurred while searching for laws. Please try again later.',
      );
    });
  });
});

// End of unit tests for: searchLaw
