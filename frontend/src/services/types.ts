export type ApiResponse<T> = { data: T };

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiListResponse<T> = { data: T[]; meta: PaginationMeta };
