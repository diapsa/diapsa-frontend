import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import CatalogoCursos from "@/components/organisms/CatalogoCursos";
import ContactForm from "@/components/organisms/ContactForm";
import { getCourses } from "@/lib/api/courses";

export const metadata: Metadata = {
  // Tablero 2026-10-01: 148 impresiones y 1.4 % de clics con "Cursos y Capacitación".
  // Se busca por técnica y por certificación ("curso de vibraciones nivel 1", "cursos de termografía").
  title: { absolute: "Cursos de vibraciones y termografía con certificación ISO 18436 | DIAPSA" },
  description: "Cursos de vibraciones mecánicas, termografía infrarroja y ultrasonido en México: formación técnica, talleres prácticos y certificación ISO 18436 Categorías I y II. Más de 3,000 especialistas capacitados en 15 años.",
  alternates: {
    canonical: "/cursos",
  },
  openGraph: {
    title: "Cursos de vibraciones y termografía con certificación ISO 18436 | DIAPSA",
    description: "Certificaciones y talleres prácticos en termografía, vibraciones, ultrasonido y diagnóstico de maquinaria industrial.",
    url: "/cursos",
    type: "website",
  },
};

export default async function CursosPage() {
  // Si el CMS no responde, la página carga con el encabezado y sin listado,
  // en vez de devolver un error 500.
  const coursesResponse = await getCourses({ per_page: 50 }).catch((error) => {
    console.error("[cursos] No se pudo cargar el catálogo:", error);
    return null;
  });
  const courses = coursesResponse?.data ?? [];

  return (
    <main className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Cursos"
        subtitle="Vibraciones, termografía, ultrasonido y confiabilidad, con casos reales de planta"
      />

      <CatalogoCursos cursos={courses} />

      {/* ¿Capacitar a tu equipo? El formulario ya llega con el asunto de cursos */}
      <section id="contacto" className="w-full">
        <div className="w-full bg-secondary px-6 py-10 text-center lg:py-12">
          <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-4xl">¿Quieres capacitar a tu equipo?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-justify text-lg leading-relaxed text-primary/80">
            Dinos qué cursos te interesan y cuántas personas son, y te respondemos con fechas y la propuesta.
          </p>
        </div>
        <ContactForm curso="" />
      </section>
    </main>
  );
}
