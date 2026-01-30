/**
 * useBrands Hook
 * Obtiene marcas de la API con caché
 */

'use client';

import { useState, useEffect } from 'react';
import { getBrands } from '@/lib/api/categories';
import type { Brand } from '@/types/category';

// Cache global para evitar múltiples llamadas
let brandsCache: Brand[] | null = null;
let brandsCacheTime: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      // Verificar caché
      const now = Date.now();
      if (
        brandsCache &&
        brandsCacheTime &&
        now - brandsCacheTime < CACHE_DURATION
      ) {
        setBrands(brandsCache);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getBrands();
        
        // Actualizar caché
        brandsCache = data;
        brandsCacheTime = now;
        
        setBrands(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error al cargar marcas');
        setError(error);
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
}
