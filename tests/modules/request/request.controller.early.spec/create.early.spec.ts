// Unit tests for: create

import { BadRequestException } from '@nestjs/common';
import { RequestController } from '../../../../src/modules/request/request.controller';

// Mock classes
class MockReadUserDto {
  public _id: string = 'mockUserId';
}

class MockCreateRequestDto {
  public title: string = 'mockTitle';
  public description: string = 'mockDescription';
}

class MockRequestService {
  create = jest.fn();
}

describe('RequestController.create() create method', () => {
  let requestController: RequestController;
  let mockRequestService: MockRequestService;
  let mockUser: MockReadUserDto;
  let mockCreateRequestDto: MockCreateRequestDto;

  beforeEach(() => {
    mockRequestService = new MockRequestService() as any;
    requestController = new RequestController(mockRequestService as any);
    mockUser = new MockReadUserDto() as any;
    mockCreateRequestDto = new MockCreateRequestDto() as any;
  });

  describe('Happy paths', () => {
    it('should create a request successfully', async () => {
      // Arrange
      mockRequestService.create.mockResolvedValue({
        id: 'mockRequestId',
      } as any);

      // Act
      const result = await requestController.create(
        mockUser as any,
        mockCreateRequestDto as any,
      );

      // Assert
      expect(result).toEqual({ message: 'success' });
      expect(mockRequestService.create).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockCreateRequestDto,
      );
    });
  });

  describe('Edge cases', () => {
    it('should throw BadRequestException if request creation fails', async () => {
      // Arrange
      mockRequestService.create.mockResolvedValue(null as any);

      // Act & Assert
      await expect(
        requestController.create(mockUser as any, mockCreateRequestDto as any),
      ).rejects.toThrow(BadRequestException);
      expect(mockRequestService.create).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockCreateRequestDto,
      );
    });

    it('should handle invalid user ID gracefully', async () => {
      // Arrange
      mockUser._id = null as any;
      mockRequestService.create.mockResolvedValue(null as any);

      // Act & Assert
      await expect(
        requestController.create(mockUser as any, mockCreateRequestDto as any),
      ).rejects.toThrow(BadRequestException);
      expect(mockRequestService.create).toHaveBeenCalledWith(
        mockUser._id,
        mockCreateRequestDto,
      );
    });

    it('should handle invalid request data gracefully', async () => {
      // Arrange
      mockCreateRequestDto = null as any;
      mockRequestService.create.mockResolvedValue(null as any);

      // Act & Assert
      await expect(
        requestController.create(mockUser as any, mockCreateRequestDto as any),
      ).rejects.toThrow(BadRequestException);
      expect(mockRequestService.create).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockCreateRequestDto,
      );
    });
  });
});

// End of unit tests for: create
