// Unit tests for: renameLaw

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  find: jest.Mock;
  findByIdAndUpdate: jest.Mock;
}

class MockLaw {
  public _id: string = 'mockId';
  public content: any = {
    description: [
      { value: 'Law Description Part 1' },
      { value: 'Law Description Part 2' },
    ],
  };
}

class MockConnection {}

interface MockMapper {}

// Test suite for renameLaw method
describe('LawService.renameLaw() renameLaw method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;
  let mockHttpService: HttpService;

  beforeEach(() => {
    mockModel = {
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
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
    it('should rename laws correctly when descriptions are available', async () => {
      // Arrange
      const mockLaws = [new MockLaw(), new MockLaw()];
      mockModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnValue(mockLaws),
      });

      // Act
      await service.renameLaw();

      // Assert
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledTimes(
        mockLaws.length,
      );
      mockLaws.forEach((law, index) => {
        expect(mockModel.findByIdAndUpdate).toHaveBeenNthCalledWith(
          index + 1,
          law._id,
          {
            name: `${law.content.description[0].value} ${law.content.description[1].value}`,
          },
        );
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty law list gracefully', async () => {
      // Arrange
      mockModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnValue([]),
      });

      // Act
      await service.renameLaw();

      // Assert
      expect(mockModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should skip renaming if description parts are missing', async () => {
      // Arrange
      const mockLaw = new MockLaw();
      mockLaw.content.description = [{ value: 'Only one part' }];
      mockModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnValue([mockLaw]),
      });

      // Act
      await service.renameLaw();

      // Assert
      expect(mockModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: renameLaw
