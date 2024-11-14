// Unit tests for: findAll

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../request.controller';

// Mock class for RequestService
class MockRequestService {
  findAll = jest.fn();
}

describe('RequestController.findAll() findAll method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;

  beforeEach(() => {
    mockRequestService = new MockRequestService() as any;
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy Path', () => {
    it('should return a list of requests when findAll is called', async () => {
      // Arrange: Set up the mock to return a list of requests
      const mockRequests = [
        { id: '1', name: 'Request 1' },
        { id: '2', name: 'Request 2' },
      ];
      mockRequestService.findAll.mockResolvedValue(
        mockRequests as any as never,
      );

      // Act: Call the findAll method
      const result = await requestController.findAll();

      // Assert: Verify the result is as expected
      expect(result).toEqual(mockRequests);
      expect(mockRequestService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle the case when no requests are found', async () => {
      // Arrange: Set up the mock to return an empty array
      mockRequestService.findAll.mockResolvedValue([] as any as never);

      // Act: Call the findAll method
      const result = await requestController.findAll();

      // Assert: Verify the result is an empty array
      expect(result).toEqual([]);
      expect(mockRequestService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if findAll throws an error', async () => {
      // Arrange: Set up the mock to throw an error
      mockRequestService.findAll.mockRejectedValue(
        new Error('Database error') as never,
      );

      // Act & Assert: Call the findAll method and expect a NotFoundException
      await expect(requestController.findAll()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRequestService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: findAll
