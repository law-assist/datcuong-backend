// Unit tests for: softDeleteUnnecessaryLaws

import { HttpService } from '@nestjs/axios';
import { hightLawList } from 'src/common/const';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  find: jest.Mock;
  findByIdAndUpdate: jest.Mock;
}

class MockLaw {
  public _id: string = 'mockId';
  public baseUrl: string = 'http://example.com';
  public category: string = 'mockCategory';
  public isDeleted: boolean = false;
}

class MockConnection {}

interface MockMapper {}

// Test suite for softDeleteUnnecessaryLaws
describe('LawService.softDeleteUnnecessaryLaws() softDeleteUnnecessaryLaws method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockHttpService: HttpService;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockModel = {
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
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
    it('should soft delete unnecessary laws successfully', async () => {
      // Arrange
      const mockLaws = [new MockLaw(), new MockLaw()];
      mockModel.find.mockResolvedValueOnce(mockLaws as any);
      mockModel.findByIdAndUpdate.mockResolvedValueOnce({} as any);

      // Act
      await service.softDeleteUnnecessaryLaws();

      // Assert
      expect(mockModel.find).toHaveBeenCalledWith({
        category: { $nin: hightLawList },
        isDeleted: false,
      });
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledTimes(
        mockLaws.length,
      );
      mockLaws.forEach((law) => {
        expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(law._id, {
          isDeleted: true,
          deletedAt: expect.any(Date),
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle no laws to delete', async () => {
      // Arrange
      mockModel.find.mockResolvedValueOnce([] as any);

      // Act
      await service.softDeleteUnnecessaryLaws();

      // Assert
      expect(mockModel.find).toHaveBeenCalledWith({
        category: { $nin: hightLawList },
        isDeleted: false,
      });
      expect(mockModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should handle errors during deletion', async () => {
      // Arrange
      const mockLaws = [new MockLaw()];
      mockModel.find.mockResolvedValueOnce(mockLaws as any);
      mockModel.findByIdAndUpdate.mockRejectedValueOnce(
        new Error('Deletion error') as never,
      );

      // Act
      await service.softDeleteUnnecessaryLaws();

      // Assert
      expect(mockModel.find).toHaveBeenCalledWith({
        category: { $nin: hightLawList },
        isDeleted: false,
      });
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockLaws[0]._id,
        {
          isDeleted: true,
          deletedAt: expect.any(Date),
        },
      );
    });
  });
});

// End of unit tests for: softDeleteUnnecessaryLaws
