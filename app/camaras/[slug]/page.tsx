import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/organisms/PageHeader";
import Button from "@/components/atoms/Button";
import camerasData from "@/data/camaras.json";
import type { Camera, CameraSerie } from "@/types/camara";

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
    title: `${data.camera.modelo} | ${data.serie.serie} | DIAPSA`,
    description: data.camera.descripcion || `Cámara termográfica ${data.camera.modelo} de la ${data.serie.serie}`,
  };
}

export default async function CameraDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCameraData(slug);

  if (!data) {
    notFound();
  }

  const { camera, serie } = data;

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title={camera.modelo}
        subtitle={`Serie ${serie.serie} | Cámara Termográfica`}
      />

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Layout tipo producto: Imágenes izquierda, Info derecha */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* IZQUIERDA: Galería de imágenes */}
            <div className="space-y-4">
              {camera.images && camera.images.length > 0 ? (
                <>
                  {/* Imagen principal */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={camera.images[0]}
                      alt={`${camera.modelo} - imagen principal`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* Miniaturas */}
                  {camera.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {camera.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded overflow-hidden border border-gray-200 cursor-pointer hover:border-secondary transition-colors"
                        >
                          <Image
                            src={img}
                            alt={`${camera.modelo} - vista ${idx + 1}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 25vw, 12.5vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Imagen no disponible</span>
                </div>
              )}
            </div>

            {/* DERECHA: Información del producto */}
            <div className="space-y-6">
              {/* Título y descripción */}
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">
                  {camera.modelo}
                </h1>
                <p className="text-lg text-gray-600">
                  {camera.descripcion || "Cámara termográfica profesional"}
                </p>
              </div>

              {/* Especificaciones técnicas */}
              <div className="border-t border-b border-gray-200 py-6">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Especificaciones Técnicas
                </h2>
                <dl className="space-y-3">
                  {Object.entries(camera.specs).map(([key, value]) => {
                    // Formatear el nombre de la especificación
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());

                    // Formatear el valor
                    let displayValue: string;
                    if (typeof value === "boolean") {
                      displayValue = value ? "Sí" : "No";
                    } else {
                      displayValue = String(value);
                    }

                    return (
                      <div key={key} className="flex justify-between items-start">
                        <dt className="font-semibold text-gray-700 w-1/2">
                          {label}:
                        </dt>
                        <dd className="text-gray-600 w-1/2 text-right">
                          {displayValue}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>

              {/* Descargas */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  Documentación
                </h2>
                <div className="flex flex-col gap-3">
                  {camera.brochure && (
                    <Link href={camera.brochure} target="_blank">
                      <Button variant="secondary" className="w-full">
                        📄 Descargar Brochure
                      </Button>
                    </Link>
                  )}
                  {camera.fichaTecnica && (
                    <Link href={camera.fichaTecnica} target="_blank">
                      <Button variant="primary" className="w-full">
                        📋 Descargar Ficha Técnica
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* CTA de contacto */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-2">
                  ¿Interesado en este equipo?
                </h3>
                <p className="text-gray-600 mb-4">
                  Contáctanos para obtener más información, cotización o agendar una demostración.
                </p>
                <Link href="/contacto">
                  <Button variant="secondary" className="w-full">
                    Solicitar Cotización
                  </Button>
                </Link>
              </div>

              {/* Volver al catálogo */}
              <Link
                href="/camaras"
                className="inline-flex items-center text-secondary hover:underline"
              >
                ← Volver al catálogo completo
              </Link>
            </div>
          </div>

          {/* Otras cámaras de la misma serie */}
          <div className="mt-16 border-t pt-16">
            <h2 className="text-3xl font-bold text-primary mb-8">
              Otras cámaras de la {serie.title}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serie.cameras
                .filter((c) => c.slug !== camera.slug)
                .slice(0, 3)
                .map((relatedCamera) => (
                  <Link
                    key={relatedCamera.id}
                    href={`/camaras/${relatedCamera.slug}`}
                    className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      {relatedCamera.images && relatedCamera.images[0] ? (
                        <Image
                          src={relatedCamera.images[0]}
                          alt={relatedCamera.modelo}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-primary group-hover:text-secondary transition-colors">
                        {relatedCamera.modelo}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {relatedCamera.descripcion}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
