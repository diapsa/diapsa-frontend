/**
 * Product Detail Page
 * Detalle completo de un producto individual
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/api/products';
import ProductDetails from '@/components/organisms/ProductDetails';
import PageHeader from '@/components/organisms/PageHeader';
import JsonLd, { createProductSchema, createBreadcrumbSchema } from '@/components/atoms/JsonLd';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    return {
      title: product.seo.title,
      description: product.seo.description,
      keywords: [
        product.name,
        product.model,
        product.brand.name,
        product.category.name,
        'mantenimiento predictivo',
        'equipos industriales',
      ],
      alternates: {
        canonical: `/productos/${slug}`,
      },
      openGraph: {
        title: product.seo.title,
        description: product.seo.description,
        url: `/productos/${slug}`,
        type: 'website',
        images: product.images
          .filter((img) => img.type === 'main')
          .map((img) => ({
            url: img.url,
            alt: img.alt,
          })),
      },
    };
  } catch (error) {

    return {
      title: 'Producto no encontrado',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.log(error)
    notFound();
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos' },
    { label: product.category.name, href: `/productos?category=${product.category.slug}` },
    { label: product.name, href: `/productos/${product.slug}` },
  ];

  // Structured data for SEO
  const productSchema = createProductSchema({
    name: product.name,
    description: product.description,
    image: product.images.find((img) => img.type === 'main')?.url || '',
    brand: product.brand.name,
    sku: product.model,
    category: product.category.name,
  });

  const breadcrumbSchema = createBreadcrumbSchema(
    breadcrumbItems.map((item) => ({ name: item.label, url: item.href }))
  );

  return (
    <>
      {/* JSON-LD for SEO */}
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <main className="min-h-screen bg-white">
        <PageHeader
          title={product.name}
          subtitle={product.short_description}
          breadcrumbs={breadcrumbItems.map((item) => ({
            label: item.label,
            link: item.href,
          }))}
        />

        {/* Product Details */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <ProductDetails product={product} />
          </div>
        </section>
      </main>
    </>
  );
}
