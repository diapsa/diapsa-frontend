/**
 * Products API
 * Functions to consume product endpoints from cms.grupodiapsa.com.mx
 */

import { apiFetch } from './config';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Product,
  ProductDetail,
  ProductFilters,
  ProductSearchParams,
} from '@/types/product';

/**
 * Get paginated list of products with optional filters
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams();

  if (filters.category) params.append('category', filters.category);
  if (filters.brand) params.append('brand', filters.brand);
  if (filters.series) params.append('series', filters.series);
  if (filters.per_page) params.append('per_page', filters.per_page.toString());
  if (filters.page) params.append('page', filters.page.toString());

  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return apiFetch<PaginatedResponse<Product>>(endpoint);
}

/**
 * Get product detail by slug
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductDetail> {
  const response = await apiFetch<ApiResponse<ProductDetail>>(
    `/products/${slug}`
  );
  return response.data;
}

/**
 * Search products by query
 */
export async function searchProducts(
  params: ProductSearchParams
): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  searchParams.append('q', params.q);
  
  if (params.per_page) {
    searchParams.append('per_page', params.per_page.toString());
  }
  if (params.page) {
    searchParams.append('page', params.page.toString());
  }

  return apiFetch<PaginatedResponse<Product>>(
    `/products/search?${searchParams.toString()}`
  );
}

/**
 * Get featured products (max 12)
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await apiFetch<ApiResponse<Product[]>>(
    '/products/featured'
  );
  return response.data;
}
