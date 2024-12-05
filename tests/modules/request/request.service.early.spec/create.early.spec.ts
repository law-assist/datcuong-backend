// Unit tests for: create

import { Types } from 'mongoose';
import { Request } from '../../../../src/modules/request/entities/request.schema';
import { RequestService } from '../../../../src/modules/request/request.service';

// Mock classes
class MockCreateRequestDto {
  public title: string = 'Sample Title';
  public content: string = 'Sample Content';
}

interface MockModel {
  create: jest.Mock;
}

class MockRequest {
  public userRequestId: string = new Types.ObjectId().toString();
  public title: string = 'Sample Title';
  public content: string = 'Sample Content';
}

class MockConnection {}

describe('RequestService.create() create method', () => {
  let service: RequestService;
  let mockRequestModel: MockModel<Request>;
  let mockConnection: MockConnection;

  beforeEach(() => {
    mockRequestModel = {
      create: jest.fn(),
    };

    mockConnection = new MockConnection();

    service = new RequestService(
      mockRequestModel as any,
      mockConnection as any,
    );
  });

  describe('Happy paths', () => {
    it('should create a request successfully', async () => {
      // Arrange
      const uid = new Types.ObjectId().toString();
      const createRequestDto = new MockCreateRequestDto();
      const expectedRequest = new MockRequest();
      mockRequestModel.create.mockResolvedValue(
        expectedRequest as any as never,
      );

      // Act
      const result = await service.create(uid, createRequestDto as any);

      // Assert
      expect(mockRequestModel.create).toHaveBeenCalledWith({
        ...createRequestDto,
        userRequestId: uid,
      });
      expect(result).toEqual(expectedRequest);
    });
  });

  describe('Edge cases', () => {
    it('should handle error when create fails', async () => {
      // Arrange
      const uid = new Types.ObjectId().toString();
      const createRequestDto = new MockCreateRequestDto();
      mockRequestModel.create.mockRejectedValue(
        new Error('Create failed') as never,
      );

      // Act & Assert
      await expect(
        service.create(uid, createRequestDto as any),
      ).rejects.toThrow('Create failed');
    });

    it('should handle empty CreateRequestDto', async () => {
      // Arrange
      const uid = new Types.ObjectId().toString();
      const createRequestDto = {} as MockCreateRequestDto;
      const expectedRequest = new MockRequest();
      mockRequestModel.create.mockResolvedValue(
        expectedRequest as any as never,
      );

      // Act
      const result = await service.create(uid, createRequestDto as any);

      // Assert
      expect(mockRequestModel.create).toHaveBeenCalledWith({
        ...createRequestDto,
        userRequestId: uid,
      });
      expect(result).toEqual(expectedRequest);
    });
  });
});

// End of unit tests for: create
