import PageHeader from "@/components/organisms/PageHeader";
// import ContactForm from "@/components/organisms/ContactForm";
import ContinuosMonitoringValueProp from "@/components/organisms/ContinuosMonitoringValueProp";
import ContinuosMonitoringStats from "@/components/organisms/ContinuosMonitoringStats";
import ContinuosMonitoringChallenge from "@/components/organisms/ContinuosMonitoringChallenge";
import ContinuosMonitoringSolutions from "@/components/organisms/ContinuosMonitoringSolutions";
import ContinuosMonitoringCta from "@/components/organisms/ContinuosMonitoringCta";
import ContinuosMonitoringTechnology from "@/components/organisms/ContinuosMonitoringTechnology";
import { Metadata } from "next";

const OG_IMAGE = "/images/og-images/og-image-monitoreo-continuo.jpg";

export const metadata: Metadata = {
    title: "Monitoreo Continuo",
    description: "Sensores que vigilan tus equipos las 24 horas y avisan antes de la falla. Monitoreo continuo con análisis remoto por especialistas de Grupo DIAPSA.",
    keywords: [
        "monitoreo continuo",
        "monitoreo 24/7",
        "sensores online",
        "análisis remoto",
        "mantenimiento predictivo",
        "activos industriales",
    ],
    alternates: {
        canonical: "/servicios/monitoreo-continuo",
    },
    openGraph: {
        title: "Monitoreo Continuo | Grupo DIAPSA",
        description: "Transformamos señales en decisiones, decisiones en resultados para proteger activos industriales.",
        url: "/servicios/monitoreo-continuo",
        type: "website",
        locale: "es_MX",
        siteName: "Grupo DIAPSA",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                type: "image/jpeg",
                alt: "Monitoreo Continuo Grupo DIAPSA",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@grupodiapsa",
        title: "Monitoreo Continuo | Grupo DIAPSA",
        description: "Monitoreo continuo para convertir datos de condición en acciones operativas.",
        images: [OG_IMAGE],
    },
};

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
            <ContinuosMonitoringValueProp />
            <ContinuosMonitoringStats />
            <ContinuosMonitoringChallenge />
            <ContinuosMonitoringSolutions />
            <ContinuosMonitoringTechnology />
            <ContinuosMonitoringCta />
            {/* <section id="contacto">
                <ContactForm />
            </section> */}
        </main>
    );
}
