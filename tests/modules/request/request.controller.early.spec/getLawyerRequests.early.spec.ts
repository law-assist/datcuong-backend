// Unit tests for: getLawyerRequests

import { NotFoundException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock classes
class MockReadUserDto {
  public _id: string = 'mockUserId';
}

class MockRequestService {
  getAllLawyerRequests = jest.fn();
}

describe('RequestController.getLawyerRequests() getLawyerRequests method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;
  let mockUser: MockReadUserDto;

  beforeEach(() => {
    mockRequestService = new MockRequestService() as any;
    requestController = new RequestController(mockRequestService as any);
    mockUser = new MockReadUserDto() as any;
  });

  describe('Happy paths', () => {
    it('should return lawyer requests successfully', async () => {
      // Arrange: Mock the service to return a successful response
      const mockResponse = [{ id: 'request1' }, { id: 'request2' }];
      mockRequestService.getAllLawyerRequests.mockResolvedValue(
        mockResponse as any as never,
      );

      // Act: Call the method
      const result = await requestController.getLawyerRequests(mockUser as any);

      // Assert: Verify the response
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
      expect(mockRequestService.getAllLawyerRequests).toHaveBeenCalledWith(
        mockUser._id,
        undefined,
      );
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if no requests are found', async () => {
      // Arrange: Mock the service to return null
      mockRequestService.getAllLawyerRequests.mockResolvedValue(
        null as any as never,
      );

      // Act & Assert: Call the method and expect an exception
      await expect(
        requestController.getLawyerRequests(mockUser as any),
      ).rejects.toThrow(NotFoundException);
      expect(mockRequestService.getAllLawyerRequests).toHaveBeenCalledWith(
        mockUser._id,
        undefined,
      );
    });

    it('should handle query parameters correctly', async () => {
      // Arrange: Mock the service to return a successful response
      const mockResponse = [{ id: 'request1' }];
      const query = { status: 'pending' };
      mockRequestService.getAllLawyerRequests.mockResolvedValue(
        mockResponse as any as never,
      );

      // Act: Call the method with query parameters
      const result = await requestController.getLawyerRequests(
        mockUser as any,
        query,
      );

      // Assert: Verify the response and query handling
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
      expect(mockRequestService.getAllLawyerRequests).toHaveBeenCalledWith(
        mockUser._id,
        query,
      );
    });
  });
});

// End of unit tests for: getLawyerRequests
