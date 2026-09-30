import type { Metadata } from "next";
import type { Servicio } from "@/types/servicio";
import datos from "@/data/servicios/diapsa-start.json";
import PaginaServicio from "@/components/organisms/PaginaServicio";

/**
 * DIAPSA START (rehecho el 2026-09-30).
 * Antes eran dos secciones con tarjetas de etapas sobre fondo oscuro. Ahora
 * se arma desde su JSON con las secciones de las páginas de servicio
 * (PaginaServicio): beneficios con fotos reales, videos de las cuatro
 * etapas, el tablero mensual de muestra, el caso de éxito y preguntas
 * frecuentes. Conserva su ruta.
 */

const service = datos as unknown as Servicio;
const OG_IMAGE = "/images/og-images/og-image-diapsa-start.jpg";
const RUTA = "/servicios/diapsa-start";
const titulo = service.seoTitle ?? service.header.title;
const descripcion = service.seoDescription ?? service.header.subtitle;

export const metadata: Metadata = {
    title: titulo,
    description: descripcion,
    keywords: [
        "DIAPSA START",
        "implementación de mantenimiento predictivo",
        "programa de mantenimiento predictivo",
        "capacitación en mantenimiento predictivo",
        "indicadores de mantenimiento",
        "monitoreo de condición",
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
                alt: "DIAPSA START Grupo DIAPSA",
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

export default function DiapsaStart() {
    return <PaginaServicio service={service} href={RUTA} />;
}
