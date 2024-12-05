// Unit tests for: catch

import {
  ArgumentsHost,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  HttpException,
} from '@nestjs/common';
import { AllExceptionsFilter } from '../../../../src/common/error/all-exception.filter';

describe('AllExceptionsFilter.catch() catch method', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
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
    it('should handle HttpException and return the correct response', () => {
      // Arrange
      const exception = new HttpException('Forbidden', 403);

      // Act
      filter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 403,
        message: 'Forbidden',
        timestamp: expect.any(String),
      });
    });

    it('should handle generic Error and return the correct response', () => {
      // Arrange
      const exception = new Error('Something went wrong');

      // Act
      filter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 500,
        message: 'Something went wrong',
        timestamp: expect.any(String),
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle exception with no message and return default message', () => {
      // Arrange
      const exception = {};

      // Act
      filter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 500,
        message: 'Internal server error.',
        timestamp: expect.any(String),
      });
    });

    it('should handle exception with response object containing message', () => {
      // Arrange
      const exception = {
        response: {
          message: 'Custom error message',
        },
        status: 400,
      };

      // Act
      filter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 400,
        message: 'Custom error message',
        timestamp: expect.any(String),
      });
    });

    it('should handle exception with undefined status and return 500', () => {
      // Arrange
      const exception = {
        message: 'Undefined status error',
      };

      // Act
      filter.catch(exception, mockHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        statusCode: 500,
        message: 'Undefined status error',
        timestamp: expect.any(String),
      });
    });
  });
});

// End of unit tests for: catch
