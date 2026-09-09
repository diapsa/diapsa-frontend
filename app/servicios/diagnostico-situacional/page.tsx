import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { ComponentType } from "react";
import BackgroundImage from "@/components/atoms/BackgroundImage";
import PageHeader from "@/components/organisms/PageHeader";
import {
    ArrowRightIcon,
    CheckCircleIcon,
    HistoryIcon,
    SettingsIcon,
    ThermometerIcon,
    VibrationIcon
} from "@/components/atoms/icons";

const OG_IMAGE = "/images/og-images/og-image-diagnostico-situacional.jpg";

type IconComponent = ComponentType<{ className?: string }>;

export const metadata: Metadata = {
    title: "Diagnóstico Situacional de Maquinaria Industrial",
    description:
        "Conoce el estado real de tus activos industriales con un análisis exhaustivo realizado por especialistas. El punto de partida de todo programa de mantenimiento predictivo eficiente.",
    keywords: [
        'análisis predictivo',
        'análisis de equipos',
        'historial de salud de maquinaria',
    ],
    alternates: {
        canonical: "/servicios/diagnostico-situacional",
    },
    openGraph: {
        title: "Diagnóstico Situacional | Grupo DIAPSA",
        description:
            "Mas de 22 años en análisis exhaustivo de activos industriales para predecir fallas antes de que ocurran.",
        url: "/servicios/diagnostico-situacional",
        type: "website",
        locale: "es_MX",
        siteName: "Grupo DIAPSA",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                type: "image/jpeg",
                alt: "Diagnóstico Situacional Grupo DIAPSA",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@grupodiapsa",
        title: "Diagnóstico Situacional | Grupo DIAPSA",
        description:
            "Conoce el estado real de tus activos industriales con un análisis exhaustivo realizado por especialistas.",
        images: [OG_IMAGE],
    },
};

const painPoints = [
    {
        // TODO: Replace with a photo showing an unexpected equipment failure / unplanned downtime
        image: "/images/diagnostico-situacional/fallas-en-maquinaria-industrial.jpg",
        title: "¿Sabes cuándo fallará tu equipo?",
        description:
            "Sin un historial documentado, cada falla es una sorpresa. Los paros no programados cuestan entre 3 y 8 veces más que el mantenimiento preventivo.",
    },
    {
        // TODO: Replace with a photo of scattered paper reports, spreadsheets or disorganized records
        image: "/images/diagnostico-situacional/report-production.jpg",
        title: "Registros dispersos o inexistentes",
        description:
            "La mayoría de las plantas tienen datos valiosos atrapados en hojas de cálculo, reportes en papel o en la memoria del técnico más antiguo.",
    },
    {
        // TODO: Replace with a photo of a technician repairing machinery reactively
        image: "/images/servicios/placeholder.jpg",
        title: "Mantenimiento reactivo perpetuo",
        description:
            "Sin una línea base de referencia, el equipo de mantenimiento siempre opera en modo apagafuegos, nunca en modo preventivo.",
    },
];

const steps = [
    {
        number: "01",
        // TODO: Replace with a photo of a technician recording equipment data / nameplate
        image: "/images/diagnostico-situacional/analisis-resultados.png",
        title: "Inventario y clasificación de activos",
        description:
            "Registramos cada equipo crítico: placa de datos, historial de reparaciones, antigüedad y condiciones de operación actuales.",
    },
    {
        number: "02",
        // TODO: Replace with a photo of vibration analysis or thermography inspection in progress
        image: "/images/diagnostico-situacional/tecnico-termografo.jpg",
        title: "Medición de condición base",
        description:
            "Aplicamos técnicas de inspección predictiva — vibraciones, termografía, ultrasonido — para establecer el estado de salud inicial de cada activo.",
    },
    {
        number: "03",
        // TODO: Replace with a photo of analysts reviewing data on screens / software
        image: "/images/diagnostico-situacional/interpretacion-de-resultados.png",
        title: "Análisis e interpretación",
        description:
            "Nuestros especialistas correlacionan los datos para detectar anomalías existentes, riesgos latentes y tendencias de deterioro.",
    },
    {
        number: "04",
        // TODO: Replace with a photo of an engineer presenting a report to a client
        image: "/images/diagnostico-situacional/creacion-reportes.jpg",
        title: "Reporte y hoja de ruta",
        description:
            "Entregamos un informe ejecutivo con prioridades de intervención, recomendaciones de acción y el punto de partida para su programa predictivo.",
    },
];

