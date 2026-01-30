/**
 * ProductFilter Component
 * Filtros para productos (categoría, marca, serie)
 */

'use client';

import { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface ProductFilterProps {
  filters: FilterGroup[];
  activeFilters: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
  onClearFilters?: () => void;
  className?: string;
}

export default function ProductFilter({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  className = '',
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some((value) => value !== '');
  const activeCount = Object.values(activeFilters).filter((value) => value !== '').length;

  return (
    <div className={className}>
      {/* Mobile: Botón para abrir drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full flex items-center justify-between
            px-4 py-3 bg-white border border-gray-300 rounded-lg
            text-gray-700 font-medium
            hover:bg-gray-50 transition-colors
          "
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtros
            {activeCount > 0 && (
              <span className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Desktop: Título */}
      <div className="hidden lg:flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-secondary transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filtros content */}
      <div
        className={`
          ${isOpen ? 'block' : 'hidden'} lg:block
          mt-4 lg:mt-0 space-y-6
        `}
      >
        {filters.map((filterGroup) => (
          <div key={filterGroup.id} className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">{filterGroup.label}</h4>
            
            <div className="space-y-2">
              {/* Opción "Todos" */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name={filterGroup.id}
                  value=""
                  checked={!activeFilters[filterGroup.id]}
                  onChange={() => onFilterChange(filterGroup.id, '')}
                  className="
                    w-4 h-4 text-primary border-gray-300
                    focus:ring-2 focus:ring-primary/50
                    cursor-pointer
                  "
                />
                <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                  Todos
                </span>
              </label>

              {/* Opciones de filtro */}
              {filterGroup.options.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name={filterGroup.id}
                    value={option.value}
                    checked={activeFilters[filterGroup.id] === option.value}
                    onChange={() => onFilterChange(filterGroup.id, option.value)}
                    className="
                      w-4 h-4 text-primary border-gray-300
                      focus:ring-2 focus:ring-primary/50
                      cursor-pointer
                    "
                  />
                  <span className="flex-1 text-sm text-gray-700 group-hover:text-primary transition-colors">
                    {option.label}
                  </span>
                  {option.count !== undefined && (
                    <span className="text-xs text-gray-500">({option.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Mobile: Botones */}
        <div className="lg:hidden flex gap-2 pt-4 border-t">
          {hasActiveFilters && onClearFilters && (
            <button
              onClick={() => {
                onClearFilters();
                setIsOpen(false);
              }}
              className="
                flex-1 px-4 py-2 border border-gray-300 rounded-lg
                text-gray-700 font-medium
                hover:bg-gray-50 transition-colors
              "
            >
              Limpiar
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="
              flex-1 px-4 py-2 bg-primary text-white rounded-lg
              font-medium hover:bg-primary/90 transition-colors
            "
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
