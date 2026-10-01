import PaginaIdap from "@/components/organisms/PaginaIdap";
import { Metadata } from "next";

const OG_IMAGE = "/images/og-images/og-image-idap.jpg";

export const metadata: Metadata = {
    // Tablero 2026-10-01: 125 impresiones y 0.8 % de clics. El título lleva lo
    // que se busca ("software de mantenimiento predictivo") antes que la marca.
    title: "IDAP: software de mantenimiento predictivo y monitoreo de condición",
    description: "IDAP reúne inspecciones, sensores y el criterio de los especialistas de DIAPSA para decirte qué equipo atender, cuándo y por qué. Agenda una demo.",
    keywords: [
        "software para predictivo",
        "plataforma de monitoreo de condición",
        "mantenimiento predictivo",
        "gestión de activos",
        "IDAP"
    ],
    alternates: {
        canonical: "/servicios/idap"
    },
    openGraph: {
        title: "IDAP: software de mantenimiento predictivo y monitoreo de condición | Grupo DIAPSA",
        description: "IDAP reúne inspecciones, sensores y el criterio de los especialistas de DIAPSA para decirte qué equipo atender, cuándo y por qué. Agenda una demo.",
        url: "/servicios/idap",
        type: "website",
        locale: "es_MX",
        siteName: "Grupo DIAPSA",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                type: "image/jpeg",
                alt: "IDAP - Inspection, Diagnostic & Asset Platform"
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@grupodiapsa",
        creator: "@grupodiapsa",
        title: "IDAP | Inspection, Diagnostic & Asset Platform",
        description: "IDAP reúne inspecciones, sensores y el criterio de los especialistas de DIAPSA para decirte qué equipo atender, cuándo y por qué. Agenda una demo.",
        images: [OG_IMAGE]
    }
}

// El cuerpo vive en PaginaIdap (rehecho 2026-09-28 con la estructura de Fracttal One)
export default function PageIdap() {
    return <PaginaIdap />;
}
