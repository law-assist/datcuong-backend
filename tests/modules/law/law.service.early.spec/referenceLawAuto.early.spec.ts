// Unit tests for: referenceLawAuto

import { LawService } from '../../../../src/modules/law/law.service';

// Mock classes and interfaces
interface MockModel {
  find: jest.Mock;
  sort: jest.Mock;
  skip: jest.Mock;
  select: jest.Mock;
}

class MockLaw {
  _id: string = 'mockId';
}

class MockConnection {}

interface MockMapper {}

// Mock implementations
const mockHttpService = {
  post: jest.fn(),
};

const mockLawModel: MockModel = {
  find: jest.fn(),
  sort: jest.fn(),
  skip: jest.fn(),
  select: jest.fn(),
};

const mockConnection = new MockConnection();
const mockMapper: MockMapper = {};

describe('LawService.referenceLawAuto() referenceLawAuto method', () => {
  let service: LawService;

  beforeEach(() => {
    service = new LawService(
      mockHttpService as any,
      mockLawModel as any,
      mockConnection as any,
      mockMapper as any,
    );
  });

  describe('Happy paths', () => {
    it('should reference laws automatically and return the count', async () => {
      // Arrange
      const mockLaws = [new MockLaw(), new MockLaw()];
      mockLawModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue(mockLaws),
          }),
        }),
      });

      jest.spyOn(service, 'referenceLawManual' as any).mockResolvedValue(true);

      // Act
      const result = await service.referenceLawAuto();

      // Assert
      expect(result).toBe(2);
      expect(mockLawModel.find).toHaveBeenCalled();
      expect(service['referenceLawManual']).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle no laws found gracefully', async () => {
      // Arrange
      mockLawModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue([]),
          }),
        }),
      });

      // Act
      const result = await service.referenceLawAuto();

      // Assert
      expect(result).toBe(0);
      expect(mockLawModel.find).toHaveBeenCalled();
    });

    it('should stop processing when referenceLawManual returns null', async () => {
      // Arrange
      const mockLaws = [new MockLaw(), new MockLaw()];
      mockLawModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue(mockLaws),
          }),
        }),
      });

      jest
        .spyOn(service, 'referenceLawManual' as any)
        .mockResolvedValueOnce(null);

      // Act
      const result = await service.referenceLawAuto();

      // Assert
      expect(result).toBe(1);
      expect(mockLawModel.find).toHaveBeenCalled();
      expect(service['referenceLawManual']).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: referenceLawAuto
