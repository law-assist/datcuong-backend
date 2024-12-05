// Unit tests for: getLawyerRequest

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock classes
class MockReadUserDto {
  public _id: string = 'mockUserId';
}

class MockRequestService {
  getLawyerRequest = jest.fn();
}

describe('RequestController.getLawyerRequest() getLawyerRequest method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;
  let mockUser: MockReadUserDto;

  beforeEach(() => {
    mockRequestService = new MockRequestService() as any;
    requestController = new RequestController(mockRequestService as any);
    mockUser = new MockReadUserDto() as any;
  });

  describe('Happy paths', () => {
    it('should return a successful response with data when a valid request is found', async () => {
      // Arrange
      const mockRequestData = { id: 'requestId', data: 'someData' };
      mockRequestService.getLawyerRequest.mockResolvedValue(
        mockRequestData as any,
      );

      // Act
      const result = await requestController.getLawyerRequest(
        mockUser as any,
        'requestId',
      );

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockRequestData,
      });
      expect(mockRequestService.getLawyerRequest).toHaveBeenCalledWith(
        'requestId',
        'mockUserId',
      );
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when no request is found', async () => {
      // Arrange
      mockRequestService.getLawyerRequest.mockResolvedValue(null as any);

      // Act & Assert
      await expect(
        requestController.getLawyerRequest(
          mockUser as any,
          'nonExistentRequestId',
        ),
      ).rejects.toThrow(NotFoundException);
      expect(mockRequestService.getLawyerRequest).toHaveBeenCalledWith(
        'nonExistentRequestId',
        'mockUserId',
      );
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      mockRequestService.getLawyerRequest.mockRejectedValue(
        new Error('Unexpected error') as never,
      );

      // Act & Assert
      await expect(
        requestController.getLawyerRequest(mockUser as any, 'requestId'),
      ).rejects.toThrow('Unexpected error');
      expect(mockRequestService.getLawyerRequest).toHaveBeenCalledWith(
        'requestId',
        'mockUserId',
      );
    });
  });
});

// End of unit tests for: getLawyerRequest
