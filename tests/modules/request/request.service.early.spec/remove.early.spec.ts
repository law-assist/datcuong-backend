// Unit tests for: remove

import { RequestService } from '../../../../src/modules/request/request.service';

// Mock classes

interface MockModel {
  findByIdAndDelete: jest.Mock;
}

class MockConnection {
  // Define any necessary properties and methods
}

describe('RequestService.remove() remove method', () => {
  let service: RequestService;
  let mockRequestModel: MockModel;
  let mockConnection: MockConnection;

  beforeEach(() => {
    mockRequestModel = {
      findByIdAndDelete: jest.fn(),
    };

    mockConnection = new MockConnection();

    service = new RequestService(
      mockRequestModel as any,
      mockConnection as any,
    );
  });

  describe('Happy paths', () => {
    it('should remove a request successfully', async () => {
      // Arrange: Set up the mock to simulate successful deletion
      const requestId = 'someRequestId';
      mockRequestModel.findByIdAndDelete.mockResolvedValue({
        _id: requestId,
      } as any);

      // Act: Call the remove method
      const result = await service.remove(requestId);

      // Assert: Verify the expected outcome
      expect(mockRequestModel.findByIdAndDelete).toHaveBeenCalledWith(
        requestId,
      );
      expect(result).toBe(`This action removes a #${requestId} request`);
    });
  });

  describe('Edge cases', () => {
    it('should handle non-existent request gracefully', async () => {
      // Arrange: Set up the mock to simulate a non-existent request
      const requestId = 'nonExistentRequestId';
      mockRequestModel.findByIdAndDelete.mockResolvedValue(null);

      // Act: Call the remove method
      const result = await service.remove(requestId);

      // Assert: Verify the expected outcome
      expect(mockRequestModel.findByIdAndDelete).toHaveBeenCalledWith(
        requestId,
      );
      expect(result).toBe(`This action removes a #${requestId} request`);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange: Set up the mock to simulate a database error
      const requestId = 'someRequestId';
      mockRequestModel.findByIdAndDelete.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert: Call the remove method and expect an error
      await expect(service.remove(requestId)).rejects.toThrow('Database error');
      expect(mockRequestModel.findByIdAndDelete).toHaveBeenCalledWith(
        requestId,
      );
    });
  });
});

// End of unit tests for: remove
