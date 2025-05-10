// Unit tests for: findAll

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock class for RequestService
class MockRequestService {
  findAll = jest.fn();
}

describe('RequestController.findAll() findAll method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;

  beforeEach(() => {
    mockRequestService = new MockRequestService();
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy Paths', () => {
    it('should return a list of requests when service returns data', async () => {
      // Arrange: Mock the service to return a list of requests
      const mockRequests = [
        { id: 1, name: 'Request 1' },
        { id: 2, name: 'Request 2' },
      ];
      mockRequestService.findAll.mockResolvedValue(
        mockRequests as any as never,
      );

      // Act: Call the findAll method
      const result = await requestController.findAll();

      // Assert: Verify the result matches the mock data
      expect(result).toEqual(mockRequests);
      expect(mockRequestService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when no requests are found', async () => {
      // Arrange: Mock the service to return an empty array
      mockRequestService.findAll.mockResolvedValue([] as any as never);

      // Act & Assert: Call the findAll method and expect a NotFoundException
      await expect(requestController.findAll()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRequestService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange: Mock the service to throw an error
      mockRequestService.findAll.mockRejectedValue(
        new Error('Service error') as never,
      );

      // Act & Assert: Call the findAll method and expect the error to be thrown
      await expect(requestController.findAll()).rejects.toThrow(
        'Service error',
      );
      expect(mockRequestService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: findAll
