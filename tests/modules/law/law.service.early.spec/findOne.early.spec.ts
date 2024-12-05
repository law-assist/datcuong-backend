// Unit tests for: findOne

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  findById: jest.Mock;
}

class MockLaw {
  _id: string = 'mockId';
  name: string = 'Mock Law';
}

class MockConnection {}

interface MockMapper {}

// Test suite for the findOne method
describe('LawService.findOne() findOne method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;
  let mockHttpService: HttpService;

  beforeEach(() => {
    mockModel = {
      findById: jest.fn(),
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

  describe('Happy Paths', () => {
    it('should return a law when a valid ID is provided', async () => {
      // Arrange
      const mockLaw = new MockLaw();
      mockModel.findById.mockResolvedValue(mockLaw as any);

      // Act
      const result = await service.findOne('validId');

      // Assert
      expect(result).toEqual(mockLaw);
      expect(mockModel.findById).toHaveBeenCalledWith('validId');
    });
  });

  describe('Edge Cases', () => {
    it('should return null when no law is found for the given ID', async () => {
      // Arrange
      mockModel.findById.mockResolvedValue(null);

      // Act
      const result = await service.findOne('nonExistentId');

      // Assert
      expect(result).toBeNull();
      expect(mockModel.findById).toHaveBeenCalledWith('nonExistentId');
    });

    it('should handle errors thrown by the model', async () => {
      // Arrange
      const error = new Error('Database error');
      mockModel.findById.mockRejectedValue(error as never);

      // Act & Assert
      await expect(service.findOne('errorId')).rejects.toThrow(
        'Database error',
      );
      expect(mockModel.findById).toHaveBeenCalledWith('errorId');
    });
  });
});

// End of unit tests for: findOne
