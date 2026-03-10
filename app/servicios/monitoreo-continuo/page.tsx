import PageHeader from "@/components/organisms/PageHeader";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import ContactForm from "@/components/organisms/ContactForm";
import Image from "next/image";

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

const solutions = [
    {
        number: "01",
        label: "Diagnóstico Situacional o Certificación de Continuidad Operativa",
        description:
            "Auditoría de la base instalada (qué sensores hay, dónde, en qué estado), revisión de criticidad, evaluación de calidad de instalación, análisis de la tasa de falsas alarmas y mapeo del flujo de trabajo actual (dato → decisión → acción).",
    },
    {
        number: "02",
        label: "Medición Técnica",
        description:
            "Corrección de instalaciones deficientes, reubicación de sensores en puntos correctos, retiro de instrumentación en activos que no la justifican, adición de sensores en activos críticos descubiertos, y nueva línea base donde sea necesario.",
    },
    {
        number: "03",
        label: "Reconfiguración",
        description:
            "Partimos del sistema existente con historial. Aprovechamos los datos históricos para calibrar umbrales con evidencia real y reducir de forma medible la tasa de falsas alarmas.",
    },
    {
        number: "04",
        label: "Análisis Remoto",
        description:
            "Analistas certificados operando el sistema con diagnósticos reales, seguimiento al cierre, ajuste continuo y capacitación progresiva al equipo interno.",
    },
];

const services = [
    "Diagnóstico Situacional",
    "Medición Técnica",
    "Configuración a la Medida",
    "Análisis Remoto",
];

const stats = [
    { value: "22+", label: "Años de experiencia" },
    { value: "500+", label: "Activos monitoreados" },
    { value: "95%", label: "Reducción de falsas alarmas" },
    { value: "24/7", label: "Monitoreo continuo" },
];

