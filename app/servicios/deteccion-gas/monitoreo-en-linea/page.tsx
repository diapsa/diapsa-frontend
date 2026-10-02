import type { Metadata } from "next";
import type { Servicio } from "@/types/servicio";
import datos from "@/data/servicios/fugas-en-linea.json";
import PaginaServicio from "@/components/organisms/PaginaServicio";

/**
 * Monitoreo de fugas en línea (2026-10-02, pedido de Emiliano): el apartado
 * de detección de gas para vigilar fugas todo el día con cámaras fijas y
 * sensores de PPM conectados al PLC. Se arma con la plantilla común
 * (PaginaServicio) desde su JSON y enlaza con el programa LDAR.
 */

const service = datos as unknown as Servicio;
const OG_IMAGE = "/images/og-images/og-image-gas.jpg";
const RUTA = "/servicios/deteccion-gas/monitoreo-en-linea";
const titulo = service.seoTitle ?? service.header.title;
const descripcion = service.seoDescription ?? service.header.subtitle;

export const metadata: Metadata = {
    title: titulo,
    description: descripcion,
    keywords: [
        "monitoreo de fugas de gas",
        "detector de gas fijo",
        "sensor de gas ppm",
        "cámara acústica fija",
        "detección de fugas en línea",
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
                alt: "Monitoreo de fugas en línea Grupo DIAPSA",
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

export default function MonitoreoFugasEnLineaPage() {
    return <PaginaServicio service={service} href={RUTA} />;
}
