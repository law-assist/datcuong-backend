// Unit tests for: findByName

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  findOne: jest.Mock;
}

class MockLaw {
  name: string = 'Mock Law';
}

class MockConnection {}

interface MockMapper {}

// Unit tests for findByName method
describe('LawService.findByName() findByName method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;
  let mockHttpService: HttpService;

  beforeEach(() => {
    mockModel = {
      findOne: jest.fn(),
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

  // Happy path test: should return a law when it exists
  it('should return a law when it exists', async () => {
    const mockLaw = new MockLaw();
    mockModel.findOne.mockResolvedValue(mockLaw as any);

    const result = await service.findByName('Mock Law');

    expect(result).toEqual(mockLaw);
    expect(mockModel.findOne).toHaveBeenCalledWith({ name: 'Mock Law' });
  });

  // Edge case test: should return null when the law does not exist
  it('should return null when the law does not exist', async () => {
    mockModel.findOne.mockResolvedValue(null);

    const result = await service.findByName('Nonexistent Law');

    expect(result).toBeNull();
    expect(mockModel.findOne).toHaveBeenCalledWith({ name: 'Nonexistent Law' });
  });

  // Edge case test: should handle errors thrown by the model
  it('should handle errors thrown by the model', async () => {
    mockModel.findOne.mockRejectedValue(new Error('Database error'));

    await expect(service.findByName('Error Law')).rejects.toThrow(
      'Database error',
    );
    expect(mockModel.findOne).toHaveBeenCalledWith({ name: 'Error Law' });
  });
});

// End of unit tests for: findByName
