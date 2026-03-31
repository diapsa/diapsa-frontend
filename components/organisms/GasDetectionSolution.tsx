import Image from "next/image";

const solutionItems = [
    {
        title: "Inspección Trimestral",
        description:
            "Monitoreo periódico con tecnología de punta para asegurar la integridad total de sus activos.",
    },
    {
        title: "Confirmación de Metano",
        description:
            "Validación técnica de concentraciones mediante sensores especializados y calibrados.",
    },
    {
        title: "Priorización de Riesgos",
        description:
            "Clasificación inteligente de hallazgos para optimizar sus recursos y tiempos de reparación.",
    },
];

export default function GasDetectionSolution() {
    return (
        <section className="bg-white py-24 px-10 lg:px-24 border-t border-gray-100">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                {/* Image */}
                <div className="relative w-full lg:w-1/2 h-80 lg:h-144 shrink-0">
                    <Image
                        src="/images/deteccion-gas/observe-invisible.png"
                        alt="Solución DIAPSA - Detección de Fugas"
                        fill
                        className="object-cover rounded-3xl"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-8 text-black">
                    {/* Overline badge */}
                    <div className="flex items-center gap-3 w-fit bg-secondary/10 border border-secondary/20 rounded-full px-4 py-2">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-secondary font-semibold text-sm tracking-widest uppercase">
                            La Solución DIAPSA
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                        Transformamos la detección en cumplimiento integral
                    </h2>
                    <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                        Implementamos un programa de Detección y Reparación de Fugas (LDAR) diseñado
                        específicamente para garantizar la continuidad operativa y seguridad normativa.
                    </p>

                    <ul className="flex flex-col gap-0 mt-2 border-t border-gray-100 pt-4">
                        {solutionItems.map(({ title, description }, i) => (
                            <li key={title} className="flex items-start gap-5 py-6 border-b border-gray-100">
                                <span className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary font-black text-sm">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <h3 className="font-bold text-black text-base mb-1">{title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
