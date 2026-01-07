import { notFound } from "next/navigation";
import camerasData from "@/data/camaras.json";
import type { Camera, CameraSerie } from "@/types/camara";
import CameraDetailContent from "./CameraDetailContent";

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

  return {
    title: `${data.camera.modelo} ${data.serie.serie} | Cámara Termográfica | DIAPSA`,
    description: data.camera.descripcion || `Cámara termográfica ${data.camera.modelo} de la serie ${data.serie.serie} - Equipos de precisión para termografía industrial`,
  };
}

export default async function CameraDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCameraData(slug);

  if (!data) {
    notFound();
  }

  const { camera, serie } = data;

  return <CameraDetailContent camera={camera} serie={serie} />;
}
