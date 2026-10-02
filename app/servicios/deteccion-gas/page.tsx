import type { Metadata } from "next";
import PaginaGas from "@/components/organisms/PaginaGas";

const OG_IMAGE = "/images/og-images/og-image-gas.jpg";
const DESCRIPCION =
    "Detección y reparación de fugas de metano (LDAR): detección con cámara OGI o cámara acústica con láser TDLAS, reparación, reinspección y evidencia para el PPCIEM ante la ASEA, más monitoreo continuo con cámaras acústicas fijas y sensores de PPM conectados a tu PLC. Para el sector hidrocarburos y la industria.";

export const metadata: Metadata = {
    title: "Detección de fugas de gas: programa LDAR y monitoreo en línea",
    description: DESCRIPCION,
    keywords: ["detección de fugas de gas", "servicio de detección de fugas de gas", "detección de fugas de gas natural", "detección de fugas de gas por ultrasonido", "cámara termográfica para fugas de gas", "programa LDAR trimestral", "inspección trimestral de fugas", "PPCIEM", "ASEA", "detección de fugas de gas", "cámara OGI", "cámara acústica", "láser TDLAS", "metano"],
    alternates: { canonical: "/servicios/deteccion-gas" },
    openGraph: {
        title: "Detección de fugas de gas: programa LDAR y monitoreo en línea | Grupo DIAPSA",
        description: DESCRIPCION,
        url: "/servicios/deteccion-gas",
        type: "website",
        locale: "es_MX",
        siteName: "Grupo DIAPSA",
        images: [{ url: OG_IMAGE, width: 1200, height: 630, type: "image/jpeg", alt: "Detección de fugas de gas Grupo DIAPSA" }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@grupodiapsa",
        title: "Detección de fugas de gas: programa LDAR y monitoreo en línea | Grupo DIAPSA",
        description: DESCRIPCION,
        images: [OG_IMAGE],
    },
};

export default function GasPage() {
    return <PaginaGas />;
}
