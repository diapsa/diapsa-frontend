import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd, { createBreadcrumbSchema } from "@/components/atoms/JsonLd";
import Pagination from "@/components/molecules/Pagination";
import PageHeader from "@/components/organisms/PageHeader";
import { getStorageUrl } from "@/lib/api/config";
import { getPaginatedBlogs } from "@/lib/api/posts";
import { formatDate } from "@/lib/utils/formatDate";
import type { Blog } from "@/types/post";

export const dynamic = "force-dynamic";

const DEFAULT_BLOG_IMAGE = "/images/fondo-mantenimiento.webp";
const BLOGS_PER_PAGE = 9;

type BlogPageProps = {
    searchParams?: Promise<{
        page?: string | string[];
    }>;
};

export const metadata: Metadata = {
    title: "Blog de Mantenimiento Predictivo Industrial",
    description:
        "Artículos de Grupo DIAPSA sobre mantenimiento predictivo, monitoreo de condición, diagnostico industrial y confiabilidad de activos.",
    keywords: [
        "blog mantenimiento predictivo",
        "mantenimiento predictivo industrial",
        "monitoreo de condición",
        "diagnostico industrial",
        "confiabilidad de activos",
        "Grupo DIAPSA",
    ],
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Blog de Mantenimiento Predictivo | Grupo DIAPSA",
        description:
            "Ideas técnicas y criterios de mantenimiento predictivo para mejorar la confiabilidad industrial.",
        url: "/blog",
        type: "website",
    },
};

function BlogCard({ blog }: { blog: Blog }) {
    const coverImage = getStorageUrl(blog.cover_image) || DEFAULT_BLOG_IMAGE;
    const publishedAt = formatDate(blog.published_at);

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-secondary/40 hover:shadow-xl">
            <Link
                href={`/blog/${blog.slug}`}
                className="relative h-56 w-full overflow-hidden bg-gray-100"
                aria-label={`Leer articulo ${blog.title}`}
            >
                <Image
                    src={coverImage}
                    alt={`Portada del articulo ${blog.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary/20" />
            </Link>

            <div className="flex flex-1 flex-col p-6">
                {publishedAt && (
                    <time
                        dateTime={blog.published_at}
                        className="mb-3 text-xs font-semibold uppercase tracking-wider text-tertiary"
                    >
                        {publishedAt}
                    </time>
                )}

                <h2 className="mb-3 text-xl font-bold leading-snug text-primary transition-colors duration-300 group-hover:text-secondary">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h2>

                <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-tertiary">
                    {blog.excerpt}
                </p>

                <div className="mt-auto">
                    <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-2 rounded-xs bg-primary px-6 py-3 font-bold text-white shadow-md transition-all duration-300 hover:bg-secondary hover:text-primary"
                    >
                        Leer articulo
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
}

function getPageParam(page?: string | string[]) {
    const rawPage = Array.isArray(page) ? page[0] : page;
    const parsedPage = Number(rawPage);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        return 1;
    }

    return parsedPage;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const params = await searchParams;
    const requestedPage = getPageParam(params?.page);
    // Si el CMS no responde, la página carga vacía en vez de devolver un 500.
    const blogsResponse = await getPaginatedBlogs({
        page: requestedPage,
        perPage: BLOGS_PER_PAGE,
    }).catch((error) => {
        console.error("[blog] No se pudo cargar el listado:", error);
        return null;
    });
    const blogs = blogsResponse?.data ?? [];
    const meta = blogsResponse?.meta ?? {
        current_page: requestedPage,
        from: 0,
        last_page: 1,
        per_page: BLOGS_PER_PAGE,
        to: 0,
        total: 0,
    };

    const breadcrumbJsonLd = createBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Blog", url: "/blog" },
    ]);

    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Blog de mantenimiento predictivo de Grupo DIAPSA",
        description:
            "Artículos sobre mantenimiento predictivo, monitoreo de condición y diagnostico industrial.",
        itemListElement: blogs.map((blog, index) => ({
            "@type": "ListItem",
            position: (meta.from || 1) + index,
            url: `https://grupodiapsa.com/blog/${blog.slug}`,
            name: blog.title,
            description: blog.seo?.description || blog.excerpt,
        })),
    };

    return (
        <main>
            <JsonLd data={breadcrumbJsonLd} />
            <JsonLd data={itemListJsonLd} />

            <PageHeader
                title="Blog"
                subtitle="Criterios técnicos, tendencias y buenas practicas para mantenimiento predictivo industrial"
            />

            <section className="w-full bg-gray-50 py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-6">

                    {blogs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-sm border border-gray-100 bg-white p-8 text-center shadow-sm">
                            <h2 className="mb-3 text-xl font-bold text-primary">
                                Artículos en preparación
                            </h2>
                            <p className="mx-auto max-w-2xl text-base leading-relaxed text-tertiary">
                                Estamos preparando nuevos contenidos técnicos para compartirlos aquí.
                            </p>
                        </div>
                    )}

                    <Pagination
                        basePath="/blog"
                        currentPage={meta.current_page}
                        totalPages={meta.last_page}
                        totalItems={meta.total}
                        itemsPerPage={meta.per_page}
                    />
                </div>
            </section>
        </main>
    );
}
