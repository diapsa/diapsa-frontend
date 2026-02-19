'use client';

import PageHeader from "@/components/organisms/PageHeader";
import { CoursesNCerts } from "@/components/organisms/CoursesNCerts";
import CourseTypeSection from "@/components/organisms/CourseTypeSection";
import { useCourses } from "@/lib/hooks/useCourses";
import { useCourseTypes } from "@/lib/hooks/useCourseType";

export default function CursosPage() {
  const { courseTypes, loading: loadingCourseTypes } = useCourseTypes();

  return (
    <main className="bg-gray-50 min-h-screen">
      <PageHeader
        title="CURSOS"
        subtitle="Capacitación profesional certificada en mantenimiento predictivo"
      />

      <section className="w-full bg-white py-12">
        <CoursesNCerts />
      </section>

      {/* Grid de secciones de cursos por tipo */}
      <section className="container mx-auto px-4 py-12">
        {loadingCourseTypes ? (
          // Loading state - 2 columnas en desktop
          <div className="grid grid-cols-1 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-6 h-150">
                <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="bg-gray-100 rounded-lg h-80"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid de 2 columnas para las cards de tipo de curso
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {courseTypes.map((courseType) => (
              <CourseTypeSectionWrapper key={courseType.id} courseType={courseType} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/**
 * Componente que maneja el fetch y renderizado de una sección individual
 */
function CourseTypeSectionWrapper({ courseType }: { courseType: { id: string; name: string; slug: string } }) {
  const { courses, loading } = useCourses({
    courseType: courseType.name, // API filtra por name, no por slug
    per_page: 100, // Obtener todos los cursos del tipo
  });

  return (
    <CourseTypeSection
      title={courseType.name}
      courses={courses}
      loading={loading}
    />
  );
}
