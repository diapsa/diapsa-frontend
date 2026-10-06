/**
 * ProductDetails Component
 * Vista detallada de producto con gallery, tabs y especificaciones
 */

'use client';

import { enlaceContacto } from "@/lib/contacto-opciones";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/molecules/ProductCard';
import type { ProductDetail } from '@/types/product';
import { getStorageUrl } from '@/lib/api/config';
import { formatStatusProduct } from '@/lib/utils/formatProductStatus';

interface ProductDetailsProps {
  product: ProductDetail;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'docs' | 'related'>('specs');

  // Procesar imágenes con URLs completas del storage
  const processedImages = product.images
    .map(img => ({
      ...img,
      url: getStorageUrl(img.url) || img.url
    }))
    .filter(img => img.url); // Filtrar imágenes sin URL válida

  const mainImage = processedImages.find((img) => img.type === 'main') || processedImages[0];
  const galleryImages = processedImages.filter((img) => img.type === 'gallery');
  const allImages = [mainImage, ...galleryImages].filter(Boolean);

  return (
    <div className="space-y-12">
      {/* Product Header Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
            {allImages[selectedImage] ? (
              <Image
                src={allImages[selectedImage].url}
                alt={allImages[selectedImage].alt}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {product.is_new && (
                <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Nuevo
                </span>
              )}
              {product.featured && (
                <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Destacado
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Ver imagen ${index + 1} de ${allImages.length}: ${image.alt || product.name}`}
                  aria-current={selectedImage === index ? 'true' : undefined}
                  className={`
                    relative aspect-square bg-gray-100 rounded-lg overflow-hidden
                    border-2 transition-all
                    ${selectedImage === index ? 'border-primary' : 'border-transparent hover:border-gray-300'}
                  `}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-contain p-2"
                    sizes="150px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {getStorageUrl(product.brand.logo) && (
              <Image
                src={getStorageUrl(product.brand.logo)!}
                alt={product.brand.name}
                width={80}
                height={40}
                className="object-contain"
              />
            )}
            <span className="text-sm font-semibold text-secondary uppercase tracking-wide">
              {product.brand.name}
            </span>
          </div>

          {/* Model & Title */}
          <div>
            <p className="text-sm font-bold text-primary uppercase tracking-wide mb-2">
              {product.model}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600">{product.short_description}</p>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 py-3 px-4 bg-gray-50 rounded-lg">
            <span
              className={`
                w-3 h-3 rounded-full
                ${product.availability_status.toLowerCase().includes('available') ? 'bg-green-500' : 'bg-yellow-500'}
              `}
            />
            <span className="text-sm font-medium text-gray-700">
              {formatStatusProduct(product.availability_status)}
            </span>
          </div>

          {/* Key Features */}
          {product.specifications.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Características destacadas
              </h3>
              <dl className="grid grid-cols-2 gap-3">
                {product.specifications[0]?.items
                  .filter((item) => item.featured)
                  .slice(0, 4)
                  .map((spec, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <dt className="text-xs text-gray-600 mb-1">{spec.label}</dt>
                      <dd className="text-lg font-bold text-primary">
                        {spec.value} {spec.unit}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a
              href="#contacto"
              className="
                flex-1 px-6 py-3 bg-primary text-white rounded-lg
                font-semibold hover:bg-primary/90 transition-colors
                text-center
              "
            >
              Solicitar cotización
            </a>
            <Link
              href={enlaceContacto("equipos", product.name)}
              className="
                flex-1 px-6 py-3 border-2 border-primary text-primary rounded-lg
                font-semibold text-center hover:bg-primary/5 transition-colors
              "
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8" role="tablist" aria-label="Informacion del producto">
            <button
              type="button"
              id="product-specs-tab"
              role="tab"
              onClick={() => setActiveTab('specs')}
              aria-selected={activeTab === 'specs'}
              aria-controls="product-specs-panel"
              className={`
                pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === 'specs' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-900'}
              `}
            >
              Especificaciones
            </button>
            {product.documents.length > 0 && (
              <button
                type="button"
                id="product-docs-tab"
                role="tab"
                onClick={() => setActiveTab('docs')}
                aria-selected={activeTab === 'docs'}
                aria-controls="product-docs-panel"
                className={`
                  pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === 'docs' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-900'}
                `}
              >
                Documentos
              </button>
            )}
            {product.related_products.length > 0 && (
              <button
                type="button"
                id="product-related-tab"
                role="tab"
                onClick={() => setActiveTab('related')}
                aria-selected={activeTab === 'related'}
                aria-controls="product-related-panel"
                className={`
                  pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === 'related' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-900'}
                `}
              >
                Productos relacionados
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {/* Specifications Tab */}
          {activeTab === 'specs' && (
            <div
              id="product-specs-panel"
              role="tabpanel"
              aria-labelledby="product-specs-tab"
              className="space-y-8"
            >
              {/* Description */}
              {product.description && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Spec Groups */}
              {product.specifications.map((group, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{group.group}</h3>
                  <dl className="grid md:grid-cols-2 gap-4">
                    {group.items.map((spec, specIndex) => (
                      <div
                        key={specIndex}
                        className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg"
                      >
                        <dt className="text-sm font-medium text-gray-700">{spec.label}</dt>
                        <dd className="text-sm font-bold text-gray-900">
                          {spec.value} {spec.unit}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'docs' && (
            <div
              id="product-docs-panel"
              role="tabpanel"
              aria-labelledby="product-docs-tab"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {product.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-4 p-4 bg-gray-50 rounded-lg
                    border border-gray-200 hover:border-primary hover:bg-primary/5
                    transition-all group
                  "
                >
                  <div className="shrink-0">
                    <svg
                      className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 uppercase">{doc.type}</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {/* Related Products Tab */}
          {activeTab === 'related' && (
            <div
              id="product-related-panel"
              role="tabpanel"
              aria-labelledby="product-related-tab"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {product.related_products.map((related) => (
                <ProductCard
                  key={related.id}
                  custom={{
                    id: related.id.toString(),
                    slug: related.slug,
                    name: related.name,
                    model: related.model,
                    image: getStorageUrl(related.main_image) || undefined,
                    description: related.short_description,
                    href: `/productos/${related.category.slug}/${related.slug}`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
