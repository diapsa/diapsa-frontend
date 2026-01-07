"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import BackgroundImage from "@/components/atoms/BackgroundImage";
import type { Camera, CameraSerie } from "@/types/camara";

interface CameraDetailContentProps {
  camera: Camera;
  serie: CameraSerie;
}

export default function CameraDetailContent({ camera, serie }: CameraDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Formatear nombre de especificación
  const formatSpecLabel = (key: string): string => {
    const labels: Record<string, string> = {
      resolucion: "Resolución IR",
      superIR: "Super IR",
      superFocus: "Super Focus",
      enfoque: "Tipo de Enfoque",
      anguloVision: "Ángulo de Visión",
      rangoTemperatura: "Rango de Temperatura",
      sensibilidadTermica: "Sensibilidad Térmica",
      certificacion: "Certificación",
      bateria: "Duración de Batería",
      resistenciaGolpes: "Resistencia a Golpes",
      temperaturaOperacion: "Temperatura de Operación",
      almacenamiento: "Almacenamiento",
      conectividad: "Conectividad",
      camaraVisual: "Cámara Visual",
    };
    
    return labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - PageHeader style */}
      <section className="relative w-full h-[50vh] sm:h-[55vh] lg:h-[60vh] overflow-hidden border-b-2 lg:border-b-4 border-secondary">
        <BackgroundImage
          src="/images/fondo-hero.webp"
          alt="Fondo cámara termográfica"
          overlayOpacity={0.5}
          priority
        />

        {/* Contenido del Header */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8 pt-16 sm:pt-20 lg:pt-24">
            {/* Breadcrumb inline */}
            <nav className="mb-6">
              <ol className="inline-flex flex-wrap items-center rounded-sm bg-black/30 px-3 py-1.5 text-xs lg:text-sm backdrop-blur-sm gap-x-1">
                <li className="flex items-center">
                  <Link href="/" className="text-white/90 hover:text-secondary transition-colors font-medium">
                    Inicio
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-white/60">/</span>
                  <Link href="/camaras" className="text-white/90 hover:text-secondary transition-colors font-medium">
                    Cámaras
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-white/60">/</span>
                  <span className="text-white/80 font-medium">{camera.modelo}</span>
                </li>
              </ol>
            </nav>

            {/* Serie Badge */}
            <div className="inline-flex items-center bg-secondary text-white text-sm font-bold px-4 py-1.5 rounded-sm mb-4 shadow-md">
              <span className="mr-2 text-xs opacity-80">SERIE</span>
              {serie.serie}
            </div>

            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
              {camera.modelo}
            </h1>

            {/* Descripción */}
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl leading-relaxed">
              {camera.descripcion}
            </p>

            {/* Badges de características */}
            <div className="flex flex-wrap gap-2 mt-6">
              {camera.specs.superIR && (
                <span className="inline-flex items-center bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-sm text-sm font-medium border border-white/20">
                  <svg className="w-4 h-4 mr-1.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Super IR
                </span>
              )}
              {camera.specs.superFocus && (
                <span className="inline-flex items-center bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-sm text-sm font-medium border border-white/20">
                  <svg className="w-4 h-4 mr-1.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Super Focus
                </span>
              )}
              {camera.specs.resolucion && (
                <span className="inline-flex items-center bg-secondary text-white px-3 py-1.5 rounded-sm text-sm font-bold shadow-sm">
                  {camera.specs.resolucion}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12 lg:py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* IZQUIERDA: Galería de imágenes (7 columnas) */}
            <div className="lg:col-span-7 space-y-4">
              {camera.images && camera.images.length > 0 ? (
                <>
                  {/* Imagen principal */}
                  <div className="relative w-full aspect-4/3 rounded-sm overflow-hidden border border-gray-200 bg-white shadow-lg">
                    <Image
                      src={camera.images[selectedImage]}
                      alt={`${camera.modelo} - imagen ${selectedImage + 1}`}
                      fill
                      className="object-contain p-6 lg:p-8"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                    {/* Indicador de imagen */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      Imagen {selectedImage + 1} de {camera.images.length}
                    </div>
                  </div>

                  {/* Miniaturas */}
                  {camera.images.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 lg:gap-3">
                      {camera.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                            selectedImage === idx
                              ? "border-secondary shadow-md ring-2 ring-secondary/30"
                              : "border-gray-200 hover:border-secondary/50 bg-white"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`${camera.modelo} - miniatura ${idx + 1}`}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 640px) 25vw, 15vw"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="relative w-full aspect-4/3 rounded-sm overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">Imagen no disponible</span>
                  </div>
                </div>
              )}
            </div>

            {/* DERECHA: Información del producto (5 columnas) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card de Especificaciones Técnicas */}
              <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-primary px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Especificaciones Técnicas
                  </h2>
                </div>
                <div className="p-6">
                  <dl className="divide-y divide-gray-100">
                    {Object.entries(camera.specs).map(([key, value]) => {
                      const label = formatSpecLabel(key);
                      let displayValue: React.ReactNode;
                      
                      if (typeof value === "boolean") {
                        displayValue = value ? (
                          <span className="inline-flex items-center text-green-600 font-semibold">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Sí
                          </span>
                        ) : (
                          <span className="text-gray-400">No incluido</span>
                        );
                      } else {
                        displayValue = <span className="font-semibold text-primary">{String(value)}</span>;
                      }

                      return (
                        <div key={key} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                          <dt className="text-sm text-gray-600">
                            {label}
                          </dt>
                          <dd className="text-sm text-right">
                            {displayValue}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>

              {/* Card de Documentación */}
              <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documentación
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {camera.brochure && (
                    <a 
                      href={camera.brochure} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-sm border border-gray-200 transition-colors group"
                    >
                      <span className="flex items-center text-sm font-medium text-gray-700">
                        <svg className="w-5 h-5 mr-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Brochure Comercial
                      </span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  )}
                  {camera.fichaTecnica && (
                    <a 
                      href={camera.fichaTecnica} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between w-full px-4 py-3 bg-primary/5 hover:bg-primary/10 rounded-sm border border-primary/20 transition-colors group"
                    >
                      <span className="flex items-center text-sm font-medium text-primary">
                        <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Ficha Técnica Completa
                      </span>
                      <svg className="w-5 h-5 text-primary/50 group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* CTA de Contacto */}
              <div className="bg-linear-to-br from-secondary to-secondary/90 rounded-sm shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  ¿Interesado en este equipo?
                </h3>
                <p className="text-sm text-white/90 mb-4 leading-relaxed">
                  Solicita cotización personalizada, demostración o asesoría técnica sin compromiso.
                </p>
                <Link href="/contacto" className="block">
                  <Button 
                    variant="primary" 
                    className="w-full bg-white text-secondary hover:bg-gray-50 font-bold"
                  >
                    Solicitar Información
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cámaras relacionadas de la misma serie */}
      {serie.cameras.filter(c => c.slug !== camera.slug).length > 0 && (
        <section className="py-12 lg:py-16 px-4 bg-white border-t border-gray-100">
          <div className="container mx-auto max-w-7xl">
            {/* Header de sección */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
              <div>
                <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
                  {serie.title}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-primary mt-1">
                  Otros modelos de la serie
                </h2>
              </div>
              <Link 
                href="/camaras" 
                className="text-secondary font-medium text-sm hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                Ver catálogo completo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Grid de cámaras relacionadas */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {serie.cameras
                .filter((c) => c.slug !== camera.slug && !!c.slug)
                .slice(0, 4)
                .map((relatedCamera) => (
                  <Link
                    key={relatedCamera.id}
                    href={`/camaras/${relatedCamera.slug}`}
                    className="group bg-white rounded-sm overflow-hidden border border-gray-200 hover:border-secondary/50 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Imagen */}
                    <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {relatedCamera.images && relatedCamera.images[0] ? (
                        <Image
                          src={relatedCamera.images[0]}
                          alt={relatedCamera.modelo}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : null}
                      {/* Badge de serie */}
                      <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
                        {serie.serie}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 border-t border-gray-100">
                      <h3 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors">
                        {relatedCamera.modelo}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1 mb-3 min-h-10">
                        {relatedCamera.descripcion}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">
                          {relatedCamera.specs.resolucion}
                        </span>
                        <span className="text-secondary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Ver detalles
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-12 lg:py-16 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              ¿Listo para adquirir tu {camera.modelo}?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Nuestro equipo de expertos te asesora en selección, instalación y capacitación
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contacto">
                <Button variant="secondary" className="min-w-50">
                  Solicitar Cotización
                </Button>
              </Link>
              <Link href="/camaras">
                <Button variant="primary" ghost ghostVariant="dark" className="min-w-50">
                  Ver más cámaras
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
