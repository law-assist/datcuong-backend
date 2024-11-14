// Unit tests for: findOne

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../request.controller';

// Mock class for RequestService
class MockRequestService {
  findOne = jest.fn();
}

describe('RequestController.findOne() findOne method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;

  beforeEach(() => {
    mockRequestService = new MockRequestService();
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy Path', () => {
    it('should return the request when a valid ID is provided', async () => {
      // Arrange
      const mockRequest = { id: '123', name: 'Test Request' };
      mockRequestService.findOne.mockResolvedValue(mockRequest as any as never);

      // Act
      const result = await requestController.findOne('123');

      // Assert
      expect(result).toEqual(mockRequest);
      expect(mockRequestService.findOne).toHaveBeenCalledWith('123');
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when the request is not found', async () => {
      // Arrange
      mockRequestService.findOne.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(requestController.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRequestService.findOne).toHaveBeenCalledWith('invalid-id');
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const error = new Error('Unexpected error');
      mockRequestService.findOne.mockRejectedValue(error as never);

      // Act & Assert
      await expect(requestController.findOne('123')).rejects.toThrow(
        'Unexpected error',
      );
      expect(mockRequestService.findOne).toHaveBeenCalledWith('123');
    });
  });
});

// End of unit tests for: findOne
