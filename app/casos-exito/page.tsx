import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import Image from "next/image";
import Link from "next/link";
import casosExitoData from "@/data/casos-exito.json";
import type { CasoExito } from "@/types/caso-exito";

const casosExito = casosExitoData as unknown as CasoExito[];

export const metadata: Metadata = {
    title: "Casos de Éxito | Grupo DIAPSA",
    description:
        "Descubre cómo Grupo DIAPSA ha transformado la operación de empresas líderes con soluciones de mantenimiento predictivo. Casos de éxito reales con resultados comprobados.",
    keywords: [
        "casos de éxito mantenimiento predictivo",
        "testimonios DIAPSA",
        "resultados mantenimiento industrial",
        "éxito termografía industrial",
        "ahorro mantenimiento predictivo",
    ],
    alternates: {
        canonical: "/casos-exito",
    },
    openGraph: {
        title: "Casos de Éxito | Grupo DIAPSA",
        description:
            "Resultados reales de empresas que confiaron en DIAPSA para su mantenimiento predictivo.",
        url: "/casos-exito",
        type: "website",
    },
};

export default function CasosExitoPage() {
    return (
        <main>
            <PageHeader
                title="CASOS DE ÉXITO"
                subtitle="Resultados reales que transforman la industria"
            />

            {/* Introducción */}
            <section className="bg-white py-16 px-6 lg:px-32">
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-primary">
                        Excelencia Comprobada
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        Durante más de dos décadas, hemos ayudado a empresas líderes a
                        optimizar sus operaciones, reducir costos y mejorar la confiabilidad
                        de sus activos críticos. Estos son algunos de nuestros casos de éxito
                        más destacados.
                    </p>
                </div>
            </section>

            {/* Grid de Casos de Éxito */}
            <section className="bg-gray-50 py-16 px-6 lg:px-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {casosExito.map((caso) => (
                            <Link
                                key={caso.slug}
                                href={`/casos-exito/${caso.slug}`}
                                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-secondary"
                            >
                                {/* Header Card con Industria */}
                                <div className="bg-primary p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -translate-y-16 translate-x-16" />
                                    <div className="relative z-10">
                                        <p className="text-secondary text-sm font-semibold uppercase tracking-wide mb-2">
                                            {caso.industry}
                                        </p>
                                        <h3 className="text-white text-xl font-bold leading-tight mb-3 group-hover:text-secondary transition-colors">
                                            {caso.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm">
                                            Cliente: <span className="font-semibold">{caso.client}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Body Card */}
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start space-x-2">
                                        <div className="shrink-0 w-1 h-12 bg-secondary rounded-full" />
                                        <div>
                                            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">
                                                Servicio
                                            </p>
                                            <p className="text-gray-700 text-sm">{caso.service}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {caso.introduction}
                                    </p>

                                    {/* Métricas destacadas */}
                                    {caso.metrics && Object.keys(caso.metrics).length > 0 && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                                Resultados Destacados
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(caso.metrics)
                                                    .slice(0, 2)
                                                    .map(([key, value]) => (
                                                        <div
                                                            key={key}
                                                            className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold"
                                                        >
                                                            {typeof value === "number" && key.includes("Percent")
                                                                ? `${value}%`
                                                                : value}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Card */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center text-secondary font-semibold text-sm group-hover:translate-x-2 transition-transform">
                                        Ver caso completo
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-primary py-16 px-6 lg:px-32">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
                        ¿Listo para ser nuestro próximo caso de éxito?
                    </h2>
                    <p className="text-lg text-gray-300">
                        Permítenos ayudarte a optimizar tus operaciones y alcanzar resultados
                        extraordinarios con nuestras soluciones de mantenimiento predictivo.
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/contacto"
                            className="inline-block bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-3 rounded-lg transition-all"
                        >
                            Contáctanos
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
