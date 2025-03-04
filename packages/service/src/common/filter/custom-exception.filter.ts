import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };
    const message = Array.isArray(res?.message) ? res.message?.join(',') : res?.message;

    response.json({
      code: exception.getStatus(),
      message: message || exception.message || '内部服务器错误',
      data: null,
    }).end();
  }
}
