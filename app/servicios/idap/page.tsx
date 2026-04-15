import IdapHero from "@/components/organisms/IdapHero";
import IdapOrigin from "@/components/organisms/IdapOrigin";
import IdapPillars from "@/components/organisms/IdapPillars";
import IdapFaq from "@/components/organisms/IdapFaq";
import { information as idapdata } from "@/data/idap.json";
import Image from "next/image";

type InfoBlock = {
    bg?: boolean;
    title: string;
    description?: string;
    image?: string;
    images?: { src: string; alt: string }[];
    alt?: string;
    status?: { name: string; description: string }[];
    items?: { id: string; name: string; description: string }[];
    diciplines?: { id: number; icon: string; name: string }[];
    indicadores?: { id: number; name: string; recommendation: string }[];
};

const colorStatus: Record<string, { border: string; text: string; bg: string }> = {
    Baja: { border: "border-[#009700]", text: "text-[#009700]", bg: "bg-[#00970040]" },
    Media: { border: "border-[#ffc000]", text: "text-[#ffc000]", bg: "bg-[#ffc00040]" },
    Alta: { border: "border-[#ff0000]", text: "text-[#ff0000]", bg: "bg-[#ff000040]" },
};

const indicadorColor: Record<string, { badge: string; bar: string }> = {
    Bueno: { badge: "bg-green-500/15 text-green-400 border-green-500/40", bar: "bg-green-500" },
    Observación: { badge: "bg-[#ffc000]/15 text-[#ffc000] border-blue-400/40", bar: "bg-[#ffc000]" },
    Precaución: { badge: "bg-yellow-300/15 text-yellow-300 border-yellow-300/40", bar: "bg-yellow-300" },
    Alarma: { badge: "bg-red-500/15 text-red-400 border-red-500/40", bar: "bg-red-500" },
    Seguimiento: { badge: "bg-blue-400/15 text-blue-300 border-blue-400/40", bar: "bg-blue-400" },
};

const sectionLabels: Record<string, { eyebrow: string; narrative: string }> = {
    "INDICADORES DE CRITICIDAD DE ACTIVOS": {
        eyebrow: "Priorizar lo que importa",
        narrative: "No todos los activos son iguales. IDAP clasifica cada equipo según su impacto real en tu operación, para que sepas exactamente a qué darle atención primero.",
    },
    "GESTIÓN INTEGRAL DE ACTIVOS INDUSTRIALES": {
        eyebrow: "Un solo centro de control",
        narrative: "IDAP centraliza toda la información técnica de tu planta. Sin hojas de cálculo dispersas, sin correos con adjuntos: todo en un solo lugar, accesible y trazable.",
    },
    "MÚLTIPLES DISCIPLINAS, UN SOLO SISTEMA": {
        eyebrow: "Convergencia de conocimiento",
        narrative: "Termografía, vibraciones, ultrasonido, aceite, electricidad e integrales, todas integradas en el mismo entorno. Una visión 360° de la salud de tus activos.",
    },
    "Indicadores de Resultados de Inspección y Prioridad": {
        eyebrow: "Claridad para actuar",
        narrative: "Cada inspección genera un estado claro: Bueno, Observación, Precaución, Alarma o Seguimiento. Sin ambigüedades, con recomendación técnica incluida.",
    },
    "SEGUIMIENTO HISTÓRICO Y ANÁLISIS COMPARATIVO": {
        eyebrow: "Tendencias que salvan equipos",
        narrative: "Las fallas no ocurren de la noche a la mañana. Con el historial de IDAP puedes detectar patrones antes de que se conviertan en paros no programados.",
    },
};

