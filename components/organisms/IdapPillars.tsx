import { tabs } from '@/data/idap.json';
import {
    VisibilityIcon,
    ChartIcon2,
    HistoryIcon
} from "@/components/atoms/icons";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
    visualiza: VisibilityIcon,
    reportes: ChartIcon2,
    historial: HistoryIcon,
};

const pillarsOrder = ["visualiza", "reportes", "historial"];

export default function IdapPillars() {
    const ordered = pillarsOrder.map((id) => tabs.find((t) => t.id === id)!);

    return (
        <section id="plataforma" className="relative bg-primary py-20 lg:py-32 overflow-hidden">
            {/* Grid de fondo sutil */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fc9f01 1px, transparent 1px), linear-gradient(90deg, #fc9f01 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12 space-y-16">

                {/* Encabezado de sección */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5">
                        <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                            ¿Qué hace IDAP?
                        </span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Tres capacidades que transforman{" "}
                        <span className="text-secondary">datos en decisiones</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        IDAP no es un repositorio pasivo de datos. Es un sistema activo que convierte los resultados de las inspecciones de DIAPSA en inteligencia operativa lista para actuar.
                    </p>
                </div>

                {/* Pilares */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {ordered.map((tab, i) => {
                        const Icon = iconMap[tab.id];
                        return (
                            <div
                                key={tab.id}
                                className="group relative bg-white/5 border border-white/10 hover:border-secondary/40 rounded-2xl p-8 space-y-6 transition-all duration-300 hover:bg-white/8"
                            >
                                {/* Número */}
                                <span className="absolute top-6 right-6 text-6xl font-black text-white/5 select-none group-hover:text-secondary/10 transition-colors duration-300">
                                    0{i + 1}
                                </span>

                                {/* Icono */}
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/15 border border-secondary/30">
                                    {Icon && <Icon className="w-7 h-7 text-secondary" />}
                                </div>

                                {/* Título */}
                                <h3 className="text-xl font-bold text-white uppercase leading-tight pr-8">
                                    {tab.title}
                                </h3>

                                {/* Descripción */}
                                <p className="text-gray-400 text-base leading-relaxed">
                                    {tab.text[0]}
                                </p>

                                {/* Línea inferior decorativa */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-secondary/0 to-transparent group-hover:via-secondary/40 transition-all duration-500 rounded-b-2xl" />
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
