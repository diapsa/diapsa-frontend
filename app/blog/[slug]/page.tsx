import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getServicioPorArticulo } from "@/lib/recursos";
import Link from "next/link";
import JsonLd, { createBreadcrumbSchema } from "@/components/atoms/JsonLd";
import ArticleIndex, { type ArticleIndexItem } from "@/components/molecules/ArticleIndex";
import TiptapRenderer, { prepareTiptapContent } from "@/components/tiptap/tiptap-renderer";
import PageHeader from "@/components/organisms/PageHeader";
import { getStorageUrl } from "@/lib/api/config";
import { getBlogBySlug } from "@/lib/api/posts";
import { formatDate } from "@/lib/utils/formatDate";
import { SITE_CONFIG } from "@/lib/constants";

interface BlogDetailPageProps {
    params: Promise<{ slug: string }>;
}

const DEFAULT_BLOG_IMAGE = "/images/fondo-mantenimiento.webp";

export async function generateMetadata({
    params,
}: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const blog = await getBlogBySlug(slug);

        return {
            title: blog.seo?.title || blog.title,
            description: blog.seo?.description || blog.excerpt,
            alternates: { canonical: `${SITE_CONFIG.baseUrl}/blog/${slug}` },
            openGraph: {
                title: blog.seo?.title || blog.title,
                description: blog.seo?.description || blog.excerpt,
                url: `${SITE_CONFIG.baseUrl}/blog/${slug}`,
                type: "article",
                images: blog.cover_image ? [getStorageUrl(blog.cover_image) || DEFAULT_BLOG_IMAGE] : undefined,
            },
        };
    } catch (error) {
        // Log en desarrollo para debugging
        if (process.env.NODE_ENV === 'development') {
            console.log(`[blog] Slug no encontrado: ${slug}`);
        }
        return {
            title: "Articulo no encontrado"
        };
    }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;

    let blog;
    try {
        blog = await getBlogBySlug(slug);
    } catch (error) {
        // Log en desarrollo para debugging
        if (process.env.NODE_ENV === 'development') {
            console.log(`[blog] Slug no encontrado: ${slug}`);
        }
        notFound();
    }

    const coverImage = getStorageUrl(blog.cover_image) || DEFAULT_BLOG_IMAGE;
    const publishedAt = formatDate(blog.published_at);
    const pageBreadcrumbs = [
        { label: "Inicio", link: "/" },
        { label: "Blog", link: "/blog" },
        { label: blog.title, link: `/blog/${slug}` },
    ];
    const breadcrumbJsonLd = createBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: blog.title, url: `/blog/${slug}` },
    ]);
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.seo?.description || blog.excerpt,
        image: coverImage,
        datePublished: blog.published_at,
        author: {
            "@type": "Organization",
            name: "Grupo DIAPSA",
            url: SITE_CONFIG.baseUrl,
        },
        publisher: {
            "@type": "Organization",
            name: "Grupo DIAPSA",
            url: SITE_CONFIG.baseUrl,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_CONFIG.baseUrl}/images/logo-diapsa.webp`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_CONFIG.baseUrl}/blog/${slug}`,
        },
        inLanguage: "es-MX",
    };
    const preparedContent = prepareTiptapContent(blog.content);
    // Servicio de DIAPSA que ejecuta la técnica que explica el artículo.
    const servicioRelacionado = getServicioPorArticulo(slug);
    const articleIndexItems: ArticleIndexItem[] = [
        { id: "contenido", label: "Contenido" },
        ...preparedContent.h2Items,
    ];

    return (
        <main className="bg-white text-primary">
            <JsonLd data={breadcrumbJsonLd} />
            <JsonLd data={articleJsonLd} />

            <PageHeader
                title={blog.title}
                subtitle={publishedAt || blog.excerpt}
                breadcrumbs={pageBreadcrumbs}
            />

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[minmax(0,860px)_220px] lg:items-start lg:px-8 lg:py-12">
                <article className="max-w-[860px]">
                    <figure className="mb-8 lg:mb-10">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-gray-100">
                            <Image
                                src={coverImage}
                                alt={`Portada del articulo ${blog.title}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 860px"
                                priority
                            />
                        </div>
                    </figure>
                    {/*
                    {blog.excerpt && (
                        <p className="mb-8 text-xl font-semibold leading-relaxed text-primary lg:text-2xl">
                            {blog.excerpt}
                        </p>
                    )} */}

                    <section id="contenido" className="scroll-mt-28 border-t border-gray-100 pt-8 lg:pt-10">
                        <TiptapRenderer content={preparedContent.content} />
                    </section>

                    {/* Servicio que corresponde al tema del artículo. Quien
                        acaba de leer sobre una técnica es el mejor momento
                        para ofrecerle el servicio que la ejecuta, y el enlace
                        le pasa relevancia a esa página en buscadores. */}
                    {servicioRelacionado && (
                        <aside className="mt-10 rounded-sm border-l-4 border-secondary bg-gray-50 p-6 lg:p-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                                Servicio relacionado
                            </p>
                            <h2 className="mt-2 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">
                                {servicioRelacionado.titulo}
                            </h2>
                            <p className="mt-3 text-base leading-relaxed text-tertiary text-justify lg:text-lg">
                                {servicioRelacionado.resumen}
                            </p>
                            <Link
                                href={servicioRelacionado.href}
                                className="mt-5 inline-flex items-center gap-2 rounded-xs bg-primary px-6 py-3 font-bold text-white transition-all duration-300 hover:bg-secondary hover:text-primary"
                            >
                                Ver el servicio
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </aside>
                    )}

                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver al blog
                        </Link>
                    </div>
                </article>

                <aside className="order-first lg:sticky lg:top-24 lg:order-none">
                    <ArticleIndex items={articleIndexItems} />
                </aside>
            </div>
        </main>
    );
}
