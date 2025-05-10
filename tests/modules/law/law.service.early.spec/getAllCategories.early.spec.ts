// Unit tests for: getAllCategories

import { HttpService } from '@nestjs/axios';
import { LawService } from '../../../../src/modules/law/law.service';

// Mock interfaces and classes
interface MockModel {
  distinct: jest.Mock;
}

class MockConnection {}

interface MockMapper {}

// Test suite for getAllCategories method
describe('LawService.getAllCategories() getAllCategories method', () => {
  let lawService: LawService;
  let mockHttpService: HttpService;
  let mockLawModel: MockModel;
  let mockConnection: MockConnection;
  let mockMapper: MockMapper;

  beforeEach(() => {
    mockHttpService = {} as any;
    mockLawModel = {
      distinct: jest.fn(),
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

  // Happy path test
  it('should return a list of categories when categories exist', async () => {
    // Arrange: Mock the distinct method to return a list of categories
    const categories = ['Category1', 'Category2', 'Category3'];
    mockLawModel.distinct.mockResolvedValue(categories as any as never);

    // Act: Call the getAllCategories method
    const result = await lawService.getAllCategories();

    // Assert: Verify the result matches the expected categories
    expect(result).toEqual(categories);
    expect(mockLawModel.distinct).toHaveBeenCalledWith('category');
  });

  // Edge case test: No categories found
  it('should return an empty array when no categories are found', async () => {
    // Arrange: Mock the distinct method to return an empty array
    mockLawModel.distinct.mockResolvedValue([] as any as never);

    // Act: Call the getAllCategories method
    const result = await lawService.getAllCategories();

    // Assert: Verify the result is an empty array
    expect(result).toEqual([]);
    expect(mockLawModel.distinct).toHaveBeenCalledWith('category');
  });

  // Edge case test: Error handling
  it('should throw an error if the database query fails', async () => {
    // Arrange: Mock the distinct method to throw an error
    const errorMessage = 'Database query failed';
    mockLawModel.distinct.mockRejectedValue(new Error(errorMessage) as never);

    // Act & Assert: Call the getAllCategories method and expect an error
    await expect(lawService.getAllCategories()).rejects.toThrow(errorMessage);
    expect(mockLawModel.distinct).toHaveBeenCalledWith('category');
  });
});

// End of unit tests for: getAllCategories
