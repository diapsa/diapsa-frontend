import type { Metadata } from "next";
import type { Servicio } from "@/types/servicio";
import datos from "@/data/servicios/diagnostico-situacional.json";
import PaginaServicio from "@/components/organisms/PaginaServicio";

/**
 * Diagnóstico situacional (rehecho el 2026-09-30).
 * Antes era una página propia con fotos de banco de imágenes, secciones
 * oscuras y cifras sin sustento. Ahora se arma desde su JSON con las mismas
 * secciones que las páginas de técnicas (PaginaServicio): beneficios con
 * fotos reales, videos del proceso y de los tres entregables (matriz de
 * criticidad, hoja de ruta y análisis económico), la ficha de muestra y
 * preguntas frecuentes. Conserva su ruta para no perder lo ya indexado.
 */

const service = datos as unknown as Servicio;
const OG_IMAGE = "/images/og-images/og-image-diagnostico-situacional.jpg";
const RUTA = "/servicios/diagnostico-situacional";
const titulo = service.seoTitle ?? service.header.title;
const descripcion = service.seoDescription ?? service.header.subtitle;

export const metadata: Metadata = {
    title: titulo,
    description: descripcion,
    keywords: [
        "diagnóstico situacional",
        "análisis de criticidad de equipos",
        "matriz de criticidad mantenimiento",
        "diagnóstico de mantenimiento industrial",
        "programa de mantenimiento predictivo",
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
                alt: "Diagnóstico Situacional Grupo DIAPSA",
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

export default function DiagnosticoSituacionalPage() {
    return <PaginaServicio service={service} href={RUTA} />;
}
