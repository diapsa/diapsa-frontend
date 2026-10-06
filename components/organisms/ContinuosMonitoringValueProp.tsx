import Button from "@/components/atoms/Button";
import Link from "next/link";
import Image from "next/image";

const services = [
    "Diagnóstico Situacional",
    "Medición Técnica",
    "Configuración a la Medida",
    "Análisis Remoto",
];

export default function ContinuosMonitoringValueProp() {
    return (
        <section className="bg-primary py-16 lg:py-24 relative overflow-hidden">
            {/* Glow principal */}
            <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
            {/* Glow secundario */}
            <div className="absolute bottom-0 right-0 w-100 h-100 bg-primary/40 rounded-full blur-2xl pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Texto */}
                    <div className="space-y-8">
                        <span className="inline-block text-secondary font-semibold text-xs tracking-widest uppercase">
                            No vendemos sensores
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                            Diseñamos{" "}
                            <span className="text-secondary italic">
                                programas de monitoreo
                            </span>{" "}
                            que convierten datos en decisiones.
                        </h2>
                        <p className="text-lg text-white/70 leading-relaxed">
                            Muchas plantas creen que instalar sensores equivale a tener
                            monitoreo continuo. En la práctica, lo que tienen es un flujo
                            constante de señales sin estructura para convertirlas en
                            decisiones. Esto genera frustración, costos hundidos y una
                            falsa sensación de control.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {services.map((s) => (
                                <div
                                    key={s}
                                    className="flex items-center gap-3 p-4 text-white rounded-sm border border-secondary/25"
                                >
                                    <span className="w-2.5 h-2.5 bg-secondary rounded-full shrink-0 shadow-sm" />
                                    <p className="text-sm font-semibold text-white">{s}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link href="/contacto?motivo=servicios">
                                <Button variant="secondary" className="px-8 py-3 text-base">
                                    Solicitar informes
                                </Button>
                            </Link>
                            <Link href="#soluciones">
                                <Button
                                    variant="primary"
                                    ghost
                                    ghostVariant="light"
                                    className="px-8 py-3 text-base border-white text-white hover:border-secondary hover:text-secondary"
                                >
                                    Ver soluciones
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Imagen */}
                    <div className="relative">
                        <div className="relative aspect-4/3 rounded-sm overflow-hidden shadow-2xl">
                            <Image
                                src="/images/monitoreo-continuo/factory.jpeg"
                                alt="Monitoreo continuo en planta industrial IA"
                                fill
                                className="object-cover"
                            />
                            {/* Badge flotante */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-sm p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shrink-0" />
                                    <p className="text-sm font-semibold text-primary">
                                        Sistema de monitoreo activo
                                    </p>
                                </div>
                                <p className="text-xs text-tertiary mt-1">
                                    Análisis en tiempo real · Diagnóstico continuo
                                </p>
                            </div>
                        </div>
                        {/* Elementos decorativos */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/10 rounded-full -z-10" />
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
