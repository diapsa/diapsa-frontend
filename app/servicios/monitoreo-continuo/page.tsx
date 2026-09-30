import type { Metadata } from "next";
import type { Servicio } from "@/types/servicio";
import datos from "@/data/servicios/monitoreo-continuo.json";
import PaginaServicio from "@/components/organisms/PaginaServicio";

/**
 * Monitoreo continuo, página general (rehecha el 2026-09-30).
 * Antes eran seis secciones propias con tres imágenes hechas con IA y fichas
 * de producto de KCF. Ahora se arma desde su JSON con las secciones de las
 * páginas de servicio (PaginaServicio): beneficios con fotos reales, las
 * cuatro páginas de sensores como modalidades, videos del proceso, de la
 * falla entre rutas y del rescate de programas con falsas alarmas, el
 * informe mensual de muestra y preguntas frecuentes. Conserva su ruta.
 */

const service = datos as unknown as Servicio;
const OG_IMAGE = "/images/og-images/og-image-monitoreo-continuo.jpg";
const RUTA = "/servicios/monitoreo-continuo";
const titulo = service.seoTitle ?? service.header.title;
const descripcion = service.seoDescription ?? service.header.subtitle;

export const metadata: Metadata = {
    title: titulo,
    description: descripcion,
    keywords: [
        "monitoreo continuo",
        "monitoreo en línea",
        "sensores inalámbricos de vibración",
        "monitoreo de condición en línea",
        "análisis remoto",
        "mantenimiento predictivo",
    ],
    alternates: {
        canonical: RUTA,
    },
    openGraph: {
        title: `${titulo} | Grupo DIAPSA`,
        description: descripcion,
        url: RUTA,
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
        title: `${titulo} | Grupo DIAPSA`,
        description: descripcion,
        images: [OG_IMAGE],
    },
};

export default function ContinuosMonitoringPage() {
    return <PaginaServicio service={service} href={RUTA} />;
}
