import React from "react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/organisms/PageHeader";
import Image from "next/image";
import type { CasoExito } from "@/types/caso-exito";
import JsonLd, { createBreadcrumbSchema } from "@/components/atoms/JsonLd";
import casosExitoData from "@/data/casos-exito.json";

const casosExito = casosExitoData as unknown as CasoExito[];

// Generar parámetros estáticos para pre-renderizado
export async function generateStaticParams() {
    return casosExito.map((caso) => ({
        slug: caso.slug,
    }));
}

// Función para cargar datos del caso de éxito
function getCasoExitoData(slug: string): CasoExito | null {
    const caso = casosExito.find((c) => c.slug === slug);
    return caso || null;
}

// Generar metadata para SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const caso = getCasoExitoData(slug);

    if (!caso) {
        return {
            title: "Caso de Éxito no encontrado",
        };
    }

    const keywords = [
        caso.client,
        caso.industry,
        "caso de éxito",
        "mantenimiento predictivo",
        "DIAPSA",
        "resultados",
    ];

    return {
        title: caso.seo.title,
        description: caso.seo.description,
        keywords,
        alternates: {
            canonical: `/casos-exito/${slug}`,
        },
        openGraph: {
            title: caso.seo.title,
            description: caso.seo.description,
            url: `/casos-exito/${slug}`,
            type: "article",
        },
    };
}

export default async function CasoExitoDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const caso = getCasoExitoData(slug);

    if (!caso) {
        notFound();
    }

    // Breadcrumbs para datos estructurados
    const breadcrumbItems = [
        { name: "Inicio", url: "/" },
        { name: "Casos de Éxito", url: "/casos-exito" },
        { name: caso.client, url: `/casos-exito/${slug}` },
    ];
    const breadcrumbJsonLd = createBreadcrumbSchema(breadcrumbItems);

    return (
        <main>
            <JsonLd data={breadcrumbJsonLd} />

            {/* Page Header */}
            <PageHeader title={caso.title} subtitle={`Cliente: ${caso.client}`} />

            {/* Hero Info Section */}
            <section className="bg-primary py-12 lg:py-16 px-6 lg:px-32">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <p className="text-secondary text-sm font-semibold uppercase tracking-wide mb-2">
                            Cliente
                        </p>
                        <p className="text-white text-xl font-bold">{caso.client}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-secondary text-sm font-semibold uppercase tracking-wide mb-2">
                            Industria
                        </p>
                        <p className="text-white text-xl font-bold">{caso.industry}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-secondary text-sm font-semibold uppercase tracking-wide mb-2">
                            Servicio
                        </p>
                        <p className="text-white text-xl font-bold">{caso.service}</p>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="bg-white py-12 lg:py-16 px-6 lg:px-32">
                <div className="max-w-5xl mx-auto">
                    <div className="border-l-4 border-secondary pl-6">
                        <h2 className="text-3xl font-extrabold text-primary mb-4">
                            Introducción
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {caso.introduction}
                        </p>
                    </div>
                </div>
            </section>

            {/* Challenge Section */}
            <section className="bg-gray-50 py-12 lg:py-16 px-6 lg:px-32">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-lg p-8 lg:p-10 shadow-md">
                        <div className="flex items-start space-x-4 mb-4">
                            <div className="shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-secondary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-primary mb-4">
                                    El Reto
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {caso.challenge}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section className="bg-white py-12 lg:py-16 px-6 lg:px-32">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-primary mb-8 text-center">
                        Metodología: {caso.methodology.name}
                    </h2>
                    <div className="space-y-6">
                        {caso.methodology.stages.map((stage, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-6 lg:p-8 border-l-4 border-secondary hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-lg">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-secondary text-sm font-semibold uppercase tracking-wide mb-1">
                                            {stage.stage}
                                        </p>
                                        <h3 className="text-xl font-bold text-primary mb-3">
                                            {stage.title}
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {stage.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="bg-gray-50 py-12 lg:py-16 px-6 lg:px-32">
                <div className="max-w-5xl mx-auto">
                    <div className="border-l-4 border-secondary pl-6">
                        <h2 className="text-3xl font-extrabold text-primary mb-4">
                            Resultados
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {caso.results}
                        </p>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            {caso.metrics && Object.keys(caso.metrics).length > 0 && (
                <section className="bg-primary py-12 lg:py-16 px-6 lg:px-32">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
                            Métricas de Impacto
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(caso.metrics).map(([key, value]) => {
                                // Formatear el nombre de la métrica
                                const metricName = key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())
                                    .replace("Percent", "%")
                                    .replace("USD", "(USD)");

                                // Formatear el valor
                                let formattedValue = value;
                                if (typeof value === "number") {
                                    if (key.includes("Percent")) {
                                        formattedValue = `${value}%`;
                                    } else if (key.includes("USD")) {
                                        formattedValue = `$${value.toLocaleString("en-US")}`;
                                    } else {
                                        formattedValue = value.toLocaleString("en-US");
                                    }
                                }

                                return (
                                    <div
                                        key={key}
                                        className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors"
                                    >
                                        <p className="text-secondary text-4xl font-extrabold mb-2">
                                            {formattedValue}
                                        </p>
                                        <p className="text-white text-sm">{metricName}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Economic Impact Section */}
            <section className="bg-white py-12 lg:py-16 px-6 lg:px-32">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-secondary/10 rounded-lg p-8 lg:p-10">
                        <div className="flex items-start space-x-4">
                            <div className="shrink-0 w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-primary mb-4">
                                    Impacto Económico
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {caso.economicImpact}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conclusion Section */}
            <section className="bg-gray-50 py-12 lg:py-16 px-6 lg:px-32">
                <div className="max-w-5xl mx-auto">
                    <div className="border-l-4 border-primary pl-6">
                        <h2 className="text-3xl font-extrabold text-primary mb-4">
                            Conclusión
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {caso.conclusion}
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary py-12 lg:py-16 px-6 lg:px-32">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
                        Impulsa tu operación con resultados comprobados
                    </h2>
                    <p className="text-lg text-gray-300">
                        Descubre cómo nuestras soluciones de mantenimiento predictivo pueden
                        transformar tu industria como lo hicieron con {caso.client}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <a
                            href="/casos-exito"
                            className="inline-block bg-white hover:bg-gray-100 text-primary font-bold px-8 py-3 rounded-lg transition-all"
                        >
                            Ver más casos
                        </a>
                        <a
                            href="/contacto"
                            className="inline-block bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-3 rounded-lg transition-all"
                        >
                            Contáctanos
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
