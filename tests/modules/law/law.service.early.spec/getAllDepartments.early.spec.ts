// Unit tests for: getAllDepartments

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  find: jest.Mock;
  distinct: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Test suite for getAllDepartments method
describe('LawService.getAllDepartments() getAllDepartments method', () => {
  let service: LawService;
  let mockModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;
  let mockHttpService: HttpService;

  beforeEach(async () => {
    mockModel = {
      find: jest.fn(),
      distinct: jest.fn(),
    };

    mockConnection = new MockConnection();
    mockMapper = {} as MockMapper;
    mockHttpService = {} as HttpService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LawService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: 'LawModel', useValue: mockModel },
        { provide: 'Connection', useValue: mockConnection },
        { provide: 'Mapper', useValue: mockMapper },
      ],
    }).compile();

    service = module.get<LawService>(LawService);
  });

  // Happy path test
  it('should return a list of departments', async () => {
    // Arrange: Mock the distinct method to return a list of departments
    const departments = ['Department A', 'Department B'];
    mockModel.distinct.mockResolvedValue(departments as any as never);

    // Act: Call the getAllDepartments method
    const result = await service.getAllDepartments();

    // Assert: Verify the result matches the expected departments
    expect(result).toEqual(departments);
    expect(mockModel.distinct).toHaveBeenCalledWith('department');
  });

  // Edge case test: No departments found
  it('should return an empty array if no departments are found', async () => {
    // Arrange: Mock the distinct method to return an empty array
    mockModel.distinct.mockResolvedValue([] as any as never);

    // Act: Call the getAllDepartments method
    const result = await service.getAllDepartments();

    // Assert: Verify the result is an empty array
    expect(result).toEqual([]);
    expect(mockModel.distinct).toHaveBeenCalledWith('department');
  });

  // Edge case test: Error handling
  it('should throw an error if the database query fails', async () => {
    // Arrange: Mock the distinct method to throw an error
    mockModel.distinct.mockRejectedValue(new Error('Database error') as never);

    // Act & Assert: Call the getAllDepartments method and expect an error
    await expect(service.getAllDepartments()).rejects.toThrow('Database error');
    expect(mockModel.distinct).toHaveBeenCalledWith('department');
  });
});

// End of unit tests for: getAllDepartments
