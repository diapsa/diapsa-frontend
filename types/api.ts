/**
 * Generic API Response Types
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

/**
 * Pagination links
 */
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Rate limit info
 */
export interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  retryAfter: number | null;
}
