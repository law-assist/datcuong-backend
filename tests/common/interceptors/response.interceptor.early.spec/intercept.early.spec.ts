// Unit tests for: intercept

import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseInterceptor } from '../../../../src/common/interceptors/response.interceptor';

describe('ResponseInterceptor.intercept() intercept method', () => {
  let interceptor: ResponseInterceptor<any>;
  let executionContextMock: Partial<ExecutionContext>;
  let callHandlerMock: Partial<CallHandler>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
    executionContextMock = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({ statusCode: 200 }),
        getRequest: jest.fn().mockReturnValue({ reqId: '12345' }),
      }),
    };
    callHandlerMock = {
      handle: jest
        .fn()
        .mockReturnValue(of({ message: 'Success', data: { key: 'value' } })),
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a response with statusCode, reqId, message, and data', (done) => {
      interceptor
        .intercept(
          executionContextMock as ExecutionContext,
          callHandlerMock as CallHandler,
        )
        .subscribe((response) => {
          expect(response).toEqual({
            statusCode: 200,
            reqId: '12345',
            message: 'Success',
            data: { key: 'value' },
          });
          done();
        });
    });

    it('should handle a response with no message gracefully', (done) => {
      callHandlerMock.handle = jest
        .fn()
        .mockReturnValue(of({ data: { key: 'value' } }));
      interceptor
        .intercept(
          executionContextMock as ExecutionContext,
          callHandlerMock as CallHandler,
        )
        .subscribe((response) => {
          expect(response).toEqual({
            statusCode: 200,
            reqId: '12345',
            message: '',
            data: { key: 'value' },
          });
          done();
        });
    });

    it('should handle a response with no data gracefully', (done) => {
      callHandlerMock.handle = jest
        .fn()
        .mockReturnValue(of({ message: 'Success' }));
      interceptor
        .intercept(
          executionContextMock as ExecutionContext,
          callHandlerMock as CallHandler,
        )
        .subscribe((response) => {
          expect(response).toEqual({
            statusCode: 200,
            reqId: '12345',
            message: 'Success',
            data: null,
          });
          done();
        });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an empty response object', (done) => {
      callHandlerMock.handle = jest.fn().mockReturnValue(of({}));
      interceptor
        .intercept(
          executionContextMock as ExecutionContext,
          callHandlerMock as CallHandler,
        )
        .subscribe((response) => {
          expect(response).toEqual({
            statusCode: 200,
            reqId: '12345',
            message: '',
            data: null,
          });
          done();
        });
    });

    it('should handle a null response', (done) => {
      callHandlerMock.handle = jest.fn().mockReturnValue(of(null));
      interceptor
        .intercept(
          executionContextMock as ExecutionContext,
          callHandlerMock as CallHandler,
        )
        .subscribe((response) => {
          expect(response).toEqual({
            statusCode: 200,
            reqId: '12345',
            message: '',
            data: null,
          });
          done();
        });
    });

    it('should handle a response with undefined fields', (done) => {
      callHandlerMock.handle = jest
        .fn()
        .mockReturnValue(of({ message: undefined, data: undefined }));
      interceptor
        .intercept(
          executionContextMock as ExecutionContext,
          callHandlerMock as CallHandler,
        )
        .subscribe((response) => {
          expect(response).toEqual({
            statusCode: 200,
            reqId: '12345',
            message: '',
            data: null,
          });
          done();
        });
    });
  });
});

// End of unit tests for: intercept
