// Unit tests for: update

import { CrawlerController } from '../../../../src/modules/crawler/crawler.controller';

class MockUpdateCrawlerDto {
  public someProperty: string = 'default value';
}

class MockCrawlerService {
  update = jest.fn();
}

describe('CrawlerController.update() update method', () => {
  let controller: CrawlerController;
  let mockCrawlerService: MockCrawlerService;

  beforeEach(() => {
    mockCrawlerService = new MockCrawlerService() as any;
    controller = new CrawlerController(mockCrawlerService as any);
  });

  describe('Happy paths', () => {
    it('should update a crawler successfully with valid id and data', async () => {
      // Arrange
      const id = '123';
      const updateData = new MockUpdateCrawlerDto() as any;
      mockCrawlerService.update.mockResolvedValue({ id, ...updateData } as any);

      // Act
      const result = await controller.update(id, updateData);

      // Assert
      expect(mockCrawlerService.update).toHaveBeenCalledWith(id, updateData);
      expect(result).toEqual({ id, ...updateData });
    });
  });

  describe('Edge cases', () => {
    it('should handle update with non-existent id gracefully', async () => {
      // Arrange
      const id = 'non-existent-id';
      const updateData = new MockUpdateCrawlerDto() as any;
      mockCrawlerService.update.mockResolvedValue(null as any);

      // Act
      const result = await controller.update(id, updateData);

      // Assert
      expect(mockCrawlerService.update).toHaveBeenCalledWith(id, updateData);
      expect(result).toBeNull();
    });

    it('should handle update with empty update data', async () => {
      // Arrange
      const id = '123';
      const updateData = {} as any;
      mockCrawlerService.update.mockResolvedValue({ id } as any);

      // Act
      const result = await controller.update(id, updateData);

      // Assert
      expect(mockCrawlerService.update).toHaveBeenCalledWith(id, updateData);
      expect(result).toEqual({ id });
    });

    it('should handle update when service throws an error', async () => {
      // Arrange
      const id = '123';
      const updateData = new MockUpdateCrawlerDto() as any;
      mockCrawlerService.update.mockRejectedValue(
        new Error('Service error') as never,
      );

      // Act & Assert
      await expect(controller.update(id, updateData)).rejects.toThrow(
        'Service error',
      );
      expect(mockCrawlerService.update).toHaveBeenCalledWith(id, updateData);
    });
  });
});

// End of unit tests for: update
