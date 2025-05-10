// Unit tests for: findByUrl

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  findOne: jest.Mock;
}

class MockLaw {
  public baseUrl: string = 'http://example.com/law';
}

class MockConnection {}

interface MockMapper {}

// Test suite for findByUrl method
describe('LawService.findByUrl() findByUrl method', () => {
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

  // Happy path test
  it('should return a law when a valid URL is provided', async () => {
    const mockLaw = new MockLaw();
    mockModel.findOne.mockResolvedValue(mockLaw as any as never);

    const result = await service.findByUrl('http://example.com/law');

    expect(result).toEqual(mockLaw);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      baseUrl: 'http://example.com/law',
    });
  });

  // Edge case test: URL not found
  it('should return null when no law is found for the given URL', async () => {
    mockModel.findOne.mockResolvedValue(null as any as never);

    const result = await service.findByUrl('http://nonexistent.com/law');

    expect(result).toBeNull();
    expect(mockModel.findOne).toHaveBeenCalledWith({
      baseUrl: 'http://nonexistent.com/law',
    });
  });

  // Edge case test: Error during database query
  it('should throw an error if there is a database query error', async () => {
    mockModel.findOne.mockRejectedValue(new Error('Database error') as never);

    await expect(service.findByUrl('http://example.com/law')).rejects.toThrow(
      'Database error',
    );
    expect(mockModel.findOne).toHaveBeenCalledWith({
      baseUrl: 'http://example.com/law',
    });
  });
});

// End of unit tests for: findByUrl
