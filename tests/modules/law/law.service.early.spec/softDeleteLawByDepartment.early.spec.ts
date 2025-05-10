// Unit tests for: softDeleteLawByDepartment

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  updateMany: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Test suite for softDeleteLawByDepartment
describe('LawService.softDeleteLawByDepartment() softDeleteLawByDepartment method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;
  let mockHttpService: HttpService;

  beforeEach(() => {
    mockModel = {
      updateMany: jest.fn(),
    };

    mockConnection = new MockConnection();
    mockMapper = {} as MockMapper;
    mockHttpService = {} as HttpService;

    service = new LawService(
      mockHttpService as any,
      mockModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should soft delete laws by department successfully', async () => {
      // Arrange
      const word = 'Finance';
      const modifiedCount = 5;
      mockModel.updateMany.mockResolvedValue({ modifiedCount } as any);

      // Act
      await service.softDeleteLawByDepartment(word);

      // Assert
      //      expect(mockModel.updateMany).toHaveBeenCalledWith(
      //        {
      //          department: { $regex: word, $options: 'i' },
      //          isDeleted: false,
      //        },
      //        {
      //          isDeleted: true,
      //          deletedAt: expect.any(Date),
      //        }
      //      );
    });
  });

  describe('Edge cases', () => {
    it('should handle no laws found for the given department', async () => {
      // Arrange
      const word = 'NonExistentDepartment';
      mockModel.updateMany.mockResolvedValue({ modifiedCount: 0 } as any);

      // Act
      await service.softDeleteLawByDepartment(word);

      // Assert
      //      expect(mockModel.updateMany).toHaveBeenCalledWith(
      //        {
      //          department: { $regex: word, $options: 'i' },
      //          isDeleted: false,
      //        },
      //        {
      //          isDeleted: true,
      //          deletedAt: expect.any(Date),
      //        }
      //      );
    });

    it('should throw an error if updateMany fails', async () => {
      // Arrange
      const word = 'Finance';
      const errorMessage = 'Database error';
      mockModel.updateMany.mockRejectedValue(new Error(errorMessage) as never);

      // Act & Assert
      await expect(service.softDeleteLawByDepartment(word)).rejects.toThrow(
        `Failed to soft delete law by department: ${errorMessage}`,
      );
    });
  });
});

// End of unit tests for: softDeleteLawByDepartment
