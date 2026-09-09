import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import { CoursesNCerts } from "@/components/organisms/CoursesNCerts";
import CourseTypeSection from "@/components/organisms/CourseTypeSection";
import { getCourses } from "@/lib/api/courses";
import { groupCoursesByType } from "@/lib/utils/groupCourses";

export const metadata: Metadata = {
  title: "Cursos y Capacitación",
  description: "Certifícate en termografía, análisis de vibraciones y ultrasonido (niveles I, II y III) con instructores que diagnostican maquinaria real todos los días.",
  alternates: {
    canonical: "/cursos",
  },
  openGraph: {
    title: "Cursos de Mantenimiento Predictivo — Grupo DIAPSA",
    description: "Certificaciones y talleres prácticos en termografía, vibraciones, ultrasonido y diagnóstico de maquinaria industrial.",
    url: "/cursos",
    type: "website",
  },
};

export default async function CursosPage() {
  // Si el CMS no responde, la página carga con el encabezado y sin listado,
  // en vez de devolver un error 500.
  const coursesResponse = await getCourses().catch((error) => {
    console.error("[cursos] No se pudo cargar el catálogo:", error);
    return null;
  });
  const courses = coursesResponse?.data ?? [];
  const coursesByType = groupCoursesByType(courses);

  return (
    <main className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Cursos"
        subtitle="Capacitación profesional certificada en mantenimiento predictivo"
      />

      <section className="w-full bg-white p-5">
        <CoursesNCerts />
      </section>

      {coursesByType.certificates.length > 0 && (
        <section className="bg-white p-5">
          <CourseTypeSection
            title="Certificados"
            variant="certificado"
            courses={coursesByType.certificates}
            loading={false}
          />
        </section>
      )}

      {coursesByType.workshops.length > 0 && (
        <section className="bg-white p-5">
          <CourseTypeSection
            title="Talleres prácticos"
            variant="taller"
            courses={coursesByType.workshops}
            loading={false}
          />
        </section>
      )}

      {coursesByType.strategics.length > 0 && (
        <section className="bg-white p-5">
          <CourseTypeSection
            title="Cursos estratégicos"
            variant="estrategico"
            courses={coursesByType.strategics}
            loading={false}
          />
        </section>
      )}
    </main>
  );
}
