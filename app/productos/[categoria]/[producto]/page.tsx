/**
 * Product Detail Page
 * Detalle completo de un producto individual
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/api/products';
import { incluyeCurso, productoLocal, versionesLocales } from '@/lib/productos-locales';
import { getStorageUrl } from '@/lib/api/config';
import ProductDetails from '@/components/organisms/ProductDetails';
import PageHeader from '@/components/organisms/PageHeader';
import JsonLd, { createProductSchema, createBreadcrumbSchema } from '@/components/atoms/JsonLd';
import ContactFormProduct from '@/components/organisms/ContactFormProduct';
import BackgroundImage from '@/components/atoms/BackgroundImage';
import { SITE_CONFIG } from '@/lib/constants';

interface ProductPageProps {
  params: Promise<{ categoria: string; producto: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { producto } = await params;

  try {
    const product = productoLocal(producto) ?? (await getProductBySlug(producto));
    const productPath = `/productos/${product.category.slug}/${product.slug}`;
    const mainImages = product.images
      .filter((img) => img.type === 'main')
      .map((img) => ({
        url: getStorageUrl(img.url) || img.url,
        alt: img.alt,
      }));

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
        canonical: `${SITE_CONFIG.baseUrl}${productPath}`,
      },
      openGraph: {
        title: product.seo.title,
        description: product.seo.description,
        url: `${SITE_CONFIG.baseUrl}${productPath}`,
        type: 'website',
        images: mainImages,
      },
    };
  } catch {

    return {
      title: 'Producto no encontrado',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { categoria, producto } = await params;

  // Las cámaras HIKMICRO viven en el sitio (lib/productos-locales.ts), no en el CMS
  let product = productoLocal(producto);
  try {
    product ??= await getProductBySlug(producto);
  } catch {
    console.log('Producto no encontrado:', producto)

    notFound();
  }

  if (product.category.slug !== categoria) {
    notFound();
  }
  const versiones = versionesLocales(product.slug);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos' },
    { label: product.category.name, href: `/productos?categoria=${product.category.slug}` },
    { label: product.name, href: `/productos/${product.category.slug}/${product.slug}` },
  ];

  // Structured data for SEO
  const productSchema = createProductSchema({
    name: product.name,
    description: product.description,
    image: product.images.find((img) => img.type === 'main')?.url || '',
    brand: product.brand.name,
    sku: product.model,
    category: product.category.name,
    url: `/productos/${product.category.slug}/${product.slug}`,
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
          breadcrumbs={breadcrumbItems.map((item) => ({
            label: item.label,
            link: item.href,
          }))}
        />

        {/* Product Details */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            {/* Promoción: curso de termografía gratis con cámaras M30 o superior */}
            {product.brand.slug === 'hikmicro' && incluyeCurso(product.model) && (
              <div className="mb-6 flex flex-col gap-3 rounded-sm bg-secondary px-5 py-4 text-primary sm:flex-row sm:items-center sm:justify-between">
                <p className="text-justify text-sm font-semibold leading-snug sm:text-base">
                  <span className="font-black">Incluye curso de termografía gratis.</span> Al comprar la {product.model} te capacitamos para que la uses bien desde el primer día.
                </p>
                <div className="flex shrink-0 gap-2">
                  <Link href="#contacto" className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-primary">
                    Cotizar
                  </Link>
                  <Link href="/cursos" className="rounded-full border border-primary/30 px-5 py-2 text-sm font-bold text-primary transition-colors hover:bg-white">
                    Ver cursos
                  </Link>
                </div>
              </div>
            )}
            {/* Versiones de la misma cámara (HIKMICRO): mismo cuerpo, cambian resolución, enfoque o temperatura */}
            {versiones.length > 1 && (
              <nav aria-label="Versiones de esta cámara" className="mb-8 rounded-sm bg-gray-50 p-5 ring-1 ring-black/5">
                <p className="text-sm font-extrabold text-primary">Esta cámara viene en {versiones.length} versiones</p>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {versiones.map((v) => {
                    const actual = v.slug === product.slug;
                    return (
                      <li key={v.slug}>
                        <Link
                          href={`/productos/${product.category.slug}/${v.slug}`}
                          aria-current={actual ? 'page' : undefined}
                          className={`block h-full rounded-sm px-4 py-3 text-xs ring-1 transition-colors ${
                            actual ? 'bg-primary text-white ring-primary' : 'bg-white text-tertiary ring-gray-200 hover:ring-secondary'
                          }`}
                        >
                          <span className={`block text-base font-extrabold ${actual ? 'text-secondary' : 'text-primary'}`}>{v.model}</span>
                          {v.datos.map((d) => (
                            <span key={d} className="block">
                              {d}
                            </span>
                          ))}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
            <ProductDetails product={product} />
          </div>
        </section>
        <section id='contacto' className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
          {/* TODO: Replace placeholder with photo of industrial warehouse or equipment showcase */}
          <BackgroundImage
            src="/images/servicios/placeholder.jpg"
            alt="Almacén de equipos industriales"
            overlayOpacity={0.75}
          />
          <ContactFormProduct product={product} className='relative max-w-7xl mx-2 lg:mx-auto bg-gray-100 px-6 lg:px-20 py-16  rounded-sm' />
        </section>
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-3">
              <Link
                href={`/productos?categoria=${product.category.slug}`}
                className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-secondary"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Categoria</p>
                <h2 className="mt-2 text-xl font-bold text-primary">{product.category.name}</h2>
                <p className="mt-2 text-sm text-gray-700">Ver mas equipos de esta familia de productos.</p>
              </Link>
              <Link
                href="/servicios/monitoreo-condicion"
                className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-secondary"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Servicio relacionado</p>
                <h2 className="mt-2 text-xl font-bold text-primary">Monitoreo de condicion</h2>
                <p className="mt-2 text-sm text-gray-700">Integra este equipo a una estrategia de confiabilidad industrial.</p>
              </Link>
              <Link
                href="/servicios/diagnostico-situacional"
                className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-secondary"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Diagnostico</p>
                <h2 className="mt-2 text-xl font-bold text-primary">Diagnostico situacional</h2>
                <p className="mt-2 text-sm text-gray-700">Define prioridades tecnicas antes de invertir en instrumentos.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
