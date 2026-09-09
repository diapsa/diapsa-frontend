import PageHeader from "@/components/organisms/PageHeader"
import StageCard from "@/components/molecules/StageCard"
import { PlusCircleIcon, ChartIcon, ChartIcon2, WindowIcon, DoubleCircleIcon } from '@/components/atoms/icons/'
import Image from "next/image";
import { Metadata } from "next";
import ContactForm from "@/components/organisms/ContactForm";

const OG_IMAGE = "/images/og-images/og-image-diapsa-start.jpg";

export const metadata: Metadata = {
    title: "DIAPSA START: Implementa Monitoreo de Condición en tu Planta",
    description: "¿Tu planta todavía apaga incendios? DIAPSA START implementa el monitoreo de condición paso a paso: diagnóstico, mediciones, capacitación y gestión de datos.",
    keywords: [
        "DIAPSA START",
        "monitoreo de condición desde cero",
        "mantenimiento predictivo",
        "capacitación técnica en planta",
        "diagnóstico situacional",
    ],
    alternates: {
        canonical: "/servicios/diapsa-start",
    },
    openGraph: {
        title: "DIAPSA START | Grupo DIAPSA",
        description: "Programa estructurado para construir capacidades de mantenimiento predictivo y tomar control de los activos industriales.",
        url: "/servicios/diapsa-start",
        type: "website",
        locale: "es_MX",
        siteName: "Grupo DIAPSA",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                type: "image/jpeg",
                alt: "DIAPSA START Grupo DIAPSA",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@grupodiapsa",
        title: "DIAPSA START | Grupo DIAPSA",
        description: "Programa para iniciar o fortalecer el monitoreo de condición de manera ordenada.",
        images: [OG_IMAGE],
    },
};

const stages = [
    {
        number: 1,
        label: "Etapa 01",
        icon: <DoubleCircleIcon className="text-secondary w-8 h-8" />,
        image: "/images/diapsa-start/cap-tecnica.jpeg",
        title: "Formación técnica aplicada",
        content: "Capacitación teórica y práctica directamente en planta para asegurar la transferencia de conocimiento real",
    },
    {
        number: 2,
        label: "Etapa 02 (core)",
        icon: <WindowIcon className="text-secondary w-8 h-8" />,
        image: "/images/diagnostico-situacional/d-situacional.jpg",
        title: "Diagnóstico situacional",
        content: [
            "Levantamiento de datos técnicos",
            "Revisión de manuales de fabricante",
            "Historial de fallas críticas",
            "Definición de KPIs estratégicos",
        ],
        featured: true,
    },
    {
        number: 3,
        label: "Etapa 03",
        icon: <ChartIcon className="text-secondary w-8 h-8" />,
        image: "/images/diapsa-start/medic-diapsa.jpg",
        title: "Mediciones",
        content: "Recolección de datos de alta precisión y confiabilidad para establecer líneas de operación certificadas.",
    },
    {
        number: 4,
        label: "Etapa 04",
        icon: <ChartIcon2 className="text-secondary w-8 h-8" />,
        image: "/images/diagnostico-situacional/creacion-reportes.jpg",
        title: "Gestión de datos",
        quote: "LO QUE NO SE MIDE, NO SE CONTROLA",
        content: "Transformamos datos complejos en decisiones estratégicas basadas en evidencia industrial.",
    },
];

const breadCrumbs = [
    { label: "Inicio", link: "/" },
    { label: "Servicios", link: "/servicios" },
    { label: "DIAPSA START", link: "/servicios/diapsa-start" }
];

export default function DiapsaStart() {
    return (
        <main className="">
            <PageHeader
                title="DIAPSA START"
                subtitle="Monitoreo de Condición desde cero o fortalecerlo de manera ordenada"
                breadcrumbs={breadCrumbs}
            />

            <section className="w-full bg-white py-16 lg:py-24 relative overflow-hidden">
                {/* Glow primary difuminado */}
                <div className="absolute -top-32 -left-32 w-125 h-125 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                {/* Glow secondary difuminado */}
                <div className="absolute -bottom-24 -right-24 w-100 h-100 bg-secondary/6 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Header */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight">
                                    Aprender haciendo. <br />
                                    Construir capacidades. <br />
                                    <span className="text-secondary">Tomar control de los activos.</span>
                                </h2>
                            </div>

                            <p className="text-tertiary text-lg leading-relaxed">
                                El programa DIAPSA Start trasciende la simple instalación técnica. Es una transformación
                                estructural en la cultura de mantenimiento, diseñada para empresas que demandan una estrategia
                                de predictibilidad sólida y robusta.
                            </p>


                        </div>
                        <div className="relative">
                            <div className="relative aspect-4/3 rounded-sm overflow-hidden shadow-xl">
                                <Image
                                    src="/images/gallery/campo-img-1.jpg"
                                    alt="Monitoreo continuo en planta industrial IA"
                                    fill
                                    className="object-cover"
                                />
                                {/* Badge flotante */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-sm p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <p className="flex items-center gap-3 text-primary text-lg">
                                            <PlusCircleIcon className="w-10 h-10 text-secondary shrink-0" />
                                            Acompañamiento integral
                                        </p>
                                    </div>

                                </div>
                            </div>
                            {/* Elementos decorativos */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/10 rounded-full -z-10" />
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full -z-10" />
                        </div>

                    </div>

                </div>
            </section>
            {/* Cards de etapas */}
            <section className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">

                    {/* Header de la sección */}
                    <div className="text-center max-w-3xl mx-auto space-y-4">

                        <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
                            Del caos reactivo al{" "}
                            <span className="text-secondary">control total.</span>
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed">
                            No es un servicio puntual. Es un método probado en planta que transforma cómo su equipo
                            entiende, mide y actúa sobre sus activos — etapa por etapa, sin atajos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {stages.map((stage) => (
                            <StageCard key={stage.number} {...stage} />
                        ))}
                    </div>
                </div>
            </section>
            <ContactForm />
        </main>
    )
}
