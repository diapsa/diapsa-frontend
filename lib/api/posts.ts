/**
 * Posts API
 * Public endpoints for announcements, success cases, and featured blogs.
 */

import { apiFetch } from './config';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Announcement, Blog, SuccessCase } from '@/types/post';
import { conBlogsLocales, getBlogLocal } from '@/lib/blog-local';

export interface PostListFilters {
  limit?: number;
}

export interface PostPaginationFilters {
  page?: number;
  perPage?: number;
}

function buildListEndpoint(
  endpoint: string,
  filters: PostListFilters & PostPaginationFilters = {}
) {
  const params = new URLSearchParams();

  if (filters.limit) {
    params.append('limit', filters.limit.toString());
  }
  if (filters.page) {
    params.append('page', filters.page.toString());
  }
  if (filters.perPage) {
    params.append('per_page', filters.perPage.toString());
  }

  const queryString = params.toString();
  return `${endpoint}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Get published and active announcements.
 * GET /api/v1/announcements?limit={limit}
 */
export async function getAnnouncements(
  filters: PostListFilters = {}
): Promise<Announcement[]> {
  const response = await apiFetch<ApiResponse<Announcement[]>>(
    buildListEndpoint('/announcements', filters)
  );
  return response.data;
}

/**
 * Get featured announcements.
 * GET /api/v1/announcements/featured
 */
export async function getFeaturedAnnouncements(): Promise<Announcement[]> {
  const response = await apiFetch<ApiResponse<Announcement[]>>(
    '/announcements/featured'
  );
  return response.data;
}

/**
 * Get announcement detail by slug.
 * GET /api/v1/announcements/{slug}
 */
export async function getAnnouncementBySlug(
  slug: string
): Promise<Announcement> {
  const response = await apiFetch<ApiResponse<Announcement>>(
    `/announcements/${slug}`
  );
  return response.data;
}

/**
 * Get published success cases.
 * GET /api/v1/success-cases?limit={limit}
 */
export async function getSuccessCases(
  filters: PostListFilters = {}
): Promise<SuccessCase[]> {
  const response = await apiFetch<ApiResponse<SuccessCase[]>>(
    buildListEndpoint('/success-cases', filters)
  );
  return response.data;
}

/**
 * Get paginated published success cases.
 * GET /api/v1/success-cases?page={page}&per_page={perPage}
 */
export async function getPaginatedSuccessCases(
  filters: PostPaginationFilters = {}
): Promise<PaginatedResponse<SuccessCase>> {
  return apiFetch<PaginatedResponse<SuccessCase>>(
    buildListEndpoint('/success-cases', filters)
  );
}

/**
 * Get featured success cases.
 * GET /api/v1/success-cases/featured
 */
export async function getFeaturedSuccessCases(): Promise<SuccessCase[]> {
  const response = await apiFetch<ApiResponse<SuccessCase[]>>(
    '/success-cases/featured'
  );
  return response.data;
}

/**
 * Get success case detail by slug.
 * GET /api/v1/success-cases/{slug}
 */
export async function getSuccessCaseBySlug(
  slug: string
): Promise<SuccessCase> {
  const response = await apiFetch<ApiResponse<SuccessCase>>(
    `/success-cases/${slug}`
  );
  return response.data;
}

/**
 * Get featured blog posts.
 * GET /api/v1/blogs/featured
 */
export async function getFeaturedBlogs(): Promise<Blog[]> {
  const response = await apiFetch<ApiResponse<Blog[]>>('/blogs/featured');
  return response.data;
}

/**
 * Get published blogs
 * GET /api/v1/blogs/
 */
export async function getBlogs(
  filters: PostListFilters = {}
): Promise<Blog[]> {
  // Se piden sin límite y se aplica después, para que las guías locales
  // (lib/blog-local.ts) entren en orden de fecha con las del CMS. Si el CMS
  // no responde, se sirven al menos las locales.
  const response = await apiFetch<ApiResponse<Blog[]>>(buildListEndpoint('/blogs')).catch(() => null);
  const todos = conBlogsLocales(response?.data ?? []);
  return filters.limit ? todos.slice(0, filters.limit) : todos;
}

/**
 * Get paginated published blogs
 * GET /api/v1/blogs?page={page}&per_page={perPage}
 */
export async function getPaginatedBlogs(
  filters: PostPaginationFilters = {}
): Promise<PaginatedResponse<Blog>> {
  // El CMS tiene pocos artículos: se traen todos, se suman los locales y se
  // pagina aquí.
  const perPage = filters.perPage ?? 9;
  const page = Math.max(1, filters.page ?? 1);
  const todos = await getBlogs();
  const total = todos.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const inicio = (page - 1) * perPage;
  const data = todos.slice(inicio, inicio + perPage);
  return {
    data,
    meta: {
      current_page: page,
      from: data.length ? inicio + 1 : 0,
      last_page: lastPage,
      per_page: perPage,
      to: inicio + data.length,
      total,
    },
    links: {
      first: "/blog",
      last: `/blog?page=${lastPage}`,
      prev: page > 1 ? `/blog?page=${page - 1}` : null,
      next: page < lastPage ? `/blog?page=${page + 1}` : null,
    },
  };
}

/**
 * Get blogs detail by slug
 * GET /api/v1/blogs/{slug}
 */
export async function getBlogBySlug(slug: string): Promise<Blog> {
  const local = getBlogLocal(slug);
  if (local) return local;
  const response = await apiFetch<ApiResponse<Blog>>(`/blogs/${slug}`);
  return response.data;
}
