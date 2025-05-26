import { registerAs } from '@nestjs/config';

export interface PaginationConfig {
  defaultLimit: number;
  maxLimit: number;
  defaultPage: number;
}

export default registerAs(
  'pagination',
  (): PaginationConfig => ({
    defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT, 10) || 10,
    maxLimit: parseInt(process.env.PAGINATION_MAX_LIMIT, 10) || 100,
    defaultPage: 1,
  }),
);
