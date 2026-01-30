/**
 * useProductDetail Hook
 * Fetch product detail by slug with caching
 */

'use client';

import { useState, useEffect } from 'react';
import { getProductBySlug } from '@/lib/api/products';
import type { ProductDetail } from '@/types/product';

interface UseProductDetailResult {
  product: ProductDetail | null;
  loading: boolean;
  error: Error | null;
  notFound: boolean;
  refetch: () => void;
}

// Simple in-memory cache
const cache = new Map<string, { data: ProductDetail; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useProductDetail(slug: string): UseProductDetailResult {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchProduct = async () => {
    // Check cache first
    const cached = cache.get(slug);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProduct(cached.data);
      setLoading(false);
      setError(null);
      setNotFound(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getProductBySlug(slug);
      setProduct(data);
      
      // Cache the result
      cache.set(slug, { data, timestamp: Date.now() });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al cargar producto');
      setError(error);
      setProduct(null);
      
      // Check if it's a 404
      if (error.message.includes('no encontrado') || error.message.includes('404')) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return {
    product,
    loading,
    error,
    notFound,
    refetch: fetchProduct,
  };
}
