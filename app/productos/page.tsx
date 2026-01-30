/**
 * Products Listing Page
 * Listado de productos con filtros y búsqueda
 */

'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import { useCategories } from '@/lib/hooks/useCategories';
import { useBrands } from '@/lib/hooks/useBrands';
import PageHeader from '@/components/organisms/PageHeader';
import ProductGrid from '@/components/organisms/ProductGrid';
import ProductFilter from '@/components/molecules/ProductFilter';
import SearchBar from '@/components/molecules/SearchBar';
import type { ProductFilters } from '@/types/product';

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    per_page: 12,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const { products, meta, loading, error, refetch } = useProducts(filters);
  const { categories, loading: categoriesLoading } = useCategories();
  const { brands, loading: brandsLoading } = useBrands();

  // Convertir categorías y marcas de la API al formato de filtros
  const filterGroups = useMemo(() => {
    const groups = [];

    // Filtro de categorías (solo categorías raíz - level 0)
    if (categories.length > 0) {
      groups.push({
        id: 'category',
        label: 'Categoría',
        options: categories
          .filter(cat => cat.level === 0)
          .map(cat => ({
            value: cat.slug,
            label: cat.name,
          })),
      });
    }

    // Filtro de marcas
    if (brands.length > 0) {
      groups.push({
        id: 'brand',
        label: 'Marca',
        options: brands.map(brand => ({
          value: brand.slug,
          label: brand.name,
        })),
      });
    }

    return groups;
  }, [categories, brands]);

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value || undefined,
      page: 1, // Reset to first page
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      per_page: 12,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implementar búsqueda con useProductSearch hook
  };

  const activeFilters = {
    category: filters.category || '',
    brand: filters.brand || '',
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader
        title="PRODUCTOS"
        subtitle="Encuentra el equipo perfecto para tus necesidades de mantenimiento predictivo"
      />

      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Buscar productos por nombre, modelo o marca..."
            />
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1 mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-4">
                {categoriesLoading || brandsLoading ? (
                  <div className="bg-white rounded-lg p-6 shadow">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ) : (
                  <ProductFilter
                    filters={filterGroups}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Results count */}
              {meta && !loading && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    {meta.total} {meta.total === 1 ? 'producto encontrado' : 'productos encontrados'}
                  </p>
                </div>
              )}

              <ProductGrid
                products={products}
                loading={loading}
                error={error}
                meta={meta}
                onPageChange={handlePageChange}
                onRetry={refetch}
                emptyMessage="No se encontraron productos"
                emptyDescription="Intenta ajustar los filtros o buscar con otros términos"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
