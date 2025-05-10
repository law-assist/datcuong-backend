import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  HttpException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Handle any exception
    const message =
      response.message || exception instanceof Error
        ? exception.message
        : 'Internal server error.';

    const status = exception?.status || 500;

    const exceptionResponse = {
      data: null,
      statusCode: status,
      message: exception?.response?.message || exception.message || message,
      timestamp: new Date().toISOString(),
    };
    console.log('Exception all: ', exceptionResponse, request.url);

    response.status(status).json(exceptionResponse);
  }
}