const benefits = [
    {
        kpi: "+80%",
        label: "Predictibilidad de fallas",
        description: "Con historial documentado, los algoritmos y analistas pueden anticipar el comportamiento futuro de cada equipo.",
    },
    {
        kpi: "Día 1",
        label: "Línea base establecida",
        description: "Desde el primer diagnóstico tienes una referencia objetiva para medir la evolución de cada activo a lo largo del tiempo.",
    },
    {
        kpi: "ROI",
        label: "Justificación de inversión",
        description: "El reporte incluye criticidad y prioridad de intervención, lo que permite asignar presupuesto donde más impacta.",
    },
];

const medicalComparison: Array<{
    medico: string;
    industrial: string;
    MedicalIcon: IconComponent;
    IndustrialIcon: IconComponent;
}> = [
        {
            medico: "Historial clínico del paciente",
            industrial: "Historial del activo industrial",
            MedicalIcon: HistoryIcon,
            IndustrialIcon: HistoryIcon,
        },
        {
            medico: "Signos vitales (presión, temperatura)",
            industrial: "Variables de condición (vibración, temperatura, ultrasonido)",
            MedicalIcon: ThermometerIcon,
            IndustrialIcon: VibrationIcon,
        },
        {
            medico: "Diagnóstico y plan de tratamiento",
            industrial: "Reporte con prioridades de intervención",
            MedicalIcon: CheckCircleIcon,
            IndustrialIcon: CheckCircleIcon,
        },
        {
            medico: "Consultas de seguimiento periódicas",
            industrial: "Monitoreo de condición continuo o periódico",
            MedicalIcon: HistoryIcon,
            IndustrialIcon: SettingsIcon,
        },
    ];

