/**
 * SearchBar Component
 * Barra de búsqueda con debouncing para productos
 */

'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  loading?: boolean;
  debounce?: number;
  autoFocus?: boolean;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Buscar productos...',
  loading = false,
  debounce = 300,
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with external value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(internalValue);
    }, debounce);

    return () => clearTimeout(timer);
  }, [internalValue, debounce, onChange]);

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && internalValue.trim()) {
      onSearch(internalValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      {/* Ícono de búsqueda */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="
          w-full pl-12 pr-24 py-3 
          border border-gray-300 rounded-lg
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-colors
        "
      />

      {/* Loading spinner o botón clear */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {loading ? (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : internalValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : null}

        {/* Botón de búsqueda (desktop) */}
        {onSearch && (
          <button
            type="submit"
            disabled={!internalValue.trim()}
            className="
              hidden sm:block
              px-4 py-1.5 bg-primary text-white rounded-lg
              text-sm font-medium
              hover:bg-primary/90 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Buscar
          </button>
        )}
      </div>
    </form>
  );
}

/**
 * SearchBarCompact Component
 * Versión compacta para navbars
 */
interface SearchBarCompactProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBarCompact({
  onSearch,
  placeholder = 'Buscar...',
  className = '',
}: SearchBarCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
      setQuery('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
        aria-label="Buscar"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          if (!query) setIsOpen(false);
        }}
        placeholder={placeholder}
        className="
          w-full sm:w-64 pl-10 pr-4 py-2
          border border-gray-300 rounded-lg
          text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary/50
        "
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </form>
  );
}
