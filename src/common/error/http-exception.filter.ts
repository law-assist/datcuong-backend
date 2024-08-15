import { Catch, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = exception.getResponse().message || exception.getResponse();

    const exceptionResponse = {
      data: null,
      status: status,
      message: message,
      timestamp: new Date().toISOString(),
    };
    console.log('Exception: ', exceptionResponse, request.url);

    response.status(status).json(exceptionResponse);
  }
}
