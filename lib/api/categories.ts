/**
 * Categories API Functions
 * Based on API documentation from cms.grupodiapsa.com.mx
 */

import { apiFetch } from './config';
import type { ApiResponse } from '@/types/api';
import type { Category, Brand, Series } from '@/types/category';

/**
 * Get all categories with hierarchical structure
 * GET /api/v1/categories
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch<ApiResponse<Category[]>>('/categories');
  return response.data;
}

/**
 * Get category detail by slug
 * GET /api/v1/categories/{slug}
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const response = await apiFetch<ApiResponse<Category>>(`/categories/${slug}`);
  return response.data;
}

/**
 * Get all brands
 * GET /api/v1/brands
 */
export async function getBrands(): Promise<Brand[]> {
  const response = await apiFetch<ApiResponse<Brand[]>>('/brands');
  return response.data;
}

/**
 * Get brand detail by slug with associated series
 * GET /api/v1/brands/{slug}
 */
export async function getBrandBySlug(slug: string): Promise<Brand> {
  const response = await apiFetch<ApiResponse<Brand>>(`/brands/${slug}`);
  return response.data;
}

/**
 * Get all series with optional filters
 * GET /api/v1/series?brand={slug}&category={slug}
 */
export async function getSeries(filters?: {
  brand?: string;
  category?: string;
}): Promise<Series[]> {
  const params = new URLSearchParams();
  if (filters?.brand) params.append('brand', filters.brand);
  if (filters?.category) params.append('category', filters.category);

  const url = `/series${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await apiFetch<ApiResponse<Series[]>>(url);
  return response.data;
}

/**
 * Get series detail by slug
 * GET /api/v1/series/{slug}
 */
export async function getSeriesBySlug(slug: string): Promise<Series> {
  const response = await apiFetch<ApiResponse<Series>>(`/series/${slug}`);
  return response.data;
}
