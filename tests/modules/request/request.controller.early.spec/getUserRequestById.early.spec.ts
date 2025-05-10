// Unit tests for: getUserRequestById

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock classes
class MockReadUserDto {
  public _id: string = 'mockUserId';
}

class MockRequestService {
  getUserRequest = jest.fn();
}

describe('RequestController.getUserRequestById() getUserRequestById method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;
  let mockReadUserDto: MockReadUserDto;

  beforeEach(() => {
    mockRequestService = new MockRequestService() as any;
    mockReadUserDto = new MockReadUserDto() as any;
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy paths', () => {
    it('should return a user request successfully', async () => {
      // Arrange
      const mockRequest = { id: 'requestId', data: 'someData' };
      mockRequestService.getUserRequest.mockResolvedValue(mockRequest as any);

      // Act
      const result = await requestController.getUserRequestById(
        mockReadUserDto as any,
        'requestId',
      );

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockRequest,
      });
      expect(mockRequestService.getUserRequest).toHaveBeenCalledWith(
        'requestId',
        'mockUserId',
      );
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if request is not found', async () => {
      // Arrange
      mockRequestService.getUserRequest.mockResolvedValue(null as any);

      // Act & Assert
      await expect(
        requestController.getUserRequestById(
          mockReadUserDto as any,
          'invalidId',
        ),
      ).rejects.toThrow(NotFoundException);
      expect(mockRequestService.getUserRequest).toHaveBeenCalledWith(
        'invalidId',
        'mockUserId',
      );
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      mockRequestService.getUserRequest.mockRejectedValue(
        new Error('Service error') as never,
      );

      // Act & Assert
      await expect(
        requestController.getUserRequestById(
          mockReadUserDto as any,
          'requestId',
        ),
      ).rejects.toThrow('Service error');
      expect(mockRequestService.getUserRequest).toHaveBeenCalledWith(
        'requestId',
        'mockUserId',
      );
    });
  });
});

// End of unit tests for: getUserRequestById
