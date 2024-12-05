// Unit tests for: getAllUserRequests

import { RequestService } from '../../../../src/modules/request/request.service';

// Mock classes

interface MockModel {
  aggregate: jest.Mock;
}

class MockConnection {}

// Test suite
describe('RequestService.getAllUserRequests() getAllUserRequests method', () => {
  let service: RequestService;
  let mockRequestModel: MockModel;
  let mockConnection: MockConnection;

  beforeEach(() => {
    mockRequestModel = {
      aggregate: jest.fn(),
    };

    mockConnection = new MockConnection();

    service = new RequestService(
      mockRequestModel as any,
      mockConnection as any,
    );
  });

  // Happy path test
  it('should return paginated user requests with total count', async () => {
    const mockData = [
      {
        data: [
          {
            title: 'Request 1',
            content: 'Content 1',
            status: 'pending',
            createdAt: new Date(),
            userResponse: { fullName: 'User 1', avatarUrl: 'url1' },
          },
        ],
        total: [{ count: 1 }],
      },
    ];

    mockRequestModel.aggregate.mockResolvedValue(mockData as any as never);

    const result = await service.getAllUserRequests('someUserId', {
      limit: 1,
      page: 1,
    });

    expect(result).toEqual({
      data: mockData[0].data,
      total: 1,
    });
    expect(mockRequestModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
  });

  // Edge case test: No requests found
  it('should return empty data and zero total when no requests are found', async () => {
    const mockData = [
      {
        data: [],
        total: [],
      },
    ];

    mockRequestModel.aggregate.mockResolvedValue(mockData as any as never);

    const result = await service.getAllUserRequests('someUserId', {
      limit: 1,
      page: 1,
    });

    expect(result).toEqual({
      data: [],
      total: 0,
    });
    expect(mockRequestModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
  });

  // Edge case test: Invalid page number
  it('should handle invalid page number gracefully', async () => {
    const mockData = [
      {
        data: [],
        total: [],
      },
    ];

    mockRequestModel.aggregate.mockResolvedValue(mockData as any as never);

    const result = await service.getAllUserRequests('someUserId', {
      limit: 1,
      page: -1,
    });

    expect(result).toEqual({
      data: [],
      total: 0,
    });
    expect(mockRequestModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
  });

  // Edge case test: Invalid limit number
  it('should handle invalid limit number gracefully', async () => {
    const mockData = [
      {
        data: [],
        total: [],
      },
    ];

    mockRequestModel.aggregate.mockResolvedValue(mockData as any as never);

    const result = await service.getAllUserRequests('someUserId', {
      limit: -1,
      page: 1,
    });

    expect(result).toEqual({
      data: [],
      total: 0,
    });
    expect(mockRequestModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
  });
});

// End of unit tests for: getAllUserRequests