export default function PageIdap() {
    return (
        <main className="bg-primary">
            {/* 1. Hero */}
            <IdapHero />

            {/* 2. Historia de origen — "No es software de terceros" */}
            <IdapOrigin />

            {/* 3. Tres pilares — Visualiza · Reportes · Alarmas */}
            <IdapPillars />

            {/* 4. Secciones de información con storytelling mejorado */}
            {(idapdata as InfoBlock[]).map((section, index) => {
                const label = sectionLabels[section.title];
                const isDark = section.bg === true;

                return (
                    <section
                        key={section.title}
                        className={`relative w-full overflow-hidden py-20 lg:py-28 ${isDark ? "bg-black" : "bg-primary"}`}
                    >
                        {isDark ? (
                            <>
                                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/25 to-white" />
                                <div
                                    className="absolute inset-0 opacity-[0.03]"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(#fc9f01 1px, transparent 5px), linear-gradient(90deg, #fc9f01 1px, transparent 5px)",
                                        backgroundSize: "48px 48px",
                                    }}
                                />
                            </>
                        ) : (
                            <div
                                className="absolute inset-0 opacity-[0.03]"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(#fc9f01 1px, transparent 1px), linear-gradient(90deg, #fc9f01 1px, transparent 1px)",
                                    backgroundSize: "48px 48px",
                                }}
                            />
                        )}

                        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-14">

                            {/* Encabezado narrativo */}
                            {label && (
                                <div className="space-y-3 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5">
                                        <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                                            {label.eyebrow}
                                        </span>
                                    </div>
                                    <p className="text-base text-gray-400 leading-relaxed">
                                        {label.narrative}
                                    </p>
                                </div>
                            )}

                            {/* Contenido principal */}
                            <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

                                {/* Columna texto */}
                                <div className="w-full lg:w-1/2 space-y-8">
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl uppercase font-bold leading-tight text-white">
                                        {section.title}
                                    </h3>
                                    {section.description && (
                                        <p className="text-lg text-gray-300 leading-relaxed">
                                            {section.description}
                                        </p>
                                    )}
                                    {section.diciplines && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {section.diciplines.map((d) => (
                                                <div key={d.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                                                    <p className="text-sm font-semibold text-white">{d.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Columna visual */}
                                <div className="w-full lg:w-1/2">
                                    {section.image && (
                                        <div className="relative w-full h-72 md:h-96 lg:h-104 rounded-2xl overflow-hidden">
                                            <Image
                                                src={section.image}
                                                alt={section.alt ?? section.title}
                                                fill
                                                className="object-contain"
                                                priority={index === 0}
                                            />
                                        </div>
                                    )}
                                    {section.images && (
                                        <div className="flex flex-col gap-3">
                                            <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden border border-white/10">
                                                <Image
                                                    src={section.images[0].src}
                                                    alt={section.images[0].alt}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {section.images.slice(1, 3).map((img) => (
                                                    <div key={img.alt} className="relative w-full h-36 md:h-48 rounded-xl overflow-hidden border border-white/10">
                                                        <Image src={img.src} alt={img.alt} fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {section.items && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {section.items.map((item) => (
                                                <div key={item.id} className="group flex flex-col gap-2 p-5 bg-white/5 border border-white/10 hover:border-secondary/40 rounded-xl transition-colors duration-300">
                                                    <p className="font-thin text-2xl text-secondary/60 group-hover:text-secondary/80 transition-colors">{item.id}</p>
                                                    <p className="text-sm text-secondary font-bold uppercase">{item.name}</p>
                                                    <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Criticidad */}
                            {section.status && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                                    {section.status.map((s) => (
                                        <div key={s.name} className={`relative overflow-hidden border-b-4 bg-white/5 rounded-xl p-6 space-y-4 ${colorStatus[s.name].border}`}>
                                            <span className={`inline-block text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-md border ${colorStatus[s.name].text} ${colorStatus[s.name].bg} ${colorStatus[s.name].border}`}>
                                                {s.name}
                                            </span>
                                            <p className="text-sm text-gray-300 leading-relaxed">{s.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Indicadores de inspección */}
                            {section.indicadores && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
                                    {section.indicadores.map((ind) => {
                                        const colors = indicadorColor[ind.name] ?? { badge: "bg-white/10 text-white border-white/20", bar: "bg-white/40" };
                                        return (
                                            <div key={ind.id} className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                                <div className={`h-1 w-full ${colors.bar}`} />
                                                <div className="p-5 space-y-3">
                                                    <span className={`inline-block text-xs font-bold uppercase tracking-wide py-0.5 px-2.5 rounded-md border ${colors.badge}`}>
                                                        {ind.name}
                                                    </span>
                                                    <p className="text-sm text-gray-300 leading-relaxed">{ind.recommendation}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    </section>
                );
            })}

            {/* 5. FAQ */}
            <IdapFaq />

            {/* 6. CTA Final — Solicitar información */}
            <section id="contacto" className="relative bg-primary py-20 lg:py-32 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

                <div className="relative max-w-3xl mx-auto px-6 lg:px-12 text-center space-y-10">

                    <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5">
                        <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                            ¿Te interesa IDAP?
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                        Empieza con una{" "}
                        <span className="text-secondary italic">conversación</span>
                    </h2>

                    <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                        <p>
                            IDAP es la plataforma que DIAPSA utiliza para dar seguimiento a sus servicios de mantenimiento predictivo y convertir datos técnicos en decisiones operativas.
                        </p>
                        <p>
                            Si ya eres cliente de DIAPSA o estás evaluando nuestros servicios, contáctanos y un especialista te explicará cómo IDAP puede integrarse a tu operación.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
                        {[
                            "Sin compromiso de contratación",
                            "Atención personalizada por un especialista",
                            "Evaluamos tu operación antes de proponer",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <a
                            href="mailto:info@grupodiapsa.com"
                            className="inline-flex items-center justify-center gap-3 rounded-xs px-10 py-4 bg-secondary text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                        >
                            Contactar a un especialista
                        </a>
                    </div>

                </div>
            </section>

        </main>
    );
}