import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ResponseServicePagination,
  PaginatedResponse,
  PaginationMeta,
} from '../types/pagination.types';

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const limit = parseInt(request.query.limit, 10) || 10;
    const page = parseInt(request.query.page, 10) || 1;

    return next.handle().pipe(
      map((data: ResponseServicePagination<T>) => {
        const totalPages = Math.ceil(data.totalItems / limit);

        const meta: PaginationMeta = {
          totalItems: data.totalItems,
          currentPage: page,
          pageSize: limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        };

        return {
          data: data.data,
          meta,
        };
      }),
    );
  }
}
