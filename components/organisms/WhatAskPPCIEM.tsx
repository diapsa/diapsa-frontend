import Image from "next/image";

const requirements = [
    {
        number: "01",
        title: "Programas trimestrales LDAR",
        description: "Implementación periódica de detección y reparación de fugas conforme a la normativa vigente.",
    },
    {
        number: "02",
        title: "Evidencia documentada",
        description: "Registros técnicos que respalden cada intervención, medición y hallazgo en campo.",
    },
    {
        number: "03",
        title: "Reportes anuales de cumplimiento",
        description: "Informes consolidados presentados ante la ASEA para certificar el cumplimiento regulatorio.",
    },
];

export default function WhatAskPPCIEM() {
    return (
        <section className="relative bg-white text-black overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
                <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-primary/5 blur-2xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24 flex flex-col lg:flex-row gap-16 items-center">

                {/* ── Left column ── */}
                <div className="w-full lg:w-1/2 space-y-10">
                    {/* Badge */}
                    <div className="flex items-center gap-3 w-fit bg-primary/8 border border-primary/15 rounded-full px-4 py-2">
                        <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                        <span className="text-primary/70 text-sm font-semibold tracking-widest uppercase">
                            Obligaciones regulatorias
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                        ¿Qué exige cada{" "}
                        <span className="text-secondary">PPCIEM?</span>
                    </h2>

                    {/* Requirement cards */}
                    <ol className="space-y-4">
                        {requirements.map((req) => (
                            <li
                                key={req.number}
                                className="flex gap-5 items-start bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-secondary/40 hover:bg-secondary/5 transition-colors duration-200"
                            >
                                <span className="text-secondary font-bold text-xl leading-none mt-0.5 shrink-0 w-8">
                                    {req.number}
                                </span>
                                <div>
                                    <p className="font-semibold text-primary text-base">{req.title}</p>
                                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{req.description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    {/* Stat callout */}
                    <div className="flex gap-6 items-center bg-primary rounded-2xl p-6">
                        <div className="text-secondary font-extrabold text-6xl leading-none shrink-0">
                            7%
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                            La cobertura real de cumplimiento en el mercado{" "}
                            <strong className="text-white">ha sido históricamente baja.</strong>{" "}
                            Evidencia clara de una brecha entre obligación y capacidad operativa.
                        </p>
                    </div>
                </div>

                {/* ── Right column – image ── */}
                <div className="w-full lg:w-1/2 relative h-80 lg:h-[560px] shrink-0">
                    {/* Decorative frame */}
                    <div className="absolute -top-3 -left-3 w-full h-full rounded-3xl border-2 border-secondary/30" />
                    <Image
                        fill
                        className="object-cover rounded-3xl"
                        src="/images/deteccion-gas/operador-frente-a-maquina.png"
                        alt="Operador revisando equipos en planta"
                    />
                    {/* Overlay badge */}
                    <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg">
                        <span className="w-3 h-3 rounded-full bg-secondary shrink-0" />
                        <p className="text-primary text-sm font-medium">
                            Cumplimiento ASEA · Sector Hidrocarburos
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}