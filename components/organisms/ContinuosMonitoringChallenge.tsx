import Image from "next/image";
import NumberedCard from "@/components/molecules/NumberedCard";

const problems = [
    {
        number: "01",
        label: "Fatiga de alertas por configuración genérica",
        description:
            "Umbrales estándar (ISO 10816/20816) aplicados sin considerar el régimen operativo de cada equipo generan cientos de falsas alarmas. El personal deja de confiar en el sistema.",
    },
    {
        number: "02",
        label: "Instalación deficiente sin Especialistas en Vibraciones",
        description:
            "Sensores mal montados producen datos sesgados. La planta toma decisiones con señales contaminadas o no detecta fallas reales. En ambos casos, la conclusión interna es que la tecnología no sirve.",
    },
    {
        number: "03",
        label: "Sin capacidad de análisis",
        description:
            "Se compran sensores sin comprar capacidad de diagnóstico. No hay quién revise tendencias, diagnostique, priorice por riesgo ni dé seguimiento. Los datos se acumulan sin acción.",
    },
    {
        number: "04",
        label: "Información fragmentada",
        description:
            "La historia del activo vive en 5-7 sistemas que no se comunican: plataforma del proveedor, SAP, Excel, PDF, CMMS, correos, WhatsApp. Sin trazabilidad no hay mejora continua.",
    },
];

export default function ContinuosMonitoringChallenge() {
    return (
        <section className="bg-gray-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Intro del reto */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
                    {/* Imagen */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/monitoreo-continuo/motor.jpg"
                                alt="Equipo industrial con sensores. IA"
                                fill
                                className="object-cover bg-gray-100"
                            />
                        </div>
                        {/* Tag decorativo */}
                        <div className="absolute -top-4 -right-4 bg-secondary text-white text-xs font-bold px-4 py-2 rounded-full shadow-md rotate-3">
                            El problema real
                        </div>
                    </div>

                    {/* Texto */}
                    <div className="order-1 lg:order-2 space-y-6">
                        <span className="inline-block text-secondary font-semibold text-xs tracking-widest uppercase border border-secondary/40 bg-secondary/5 px-4 py-2 rounded-full">
                            Entendamos el reto
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">
                            Los sensores no son la solución universal.
                        </h2>
                        <p className="text-lg text-primary/70 leading-relaxed">
                            El problema comienza desde el enfoque comercial: se vende
                            sensorización como receta universal. Se instrumentan equipos sin
                            haber definido criticidad, modos de falla, condiciones de
                            operación, impacto en seguridad/producción/costo ni el retorno
                            esperado por activo.
                        </p>
                        <p className="text-lg text-primary/70 leading-relaxed">
                            El resultado es un programa que nace mal: con mala selección,
                            expectativas infladas y sin ruta de escalamiento.
                        </p>
                    </div>
                </div>

                {/* Tarjetas de retos */}
                <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-3 text-center">
                        Retos más comunes en empresas con sensores instalados
                    </h3>
                    <p className="text-center text-tertiary mb-10 max-w-2xl mx-auto">
                        ¿Te suena familiar alguno de estos escenarios? Son más comunes de
                        lo que parece.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {problems.map((p) => (
                            <NumberedCard
                                key={p.number}
                                number={p.number}
                                label={p.label}
                                description={p.description}
                                variant="light"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
