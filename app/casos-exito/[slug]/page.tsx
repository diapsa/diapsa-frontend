import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import JsonLd, { createBreadcrumbSchema } from "@/components/atoms/JsonLd";
import ArticleIndex, { type ArticleIndexItem } from "@/components/molecules/ArticleIndex";
import PageHeader from "@/components/organisms/PageHeader";
import { getStorageUrl } from "@/lib/api/config";
import { getSuccessCaseBySlug } from "@/lib/api/posts";
import { formatDate } from "@/lib/utils/formatDate";
import ContactForm from "@/components/organisms/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";

interface SuccessCasePageProps {
    params: Promise<{ slug: string }>;
}

function SectionHeading({ title }: { title: string }) {
    return (
        <header className="mb-4">
            <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight text-primary">
                {title}
            </h2>
        </header>
    );
}

function DocumentSection({
    id,
    title,
    children,
    className = "",
}: {
    id: string;
    title: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section id={id} className={`scroll-mt-28 border-t border-gray-100 pt-8 lg:pt-10 ${className}`}>
            <SectionHeading title={title} />
            {children}
        </section>
    );
}

function formatMetricLabel(label: string) {
    return label
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .replace("Percent", "%")
        .replace("USD", "(USD)");
}

function SuccessCaseCta() {
    return (
        <section className="border-y border-gray-100 bg-secondary/20 py-12 lg:py-14">
            <div className="mx-auto max-w-6xl px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:px-8">
                <div>
                    <h2 className="text-2xl font-extrabold leading-tight text-primary lg:text-3xl">
                        Si este caso se parece a tu operación, vale la pena revisarlo antes del proximo paro.
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-tertiary">
                        Podemos ayudarte a identificar señales tempranas, priorizar activos críticos y definir un plan técnico con impacto medible.
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
                    <Link
                        href="#contacto"
                        className="inline-flex items-center justify-center rounded-xs bg-primary px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-secondary hover:text-primary"
                    >
                        Solicitar revision técnica
                    </Link>
                    <Link
                        href="/casos-exito"
                        className="inline-flex items-center justify-center rounded-xs border border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-white hover:text-primary hover:border-white"
                    >
                        Ver mas casos
                    </Link>
                </div>
            </div>
        </section>
    );
}

export async function generateMetadata({
    params,
}: SuccessCasePageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const caso = await getSuccessCaseBySlug(slug);

        const keywords = [
            caso.success_case.industry,
            caso.success_case.service,
            "caso de exito",
            "mantenimiento predictivo",
            "monitoreo de condicion",
            "servicios de mantenimiento",
            "confiabilidad industrial",
            "mantenimiento predictivo Sudamerica",
            "DIAPSA",
            "resultados",
        ];

        return {
            title: caso.seo.title,
            description: caso.seo.description,
            keywords,
            alternates: { canonical: `${SITE_CONFIG.baseUrl}/casos-exito/${slug}` },
            openGraph: {
                title: caso.seo.title,
                description: caso.seo.description,
                url: `${SITE_CONFIG.baseUrl}/casos-exito/${slug}`,
                type: "article",
            },
        };
    } catch (error) {
        // Log en desarrollo para debugging
        if (process.env.NODE_ENV === 'development') {
            console.log(`[casos-exito] Slug no encontrado: ${slug}`);
        }
        return {
            title: "Caso de exito no encontrado"
        };
    }
}

