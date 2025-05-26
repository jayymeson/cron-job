import { HttpStatus } from '@nestjs/common';
import { DefaultException } from './default.exception';

export class UserNotFoundException extends DefaultException {
  constructor(identifier: string) {
    super(
      `User with identifier '${identifier}' not found`,
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
    );
  }
}

export class UserAlreadyExistsException extends DefaultException {
  constructor(email: string) {
    super(
      `User with email '${email}' already exists`,
      HttpStatus.CONFLICT,
      'USER_ALREADY_EXISTS',
    );
  }
}

export class UserUpdateFailedException extends DefaultException {
  constructor(userId: string, reason?: string) {
    super(
      `Failed to update user '${userId}'${reason ? `: ${reason}` : ''}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
      'USER_UPDATE_FAILED',
    );
  }
}

export class UserValidationException extends DefaultException {
  constructor(field: string, value: any) {
    super(
      `Invalid value '${value}' for field '${field}'`,
      HttpStatus.BAD_REQUEST,
      'USER_VALIDATION_ERROR',
    );
  }
}
