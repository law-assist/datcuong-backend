// Unit tests for: getHello

import { AppService } from '../../src/app.service';

// Import necessary modules
// Describe block for the getHello method
describe('AppService.getHello() getHello method', () => {
  let appService: AppService;

  // Before each test, instantiate the AppService
  beforeEach(() => {
    appService = new AppService();
  });

  // Happy path tests
  describe('Happy Paths', () => {
    it('should return "Hello World!"', () => {
      // Test to ensure the method returns the expected string
      const result = appService.getHello();
      expect(result).toBe('Hello World!');
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    // Since the method does not take any input or have any complex logic,
    // there are no traditional edge cases to test. However, we can still
    // ensure that the method consistently returns the correct value.
    it('should consistently return the same string', () => {
      // Test to ensure the method consistently returns the same result
      const firstCall = appService.getHello();
      const secondCall = appService.getHello();
      expect(firstCall).toBe(secondCall);
    });
  });
});

// End of unit tests for: getHello
