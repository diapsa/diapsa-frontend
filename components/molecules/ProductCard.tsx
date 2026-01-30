/**
 * ProductCard Component
 * Tarjeta de producto genérica - soporta datos de API del CMS y JSON local
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';

interface ProductCardProps {
  // Acepta datos del CMS API
  product?: Product;
  // O datos custom (cámaras, etc.)
  custom?: {
    id: string;
    slug: string;
    name: string;
    model?: string;
    image?: string;
    description?: string;
    badge?: string;
    badgeColor?: 'primary' | 'secondary' | 'success';
    specs?: Array<{ label: string; value: string }>;
    href?: string;
  };
  className?: string;
}

export default function ProductCard({ product, custom, className = '' }: ProductCardProps) {
  // Normalizar datos
  const data = product
    ? {
        id: product.id.toString(),
        slug: product.slug,
        name: product.name,
        model: product.model,
        image: product.main_image,
        description: product.short_description,
        badge: product.is_new ? 'Nuevo' : product.featured ? 'Destacado' : undefined,
        badgeColor: product.is_new ? ('success' as const) : ('secondary' as const),
        specs: product.featured_specs.map((spec) => ({
          label: spec.label,
          value: `${spec.value} ${spec.unit}`,
        })),
        href: `/productos/${product.slug}`,
        availability: product.availability_status,
        brand: product.brand.name,
      }
    : custom
    ? {
        ...custom,
        href: custom.href || `/productos/${custom.slug}`,
      }
    : null;

  if (!data) return null;

  const badgeColors = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-green-600 text-white',
  };

  return (
    <Link
      href={data.href}
      className={`
        group bg-white rounded-lg overflow-hidden
        border border-gray-200 hover:border-secondary/50
        hover:shadow-lg transition-all duration-300
        ${className}
      `}
    >
      {/* Imagen */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Badge */}
        {data.badge && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`
                text-xs font-bold px-3 py-1 rounded-full shadow-md
                ${badgeColors[data.badgeColor || 'secondary']}
              `}
            >
              {data.badge}
            </span>
          </div>
        )}

        {/* Imagen del producto */}
        {data.image ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-contain p-4 lg:p-6 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Marca (si existe) */}
        {'brand' in data && data.brand && (
          <p className="text-xs font-semibold text-secondary uppercase tracking-wide">
            {data.brand}
          </p>
        )}

        {/* Modelo */}
        {data.model && (
          <p className="text-sm font-bold text-primary uppercase tracking-wide">
            {data.model}
          </p>
        )}

        {/* Nombre */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
          {data.name}
        </h3>

        {/* Descripción */}
        {data.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{data.description}</p>
        )}

        {/* Especificaciones destacadas */}
        {data.specs && data.specs.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {data.specs.slice(0, 3).map((spec, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                <span className="font-medium">{spec.label}:</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Estado de disponibilidad (solo productos de API) */}
        {'availability' in data && data.availability && (
          <p className="text-xs text-gray-500 pt-1">
            <span
              className={`
                inline-block w-2 h-2 rounded-full mr-1.5
                ${
                  data.availability.toLowerCase().includes('disponible')
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }
              `}
            />
            {data.availability}
          </p>
        )}

        {/* Call to action */}
        <div className="pt-2">
          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-secondary transition-colors">
            Ver detalles
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
