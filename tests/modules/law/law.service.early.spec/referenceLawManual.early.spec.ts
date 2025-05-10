// Unit tests for: referenceLawManual

import { lastValueFrom } from 'rxjs';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  findById: jest.Mock;
  save: jest.Mock;
}

class MockLaw {
  public _id: string = 'mockId';
  public relationLaws: any[] = [];
  public content: any = {};
}

class MockConnection {}

interface MockMapper {}

// Mock HttpService
class MockHttpService {
  post = jest.fn();
}

describe('LawService.referenceLawManual() referenceLawManual method', () => {
  let service: LawService;
  let mockHttpService: MockHttpService;
  let mockLawModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockHttpService = new MockHttpService();
    mockLawModel = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    mockConnection = new MockConnection();
    mockMapper = {} as MockMapper;

    service = new LawService(
      mockHttpService as any,
      mockLawModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy Paths', () => {
    it('should successfully reference a law manually', async () => {
      // Arrange
      const mockId = 'mockId';
      const mockResponse = {
        data: {
          _id: mockId,
          relationLaws: [{ id: '', original_name: 'originalName' }],
          content: 'mockContent',
        },
        update_data_in_db: [],
      };
      const mockLaw = new MockLaw();
      mockHttpService.post.mockReturnValue({
        pipe: jest.fn().mockReturnValue(mockResponse),
      });
      mockLawModel.findById.mockResolvedValue(mockLaw as any);
      lastValueFrom.mockResolvedValue(mockResponse as any);

      // Act
      const result = await service.referenceLawManual(mockId);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockLawModel.findById).toHaveBeenCalledWith(mockId);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        `${service.aiHost}/reference_matching/id_input`,
        { input_string_id: mockId },
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle a case where the law is not found', async () => {
      // Arrange
      const mockId = 'nonExistentId';
      mockLawModel.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.referenceLawManual(mockId)).resolves.toBeUndefined();
      expect(mockLawModel.findById).toHaveBeenCalledWith(mockId);
    });

    it('should handle a case where the HTTP request fails', async () => {
      // Arrange
      const mockId = 'mockId';
      mockHttpService.post.mockReturnValue({
        pipe: jest.fn().mockRejectedValue(new Error('HTTP error')),
      });

      // Act & Assert
      await expect(service.referenceLawManual(mockId)).rejects.toThrow(
        'HTTP error',
      );
      expect(mockHttpService.post).toHaveBeenCalledWith(
        `${service.aiHost}/reference_matching/id_input`,
        { input_string_id: mockId },
      );
    });

    it('should handle a case where the response data is missing', async () => {
      // Arrange
      const mockId = 'mockId';
      const mockResponse = {};
      mockHttpService.post.mockReturnValue({
        pipe: jest.fn().mockReturnValue(mockResponse),
      });
      lastValueFrom.mockResolvedValue(mockResponse as any);

      // Act
      const result = await service.referenceLawManual(mockId);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});

// End of unit tests for: referenceLawManual
