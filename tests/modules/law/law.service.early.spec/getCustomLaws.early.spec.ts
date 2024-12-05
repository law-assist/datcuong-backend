// Unit tests for: getCustomLaws

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  find: jest.Mock;
}

class MockLaw {
  public name: string = 'Mock Law';
  public category: string = 'Nghị định';
}

class MockConnection {}

interface MockMapper {}

// Test suite for getCustomLaws method
describe('LawService.getCustomLaws() getCustomLaws method', () => {
  let lawService: LawService;
  let mockHttpService: HttpService;
  let mockLawModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockHttpService = {} as any;
    mockLawModel = {
      find: jest.fn(),
    } as any;
    mockConnection = {} as any;
    mockMapper = {} as any;

    lawService = new LawService(
      mockHttpService as any,
      mockLawModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should return a list of laws matching the criteria', async () => {
      // Arrange
      const mockLaws = [new MockLaw(), new MockLaw()];
      mockLawModel.find.mockReturnValue({
        limit: jest.fn().mockReturnValue(mockLaws),
      });

      // Act
      const result = await lawService.getCustomLaws();

      // Assert
      expect(result).toEqual(mockLaws);
      expect(mockLawModel.find).toHaveBeenCalledWith({
        name: { $regex: 'SỬA ĐỔI, BỔ SUNG', $options: 'i' },
        category: 'Nghị định',
      });
    });
  });

  describe('Edge cases', () => {
    it('should return an empty array if no laws match the criteria', async () => {
      // Arrange
      mockLawModel.find.mockReturnValue({
        limit: jest.fn().mockReturnValue([]),
      });

      // Act
      const result = await lawService.getCustomLaws();

      // Assert
      expect(result).toEqual([]);
      expect(mockLawModel.find).toHaveBeenCalledWith({
        name: { $regex: 'SỬA ĐỔI, BỔ SUNG', $options: 'i' },
        category: 'Nghị định',
      });
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const errorMessage = 'Database error';
      mockLawModel.find.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      await expect(lawService.getCustomLaws()).rejects.toThrow(
        new Error(errorMessage),
      );
    });
  });
});

// End of unit tests for: getCustomLaws
