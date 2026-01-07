import React from "react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/organisms/PageHeader";
import ServiceAccordion from "@/components/molecules/ServiceAccordion";
import RelatedProducts from "@/components/organisms/RelatedProducts";
import Image from "next/image";
import type { Servicio } from "@/types/servicio";
import CoursesPromo from "@/components/organisms/CoursesPromo";

// Lista de slugs disponibles
const serviceSlugs = [
  "termografia-infrarroja",
  "vibraciones-mecanicas",
  "diagnostico-de-maquinaria",
  "analisis-de-ultrasonido",
  "estudios-electricos",
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
  } catch (error) {
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

  return {
    title: `${service.header.title} | DIAPSA`,
    description: service.header.subtitle,
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

  return (
    <main>
      {/* Page Header with Breadcrumb */}
      <PageHeader
        title={service.header.title}
        subtitle={service.header.subtitle}
        breadcrumbs={service.breadcrumbs}
      />
      {/* Content Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left Column: Title, Subtitle, Accordion */}
            <div className="space-y-8">
              {/* Content Header with Background */}
              {service.content.title && (
                <div className="bg-gray-100 rounded-lg p-6 lg:p-8 relative">
                  {/* Decorative Triangle */}
                  <div className="absolute left-0 top-8 w-0 h-0 border-t-12 border-t-transparent border-b-12 border-b-transparent border-r-12 border-r-secondary -translate-x-full" />
                  
                  <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                    {service.content.title}
                  </h2>
                  {service.content.subtitle && (
                    <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                      {service.content.subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Accordion */}
              <div className="space-y-3">
                <ServiceAccordion items={service.content.items} />
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="lg:sticky lg:top-28">
              {service.content.image ? (
                <div className="relative w-full h-94 lg:h-124 rounded-sm overflow-hidden shadow-xl">
                  <Image
                    src={service.content.image}
                    alt={service.header.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="hidden lg:block w-full h-124" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts
        title={service.relatedProducts.title}
        subtitle={service.relatedProducts.subtitle}
        items={service.relatedProducts.items}
      />

      <CoursesPromo />
    </main>
  );
}
