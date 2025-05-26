import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationQuery } from '../types/pagination.types';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationQuery => {
    const request = ctx.switchToHttp().getRequest();
    const { query } = request;

    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 10, 100);

    return {
      page: Math.max(page, 1),
      limit: Math.max(limit, 1),
    };
  },
);
