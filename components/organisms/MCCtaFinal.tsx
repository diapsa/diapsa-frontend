import Link from "next/link";

const stats = [
    { value: "+20", label: "Años de experiencia" },
    { value: "9", label: "Servicios de monitoreo" },
    { value: "0", label: "Paros para medir" },
];

export default function MCCtaFinal() {
    return (
        <section className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-secondary/6 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">

                <span className="inline-block text-secondary text-xs font-semibold tracking-widest uppercase mb-6">
                    Tu siguiente paso
                </span>
                <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                    TU OPERACIÓN NO DEBERÍA{" "}
                    <span className="text-secondary">DEPENDER DEL AZAR</span>
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
                    Más de 20 años midiendo equipos industriales en México. El primer paso es una conversación sin costo ni compromiso.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/* CTA Primario */}
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3 rounded-xs hover:bg-white hover:text-primary transition-all duration-300 shadow-md"
                    >
                        Agendar diagnóstico
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                    {/* CTA Secundario */}
                    <Link
                        href="/casos-exito"
                        className="inline-flex items-center gap-2 border border-white/40 text-white font-bold px-8 py-3 rounded-xs hover:border-secondary hover:text-secondary transition-all duration-300"
                    >
                        Ver casos de éxito
                    </Link>

                    {/* CTA Terciario */}
                    <Link
                        href="/metodologia"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-secondary font-semibold px-4 py-3 transition-colors duration-300 text-sm"
                    >
                        Conocer nuestra metodología →
                    </Link>
                </div>

                {/* Social proof */}
                <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-xl mx-auto">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl font-extrabold text-secondary">{stat.value}</p>
                            <p className="text-white/50 text-xs uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
