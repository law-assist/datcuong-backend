// Unit tests for: findOne

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock class for RequestService
class MockRequestService {
  findOne = jest.fn();
}

describe('RequestController.findOne() findOne method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;

  beforeEach(() => {
    mockRequestService = new MockRequestService() as any;
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy Paths', () => {
    it('should return the request when a valid ID is provided', async () => {
      // Arrange
      const mockRequest = { id: '1', name: 'Test Request' };
      mockRequestService.findOne.mockResolvedValue(mockRequest as any as never);

      // Act
      const result = await requestController.findOne('1');

      // Assert
      expect(result).toEqual(mockRequest);
      expect(mockRequestService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when the request is not found', async () => {
      // Arrange
      mockRequestService.findOne.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(
        requestController.findOne('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
      expect(mockRequestService.findOne).toHaveBeenCalledWith(
        'non-existent-id',
      );
    });

    it('should handle invalid ID formats gracefully', async () => {
      // Arrange
      const invalidId = 'invalid-id-format';
      mockRequestService.findOne.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(requestController.findOne(invalidId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRequestService.findOne).toHaveBeenCalledWith(invalidId);
    });
  });
});

// End of unit tests for: findOne
