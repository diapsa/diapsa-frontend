import { notFound } from "next/navigation";
import type { Servicio } from "@/types/servicio";
import { SITE_CONFIG } from "@/lib/constants";
import PaginaServicio from "@/components/organisms/PaginaServicio";

const OG_IMAGE = "/images/og-images/og-image-monitoreo-condicion.jpg";

// Lista de slugs disponibles
const serviceSlugs = [
    "termografia-infrarroja",
    "termografia-con-drones",
    "vibraciones-mecanicas",
    "analisis-de-aceite",
    "diagnostico-de-maquinaria",
    "analisis-de-ultrasonido",
    "calidad-de-energia",
    "tierras-fisicas",
    "arco-electrico",
    "alineacion-balanceo",
];

// Generar parámetros estáticos para pre-renderizado
export async function generateStaticParams() {
    return serviceSlugs.map((slug) => ({
        slug,
    }));
}

// Función para cargar datos del servicio
async function getServiceData(slug: string): Promise<Servicio | null> {
    try {
        const data = await import(`@/data/servicios/${slug}.json`);
        return data.default as Servicio;
    } catch {
        return null;
    }
}

// Generar metadata para SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const service = await getServiceData(slug);

    if (!service) {
        return {
            title: "Servicio no encontrado",
        };
    }

    const keywords = [
        service.header.title.toLowerCase(),
        "mantenimiento predictivo",
        "diagnóstico industrial",
        "México",
        "DIAPSA",
    ];

    // La descripción para Google puede ser más larga y vendedora que el
    // subtítulo visible del hero; por eso se separan.
    const descripcion = service.seoDescription ?? service.header.subtitle;
    const titulo = service.seoTitle ?? service.header.title;

    return {
        title: titulo,
        description: descripcion,
        keywords,
        alternates: {
            canonical: `${SITE_CONFIG.baseUrl}/servicios/monitoreo-condicion/${slug}`,
        },
        openGraph: {
            title: `${titulo} | Grupo DIAPSA`,
            description: descripcion,
            url: `${SITE_CONFIG.baseUrl}/servicios/monitoreo-condicion/${slug}`,
            type: "website",
            locale: "es_MX",
            siteName: "Grupo DIAPSA",
            images: [
                {
                    url: OG_IMAGE,
                    width: 1200,
                    height: 630,
                    type: "image/jpeg",
                    alt: `${service.header.title} Grupo DIAPSA`,
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
}

export default async function ServicePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const service = await getServiceData(slug);

    if (!service) {
        notFound();
    }

    return <PaginaServicio service={service} href={`/servicios/monitoreo-condicion/${slug}`} />;
}
