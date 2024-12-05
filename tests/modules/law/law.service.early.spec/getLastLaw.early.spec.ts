// Unit tests for: getLastLaw

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock classes and interfaces
interface MockModel {
  findOne: jest.Mock;
}

class MockLaw {
  public _id: string = 'mockId';
  public name: string = 'Mock Law';
  public isDeleted: boolean = false;
}

class MockConnection {}

interface MockMapper {}

// Test suite for getLastLaw method
describe('LawService.getLastLaw() getLastLaw method', () => {
  let lawService: LawService;
  let mockModel: MockModel;
  let mockHttpService: HttpService;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockModel = {
      findOne: jest.fn(),
    };

    mockHttpService = {} as any;
    mockConnection = {} as any;
    mockMapper = {} as any;

    lawService = new LawService(
      mockHttpService as any,
      mockModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should return the last law when it exists', async () => {
      // Arrange
      const mockLaw = new MockLaw();
      mockModel.findOne.mockResolvedValue(mockLaw as any);

      // Act
      const result = await lawService.getLastLaw();

      // Assert
      expect(result).toEqual(mockLaw);
      expect(mockModel.findOne).toHaveBeenCalledWith({ isDeleted: false });
      expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should return null if no law is found', async () => {
      // Arrange
      mockModel.findOne.mockResolvedValue(null);

      // Act
      const result = await lawService.getLastLaw();

      // Assert
      expect(result).toBeNull();
      expect(mockModel.findOne).toHaveBeenCalledWith({ isDeleted: false });
      expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const errorMessage = 'Database error';
      mockModel.findOne.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(lawService.getLastLaw()).rejects.toThrowError(errorMessage);
      expect(mockModel.findOne).toHaveBeenCalledWith({ isDeleted: false });
      expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: getLastLaw
