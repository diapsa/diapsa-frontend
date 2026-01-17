import { notFound } from "next/navigation";
import camerasData from "@/data/camaras.json";
import type { Camera, CameraSerie } from "@/types/camara";
import CameraDetailContent from "./CameraDetailContent";
import JsonLd, {
  createProductSchema,
  createBreadcrumbSchema,
} from "@/components/atoms/JsonLd";

// Generar rutas estáticas para todas las cámaras
export function generateStaticParams() {
  const slugs: string[] = [];
  
  camerasData.series.forEach((serie) => {
    serie.cameras.forEach((camera) => {
      slugs.push(camera.slug);
    });
  });

  return slugs.map((slug) => ({ slug }));
}

// Obtener datos de una cámara específica
function getCameraData(slug: string): { camera: Camera; serie: CameraSerie } | null {
  for (const serie of camerasData.series) {
    const camera = serie.cameras.find((c) => c.slug === slug);
    if (camera) {
      return { camera, serie };
    }
  }
  return null;
}

// Metadata dinámica
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCameraData(slug);
  
  if (!data) {
    return {
      title: "Cámara no encontrada",
    };
  }

  const { camera, serie } = data;
  const fullTitle = `${camera.modelo} Serie ${serie.serie}`;
  const description = camera.descripcion || `Cámara termográfica ${camera.modelo} de la serie ${serie.serie} - Equipos de precisión para termografía industrial`;

  return {
    title: `${fullTitle} | Cámara Termográfica HIKMIKRO`,
    description,
    keywords: [
      `HIKMIKRO ${camera.modelo}`,
      `cámara termográfica ${camera.modelo}`,
      `Serie ${serie.serie} HIKMIKRO`,
      "termografía industrial",
      "cámara infrarroja",
      "DIAPSA México",
    ],
    alternates: {
      canonical: `/camaras/${slug}`,
    },
    openGraph: {
      title: `${fullTitle} | Cámara Termográfica HIKMIKRO`,
      description,
      url: `/camaras/${slug}`,
      type: "website",
      images: camera.images?.[0]
        ? [
            {
              url: camera.images[0],
              width: 800,
              height: 600,
              alt: `Cámara termográfica HIKMIKRO ${camera.modelo}`,
            },
          ]
        : undefined,
    },
  };
}

export default async function CameraDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCameraData(slug);

  if (!data) {
    notFound();
  }

  const { camera, serie } = data;

  // Datos estructurados del producto
  const productJsonLd = createProductSchema({
    name: `HIKMIKRO ${camera.modelo} Serie ${serie.serie}`,
    description: camera.descripcion || `Cámara termográfica profesional ${camera.modelo}`,
    image: camera.images?.[0] || "",
    brand: "HIKMIKRO",
    sku: camera.id,
    category: "Cámaras Termográficas",
  });

  // Breadcrumbs estructurados
  const breadcrumbJsonLd = createBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Cámaras", url: "/camaras" },
    { name: `Serie ${serie.serie}`, url: `/camaras#serie-${serie.id}` },
    { name: camera.modelo, url: `/camaras/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <CameraDetailContent camera={camera} serie={serie} />
    </>
  );
}
