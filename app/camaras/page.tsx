import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/organisms/PageHeader";
import camerasData from "@/data/camaras.json";

export const metadata: Metadata = {
  title: "Cámaras Termográficas HIKMIKRO",
  description:
    "Catálogo completo de cámaras termográficas profesionales HIKMIKRO. Series M, SP y G para mantenimiento predictivo, análisis térmico industrial y diagnóstico de equipos en México.",
  keywords: [
    "cámaras termográficas HIKMIKRO",
    "cámara termográfica industrial",
    "equipo termografía México",
    "HIKMIKRO Serie M",
    "HIKMIKRO Serie SP",
    "HIKMIKRO Serie G",
    "termografía predictiva",
  ],
  alternates: {
    canonical: "/camaras",
  },
  openGraph: {
    title: "Cámaras Termográficas HIKMIKRO | Grupo DIAPSA",
    description:
      "Equipos de precisión para análisis térmico y mantenimiento predictivo. Distribuidor autorizado HIKMIKRO en México.",
    url: "/camaras",
    type: "website",
  },
};

export default function CamerasPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader
        title="CÁMARAS TERMOGRÁFICAS"
        subtitle="Equipos de precisión para análisis térmico y mantenimiento predictivo"
      />

      {/* Introducción */}
      <section className="py-10 lg:py-12 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
            Descubre nuestra línea completa de cámaras termográficas <span className="font-bold text-primary">HIKMIKRO</span>, 
            diseñadas para profesionales que exigen precisión, durabilidad y tecnología de vanguardia en 
            diagnóstico térmico industrial.
          </p>
        </div>
      </section>

      {/* Series de cámaras */}
      <section className="py-12 lg:py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl space-y-16 lg:space-y-20">
          {camerasData.series.map((serie, index) => (
            <div key={serie.id} className="relative">
              {/* Serie Header con imagen hero */}
              <div className="relative h-64 lg:h-72 rounded-sm overflow-hidden mb-8 lg:mb-10 shadow-lg">
                <Image
                  src={serie.images[0]}
                  alt={serie.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary/85 to-primary/70" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16">
                  {/* Serie Badge */}
                  <div className="inline-flex items-center bg-secondary text-white text-sm font-bold px-3 py-1 rounded-sm mb-3 w-fit shadow-md">
                    <span className="mr-2 text-xs opacity-80">SERIE</span>
                    {serie.serie}
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                    {serie.title}
                  </h2>
                  <p className="text-base lg:text-lg text-white/90 max-w-2xl">
                    {serie.description}
                  </p>
                </div>
              </div>

              {/* Grid de cámaras */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {serie.cameras
                  .filter((c) => !!c.slug)
                  .map((camera) => (
                  <Link
                    key={camera.id}
                    href={`/camaras/${camera.slug}`}
                    className="group bg-white rounded-sm overflow-hidden border border-gray-200 hover:border-secondary/50 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Imagen del producto */}
                    <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {camera.images && camera.images[0] ? (
                        <Image
                          src={camera.images[0]}
                          alt={camera.modelo}
                          fill
                          className="object-contain p-4 lg:p-6 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400 text-sm">Sin imagen</span>
                        </div>
                      )}
                      {/* Badge de serie */}
                      <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
                        {serie.serie}
                      </div>
                      {/* Badges de tecnología */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                        {camera.specs.superIR && (
                          <span className="bg-primary/90 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm">
                            Super IR
                          </span>
                        )}
                        {camera.specs.superFocus && (
                          <span className="bg-secondary/90 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm">
                            Super Focus
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Información del producto */}
                    <div className="p-4 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-primary mb-1.5 group-hover:text-secondary transition-colors">
                        {camera.modelo}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
                        {camera.descripcion}
                      </p>

                      {/* Especificaciones clave */}
                      <div className="space-y-1.5 mb-4 text-xs">
                        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                          <span className="text-gray-500">Resolución</span>
                          <span className="font-semibold text-primary">{camera.specs.resolucion}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                          <span className="text-gray-500">Enfoque</span>
                          <span className="font-semibold text-primary">{camera.specs.enfoque}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-gray-500">Ángulo de Visión</span>
                          <span className="font-semibold text-primary">{camera.specs.anguloVision}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm font-semibold text-secondary group-hover:underline flex items-center gap-1">
                          Ver detalles
                          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 lg:py-16 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Nuestros expertos te ayudarán a encontrar la cámara termográfica perfecta para tu aplicación
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-3 rounded-sm transition-all shadow-md hover:shadow-lg"
          >
            Contactar a un Especialista
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
