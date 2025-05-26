export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ResponseServicePagination<T> {
  data: T[];
  totalItems: number;
}
