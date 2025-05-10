// Unit tests for: getUserRequest

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock classes
class MockReadUserDto {
  public _id: string = 'mockUserId';
}

class MockRequestService {
  getAllUserRequests = jest.fn();
}

describe('RequestController.getUserRequest() getUserRequest method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;
  let mockUser: MockReadUserDto;

  beforeEach(() => {
    mockRequestService = new MockRequestService() as any;
    mockUser = new MockReadUserDto() as any;
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy paths', () => {
    it('should return a success message and data when requests are found', async () => {
      // Arrange
      const mockResponseData = [{ id: 'request1' }, { id: 'request2' }];
      mockRequestService.getAllUserRequests.mockResolvedValue(
        mockResponseData as any,
      );

      // Act
      const result = await requestController.getUserRequest(mockUser as any);

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResponseData,
      });
      expect(mockRequestService.getAllUserRequests).toHaveBeenCalledWith(
        mockUser._id,
        undefined,
      );
    });

    it('should handle query parameters correctly', async () => {
      // Arrange
      const mockResponseData = [{ id: 'request1' }];
      const query = { status: 'pending' };
      mockRequestService.getAllUserRequests.mockResolvedValue(
        mockResponseData as any,
      );

      // Act
      const result = await requestController.getUserRequest(
        mockUser as any,
        query,
      );

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResponseData,
      });
      expect(mockRequestService.getAllUserRequests).toHaveBeenCalledWith(
        mockUser._id,
        query,
      );
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when no requests are found', async () => {
      // Arrange
      mockRequestService.getAllUserRequests.mockResolvedValue(null as any);

      // Act & Assert
      await expect(
        requestController.getUserRequest(mockUser as any),
      ).rejects.toThrow(NotFoundException);
      expect(mockRequestService.getAllUserRequests).toHaveBeenCalledWith(
        mockUser._id,
        undefined,
      );
    });

    it('should handle empty query object gracefully', async () => {
      // Arrange
      const mockResponseData = [{ id: 'request1' }];
      mockRequestService.getAllUserRequests.mockResolvedValue(
        mockResponseData as any,
      );

      // Act
      const result = await requestController.getUserRequest(
        mockUser as any,
        {},
      );

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResponseData,
      });
      expect(mockRequestService.getAllUserRequests).toHaveBeenCalledWith(
        mockUser._id,
        {},
      );
    });
  });
});

// End of unit tests for: getUserRequest
