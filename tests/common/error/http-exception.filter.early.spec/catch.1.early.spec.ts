// Unit tests for: catch

import { HttpException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces';
import { HttpExceptionFilter } from '../../../../src/common/error/http-exception.filter';

describe('HttpExceptionFilter.catch() catch method', () => {
  let httpExceptionFilter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    httpExceptionFilter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      url: '/test-url',
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  // Happy path tests
  describe('Happy paths', () => {
    it('should handle HttpException with a message', () => {
      // Arrange: Create an HttpException with a message
      const exception = new HttpException(
        { message: 'Test error message' },
        400,
      );

      // Act: Call the catch method
      httpExceptionFilter.catch(exception, mockHost);

      // Assert: Verify the response status and json methods are called with correct arguments
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 400,
        message: 'Test error message',
        timestamp: expect.any(String),
      });
    });

    it('should handle HttpException without a message', () => {
      // Arrange: Create an HttpException without a message
      const exception = new HttpException('Test error', 404);

      // Act: Call the catch method
      httpExceptionFilter.catch(exception, mockHost);

      // Assert: Verify the response status and json methods are called with correct arguments
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 404,
        message: 'Test error',
        timestamp: expect.any(String),
      });
    });
  });

  // Edge case tests
  describe('Edge cases', () => {
    it('should handle HttpException with an empty response', () => {
      // Arrange: Create an HttpException with an empty response
      const exception = new HttpException({}, 500);

      // Act: Call the catch method
      httpExceptionFilter.catch(exception, mockHost);

      // Assert: Verify the response status and json methods are called with correct arguments
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 500,
        message: {},
        timestamp: expect.any(String),
      });
    });

    it('should handle HttpException with a non-standard response structure', () => {
      // Arrange: Create an HttpException with a non-standard response structure
      const exception = new HttpException({ error: 'Custom error' }, 418);

      // Act: Call the catch method
      httpExceptionFilter.catch(exception, mockHost);

      // Assert: Verify the response status and json methods are called with correct arguments
      expect(mockResponse.status).toHaveBeenCalledWith(418);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 418,
        message: { error: 'Custom error' },
        timestamp: expect.any(String),
      });
    });
  });
});

// End of unit tests for: catch
