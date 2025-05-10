// Unit tests for: findAll

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  aggregate: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Test suite for the findAll method
describe('LawService.findAll() findAll method', () => {
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

  // Happy path test
  it('should return paginated laws with metadata', async () => {
    // Arrange
    const mockResult = [
      {
        metadata: [{ total: 20 }],
        data: [{ _id: '1', dateApproved: '2023-01-01' }],
      },
    ];
    mockLawModel.aggregate.mockResolvedValue(mockResult as any);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual({
      page: 1,
      total: 20,
      laws: [{ _id: '1', dateApproved: '2023-01-01' }],
    });
    expect(mockLawModel.aggregate).toHaveBeenCalledWith([
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $sort: { dateApproved: -1 } }, { $skip: 0 }, { $limit: 10 }],
        },
      },
    ]);
  });

  // Edge case test: No laws found
  it('should return empty laws array when no laws are found', async () => {
    // Arrange
    const mockResult = [
      {
        metadata: [{ total: 0 }],
        data: [],
      },
    ];
    mockLawModel.aggregate.mockResolvedValue(mockResult as any);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual({
      page: 1,
      total: 0,
      laws: [],
    });
  });

  // Edge case test: Handle unexpected aggregation result structure
  it('should handle unexpected aggregation result structure gracefully', async () => {
    // Arrange
    const mockResult = [{}];
    mockLawModel.aggregate.mockResolvedValue(mockResult as any);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual({
      page: 1,
      total: 0,
      laws: [],
    });
  });

  // Edge case test: Handle aggregation error
  it('should throw an error if aggregation fails', async () => {
    // Arrange
    mockLawModel.aggregate.mockRejectedValue(new Error('Aggregation error'));

    // Act & Assert
    await expect(service.findAll()).rejects.toThrow('Aggregation error');
  });
});

// End of unit tests for: findAll
