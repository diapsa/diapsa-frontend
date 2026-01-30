/**
 * useFeaturedProducts Hook
 * Fetch featured products with caching (ideal for homepage)
 */

'use client';

import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '@/lib/api/products';
import type { Product } from '@/types/product';

interface UseFeaturedProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Cache for featured products
let cachedProducts: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useFeaturedProducts(): UseFeaturedProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeaturedProducts = async () => {
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedProducts && now - cacheTimestamp < CACHE_TTL) {
      setProducts(cachedProducts);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getFeaturedProducts();
      setProducts(data);
      
      // Update cache
      cachedProducts = data;
      cacheTimestamp = now;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Error al cargar productos destacados')
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchFeaturedProducts,
  };
}
