/**
 * Category Products Page
 * Listado inicial renderizado en servidor con filtros cliente.
 */

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { CATEGORIA_TERMOGRAFIA } from '@/lib/productos-locales';
import { getBrands, getCategoryBySlug, getSeries } from '@/lib/api/categories';
import { esNoEncontrado, getStorageUrl } from '@/lib/api/config';
import { getProducts } from '@/lib/api/products';
import JsonLd, { createBreadcrumbSchema } from '@/components/atoms/JsonLd';
import CategoryPageClient from '@/components/organisms/CategoryPageClient';
import { SITE_CONFIG } from '@/lib/constants';

interface CategoryPageProps {
    params: Promise<{ categoria: string }>;
}

// La categoría se sirve desde el caché y se rehace cada hora, como la portada
// y /servicios (2026-11-15): sin generateStaticParams Next la marcaba dinámica
// (ƒ), con "Cache-Control: no-store" en cada visita. Devuelve [] para no
// pedirle cada categoría al CMS en el build (limita peticiones, 429); se
// genera con el primer visitante.
export const revalidate = 3600;

export function generateStaticParams() {
    return [];
}



function buildCategoryDescription(categoryName: string, description?: string) {
    return (
        description ||
        `Productos de ${categoryName} para mantenimiento predictivo industrial, monitoreo de condicion y confiabilidad de activos en Mexico.`
    );
}


export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { categoria } = await params;

    try {
        const category = await getCategoryBySlug(categoria);
        const description = buildCategoryDescription(category.name, category.seo?.description || category.description);
        const image = getStorageUrl(category.image) || category.image;

        return {
            title: category.seo?.title || `${category.name} para Mantenimiento Predictivo Industrial`,
            description,
            keywords: [
                category.name,
                'mantenimiento predictivo',
                'monitoreo de condicion',
                'equipos industriales',
                'Grupo DIAPSA',
            ],
            alternates: {
                canonical: `${SITE_CONFIG.baseUrl}/productos/${category.slug}`,
            },
            openGraph: {
                title: category.seo?.title || `${category.name} | Grupo DIAPSA`,
                description,
                url: `${SITE_CONFIG.baseUrl}/productos/${category.slug}`,
                type: 'website',
                images: image
                    ? [
                        {
                            url: image,
                            alt: category.name,
                        },
                    ]
                    : undefined,
            },
        };
    } catch (error) {
        // Solo un 404 real del CMS es "no encontrada" (2026-11-15); un timeout o
        // un 429 se relanza para que ese título no se quede guardado en caché.
        if (!esNoEncontrado(error)) throw error;
        return {
            title: 'Categoría no encontrada',
        };
    }
}

async function getCategoryPageData(categoria: string) {
    const pedidaCategoria = getCategoryBySlug(categoria);
    try {
        const [category, productsResponse, brands, series] = await Promise.all([
            pedidaCategoria,
            getProducts({ category: categoria, page: 1, per_page: 12 }),
            getBrands(),
            getSeries({ category: categoria }),
        ]);

        return { category, productsResponse, brands, series };
    } catch (error) {
        // La página es 404 solo si la categoría misma no existe en el CMS
        // (2026-11-15). Si falló otra de las cuatro peticiones (un 429 en
        // marcas, por ejemplo) se relanza tal cual, sin convertirla en 404.
        const noExiste = await pedidaCategoria.then(() => false, esNoEncontrado);
        if (noExiste) notFound();
        throw error;
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categoria } = await params;

    // Las cámaras termográficas no están en el CMS: se ven en el catálogo general, filtradas
    if (categoria === CATEGORIA_TERMOGRAFIA.slug) {
        redirect(`/productos?categoria=${categoria}`);
    }

    // getCategoryPageData ya llama notFound() con el 404 real del CMS; los
    // demás errores suben para que Next sirva la versión en caché o un 5xx
    // (2026-11-15), en vez del 404 que salía ante cualquier fallo.
    const { category, productsResponse, brands, series } = await getCategoryPageData(categoria);
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Productos', href: '/productos' },
        { label: category.name, href: `/productos/${category.slug}` },
    ];

    const breadcrumbSchema = createBreadcrumbSchema(
        breadcrumbItems.map((item) => ({ name: item.label, url: item.href }))
    );

    return (
        <>
            <JsonLd data={breadcrumbSchema} />
            <CategoryPageClient
                category={category}
                initialProducts={productsResponse.data}
                initialMeta={productsResponse.meta}
                initialBrands={brands}
                initialSeries={series}
            />
        </>
    );
}
