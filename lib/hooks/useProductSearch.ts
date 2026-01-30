/**
 * useProductSearch Hook
 * Search products with debouncing
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchProducts } from '@/lib/api/products';
import type { Product, ProductSearchParams } from '@/types/product';
import type { PaginationMeta } from '@/types/api';

interface UseProductSearchResult {
  results: Product[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: Error | null;
  query: string;
  setQuery: (query: string) => void;
  clear: () => void;
  search: (searchQuery: string, page?: number) => void;
}

const DEBOUNCE_DELAY = 300; // ms

export function useProductSearch(
  initialQuery: string = '',
  autoSearch: boolean = true
): UseProductSearchResult {
  const [results, setResults] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = useCallback(
    async (searchQuery: string, page: number = 1) => {
      // Don't search if query is too short
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setMeta(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params: ProductSearchParams = {
          q: searchQuery,
          page,
        };

        const response = await searchProducts(params);
        setResults(response.data);
        setMeta(response.meta);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Error al buscar productos')
        );
        setResults([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Auto-search when debounced query changes
  useEffect(() => {
    if (autoSearch && debouncedQuery) {
      performSearch(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, autoSearch]);

  const clear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setMeta(null);
    setError(null);
  }, []);

  return {
    results,
    meta,
    loading,
    error,
    query,
    setQuery,
    clear,
    search: performSearch,
  };
}
