// Unit tests for: getUserRequest

import { Types } from 'mongoose';
import { RequestService } from '../../../../src/modules/request/request.service';

// Mock classes

interface MockModel {
  aggregate: jest.Mock;
}

class MockConnection {}

// Test suite
describe('RequestService.getUserRequest() getUserRequest method', () => {
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

  describe('Happy paths', () => {
    it('should return the user request data when found', async () => {
      // Arrange
      const reqId = new Types.ObjectId().toString();
      const uid = new Types.ObjectId().toString();
      const mockData = {
        title: 'Test Request',
        content: 'Test Content',
        status: 'pending',
        createdAt: new Date(),
        userResponse: {
          fullName: 'John Doe',
          avatarUrl: 'http://example.com/avatar.jpg',
        },
      };

      mockRequestModel.aggregate.mockResolvedValue([
        { data: [mockData] },
      ] as any as never);

      // Act
      const result = await service.getUserRequest(reqId, uid);

      // Assert
      expect(result).toEqual(mockData);
      expect(mockRequestModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            _id: new Types.ObjectId(reqId),
            userRequestId: new Types.ObjectId(uid),
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            data: [
              {
                $lookup: {
                  from: 'users',
                  localField: 'userResponseId',
                  foreignField: '_id',
                  as: 'userResponse',
                },
              },
              {
                $unwind: {
                  path: '$userResponse',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  title: 1,
                  content: 1,
                  status: 1,
                  createdAt: -1,
                  field: 1,
                  media: 1,
                  responseMessage: 1,
                  'userResponse.fullName': 1,
                  'userResponse.avatarUrl': 1,
                },
              },
            ],
          },
        },
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should return undefined if no request is found', async () => {
      // Arrange
      const reqId = new Types.ObjectId().toString();
      const uid = new Types.ObjectId().toString();

      mockRequestModel.aggregate.mockResolvedValue([
        { data: [] },
      ] as any as never);

      // Act
      const result = await service.getUserRequest(reqId, uid);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle invalid ObjectId format gracefully', async () => {
      // Arrange
      const reqId = 'invalidObjectId';
      const uid = new Types.ObjectId().toString();

      mockRequestModel.aggregate.mockResolvedValue([
        { data: [] },
      ] as any as never);

      // Act
      const result = await service.getUserRequest(reqId, uid);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});

// End of unit tests for: getUserRequest
