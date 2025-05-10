// Unit tests for: sendResponse

import { BadRequestException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock classes
class MockReadUserDto {
  public _id: string = 'mockUserId';
}

class MockRequestService {
  sendResponse = jest.fn();
}

describe('RequestController.sendResponse() sendResponse method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;
  let mockUser: MockReadUserDto;

  beforeEach(() => {
    mockRequestService = new MockRequestService() as any;
    mockUser = new MockReadUserDto() as any;
    requestController = new RequestController(mockRequestService as any);
  });

  describe('Happy Paths', () => {
    it('should return success message and data when response is sent successfully', async () => {
      // Arrange
      const mockResponseData = { some: 'data' };
      mockRequestService.sendResponse.mockResolvedValue(
        mockResponseData as any as never,
      );

      // Act
      const result = await requestController.sendResponse(
        mockUser as any,
        { some: 'body' },
        'mockId',
      );

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResponseData,
      });
      expect(mockRequestService.sendResponse).toHaveBeenCalledWith(
        'mockId',
        'mockUserId',
        { some: 'body' },
      );
    });
  });

  describe('Edge Cases', () => {
    it('should throw BadRequestException when response is not sent', async () => {
      // Arrange
      mockRequestService.sendResponse.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(
        requestController.sendResponse(
          mockUser as any,
          { some: 'body' },
          'mockId',
        ),
      ).rejects.toThrow(BadRequestException);
      expect(mockRequestService.sendResponse).toHaveBeenCalledWith(
        'mockId',
        'mockUserId',
        { some: 'body' },
      );
    });

    it('should handle empty body gracefully', async () => {
      // Arrange
      const mockResponseData = { some: 'data' };
      mockRequestService.sendResponse.mockResolvedValue(
        mockResponseData as any as never,
      );

      // Act
      const result = await requestController.sendResponse(
        mockUser as any,
        {},
        'mockId',
      );

      // Assert
      expect(result).toEqual({
        message: 'success',
        data: mockResponseData,
      });
      expect(mockRequestService.sendResponse).toHaveBeenCalledWith(
        'mockId',
        'mockUserId',
        {},
      );
    });

    it('should handle invalid user ID gracefully', async () => {
      // Arrange
      mockUser._id = null as any;
      mockRequestService.sendResponse.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(
        requestController.sendResponse(
          mockUser as any,
          { some: 'body' },
          'mockId',
        ),
      ).rejects.toThrow(BadRequestException);
      expect(mockRequestService.sendResponse).toHaveBeenCalledWith(
        'mockId',
        null,
        { some: 'body' },
      );
    });
  });
});

// End of unit tests for: sendResponse