export default function ContinuosMonitoringPage() {
    return (
        <main>
            <PageHeader
                title="Monitoreo Continuo"
                subtitle="Transformamos señales en decisiones, decisiones en resultados"
                breadcrumbs={[
                    { label: "Inicio", link: "/" },
                    { label: "Servicios", link: "/servicios" },
                    { label: "Monitoreo Continuo", link: "/servicios/monitoreo-continuo" },
                ]}
            />

            {/* ── Propuesta de Valor ── */}
            <section className="bg-primary/4 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Texto */}
                        <div className="space-y-8">
                            <span className="inline-block text-secondary font-semibold text-xs tracking-widest uppercase border border-secondary/40 bg-secondary/5 px-4 py-2 rounded-full">
                                No vendemos sensores
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                                Diseñamos{" "}
                                <span className="text-secondary italic">
                                    programas de monitoreo
                                </span>{" "}
                                que convierten datos en decisiones.
                            </h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
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
                                        className="flex items-center gap-3 p-4 text-white rounded-lg border-2 border-secondary/25 shadow-sm"
                                    >
                                        <span className="w-2.5 h-2.5 bg-secondary rounded-full shrink-0 shadow-sm" />
                                        <p className="text-sm font-semibold text-white">{s}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link href="#contacto">
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
                            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/monitoreo-continuo/factory-image.jpg"
                                    alt="Monitoreo continuo en planta industrial IA"
                                    fill
                                    className="object-cover"
                                />
                                {/* Badge flotante */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
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

            {/* ── Métricas ── */}
            <section className="bg-primary py-12 border-y-4 border-secondary">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-4xl lg:text-5xl font-black text-secondary">
                                    {stat.value}
                                </p>
                                <p className="text-white/70 text-sm mt-1 tracking-wide">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── El Reto ── */}
            <section className="bg-gray-50 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Intro del reto */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
                        {/* Imagen placeholder */}
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
                                <div
                                    key={p.number}
                                    className="bg-white rounded-xl p-8 border border-gray-100 border-t-4 border-t-secondary/30 hover:border-t-secondary shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start gap-5">
                                        <span className="text-5xl font-black text-secondary/30 group-hover:text-secondary/60 transition-colors leading-none select-none">
                                            {p.number}
                                        </span>
                                        <div className="space-y-2 pt-1">
                                            <p className="font-bold text-base text-primary">
                                                {p.label}
                                            </p>
                                            <p className="text-tertiary text-sm leading-relaxed">
                                                {p.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Soluciones ── */}
            <section id="soluciones" className="bg-primary/4 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Encabezado */}
                    <div className="text-center mb-16 space-y-4">
                        <span className="inline-block text-secondary font-semibold text-xs tracking-widest uppercase border border-secondary/40 bg-secondary/5 px-4 py-2 rounded-full">
                            Nuestro enfoque
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white">
                            Soluciones
                        </h2>
                    </div>

                    {/* Rescate y Optimización */}
                    <div className="mb-20">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                            <div className="flex-1 bg-primary/5 border-l-4 border-secondary rounded-r-xl px-6 py-4">
                                <p className="text-xs font-semibold text-secondary tracking-widest uppercase mb-1">
                                    Para empresas con sensores instalados
                                </p>
                                <h3 className="text-xl font-bold text-white">
                                    Rescate y Optimización de Programa de Monitoreo
                                </h3>
                            </div>
                        </div>
                        <p className="text-lg text-gray-300 mb-10 max-w-3xl">
                            Si ya invertiste en sensorización pero el programa no está
                            entregando valor, el problema no fue la tecnología. Fue el
                            proceso. Diagnosticamos tu programa, lo remediamos y lo ponemos
                            a generar valor real.
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {solutions.map((s) => (
                                <div
                                    key={s.number}
                                    className="relative overflow-hidden rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-all group bg-primary"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                                    <div className="p-8 pl-10">
                                        <div className="flex items-start gap-5">
                                            <span className="text-5xl font-black text-secondary/30 group-hover:text-secondary/60 transition-colors leading-none shrink-0 select-none">
                                                {s.number}
                                            </span>
                                            <div className="space-y-2 pt-1">
                                                <p className="font-bold text-base text-white">
                                                    {s.label}
                                                </p>
                                                <p className="text-white/60 text-sm leading-relaxed">
                                                    {s.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desde cero */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center bg-primary rounded-2xl p-10 lg:p-14">
                        <div className="space-y-6">
                            <div className="bg-white/10 border-l-4 border-secondary rounded-r-xl px-6 py-4">
                                <p className="text-xs font-semibold text-secondary tracking-widest uppercase mb-1">
                                    Para empresas sin monitoreo
                                </p>
                                <h3 className="text-xl font-bold text-white">
                                    Implementación desde cero
                                </h3>
                            </div>
                            <p className="text-lg text-white/75 leading-relaxed">
                                Si vas a dar el paso hacia el monitoreo continuo, hazlo bien
                                desde el inicio. Entregamos un programa completo —
                                ingeniería, instalación, configuración y operación — no solo
                                hardware.
                            </p>
                            <Link href="#contacto">
                                <Button variant="secondary" className="px-8 py-3 text-base">
                                    Hablar con un especialista
                                </Button>
                            </Link>
                        </div>
                        {/* Imagen placeholder */}
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center">
                            <Image
                                src="/images/monitoreo-continuo/sensor-installation.jpg"
                                alt="Especialistas en instalación de sensores. IA"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="relative min-h-screen bg-primary py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/images/monitoreo-continuo/fondo-mantenimiento.jpg"
                        alt="Decorativo (se usa al 20% de opacidad como textura de fondo)"
                        fill
                        className="object-cover"
                    />
                </div>
                {/* Línea decorativa */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
                    <span className="inline-block text-secondary font-semibold text-sm tracking-widest uppercase border border-secondary/40 px-8 py-4 rounded-full">
                        ¿Listo para empezar?
                    </span>
                    <h2 className="text-3xl lg:text-7xl font-bold text-white leading-tight">
                        Convierte tus datos en{" "}
                        <span className="text-secondary">decisiones reales</span>
                    </h2>
                    <p className="text-2xl lg:text-3xl text-white/75 max-w-2xl mx-auto">
                        Nuestros especialistas están listos para diagnosticar tu programa y
                        diseñar la solución correcta para tu planta.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link href="#contacto">
                            <Button variant="secondary" className="px-10 py-4 text-lg">
                                Solicitar diagnóstico
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />
            </section>

            <section id="contacto">
                <ContactForm />
            </section>
        </main>
    );
}
