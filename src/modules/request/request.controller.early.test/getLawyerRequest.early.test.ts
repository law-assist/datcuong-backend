// Unit tests for: getLawyerRequest

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../request.controller';

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
    mockUser = new MockReadUserDto() as any;
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy Path', () => {
    it('should return a successful response with data when request is found', async () => {
      // Arrange
      const mockRequestData = { id: 'request1', name: 'Test Request' };
      mockRequestService.getLawyerRequest.mockResolvedValue(
        mockRequestData as any,
      );

      // Act
      const result = await requestController.getLawyerRequest(
        mockUser as any,
        'lawyerId1',
      );

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockRequestData,
      });
      expect(mockRequestService.getLawyerRequest).toHaveBeenCalledWith(
        'lawyerId1',
        'mockUserId',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException when no request is found', async () => {
      // Arrange
      mockRequestService.getLawyerRequest.mockResolvedValue(null as any);

      // Act & Assert
      await expect(
        requestController.getLawyerRequest(mockUser as any, 'lawyerId1'),
      ).rejects.toThrow(NotFoundException);
      expect(mockRequestService.getLawyerRequest).toHaveBeenCalledWith(
        'lawyerId1',
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
        requestController.getLawyerRequest(mockUser as any, 'lawyerId1'),
      ).rejects.toThrow('Unexpected error');
      expect(mockRequestService.getLawyerRequest).toHaveBeenCalledWith(
        'lawyerId1',
        'mockUserId',
      );
    });
  });
});

// End of unit tests for: getLawyerRequest
