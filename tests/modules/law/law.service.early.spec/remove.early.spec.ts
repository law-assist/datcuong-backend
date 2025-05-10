// Unit tests for: remove

import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  findByIdAndDelete: jest.Mock;
}

class MockLaw {
  _id: string = 'mockId';
  name: string = 'Mock Law';
}

class MockConnection {}

interface MockMapper {}

// Test suite for the remove method
describe('LawService.remove() remove method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;
  let mockHttpService: HttpService;

  beforeEach(() => {
    mockModel = {
      findByIdAndDelete: jest.fn(),
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
    it('should successfully remove a law when it exists', async () => {
      // Arrange
      const mockLaw = new MockLaw();
      mockModel.findByIdAndDelete.mockResolvedValue(mockLaw as any);

      // Act
      const result = await service.remove('mockId');

      // Assert
      expect(result).toEqual(mockLaw);
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('mockId');
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when the law does not exist', async () => {
      // Arrange
      mockModel.findByIdAndDelete.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove('nonExistentId')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('nonExistentId');
    });

    it('should handle errors thrown by the database operation', async () => {
      // Arrange
      const error = new Error('Database error');
      mockModel.findByIdAndDelete.mockRejectedValue(error);

      // Act & Assert
      await expect(service.remove('mockId')).rejects.toThrow('Database error');
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('mockId');
    });
  });
});

// End of unit tests for: remove
