import Image from "next/image";

const stats = [
    { value: "+22", label: "Años diagnosticando activos industriales" },
    { value: "6", label: "Disciplinas predictivas integradas en una plataforma" },
    { value: "100%", label: "Desarrollada y respaldada por especialistas DIAPSA" },
    { value: "1", label: "Plataforma central. Toda la información de tus activos" },
];

export default function IdapOrigin() {
    return (
        <section className="relative bg-black py-20 lg:py-32 overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fc9f01 1px, transparent 5px), linear-gradient(90deg, #fc9f01 1px, transparent 5px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Líneas decorativas */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />

            {/* Blob de acento */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Columna izquierda — Narrativa */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                                Construida desde adentro
                            </span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                            No es software de terceros.{" "}
                            <span className="text-secondary italic">
                                Es la herramienta que DIAPSA usa.
                            </span>
                        </h2>

                        <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                            <p>
                                IDAP nació de la necesidad real de los especialistas de DIAPSA de centralizar, visualizar y comunicar los resultados del mantenimiento predictivo de forma clara y accionable.
                            </p>
                            <p>
                                Después de más de{" "}
                                <span className="text-white font-semibold">22 años diagnosticando activos industriales</span>,
                                sabemos exactamente qué información necesita un tomador de decisiones: no tablas interminables, sino criterio experto traducido en acciones concretas.
                            </p>
                            <p>
                                Por eso IDAP no es solo tecnología:{" "}
                                <span className="text-secondary font-semibold">
                                    es el conocimiento de DIAPSA convertido en plataforma.
                                </span>
                            </p>
                        </div>

                        {/* Acreditación visual */}
                        <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                            <div className="relative h-10 w-32 shrink-0">
                                <Image
                                    src="/images/logo-diapsa.webp"
                                    alt="Logo DIAPSA"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-sm text-gray-400">
                                Una herramienta desarrollada, operada y respaldada{" "}
                                <span className="text-white">exclusivamente por DIAPSA</span>
                            </p>
                        </div>
                    </div>

                    {/* Columna derecha — Estadísticas */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="group relative bg-white/5 border border-white/10 hover:border-secondary/40 rounded-2xl p-6 space-y-3 transition-colors duration-300"
                            >
                                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                                <p className="text-4xl font-black text-secondary">{stat.value}</p>
                                <p className="text-sm text-gray-400 leading-snug">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
