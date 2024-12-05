// Unit tests for: update

import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock classes and interfaces
class MockUpdateLawDto {
  // Define properties as needed for testing
}

interface MockModel {
  findByIdAndUpdate: jest.Mock;
}

class MockConnection {
  // Define properties as needed for testing
}

interface MockMapper {
  // Define properties as needed for testing
}

describe('LawService.update() update method', () => {
  let service: LawService;
  let mockHttpService: HttpService;
  let mockLawModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockHttpService = {} as any;
    mockLawModel = {
      findByIdAndUpdate: jest.fn(),
    } as any;
    mockConnection = {} as any;
    mockMapper = {} as any;

    service = new LawService(
      mockHttpService as any,
      mockLawModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should update a law successfully', async () => {
      // Arrange
      const id = 'some-id';
      const updateLawDto = new MockUpdateLawDto() as any;
      mockLawModel.findByIdAndUpdate.mockResolvedValue({} as any);

      // Act
      const result = await service.update(id, updateLawDto);

      // Assert
      expect(mockLawModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateLawDto,
      );
      expect(result).toEqual({ message: 'success' });
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if law is not found', async () => {
      // Arrange
      const id = 'non-existent-id';
      const updateLawDto = new MockUpdateLawDto() as any;
      mockLawModel.findByIdAndUpdate.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(id, updateLawDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle errors thrown by the model', async () => {
      // Arrange
      const id = 'some-id';
      const updateLawDto = new MockUpdateLawDto() as any;
      const error = new Error('Database error');
      mockLawModel.findByIdAndUpdate.mockRejectedValue(error);

      // Act & Assert
      await expect(service.update(id, updateLawDto)).rejects.toThrow(
        'Database error',
      );
    });
  });
});

// End of unit tests for: update
