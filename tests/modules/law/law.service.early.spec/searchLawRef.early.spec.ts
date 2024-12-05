// Unit tests for: searchLawRef

import { HttpService } from '@nestjs/axios';
import { RefQuery } from 'src/common/types';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock classes and interfaces
interface MockModel {
  findById: jest.Mock;
}

class MockLaw {
  public _id: string = 'mockId';
  public name: string = 'Mock Law';
  public content: any = {
    section1: {
      content: [{ name: 'subsection1', content: [{ name: 'subsubsection1' }] }],
    },
  };
}

class MockConnection {}

interface MockMapper {}

describe('LawService.searchLawRef() searchLawRef method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockHttpService: HttpService;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockModel = {
      findById: jest.fn(),
    };

    mockHttpService = {} as any;
    mockConnection = new MockConnection() as any;
    mockMapper = {} as any;

    service = new LawService(
      mockHttpService as any,
      mockModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should return the correct law reference when valid lawId and LawRef are provided', async () => {
      // Arrange
      const mockLaw = new MockLaw();
      mockModel.findById.mockResolvedValue(mockLaw as any);

      const query: RefQuery = {
        lawId: 'mockId',
        LawRef: 'section1,subsection1,subsubsection1',
        index: 0,
        classification: 1,
        type: 'type1',
      };

      // Act
      const result = await service.searchLawRef(query);

      // Assert
      expect(result).toEqual({
        _id: mockLaw._id,
        name: mockLaw.name,
        ref: { name: 'subsubsection1' },
        type: 'type1',
        classification: 1,
        index: 0,
        content: { name: 'subsubsection1' },
      });
    });
  });

  describe('Edge cases', () => {
    it('should return null if the law is not found', async () => {
      // Arrange
      mockModel.findById.mockResolvedValue(null);

      const query: RefQuery = {
        lawId: 'nonExistentId',
        LawRef: 'section1',
        index: 0,
        classification: 1,
        type: 'type1',
      };

      // Act
      const result = await service.searchLawRef(query);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null ref if LawRef is empty', async () => {
      // Arrange
      const mockLaw = new MockLaw();
      mockModel.findById.mockResolvedValue(mockLaw as any);

      const query: RefQuery = {
        lawId: 'mockId',
        LawRef: '',
        index: 0,
        classification: 1,
        type: 'type1',
      };

      // Act
      const result = await service.searchLawRef(query);

      // Assert
      expect(result).toEqual({
        _id: mockLaw._id,
        name: mockLaw.name,
        ref: null,
        type: 'type1',
        classification: 1,
        index: 0,
        content: null,
      });
    });

    it('should handle non-existent references gracefully', async () => {
      // Arrange
      const mockLaw = new MockLaw();
      mockModel.findById.mockResolvedValue(mockLaw as any);

      const query: RefQuery = {
        lawId: 'mockId',
        LawRef: 'section1,nonExistentSubsection',
        index: 0,
        classification: 1,
        type: 'type1',
      };

      // Act
      const result = await service.searchLawRef(query);

      // Assert
      expect(result).toEqual({
        _id: mockLaw._id,
        name: mockLaw.name,
        ref: undefined,
        type: 'type1',
        classification: 1,
        index: 0,
        content: undefined,
      });
    });
  });
});

// End of unit tests for: searchLawRef
