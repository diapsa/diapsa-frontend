import type { Metadata } from "next";
import PaginaGas from "@/components/organisms/PaginaGas";

const OG_IMAGE = "/images/og-images/og-images-gas.jpg";
const DESCRIPCION =
    "Detección y reparación de fugas de metano (LDAR): cámara OGI, confirmación con láser TDLAS, reinspección y evidencia para el PPCIEM ante la ASEA. Para el sector hidrocarburos y la industria.";

export const metadata: Metadata = {
    title: "Detección y Reparación de Fugas de Gas",
    description: DESCRIPCION,
    keywords: ["detección de fugas de gas", "LDAR", "PPCIEM", "ASEA", "cámara OGI", "metano"],
    alternates: { canonical: "/servicios/deteccion-gas" },
    openGraph: {
        title: "Detección y Reparación de Fugas de Gas | Grupo DIAPSA",
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
        title: "Detección y Reparación de Fugas de Gas | Grupo DIAPSA",
        description: DESCRIPCION,
        images: [OG_IMAGE],
    },
};

export default function GasPage() {
    return <PaginaGas />;
}
