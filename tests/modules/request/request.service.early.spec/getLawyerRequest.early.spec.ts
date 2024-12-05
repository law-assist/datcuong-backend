// Unit tests for: getLawyerRequest

import { Types } from 'mongoose';
import { RequestService } from '../../../../src/modules/request/request.service';

// Mock classes

interface MockModel {
  aggregate: jest.Mock;
}

class MockConnection {}

// Test suite for getLawyerRequest
describe('RequestService.getLawyerRequest() getLawyerRequest method', () => {
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
    it('should return the lawyer request data when found', async () => {
      // Arrange
      const reqId = new Types.ObjectId().toString();
      const lawyerId = new Types.ObjectId().toString();
      const expectedData = {
        title: 'Sample Title',
        content: 'Sample Content',
        status: 'pending',
        createdAt: new Date(),
        field: 'Sample Field',
        media: [],
        userRequestId: new Types.ObjectId(),
        userResponseId: new Types.ObjectId(),
        responseMessage: [],
        userResponse: {
          fullName: 'John Doe',
          avatarUrl: 'http://example.com/avatar.jpg',
        },
      };

      mockRequestModel.aggregate.mockResolvedValue([
        {
          data: [expectedData],
        },
      ] as any as never);

      // Act
      const result = await service.getLawyerRequest(reqId, lawyerId);

      // Assert
      expect(result).toEqual(expectedData);
      expect(mockRequestModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            _id: new Types.ObjectId(reqId),
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
                  userRequestId: 1,
                  userResponseId: 1,
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
      const lawyerId = new Types.ObjectId().toString();

      mockRequestModel.aggregate.mockResolvedValue([
        {
          data: [],
        },
      ] as any as never);

      // Act
      const result = await service.getLawyerRequest(reqId, lawyerId);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const reqId = new Types.ObjectId().toString();
      const lawyerId = new Types.ObjectId().toString();

      mockRequestModel.aggregate.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.getLawyerRequest(reqId, lawyerId)).rejects.toThrow(
        'Database error',
      );
    });
  });
});

// End of unit tests for: getLawyerRequest
