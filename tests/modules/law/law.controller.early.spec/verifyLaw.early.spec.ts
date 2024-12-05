// Unit tests for: verifyLaw

import { NotFoundException } from '@nestjs/common';
import { LawController } from '../../../../src/modules/law/law.controller';

class MockLawService {
  verifyLaw = jest.fn();
}

describe('LawController.verifyLaw() verifyLaw method', () => {
  let lawController: LawController;
  let mockLawService: MockLawService;

  beforeEach(() => {
    mockLawService = new MockLawService();
    lawController = new LawController(mockLawService as any);
  });

  describe('Happy paths', () => {
    it('should return success message and data when verifyLaw is successful', async () => {
      // Arrange: Mock the verifyLaw method to return a successful response
      const mockResponse = { verified: true };
      mockLawService.verifyLaw.mockResolvedValue(mockResponse as any);

      // Act: Call the verifyLaw method
      const result = await lawController.verifyLaw();

      // Assert: Verify the response
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
      expect(mockLawService.verifyLaw).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when verifyLaw returns null', async () => {
      // Arrange: Mock the verifyLaw method to return null
      mockLawService.verifyLaw.mockResolvedValue(null as any);

      // Act & Assert: Call the verifyLaw method and expect a NotFoundException
      await expect(lawController.verifyLaw()).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLawService.verifyLaw).toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange: Mock the verifyLaw method to throw an error
      const error = new Error('Unexpected error');
      mockLawService.verifyLaw.mockRejectedValue(error as never);

      // Act & Assert: Call the verifyLaw method and expect the error to be thrown
      await expect(lawController.verifyLaw()).rejects.toThrow(error);
      expect(mockLawService.verifyLaw).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: verifyLaw
