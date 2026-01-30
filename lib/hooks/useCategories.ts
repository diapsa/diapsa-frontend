/**
 * useCategories Hook
 * Obtiene categorías de la API con caché
 */

'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/api/categories';
import type { Category } from '@/types/category';

// Cache global para evitar múltiples llamadas
let categoriesCache: Category[] | null = null;
let categoriesCacheTime: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      // Verificar caché
      const now = Date.now();
      if (
        categoriesCache &&
        categoriesCacheTime &&
        now - categoriesCacheTime < CACHE_DURATION
      ) {
        setCategories(categoriesCache);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getCategories();
        
        // Actualizar caché
        categoriesCache = data;
        categoriesCacheTime = now;
        
        setCategories(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error al cargar categorías');
        setError(error);
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
