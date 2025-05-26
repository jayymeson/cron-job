import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

export function ApiPaginatedResponse() {
  return applyDecorators(
    UseInterceptors(PaginationInterceptor),
    UseInterceptors(LoggingInterceptor),
  );
}

export function ApiLoggedResponse() {
  return applyDecorators(UseInterceptors(LoggingInterceptor));
}
