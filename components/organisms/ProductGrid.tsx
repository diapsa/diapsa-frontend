/**
 * ProductGrid Component
 * Grid de productos con loading, error, empty states y paginación
 */

'use client';

import { useEffect } from 'react';
import ProductCard from '@/components/molecules/ProductCard';
import { ProductGridSkeleton } from '@/components/atoms/LoadingSkeleton';
import ErrorMessage, { EmptyState } from '@/components/atoms/ErrorMessage';
import type { Product } from '@/types/product';
import type { PaginationMeta } from '@/types/api';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  emptyDescription?: string;
  meta?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
  skeletonCount?: number;
  className?: string;
}

export default function ProductGrid({
  products,
  loading = false,
  error = null,
  emptyMessage = 'No se encontraron productos',
  emptyDescription = 'Intenta ajustar los filtros o buscar con otros términos',
  meta,
  onPageChange,
  onRetry,
  skeletonCount = 12,
  className = '',
}: ProductGridProps) {
  // Scroll to top when page changes
  useEffect(() => {
    if (meta?.current_page && meta.current_page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [meta?.current_page]);

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        <ProductGridSkeleton count={skeletonCount} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <ErrorMessage
          message={error.message || 'Error al cargar productos'}
          variant="error"
          onRetry={onRetry}
          retryLabel="Reintentar"
        />
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyMessage}
          description={emptyDescription}
          icon={
            <svg
              className="w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          totalItems={meta.total}
          itemsPerPage={meta.per_page}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

/**
 * Pagination Component
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Results info */}
      <p className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{totalItems}</span> resultados
      </p>

      {/* Page buttons */}
      <nav className="flex items-center gap-1" aria-label="Paginación">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          aria-label="Página anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`
                min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
              aria-label={`Página ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          aria-label="Página siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
