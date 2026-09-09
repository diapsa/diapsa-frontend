import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/organisms/PageHeader";
import JsonLd, { createBreadcrumbSchema } from "@/components/atoms/JsonLd";
import Pagination from "@/components/molecules/Pagination";
import { getStorageUrl } from "@/lib/api/config";
import { getPaginatedSuccessCases } from "@/lib/api/posts";
import { formatDate } from "@/lib/utils/formatDate";
import type { SuccessCase } from "@/types/post";

export const dynamic = "force-dynamic";

const SUCCESS_CASES_PER_PAGE = 9;

type CasosExitoPageProps = {
    searchParams?: Promise<{
        page?: string | string[];
    }>;
};

export const metadata: Metadata = {
    title: "Casos de Éxito en Mantenimiento Predictivo",
    description:
        "Casos de éxito de Grupo DIAPSA en mantenimiento predictivo, monitoreo de condición y servicios de mantenimiento industrial para Mexico y Sudamérica.",
    keywords: [
        "casos de éxito mantenimiento predictivo",
        "mantenimiento predictivo",
        "monitoreo de condición",
        "servicios de mantenimiento",
        "resultados mantenimiento industrial",
        "casos de éxito monitoreo de condición",
        "ahorro mantenimiento predictivo",
        "mantenimiento predictivo Sudamérica",
    ],
    alternates: {
        canonical: "/casos-exito",
    },
    openGraph: {
        title: "Casos de Éxito en Mantenimiento Predictivo | Grupo DIAPSA",
        description:
            "Resultados reales de mantenimiento predictivo, monitoreo de condición y confiabilidad industrial con Grupo DIAPSA.",
        url: "/casos-exito",
        type: "website",
    },
};

function SuccessCaseCard({ successCase }: { successCase: SuccessCase }) {
    const detail = successCase.success_case;
    const coverImage = getStorageUrl(successCase.cover_image) || "/images/fondo-mantenimiento.webp";
    const publishedAt = formatDate(successCase.published_at);

    return (
        <article className="group grid grid-cols-1 lg:grid-cols-[minmax(280px,420px)_1fr] bg-white rounded-sm border border-gray-100 hover:border-secondary/40 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300">
            <Link
                href={`/casos-exito/${successCase.slug}`}
                className="relative min-h-72 lg:min-h-full overflow-hidden bg-gray-100"
                aria-label={`Ver caso ${successCase.title}`}
            >
                <Image
                    src={coverImage}
                    alt={`Portada del caso de exito ${successCase.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-primary/20" />
            </Link>

            <div className="flex flex-col p-6 lg:p-8 gap-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <p className="text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
                            {detail.industry}
                        </p>
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-primary leading-tight group-hover:text-secondary transition-colors duration-300">
                            {successCase.title}
                        </h2>
                    </div>

                    {publishedAt && (
                        <time
                            dateTime={successCase.published_at}
                            className="shrink-0 text-xs font-semibold uppercase tracking-wider text-tertiary"
                        >
                            {publishedAt}
                        </time>
                    )}
                </div>

                <div className="border-l-2 border-secondary pl-4">
                    <span className="block text-xs uppercase tracking-wider text-tertiary mb-1">
                        Servicio aplicado
                    </span>
                    <span className="block text-base font-bold text-primary leading-snug">
                        {detail.service}
                    </span>
                </div>

                <p className="text-tertiary text-base leading-relaxed line-clamp-3">
                    {detail.introduction || successCase.excerpt}
                </p>

                <div className="mt-auto pt-2">
                    <Link
                        href={`/casos-exito/${successCase.slug}`}
                        className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xs hover:bg-secondary hover:text-primary transition-all duration-300 shadow-md"
                    >
                        Ver caso
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default async function CasosExitoPage({ searchParams }: CasosExitoPageProps) {
    const params = await searchParams;
    const requestedPage = getPageParam(params?.page);
    // Si el CMS no responde, la página carga vacía en vez de devolver un 500.
    const casosResponse = await getPaginatedSuccessCases({
        page: requestedPage,
        perPage: SUCCESS_CASES_PER_PAGE,
    }).catch((error) => {
        console.error("[casos-exito] No se pudo cargar el listado:", error);
        return null;
    });
    const casosExito = casosResponse?.data ?? [];
    const meta = casosResponse?.meta ?? {
        current_page: requestedPage,
        from: 0,
        last_page: 1,
        per_page: SUCCESS_CASES_PER_PAGE,
        to: 0,
        total: 0,
    };

    const breadcrumbJsonLd = createBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Casos de Éxito", url: "/casos-exito" },
    ]);

    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Casos de éxito de mantenimiento predictivo",
        description:
            "Resultados de mantenimiento predictivo, monitoreo de condición y confiabilidad industrial implementados por Grupo DIAPSA.",
        itemListElement: casosExito.map((caso, index) => ({
            "@type": "ListItem",
            position: (meta.from || 1) + index,
            url: `https://grupodiapsa.com/casos-exito/${caso.slug}`,
            name: caso.title,
            description: caso.seo?.description || caso.excerpt,
        })),
    };

    return (
        <main>
            <JsonLd data={breadcrumbJsonLd} />
            <JsonLd data={itemListJsonLd} />

            <PageHeader
                title="Casos de Éxito"
                subtitle="Proyectos realizados por Grupo DIAPSA y resultados obtenidos en activos industriales críticos"
            />

            <section className="w-full bg-white py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-4 leading-tight">
                            Resultados técnicos con <span className="text-secondary">impacto operativo</span>
                        </h2>
                        <p className="text-tertiary text-lg leading-relaxed max-w-3xl mx-auto">
                            Aqui presentamos proyectos ejecutados por nuestro equipo, las condiciones
                            atendidas y los resultados obtenidos mediante mantenimiento predictivo,
                            monitoreo de condición y diagnostico especializado.
                        </p>
                    </div>

                    {casosExito.length > 0 ? (
                        <div className="flex flex-col gap-8">
                            {casosExito.map((caso) => (
                                <SuccessCaseCard key={caso.id} successCase={caso} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-sm border border-gray-100 p-8 text-center shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-3">
                                Casos de éxito en preparación
                            </h3>
                            <p className="text-tertiary text-base leading-relaxed max-w-2xl mx-auto">
                                Estamos documentando nuevos resultados para compartirlos aquí.
                            </p>
                        </div>
                    )}

                    <Pagination
                        basePath="/casos-exito"
                        currentPage={meta.current_page}
                        totalPages={meta.last_page}
                    />
                </div>
            </section>

            <section className="w-full py-20 lg:py-28 px-6 relative overflow-hidden bg-primary">
                <Image
                    src="/images/monitoreo-continuo/factory.jpeg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-primary/80" />
                <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                        Listo para construir tu proximo <span className="text-secondary">caso de éxito</span>
                    </h2>
                    <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                        Permitenos ayudarte a optimizar tus operaciones con soluciones de mantenimiento
                        predictivo, monitoreo de condición y confiabilidad industrial.
                    </p>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3 rounded-xs hover:bg-white hover:text-primary transition-all duration-300 shadow-md"
                    >
                        Contactar especialista
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
