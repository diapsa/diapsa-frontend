import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/organisms/PageHeader";
import camerasData from "@/data/camaras.json";
import type { Camera } from "@/types/camara";

export default function CamerasPage() {
  // Obtener todas las cámaras de todas las series
  const allCameras: (Camera & { serieName: string })[] = [];
  
  camerasData.series.forEach((serie) => {
    serie.cameras.forEach((camera) => {
      allCameras.push({
        ...camera,
        serieName: serie.serie,
      });
    });
  });

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="CÁMARAS TERMOGRÁFICAS"
        subtitle="Catálogo completo de equipos para termografía infrarroja"
      />

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Lista simple sin diseño */}
          <div className="space-y-8">
            {camerasData.series.map((serie) => (
              <div key={serie.id} className="border-b pb-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  {serie.title}
                </h2>
                <p className="text-gray-600 mb-6">{serie.description}</p>
                
                <div className="grid gap-4">
                  {serie.cameras.map((camera) => (
                    <Link
                      key={camera.id}
                      href={`/camaras/${camera.slug}`}
                      className="block p-4 border rounded hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-primary">
                            {camera.modelo}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {camera.descripcion}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>Resolución: {camera.specs.resolucion}</span>
                            <span>Enfoque: {camera.specs.enfoque}</span>
                          </div>
                        </div>
                        <div className="text-secondary">→</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
