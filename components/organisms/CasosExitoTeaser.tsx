import { SuccessCase } from "@/types/post";
import Image from "next/image";
import Link from "next/link";

type CaseCardProps = {
    c: SuccessCase;
}

function CaseCard({ c }: CaseCardProps) {
    const primaryMetric = c.success_case.metrics?.[0];
    const secondMetric = c.success_case.metrics?.[1];

    return (
        <Link
            href={`/casos-exito/${c.slug}`}
            className="group flex flex-col bg-white/10 rounded-sm border border-white/15 hover:border-secondary/50 shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 h-full"
        >
            {/* Top accent */}
            <div className="px-4 py-3 border-b border-white/10">
                <div className="flex items-center justify-between gap-1">
                    <span className="text-secondary text-xs font-semibold uppercase tracking-wider leading-none">
                        {c.success_case.service}
                    </span>
                    <span className="text-white/40 text-xs truncate">{c.success_case.industry}</span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                <div>
                    <div className="text-2xl font-extrabold text-secondary leading-none">
                        {primaryMetric?.number ?? "Destacado"}
                    </div>
                    <div className="text-white/50 text-xs uppercase tracking-wide mt-1">
                        {primaryMetric?.label ?? "Caso documentado"}
                    </div>
                </div>
                <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-secondary transition-colors">
                    {c.title}
                </h3>
                <p className="text-xs text-white/60 border-l-2 border-secondary pl-2 italic">
                    {secondMetric ? `${secondMetric.number} ${secondMetric.label}` : c.excerpt}
                </p>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4">
                <span className="inline-flex items-center gap-1 text-secondary text-xs font-semibold group-hover:gap-2 transition-all">
                    Ver caso completo
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}

type CasosExitoTeaserProps = {
    cases: SuccessCase[]
}

export default function CasosExitoTeaser({ cases }: CasosExitoTeaserProps) {
    const featuredCases = cases.slice(0, 4);

    if (featuredCases.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
            {/* Glows industriales difuminados */}
            <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-100 h-100 bg-primary/40 rounded-full blur-2xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* IZQUIERDA: Imagen del ingeniero */}
                    <div className="relative w-full h-80 lg:h-full min-h-120 overflow-hidden rounded-sm">
                        <Image
                            src="/images/engineer-without-bg.png"
                            alt="Especialista certificado DIAPSA"
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* DERECHA: Headlines + Cards en pirámide invertida */}
                    <div className="flex flex-col gap-6">
                        {/* Headlines */}
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                                Resultados que <span className="text-secondary">Hablan por sí solos</span>
                            </h2>
                            <p className="text-white/70 text-base mb-5 max-w-md">
                                Empresas líderes confían en DIAPSA para proteger sus activos y maximizar su rentabilidad operativa.
                            </p>
                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                                <Link
                                    href="/casos-exito"
                                    className="inline-flex w-full sm:w-fit items-center justify-center gap-2 bg-secondary text-primary font-bold px-6 py-3 rounded-xs hover:bg-white transition-all duration-300 shadow-md"
                                >
                                    Explorar casos de éxito
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/contacto?motivo=servicios"
                                    className="inline-flex w-full sm:w-fit items-center justify-center gap-2 border border-white/60 bg-white/5 text-white font-bold px-6 py-3 rounded-xs hover:bg-white hover:border-white hover:text-primary transition-all duration-300"
                                >
                                    Quiero lograr estos resultados
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>

                        </div>

                        {/* Cards en pirámide invertida */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Fila superior: 2 cards */}
                            {featuredCases.map((successCase) => (
                                <CaseCard key={successCase.id} c={successCase} />
                            ))}
                            {/* Fila inferior: 1 card centrada → vértice de la pirámide */}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
