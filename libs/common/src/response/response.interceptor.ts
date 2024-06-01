import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Request, Response } from 'express';

interface ErrorResponse {
  message: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: Error | HttpException, context: ExecutionContext) {
    console.log('Exception type:', typeof exception);
    console.log(
      'Exception is instance of HttpException:',
      exception instanceof HttpException,
    );
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse = null;
    let message = exception.message;

    if (exception instanceof HttpException) {
      errorResponse = exception.getResponse();
      if (
        typeof errorResponse === 'object' &&
        errorResponse.hasOwnProperty('message')
      ) {
        message = errorResponse['message'];
      }
    } else if (exception instanceof Error) {
      message = 'Something went wrong';
      console.error(exception.message);
    }

    return response.status(status).json({
      statusCode: status,
      path: request.url,
      message,
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = response.statusCode;

    const result = {
      statusCode,
      data: res,
    };
    return response.status(statusCode).json(Object.freeze(result));
  }
}
