import Image from "next/image";
import { DoubleCircleIcon, ChartIcon2, HistoryIcon, WarningIcon } from "@/components/atoms/icons";
import type { ComponentType, SVGProps } from "react";

const challenges: {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    image: string;
}[] = [
        {
            icon: DoubleCircleIcon,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
            title: "Detección y Precisión",
            image: "/images/deteccion-gas/gas-valvules.jpg",
            description:
                "Fallas en la localización exacta de fugas imperceptibles que comprometen la seguridad operativa.",
        },
        {
            icon: ChartIcon2,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-500",
            title: "Cuantificación de Impacto",
            image: "/images/deteccion-gas/charts_ai.jpg",
            description:
                "Dificultad técnica para medir el volumen real de emisiones perdidas y su costo económico.",
        },
        {
            icon: HistoryIcon,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-500",
            title: "Trazabilidad Reparación",
            image: "/images/deteccion-gas/technical_reviewing_ai.jpg",
            description:
                "Falta de seguimiento histórico y re-inspección en el ciclo crítico de mantenimiento de activos.",
        },
        {
            icon: WarningIcon,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-500",
            title: "Reportes No Conformantes",
            image: "/images/deteccion-gas/report_ai.jpg",
            description:
                "Alto riesgo de sanciones por auditorías de ASEA ante informes incompletos o mal documentados.",
        },
    ];

export default function GasDetectionChallenges() {
    return (
        <section className="relative bg-gray-100 text-black py-24 px-10 lg:px-24 border-t border-gray-100">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-150 h-150 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-primary/10 blur-3xl" />
            </div>
            <p className="text-center font-bold text-secondary tracking-widest text-sm uppercase mb-4">
                Desafíos Críticos
            </p>
            <h2 className="font-bold text-center text-3xl lg:text-5xl text-black mb-16 max-w-2xl mx-auto leading-tight">
                Identificamos los riesgos que amenazan su cumplimiento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-8xl mx-auto">
                {challenges.map(({ title, description, image }) => (
                    <div
                        key={title}
                        className="group bg-white/40 border border-gray-100 hover:border-secondary/30 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg"
                    >
                        <div className="relative w-full h-60 overflow-hidden rounded-xl">
                            <Image
                                src={image}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                alt={`Imagen de ${title}`}
                            />
                        </div>
                        <h3 className="font-bold text-black text-xl">{title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
