/**
 * Category Products Page
 * Listado inicial renderizado en servidor con filtros cliente.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBrands, getCategoryBySlug, getSeries } from '@/lib/api/categories';
import { getStorageUrl } from '@/lib/api/config';
import { getProducts } from '@/lib/api/products';
import JsonLd, { createBreadcrumbSchema } from '@/components/atoms/JsonLd';
import CategoryPageClient from '@/components/organisms/CategoryPageClient';
import { SITE_CONFIG } from '@/lib/constants';

interface CategoryPageProps {
    params: Promise<{ categoria: string }>;
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
    } catch {
        return {
            title: 'Categoria no encontrada',
        };
    }
}

async function getCategoryPageData(categoria: string) {
    const [category, productsResponse, brands, series] = await Promise.all([
        getCategoryBySlug(categoria),
        getProducts({ category: categoria, page: 1, per_page: 12 }),
        getBrands(),
        getSeries({ category: categoria }),
    ]);

    return { category, productsResponse, brands, series };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categoria } = await params;

    let pageData: Awaited<ReturnType<typeof getCategoryPageData>>;

    try {
        pageData = await getCategoryPageData(categoria);
    } catch {
        notFound();
    }

    const { category, productsResponse, brands, series } = pageData;
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
