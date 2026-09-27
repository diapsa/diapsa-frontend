import type { Metadata } from "next";

import PageHeader from "@/components/organisms/PageHeader";
import PaginaMonitoreo from "@/components/organisms/PaginaMonitoreo";
import MCFaq from "@/components/organisms/MCFaq";
import MCCtaFinal from "@/components/organisms/MCCtaFinal";

const OG_IMAGE = "/images/og-images/og-image-monitoreo-condicion.jpg";

export const metadata: Metadata = {
    title: "Monitoreo de Condición: Vibraciones, Termografía y Ultrasonido",
    description:
        "Detecta fallas antes del paro con termografía, vibraciones, ultrasonido, análisis de aceite y estudios eléctricos. Medimos con tus equipos en operación.",
    keywords: [
        "monitoreo de condición industrial",
        "mantenimiento predictivo México",
        "termografía infrarroja industrial",
        "análisis de vibraciones",
        "ultrasonido industrial",
        "diagnóstico de maquinaria",
        "estudios eléctricos industriales",
        "prevención paros de producción",
    ],
    alternates: {
        canonical: "/servicios/monitoreo-condicion",
    },
    openGraph: {
        title: "Monitoreo de Condición | Grupo DIAPSA",
        description:
            "Consigue operación continua sin paros repentinos ni gastos innecesarios. Más de 20 años protegiendo activos industriales.",
        url: "/servicios/monitoreo-condicion",
        type: "website",
        locale: "es_MX",
        siteName: "Grupo DIAPSA",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                type: "image/jpeg",
                alt: "Grupo DIAPSA - Monitoreo de Condición"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        site: "@grupodiapsa",
        creator: "@grupodiapsa",
        title: "Grupo DIAPSA | Monitoreo de Condición",
        description:
            "Mantenimiento predictivo, monitoreo de condición y servicios de mantenimiento industrial para Mexico y Sudamérica.",
        images: [OG_IMAGE],
    },
};

export default function MonitoreoConditionPage() {
    return (
        <main>
            <PageHeader
                title="Monitoreo de Condición"
                subtitle="Operación continua sin paros repentinos ni gastos innecesarios. Conoce el estado real de tus equipos."
                breadcrumbs={[
                    { label: "Inicio", link: "/" },
                    { label: "Servicios", link: "/servicios" },
                    { label: "Monitoreo de Condición", link: "/servicios/monitoreo-condicion" },
                ]}
            />

            <PaginaMonitoreo />
            <MCFaq />
            <MCCtaFinal />
        </main>
    );
}

