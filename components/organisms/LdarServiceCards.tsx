const whatIsItems = ["Detección", "Cuantificación", "Cierre"];

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
    { text: "Reducción medible de emisiones", bold: false },
    { text: "Evidencia trimestral estructurada", bold: false },
    { text: "Cumplimiento PPCIEM documentado", bold: false },
    { text: "Disminución de riesgo regulatorio", bold: false },
    { text: "Control técnico real de emisiones", bold: false },
    { text: "Transición de mantenimiento reactivo a preventivo", bold: true },
];

function ArrowIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
        </svg>
    );
}

export default function LdarServiceCards() {
    return (
        <section className="bg-white min-h-screen py-20 px-10 text-black">
            <h2 className="text-4xl font-bold text-center text-black mb-14">
                Servicio Trimestral LDAR para PPCIEM
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                {/* ¿QUÉ ES? */}
                <div className="border border-gray-200 rounded-2xl p-8 flex flex-col gap-6 h-full">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-black">¿QUÉ ES?</h3>
                        <span className="text-secondary">
                            <ArrowIcon />
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        DIAPSA transforma la detección de fugas en un programa completo,
                        audit-able y alineado al PPCIEM.
                    </p>
                    <ol className="mt-4 space-y-4">
                        {whatIsItems.map((item, i) => (
                            <li key={item} className="flex items-center gap-2 text-sm font-semibold text-black">
                                <span className="text-gray-400">{i + 1}.</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* ¿CÓMO SE REALIZA? */}
                <div className="bg-primary rounded-2xl p-8 flex flex-col gap-6 h-full">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">¿CÓMO SE REALIZA?</h3>
                        <span className="text-white/60">
                            <ArrowIcon />
                        </span>
                    </div>
                    <ol className="space-y-3">
                        {howItems.map((item, i) => (
                            <li key={item} className="flex gap-3 text-sm text-white/90 leading-snug">
                                <span className="text-white/50 shrink-0">{i + 1}.</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* ¿QUÉ LOGRAMOS? */}
                <div className="border border-gray-200 rounded-2xl p-8 flex flex-col gap-6 h-full">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-black">¿QUÉ LOGRAMOS?</h3>
                        <span className="text-secondary">
                            <ArrowIcon />
                        </span>
                    </div>
                    <ol className="space-y-3">
                        {achievementsItems.map((item, i) => (
                            <li key={item.text} className="flex gap-3 text-sm leading-snug">
                                <span className="text-gray-400 shrink-0">{i + 1}.</span>
                                <span
                                    className={
                                        item.bold
                                            ? "font-bold text-black"
                                            : "text-gray-500"
                                    }
                                >
                                    {item.text}
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