export default function DiagnosticoSituacionalPage() {
    return (
        <main>
            {/* 1. Headline magnético */}
            <PageHeader
                title="Diagnóstico Situacional"
                subtitle="El historial médico de tus activos industriales — el punto de partida de todo programa predictivo eficiente"
                breadcrumbs={[
                    { label: "Inicio", link: "/" },
                    { label: "Servicios", link: "/servicios" },
                    { label: "Diagnóstico Situacional", link: "/servicios/diagnostico-situacional" },
                ]}
            />

            {/* 2. ¿Qué es? — Intro hero (bg-white, light glow) */}
            <section className="w-full bg-white py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-125 h-125 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-100 h-100 bg-secondary/6 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Texto */}
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-6">
                                EL ANÁLISIS INICIAL QUE{" "}
                                <span className="text-secondary">CAMBIA TODO</span>
                            </h2>
                            <p className="text-tertiary text-base lg:text-lg leading-relaxed mb-6">
                                El Diagnóstico Situacional es un análisis exhaustivo de tus activos
                                industriales realizado por analistas especializados. Documentamos el
                                estado actual, el historial de cada equipo y los patrones de
                                comportamiento para establecer la <strong className="text-primary">línea base</strong> de
                                tu programa de mantenimiento predictivo.
                            </p>
                            <p className="text-tertiary text-base lg:text-lg leading-relaxed">
                                Sin esta fotografía inicial, cualquier programa predictivo opera a ciegas.
                                Con ella, cada decisión de mantenimiento está respaldada por datos reales.
                            </p>
                        </div>
                        {/* Imagen con KPIs superpuestos */}
                        {/* TODO: Replace placeholder with a photo of specialists performing an on-site assessment */}
                        <div className="relative rounded-sm overflow-hidden shadow-xl">
                            <div className="relative w-full h-105">
                                <Image
                                    src="/images/diagnostico-situacional/engineer-checking-machinery.webp"
                                    alt="Especialistas realizando diagnóstico situacional en planta industrial"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-primary/30" />
                            </div>
                            {/* KPI badges superpuestos */}
                            <div className="absolute bottom-0 left-0 right-0 bg-primary/80 backdrop-blur-sm p-5 flex flex-col sm:flex-row gap-4 justify-around border-t-2 border-secondary">
                                {[
                                    { value: "+20 años", label: "Experiencia" },
                                    { value: "100%", label: "Reportes con prioridad" },
                                    { value: "Día 1", label: "Línea base documentada" },
                                ].map((item) => (
                                    <div key={item.label} className="text-center">
                                        <span className="block text-2xl font-extrabold text-secondary">
                                            {item.value}
                                        </span>
                                        <span className="block text-xs uppercase tracking-wider text-white/80 mt-0.5">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. El problema — Pain points (bg-gray-50) */}
            <section className="w-full bg-gray-50 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-4">
                            ¿REALMENTE <span className="text-secondary">CONOCES</span> TUS ACTIVOS?
                        </h2>
                        <p className="text-tertiary text-lg max-w-2xl mx-auto">
                            Conocer el nombre de tus equipos no es lo mismo que conocer su historia.
                            La mayoría de las plantas operan con esta brecha crítica de información.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {painPoints.map((point) => {

                            return (
                                <div
                                    key={point.title}
                                    className="group relative flex flex-col bg-white rounded-sm border border-gray-100 hover:border-secondary/40 hover:shadow-xl overflow-hidden transition-all duration-300"
                                >
                                    {/* Imagen de card */}
                                    <div className="relative w-full h-48 overflow-hidden">
                                        <Image
                                            src={point.image}
                                            alt={point.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-primary/50 group-hover:bg-primary/30 transition-colors duration-300" />

                                    </div>
                                    <div className="flex-1 p-6">
                                        <h3 className="font-bold text-primary text-base leading-snug mb-2 group-hover:text-secondary transition-colors">
                                            {point.title}
                                        </h3>
                                        <p className="text-tertiary text-sm leading-relaxed">
                                            {point.description}
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* 4. Analogía médica — storytelling central (bg-primary, dark glow) */}
            <section className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-100 h-100 bg-primary/40 rounded-full blur-2xl pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Quote / Analogía */}
                        <div>
                            <span className="inline-block text-secondary text-xs font-semibold tracking-widest uppercase ">
                                La analogía que lo explica todo
                            </span>
                            <blockquote className="border-l-2 border-secondary pl-6 mb-8">
                                <p className="text-white text-xl lg:text-2xl font-bold leading-snug italic mb-3">
                                    &quot;Un médico sin expediente clínico está adivinando. Un técnico sin historial de equipo también.&quot;
                                </p>
                                <cite className="text-white/60 text-sm not-italic">
                                    — Principio fundamental del mantenimiento predictivo
                                </cite>
                            </blockquote>
                            <p className="text-white/70 text-base lg:text-lg leading-relaxed mb-8">
                                Así como los médicos diagnostican a sus pacientes apoyándose en su
                                historial clínico, el mantenimiento predictivo funciona exactamente
                                igual: <strong className="text-white">entre más historial tiene un activo, más
                                    predecible es su comportamiento</strong>. El Diagnóstico Situacional
                                construye esa línea de tiempo desde el primer día.
                            </p>
                            {/* Comparación médico vs industrial */}
                            <div className="space-y-3">
                                {medicalComparison.map(({ medico, industrial, MedicalIcon, IndustrialIcon }, i) => (
                                    <div key={i} className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-start gap-2 bg-white/10 border border-white/15 hover:border-secondary/50 rounded-sm px-4 py-3 text-white/80 transition-all duration-300">
                                            <MedicalIcon className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                                            <span>{medico}</span>
                                        </div>
                                        <div className="flex items-start gap-2 bg-white/10 border border-white/15 hover:border-secondary/50 rounded-sm px-4 py-3 text-white/80 transition-all duration-300">
                                            <IndustrialIcon className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                                            <span>{industrial}</span>
                                        </div>
                                    </div>
                                ))}
                                <p className="text-white/50 text-xs uppercase tracking-wider pt-2">
                                    Medicina preventiva ↔ Mantenimiento predictivo
                                </p>
                            </div>
                        </div>
                        {/* Imagen — lado derecho */}
                        {/* TODO: Replace placeholder with a split photo: doctor reviewing patient chart (left half) / technician inspecting motor (right half), or a single industrial inspection photo */}
                        <div className="relative rounded-sm overflow-hidden shadow-2xl border border-white/10">
                            <div className="relative w-full h-130">
                                <Image
                                    src="/images/diagnostico-situacional/analogia-medica.png"
                                    alt="Analogía médica — técnico inspeccionando activo industrial con herramientas predictivas"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-primary/40" />
                            </div>
                            {/* Badge sobre la imagen */}
                            <div className="absolute top-4 right-4 bg-secondary text-primary text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xs shadow-md">
                                +20 años de experiencia
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Proceso — Cómo funciona (bg-white, light glow) */}
            <section className="w-full bg-white py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-125 h-125 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-100 h-100 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-4">
                            PROCESO DE <span className="text-secondary">4 ETAPAS</span>
                        </h2>
                        <p className="text-tertiary text-lg max-w-2xl mx-auto">
                            Un proceso estructurado para capturar, analizar e interpretar el estado real
                            de cada activo crítico en tu planta.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="group relative flex flex-col bg-white rounded-sm border border-gray-100 hover:border-secondary/40 hover:shadow-xl overflow-hidden transition-all duration-300"
                            >
                                {/* Imagen de etapa */}
                                <div className="relative w-full h-80 overflow-hidden">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-300" />
                                    {/* Número de etapa superpuesto */}
                                    <span className="absolute bottom-3 left-4 text-5xl font-extrabold text-white/30 leading-none select-none">
                                        {step.number}
                                    </span>
                                </div>
                                {/* Contenido */}
                                <div className="p-6">
                                    <h3 className="font-bold text-primary text-base leading-snug mb-2 group-hover:text-secondary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-tertiary text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Beneficios (bg-gray-50) */}
            <section className="w-full bg-gray-50 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-4">
                            LO QUE OBTIENES CON UN{" "}
                            <span className="text-secondary">DIAGNÓSTICO</span>
                        </h2>
                        <p className="text-tertiary text-lg max-w-2xl mx-auto">
                            El diagnóstico no es un gasto — es la inversión que evita todos los demás
                            gastos inesperados.
                        </p>
                    </div>
                    {/* Imagen lateral + KPI cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-12">
                        {/* Imagen */}
                        {/* TODO: Replace placeholder with a photo of engineers reviewing diagnostic report with client in a meeting room */}
                        <div className="relative rounded-sm overflow-hidden shadow-xl min-h-85">
                            <Image
                                src="/images/diagnostico-situacional/report-review-with-client.jpg"
                                alt="Ingenieros revisando reporte de diagnóstico situacional con cliente industrial"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-primary/20" />
                            {/* Label superpuesto */}
                            <div className="absolute bottom-4 left-4 right-4 bg-primary/80 backdrop-blur-sm rounded-xs px-4 py-3 border-l-2 border-secondary">
                                <p className="text-white text-sm font-semibold leading-snug">
                                    &quot;El diagnóstico es el paso cero que hace posible todo lo demás.&quot;
                                </p>
                            </div>
                        </div>
                        {/* KPI cards */}
                        <div className="flex flex-col gap-4">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.label}
                                    className="group flex items-start gap-5 bg-white rounded-sm border border-gray-100 hover:border-secondary/30 shadow-sm hover:shadow-xl p-5 transition-all duration-300 relative overflow-hidden"
                                >
                                    <span className="text-3xl font-extrabold text-secondary shrink-0 leading-none">
                                        {benefit.kpi}
                                    </span>
                                    <div>
                                        <span className="block text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                                            {benefit.label}
                                        </span>
                                        <p className="text-tertiary text-sm leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bloque de refuerzo narrativo */}
                    <div className="bg-primary rounded-sm p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                        <div className="flex-1">
                            <h3 className="font-extrabold text-white text-xl lg:text-2xl mb-3">
                                Todo plan predictivo eficiente comienza con un{" "}
                                <span className="text-secondary">diagnóstico situacional</span>
                            </h3>
                            <p className="text-white/70 text-base leading-relaxed">
                                Sin una línea base no hay referencia. Sin referencia no hay tendencia.
                                Sin tendencia no hay predicción. El diagnóstico es el paso cero que
                                hace posible todo lo demás.
                            </p>
                        </div>
                        <Link
                            href="/servicios/monitoreo-condicion"
                            className="shrink-0 inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3 rounded-xs hover:bg-white hover:text-primary transition-all duration-300 shadow-md whitespace-nowrap"
                        >
                            Ver Monitoreo de Condición
                            <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. CTA Final (bg-primary, dark glow) */}
            {/* TODO: Replace placeholder with a photo of an industrial plant or field inspection — used as background */}
            <section className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
                <BackgroundImage
                    src="/images/servicios/placeholder.jpg"
                    alt="Diagnóstico situacional en planta industrial"
                    overlayOpacity={0.75}
                />
                <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                        AGENDA TU <span className="text-secondary">DIAGNÓSTICO SITUACIONAL</span>
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
                        En una sola visita, nuestros analistas establecen el punto de partida que
                        tu programa de mantenimiento predictivo necesita. Sin compromisos a largo plazo.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contacto"
                            className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3 rounded-xs hover:bg-white hover:text-primary transition-all duration-300 shadow-md"
                        >
                            Solicitar diagnóstico
                            <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/servicios"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-secondary font-semibold px-6 py-3 transition-colors duration-300"
                        >
                            Ver todos los servicios
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
