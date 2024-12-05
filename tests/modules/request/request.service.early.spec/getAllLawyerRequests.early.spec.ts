// Unit tests for: getAllLawyerRequests

import { Types } from 'mongoose';
import { RequestService } from '../../../../src/modules/request/request.service';

// Mock classes
class MockRequest {
  public _id: Types.ObjectId = new Types.ObjectId();
  public userResponseId: Types.ObjectId = new Types.ObjectId();
  public title: string = 'Sample Title';
  public content: string = 'Sample Content';
  public status: string = 'pending';
  public createdAt: Date = new Date();
  public userResponse: any = { fullName: 'John Doe', avatarUrl: 'avatar.png' };
}

interface MockModel {
  aggregate: jest.Mock;
}

class MockConnection {}

describe('RequestService.getAllLawyerRequests() getAllLawyerRequests method', () => {
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

  describe('Happy Paths', () => {
    it('should return paginated lawyer requests successfully', async () => {
      // Arrange
      const mockData = [new MockRequest()];
      const mockResult = [{ total: [{ count: 1 }], data: mockData }];
      mockRequestModel.aggregate.mockResolvedValue(mockResult as any as never);

      const uid = new Types.ObjectId().toString();
      const query = { limit: 5, page: 1 };

      // Act
      const result = await service.getAllLawyerRequests(uid, query);

      // Assert
      expect(result).toEqual({ data: mockData, total: 1 });
      //      expect(mockRequestModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty result set gracefully', async () => {
      // Arrange
      const mockResult = [{ total: [], data: [] }];
      mockRequestModel.aggregate.mockResolvedValue(mockResult as any as never);

      const uid = new Types.ObjectId().toString();
      const query = { limit: 5, page: 1 };

      // Act
      const result = await service.getAllLawyerRequests(uid, query);

      // Assert
      expect(result).toEqual({ data: [], total: 0 });
    });

    it('should handle invalid page number gracefully', async () => {
      // Arrange
      const mockData = [new MockRequest()];
      const mockResult = [{ total: [{ count: 1 }], data: mockData }];
      mockRequestModel.aggregate.mockResolvedValue(mockResult as any as never);

      const uid = new Types.ObjectId().toString();
      const query = { limit: 5, page: -1 };

      // Act
      const result = await service.getAllLawyerRequests(uid, query);

      // Assert
      expect(result).toEqual({ data: mockData, total: 1 });
    });

    it('should handle missing query parameters gracefully', async () => {
      // Arrange
      const mockData = [new MockRequest()];
      const mockResult = [{ total: [{ count: 1 }], data: mockData }];
      mockRequestModel.aggregate.mockResolvedValue(mockResult as any as never);

      const uid = new Types.ObjectId().toString();
      const query = {};

      // Act
      const result = await service.getAllLawyerRequests(uid, query);

      // Assert
      expect(result).toEqual({ data: mockData, total: 1 });
    });
  });
});

// End of unit tests for: getAllLawyerRequests
