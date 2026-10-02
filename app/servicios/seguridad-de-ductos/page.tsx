import type { Metadata } from "next";
import type { Servicio } from "@/types/servicio";
import datos from "@/data/servicios/seguridad-de-ductos.json";
import PaginaServicio from "@/components/organisms/PaginaServicio";

/**
 * Seguridad de ductos (2026-10-02): servicio propio, no un apartado de
 * monitoreo continuo (Emiliano). La línea de seguridad de ductos de
 * Hertzinno en cuatro capas: centinelas en los postes marcadores, monitoreo
 * acústico de fugas en pozos y válvulas, y fibra óptica DAS y DTS. Se arma
 * con la plantilla común (PaginaServicio) desde su JSON.
 */

const service = datos as unknown as Servicio;
const OG_IMAGE = "/images/og-images/og-image.jpg";
const RUTA = "/servicios/seguridad-de-ductos";
const titulo = service.seoTitle ?? service.header.title;
const descripcion = service.seoDescription ?? service.header.subtitle;

export const metadata: Metadata = {
    title: titulo,
    description: descripcion,
    keywords: [
        "monitoreo de ductos",
        "monitoreo de oleoductos",
        "sistema de detección de fugas en ductos",
        "derecho de vía de ductos",
        "seguridad de gasoductos",
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
                alt: "Seguridad de ductos Grupo DIAPSA",
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

export default function SeguridadDeDuctosPage() {
    return <PaginaServicio service={service} href={RUTA} />;
}
