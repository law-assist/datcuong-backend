// Unit tests for: remove

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock classes
class MockRequestService {
  remove = jest.fn();
}

describe('RequestController.remove() remove method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;

  beforeEach(() => {
    mockRequestService = new MockRequestService();
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy paths', () => {
    it('should successfully remove a request by id', async () => {
      // Arrange: Set up the mock to return a successful result
      mockRequestService.remove.mockResolvedValue({ success: true } as any);

      // Act: Call the remove method
      const result = await requestController.remove('valid-id');

      // Assert: Verify the result and that the service was called correctly
      expect(result).toEqual({ success: true });
      expect(mockRequestService.remove).toHaveBeenCalledWith('valid-id');
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if the request does not exist', async () => {
      // Arrange: Set up the mock to throw a NotFoundException
      mockRequestService.remove.mockRejectedValue(
        new NotFoundException('request_not_found') as never,
      );

      // Act & Assert: Call the remove method and expect a NotFoundException
      await expect(requestController.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRequestService.remove).toHaveBeenCalledWith('non-existent-id');
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange: Set up the mock to throw a generic error
      mockRequestService.remove.mockRejectedValue(
        new Error('Unexpected error') as never,
      );

      // Act & Assert: Call the remove method and expect a generic error
      await expect(requestController.remove('any-id')).rejects.toThrow(
        'Unexpected error',
      );
      expect(mockRequestService.remove).toHaveBeenCalledWith('any-id');
    });
  });
});

// End of unit tests for: remove
