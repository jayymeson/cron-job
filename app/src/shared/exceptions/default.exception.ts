import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class DefaultException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly errorCode?: string,
    public readonly timestamp: string = new Date().toISOString(),
  ) {
    super(
      {
        message,
        errorCode,
        timestamp,
        statusCode,
      },
      statusCode,
    );
  }
}
