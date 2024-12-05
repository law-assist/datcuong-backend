// Unit tests for: sendResponse

import { Types } from 'mongoose';
import { RequestStatus } from 'src/common/enum';
import { RequestService } from '../../../../src/modules/request/request.service';

// Mock classes
interface MockModel {
  findById: jest.Mock;
}

class MockRequest {
  public _id: string = new Types.ObjectId().toString();
  public userRequestId: string = new Types.ObjectId().toString();
  public userResponseId: string = new Types.ObjectId().toString();
  public status: RequestStatus = RequestStatus.STARTING;
  public responseMessage: any[] = [];
  public save: jest.Mock = jest.fn();
}

class MockConnection {}

// Test suite for sendResponse method
describe('RequestService.sendResponse() sendResponse method', () => {
  let service: RequestService;
  let mockModel: MockModel;
  let mockConnection: MockConnection;

  beforeEach(() => {
    mockModel = {
      findById: jest.fn(),
    };

    mockConnection = new MockConnection();

    service = new RequestService(mockModel as any, mockConnection as any);
  });

  describe('Happy paths', () => {
    it('should successfully send a response and update the request status to END', async () => {
      // Arrange
      const mockRequest = new MockRequest();
      mockModel.findById.mockResolvedValue(mockRequest as any as never);

      const id = mockRequest._id;
      const uid = mockRequest.userRequestId;
      const data = { content: 'Test content', medias: ['media1', 'media2'] };

      // Act
      const result = await service.sendResponse(id, uid, data);

      // Assert
      expect(mockModel.findById).toHaveBeenCalledWith(id);
      expect(mockRequest.status).toBe(RequestStatus.END);
      expect(mockRequest.responseMessage).toHaveLength(1);
      expect(mockRequest.responseMessage[0].content).toBe(data.content);
      expect(result).toBe(mockRequest);
    });
  });

  describe('Edge cases', () => {
    it('should return undefined if the request is not found', async () => {
      // Arrange
      mockModel.findById.mockResolvedValue(null);

      const id = new Types.ObjectId().toString();
      const uid = new Types.ObjectId().toString();
      const data = { content: 'Test content' };

      // Act
      const result = await service.sendResponse(id, uid, data);

      // Assert
      expect(mockModel.findById).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });

    it('should return undefined if the user is not authorized to respond', async () => {
      // Arrange
      const mockRequest = new MockRequest();
      mockRequest.userRequestId = new Types.ObjectId().toString(); // Different user
      mockModel.findById.mockResolvedValue(mockRequest as any as never);

      const id = mockRequest._id;
      const uid = new Types.ObjectId().toString(); // Different user
      const data = { content: 'Test content' };

      // Act
      const result = await service.sendResponse(id, uid, data);

      // Assert
      expect(mockModel.findById).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });

    it('should return undefined if the request status is REJECT', async () => {
      // Arrange
      const mockRequest = new MockRequest();
      mockRequest.status = RequestStatus.REJECT;
      mockModel.findById.mockResolvedValue(mockRequest as any as never);

      const id = mockRequest._id;
      const uid = mockRequest.userRequestId;
      const data = { content: 'Test content' };

      // Act
      const result = await service.sendResponse(id, uid, data);

      // Assert
      expect(mockModel.findById).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});

// End of unit tests for: sendResponse
