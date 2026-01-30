/**
 * useProducts Hook
 * Fetch paginated list of products with filters
 */

'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api/products';
import type { Product, ProductFilters } from '@/types/product';
import type { PaginationMeta } from '@/types/api';

interface UseProductsResult {
  products: Product[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProducts(filters: ProductFilters = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create stable key for filters to trigger refetch
  const filtersKey = JSON.stringify(filters);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProducts(filters);
      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar productos'));
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return {
    products,
    meta,
    loading,
    error,
    refetch: fetchProducts,
  };
}
