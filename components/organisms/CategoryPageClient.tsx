'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/api/products';
import PageHeader from '@/components/organisms/PageHeader';
import ProductGrid from '@/components/organisms/ProductGrid';
import ProductFilter from '@/components/molecules/ProductFilter';
import SearchBar from '@/components/molecules/SearchBar';
import type { PaginationMeta } from '@/types/api';
import type { Brand, Category, Series } from '@/types/category';
import type { Product, ProductFilters } from '@/types/product';

interface CategoryPageClientProps {
  category: Category;
  initialProducts: Product[];
  initialMeta: PaginationMeta;
  initialBrands: Brand[];
  initialSeries: Series[];

}

export default function CategoryPageClient({
  category,
  initialProducts,
  initialMeta,
  initialBrands,
  initialSeries,
}: CategoryPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    category: category.slug,
    page: 1,
    per_page: 12,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Inicio', href: '/' },
      { label: 'Productos', href: '/productos' },
      { label: category.name, href: `/productos/${category.slug}` },
    ],
    [category.name, category.slug]
  );

  const filterGroups = useMemo(() => {
    const groups = [];

    if (initialBrands.length > 0) {
      groups.push({
        id: 'brand',
        label: 'Marca',
        options: initialBrands.map((brand) => ({
          value: brand.slug,
          label: brand.name,
        })),
      });
    }

    if (initialSeries.length > 0) {
      groups.push({
        id: 'series',
        label: 'Serie',
        options: initialSeries.map((s) => ({
          value: s.slug,
          label: s.name,
        })),
      });
    }

    return groups;
  }, [initialBrands, initialSeries]);

  const fetchFilteredProducts = async (nextFilters: ProductFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProducts(nextFilters);
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

  const updateFilters = (nextFilters: ProductFilters) => {
    setFilters(nextFilters);
    fetchFilteredProducts(nextFilters);
  };

  const handleFilterChange = (filterId: string, value: string) => {
    updateFilters({
      ...filters,
      [filterId]: value || undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    updateFilters({
      category: category.slug,
      page: 1,
      per_page: 12,
    });
  };

  const handlePageChange = (page: number) => {
    updateFilters({
      ...filters,
      page,
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const activeFilters = {
    brand: filters.brand || '',
    series: filters.series || '',
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader
        title={category.name}
        subtitle={category.description}
        breadcrumbs={breadcrumbItems.map((item) => ({
          label: item.label,
          link: item.href,
        }))}
      />


      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Buscar productos por nombre, modelo o marca..."
            />
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <aside className="lg:col-span-1 mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-4">
                <ProductFilter
                  filters={filterGroups}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>

            <div className="lg:col-span-3">
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
                onRetry={() => fetchFilteredProducts(filters)}
                emptyMessage="No se encontraron productos en esta categoria"
                emptyDescription="Intenta ajustar los filtros o buscar con otros terminos"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary">Soporte para seleccionar {category.name}</h2>
              <p className="mt-2 text-sm text-gray-700">
                Conecta esta categoria con diagnostico, capacitacion y servicios de mantenimiento predictivo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/servicios" className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white">
                Ver servicios
              </Link>
              <Link href="/contacto?motivo=equipos" className="rounded-sm border border-primary px-4 py-2 text-sm font-semibold text-primary">
                Solicitar asesoria
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
