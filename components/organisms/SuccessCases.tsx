import Link from "next/link";
import casesData from "@/data/casos-exito.json";
import type { CasoExito } from "@/types/caso-exito";

const casosExito = casesData as unknown as CasoExito[];

export default function SuccessCases() {
    return (
        <section className="py-16 px-6 lg:px-32 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-4xl font-extrabold text-primary">
                        Casos de Éxito
                    </h2>
                    <p className="text-lg text-gray-700">
                        Conoce los <b>casos de éxito</b> de nuestros servicios
                    </p>
                </div>

                {/* Grid de Casos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {casosExito.map((caso) => (
                        <Link
                            key={caso.slug}
                            href={`/casos-exito/${caso.slug}`}
                            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-secondary"
                        >
                            {/* Header Card */}
                            <div className="bg-primary p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -translate-y-16 translate-x-16" />
                                <div className="relative z-10">
                                    <p className="text-secondary text-sm font-semibold uppercase tracking-wide mb-2">
                                        {caso.industry}
                                    </p>
                                    <h3 className="text-white text-xl font-bold leading-tight mb-3 group-hover:text-secondary transition-colors">
                                        {caso.title}
                                    </h3>
                                    {/* <p className="text-gray-300 text-sm">
                                        Cliente:{" "}
                                        <span className="font-semibold">{caso.client}</span>
                                    </p> */}
                                </div>
                            </div>

                            {/* Body Card */}
                            <div className="p-6 space-y-4">
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {caso.introduction}
                                </p>

                                {/* Botón de Ver Más */}
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

                {/* Ver Todos CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/casos-exito"
                        className="inline-block bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-3 rounded-lg transition-all"
                    >
                        Ver todos los casos de éxito
                    </Link>
                </div>
            </div>
        </section>
    );
}