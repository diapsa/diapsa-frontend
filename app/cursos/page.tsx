'use client';

import PageHeader from "@/components/organisms/PageHeader";
import { CoursesNCerts } from "@/components/organisms/CoursesNCerts";
import CourseTypeSection from "@/components/organisms/CourseTypeSection";
import { useCourses } from "@/lib/hooks/useCourses";
import { useCourseCategories } from "@/lib/hooks/useCourseType";
import CourseMainContent from "@/components/organisms/CourseMainContent";
import { groupCoursesByType } from "@/lib/utils/groupCourses";
import { GroupedCourses } from "@/types/course";

export default function CursosPage() {
  const { courseCategories, loading: loadingCourseCategories } = useCourseCategories();
  const { courses, loading } = useCourses()
  const coursesByType = groupCoursesByType(courses);
  return (
    <main className="bg-gray-50 min-h-screen">
      <PageHeader
        title="CURSOS"
        subtitle="Capacitación profesional certificada en mantenimiento predictivo"
      />

      <section className="w-full bg-white p-5">
        <CoursesNCerts />
      </section>

      <section className="bg-white p-5">
        <CourseMainContent />
      </section>

      {coursesByType.certificates && (
        <section className="bg-white p-5">
          <CourseTypeSection title="Certificados" variant="certificado" courses={coursesByType.certificates} loading={loading} />
        </section>
      )}

      {coursesByType.workshops && (
        <section className="bg-white p-5">
          <CourseTypeSection title="Talleres practicos" variant="taller" courses={coursesByType.workshops} loading={loading} />
        </section>
      )}

      {coursesByType.strategics && (
        <section className="bg-white p-5">
          <CourseTypeSection title="Cursos estrategicos" variant="estrategico" courses={coursesByType.strategics} loading={loading} />
        </section>
      )}



    </main>
  );
}

