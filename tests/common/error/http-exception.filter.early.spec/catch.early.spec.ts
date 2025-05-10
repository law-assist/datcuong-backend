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

  describe('Happy paths', () => {
    it('should handle a standard HttpException and return the correct response', () => {
      // Arrange
      const exception = new HttpException('Test error message', 400);

      // Act
      httpExceptionFilter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 400,
        message: 'Test error message',
        timestamp: expect.any(String),
      });
    });

    it('should handle an HttpException with a response object containing a message', () => {
      // Arrange
      const exception = new HttpException(
        { message: 'Detailed error message' },
        404,
      );

      // Act
      httpExceptionFilter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 404,
        message: 'Detailed error message',
        timestamp: expect.any(String),
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle an HttpException with a response object without a message', () => {
      // Arrange
      const exception = new HttpException({ error: 'Error occurred' }, 500);

      // Act
      httpExceptionFilter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 500,
        message: { error: 'Error occurred' },
        timestamp: expect.any(String),
      });
    });

    it('should handle an HttpException with a non-standard response', () => {
      // Arrange
      const exception = new HttpException('Non-standard error', 418);

      // Act
      httpExceptionFilter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(418);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 418,
        message: 'Non-standard error',
        timestamp: expect.any(String),
      });
    });

    it('should handle an HttpException with an empty response', () => {
      // Arrange
      const exception = new HttpException('', 204);

      // Act
      httpExceptionFilter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 204,
        message: '',
        timestamp: expect.any(String),
      });
    });
  });
});

// End of unit tests for: catch
