// Unit tests for: update

import { Types } from 'mongoose';
import { Request } from '../../../../src/modules/request/entities/request.schema';
import { RequestService } from '../../../../src/modules/request/request.service';

// Mock classes
class MockUpdateRequestDto {
  public title: string = 'Updated Title';
  public content: string = 'Updated Content';
}

interface MockModel {
  findByIdAndUpdate: jest.Mock;
}

class MockRequest {
  public _id: Types.ObjectId = new Types.ObjectId();
  public title: string = 'Original Title';
  public content: string = 'Original Content';
}

class MockConnection {}

// Test suite
describe('RequestService.update() update method', () => {
  let service: RequestService;
  let mockRequestModel: MockModel<Request>;
  let mockConnection: MockConnection;

  beforeEach(() => {
    mockRequestModel = {
      findByIdAndUpdate: jest.fn(),
    } as any;

    mockConnection = new MockConnection() as any;

    service = new RequestService(
      mockRequestModel as any,
      mockConnection as any,
    );
  });

  describe('Happy paths', () => {
    it('should update a request successfully', async () => {
      // Arrange
      const id = new Types.ObjectId().toString();
      const updateRequestDto = new MockUpdateRequestDto() as any;
      const updatedRequest = new MockRequest() as any;
      updatedRequest.title = updateRequestDto.title;
      updatedRequest.content = updateRequestDto.content;

      mockRequestModel.findByIdAndUpdate.mockResolvedValue(updatedRequest);

      // Act
      const result = await service.update(id, updateRequestDto);

      // Assert
      expect(mockRequestModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateRequestDto,
      );
      expect(result).toEqual(updatedRequest);
    });
  });

  describe('Edge cases', () => {
    it('should handle non-existent request ID gracefully', async () => {
      // Arrange
      const id = new Types.ObjectId().toString();
      const updateRequestDto = new MockUpdateRequestDto() as any;

      mockRequestModel.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      const result = await service.update(id, updateRequestDto);

      // Assert
      expect(mockRequestModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateRequestDto,
      );
      expect(result).toBeNull();
    });

    it('should handle invalid update data gracefully', async () => {
      // Arrange
      const id = new Types.ObjectId().toString();
      const updateRequestDto = {} as any; // Invalid data

      mockRequestModel.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      const result = await service.update(id, updateRequestDto);

      // Assert
      expect(mockRequestModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateRequestDto,
      );
      expect(result).toBeNull();
    });
  });
});

// End of unit tests for: update