export default async function CasoExitoDetailPage({
    params,
}: SuccessCasePageProps) {
    const { slug } = await params;

    let caso;
    try {
        caso = await getSuccessCaseBySlug(slug);
    } catch (error) {
        // Log en desarrollo para debugging
        if (process.env.NODE_ENV === 'development') {
            console.log(`[casos-exito] Slug no encontrado: ${slug}`);
        }
        notFound();
    }

    const coverImage = getStorageUrl(caso.cover_image) || "/images/fondo-mantenimiento.webp";
    const publishedAt = formatDate(caso.published_at);
    const heroSubtitle = [
        caso.success_case.industry,
        caso.success_case.service,
        publishedAt,
    ].filter(Boolean).join(" | ");
    const pageBreadcrumbs = [
        { label: "Inicio", link: "/" },
        { label: "Casos de Exito", link: "/casos-exito" },
        { label: caso.title, link: `/casos-exito/${slug}` },
    ];
    const articleIndexItems: ArticleIndexItem[] = [
        { id: "introduccion", label: "Introducción" },
        { id: "reto", label: "El reto" },
        { id: "metodologia", label: "Metodología" },
        { id: "resultados", label: "Resultados" },
        { id: "impacto-economico", label: "Impacto económico" },
        { id: "conclusion", label: "Conclusion" },
    ];
    const breadcrumbItems = [
        { name: "Inicio", url: "/" },
        { name: "Casos de Exito", url: "/casos-exito" },
        { name: caso.title, url: `/casos-exito/${slug}` },
    ];
    const breadcrumbJsonLd = createBreadcrumbSchema(breadcrumbItems);
    const caseStudyJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: caso.title,
        description: caso.seo.description,
        articleSection: "Casos de exito",
        keywords: [
            caso.success_case.industry,
            caso.success_case.service,
            "mantenimiento predictivo",
            "monitoreo de condicion",
            "servicios de mantenimiento",
            "confiabilidad industrial",
        ],
        author: {
            "@type": "Organization",
            name: "Grupo DIAPSA",
            url: "https://grupodiapsa.com",
        },
        publisher: {
            "@type": "Organization",
            name: "Grupo DIAPSA",
            logo: {
                "@type": "ImageObject",
                url: "https://grupodiapsa.com/images/logo-diapsa.webp",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://grupodiapsa.com/casos-exito/${slug}`,
        },
        inLanguage: "es-MX",
        about: [
            {
                "@type": "Thing",
                name: "Mantenimiento predictivo",
            },
            {
                "@type": "Thing",
                name: "Monitoreo de condición",
            },
            {
                "@type": "Thing",
                name: caso.title,
            },
        ],
    };

    return (
        <main className="bg-white text-primary">
            <JsonLd data={breadcrumbJsonLd} />
            <JsonLd data={caseStudyJsonLd} />

            <PageHeader
                title={caso.title}
                subtitle={heroSubtitle}
                breadcrumbs={pageBreadcrumbs}
            />
            <SuccessCaseCta />

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[minmax(0,860px)_220px] lg:items-start lg:px-8 lg:py-12">
                <article className="max-w-[860px]">
                    <section id="introduccion" className="scroll-mt-28 pb-8 lg:pb-10">
                        <SectionHeading title="Introducción" />
                        <p className="text-xl font-semibold leading-relaxed text-primary lg:text-2xl">
                            {caso.success_case.introduction}
                        </p>
                    </section>

                    <DocumentSection id="reto" title="El reto">
                        <p className="text-base leading-8 text-tertiary lg:text-lg">
                            {caso.success_case.challenge}
                        </p>
                    </DocumentSection>

                    <DocumentSection
                        id="metodologia"
                        title="Metodología"
                        className="mt-8 lg:mt-10"
                    >
                        {caso.success_case.methodology_name && (
                            <p className="mb-5 text-lg font-semibold leading-8 text-primary">
                                {caso.success_case.methodology_name}
                            </p>
                        )}
                        <div className="relative mt-6">
                            <div className="absolute bottom-2 left-5 top-2 w-px bg-gray-200" aria-hidden="true" />
                            <div className="space-y-6">
                                {caso.success_case.stages.map((stage, index) => (
                                    <div key={stage.id || index} className="relative grid grid-cols-[40px_1fr] gap-5">
                                        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-secondary bg-white text-sm font-bold text-secondary">
                                            {index + 1}
                                        </div>
                                        <div className="pb-2">
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-tertiary">
                                                {stage.stage_label}
                                            </p>
                                            <h3 className="mb-2 text-lg font-extrabold leading-snug text-primary">
                                                {stage.title}
                                            </h3>
                                            <p className="text-base leading-7 text-tertiary">
                                                {stage.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DocumentSection>

                    <figure className="my-8 lg:my-10">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-gray-100">
                            <Image
                                src={coverImage}
                                alt={`Proceso documentado para ${caso.title}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 860px"
                            />
                        </div>
                    </figure>

                    <DocumentSection id="resultados" title="Resultados">
                        <p className="text-lg font-semibold leading-8 text-primary lg:text-xl">
                            {caso.success_case.results}
                        </p>

                        {caso.success_case.metrics && caso.success_case.metrics.length > 0 && (
                            <dl className="mt-6 divide-y divide-gray-100 border-y border-gray-100">
                                {caso.success_case.metrics.map(({ label, number }) => (
                                    <div
                                        key={label}
                                        className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6"
                                    >
                                        <dt className="text-sm font-semibold text-tertiary">
                                            {formatMetricLabel(label)}
                                        </dt>
                                        <dd className="text-3xl font-extrabold leading-none text-secondary lg:text-4xl">
                                            {number}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </DocumentSection>

                    <DocumentSection id="impacto-economico" title="Impacto económico" className="mt-8 lg:mt-10">
                        <div className="border-l-4 border-secondary bg-gray-50 px-5 py-5 lg:px-6">
                            <p className="text-lg font-semibold leading-8 text-primary">
                                {caso.success_case.economic_impact}
                            </p>
                        </div>
                    </DocumentSection>

                    <DocumentSection id="conclusion" title="Conclusion" className="mt-8 lg:mt-10">
                        <p className="text-base leading-8 text-tertiary lg:text-lg">
                            {caso.success_case.conclusion}
                        </p>
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <Link
                                href="/casos-exito"
                                className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Volver a casos de éxito
                            </Link>
                        </div>
                    </DocumentSection>
                </article>

                <aside className="order-first lg:sticky lg:top-24 lg:order-none">
                    <ArticleIndex items={articleIndexItems} />
                </aside>
            </div>
            <section id="contacto" className="scroll-mt-24">
                <ContactForm />
            </section>
        </main>
    );
}
