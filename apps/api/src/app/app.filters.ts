import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  private static readonly logger = new Logger('MongoExceptionsHandler');

  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    let status: HttpStatus;
    let message: string;
    switch (exception.code) {
      case 121:
        status = HttpStatus.BAD_REQUEST;
        message = 'Document failed validation.';
        break;
      case 11000:
        status = HttpStatus.BAD_REQUEST;
        message = 'Duplicate key error.';
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error.';
    }

    response.status(status).json({
      message,
      timestamp: new Date().toISOString(),
    });

    return MongoExceptionFilter.logger.error(exception.message, exception.stack);
  }
}
