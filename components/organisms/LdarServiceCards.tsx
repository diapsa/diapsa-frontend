const whatIsSteps = [
    {
        label: "Detección",
        description: "Localización precisa de fugas en campo con tecnología OGI.",
    },
    {
        label: "Cuantificación",
        description: "Medición del volumen y tasa de emisión por componente.",
    },
    {
        label: "Cierre",
        description: "Reparación, reinspección y cierre documentado del hallazgo.",
    },
];

const howItems = [
    "Inspección trimestral en campo",
    "Identificación y localización precisa por equipo/componente",
    "Confirmación específica de metano",
    "Cuantificación de volumen/tasa",
    "Priorización por riesgo y costo",
    "Plan de reparación",
    "Reinspección post-reparación",
    "Cierre documentado del hallazgo",
];

const achievementsItems = [
    "Reducción medible de emisiones",
    "Evidencia trimestral estructurada",
    "Cumplimiento PPCIEM documentado",
    "Disminución de riesgo regulatorio",
    "Control técnico real de emisiones",
];

const achievementHighlight =
    "Transición de mantenimiento reactivo a preventivo";

function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export default function LdarServiceCards() {
    return (
        <section className="relative bg-gray-50 text-black overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-0 -right-16 w-72 h-72 rounded-full bg-secondary/5 blur-2xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <p className="text-secondary font-bold tracking-widest text-sm uppercase">
                        Programa Certificado
                    </p>
                    <h2 className="text-3xl lg:text-5xl font-bold text-black leading-tight">
                        Servicio Trimestral{" "}
                        <span className="text-secondary">LDAR</span> para PPCIEM
                    </h2>
                    <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
                        Un ciclo completo, auditable y alineado a la normativa ASEA que
                        convierte la obligación regulatoria en control operativo real.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                    {/* ── ¿QUÉ ES? ── */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-6 hover:border-secondary/40 hover:shadow-md transition-all duration-300">
                        <div>
                            <span className="inline-block text-xs font-bold tracking-widest uppercase text-secondary mb-3">
                                ¿Qué es?
                            </span>
                            <h3 className="text-xl font-bold text-black leading-snug">
                                Ciclo integral de gestión de fugas
                            </h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            DIAPSA transforma la detección de fugas en un programa
                            auditado y alineado al PPCIEM, con tres fases críticas:
                        </p>

                        {/* Process flow steps */}
                        <div className="flex flex-col gap-3 mt-auto">
                            {whatIsSteps.map((step, i) => (
                                <div key={step.label} className="flex gap-4 items-start">
                                    <div className="flex flex-col items-center shrink-0">
                                        <span className="w-8 h-8 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        {i < whatIsSteps.length - 1 && (
                                            <span className="w-px h-6 bg-gray-200 mt-1" />
                                        )}
                                    </div>
                                    <div className="pb-1">
                                        <p className="text-sm font-bold text-black">{step.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── ¿CÓMO SE REALIZA? ── */}
                    <div className="bg-primary rounded-2xl p-8 flex flex-col gap-6">
                        <div>
                            <span className="inline-block text-xs font-bold tracking-widest uppercase text-secondary/80 mb-3">
                                ¿Cómo se realiza?
                            </span>
                            <h3 className="text-xl font-bold text-white leading-snug">
                                8 pasos de ejecución en campo
                            </h3>
                        </div>

                        {/* Timeline list */}
                        <ol className="flex flex-col gap-0">
                            {howItems.map((item, i) => (
                                <li key={item} className="flex gap-4 items-start">
                                    <div className="flex flex-col items-center shrink-0">
                                        <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-bold flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        {i < howItems.length - 1 && (
                                            <span className="w-px h-5 bg-white/15" />
                                        )}
                                    </div>
                                    <p className="text-sm text-white/85 leading-snug py-1">
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* ── ¿QUÉ LOGRAMOS? ── */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-6 hover:border-secondary/40 hover:shadow-md transition-all duration-300">
                        <div>
                            <span className="inline-block text-xs font-bold tracking-widest uppercase text-secondary mb-3">
                                ¿Qué logramos?
                            </span>
                            <h3 className="text-xl font-bold text-black leading-snug">
                                Resultados medibles y documentados
                            </h3>
                        </div>

                        <ul className="flex flex-col gap-3">
                            {achievementsItems.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-gray-600 leading-snug">
                                    <span className="text-secondary mt-0.5">
                                        <CheckIcon />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Highlighted last item */}
                        <div className="mt-auto bg-secondary/8 border border-secondary/30 rounded-xl p-4 flex items-start gap-3">
                            <span className="text-secondary mt-0.5 shrink-0">
                                <CheckIcon />
                            </span>
                            <p className="text-sm font-bold text-primary leading-snug">
                                {achievementHighlight}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
