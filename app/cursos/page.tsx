import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import { CoursesNCerts } from "@/components/organisms/CoursesNCerts";
import { CoursesListSection } from "@/components/organisms/CoursesListSection";

export const metadata: Metadata = {
  title: "Cursos de Capacitación",
  description:
    "Cursos profesionales certificados en mantenimiento predictivo: Termografía Categoría 1 y 2, Análisis de Vibraciones, Ultrasonido Industrial. Capacitación presencial y en línea en México.",
  keywords: [
    "cursos termografía",
    "certificación termografía México",
    "curso análisis de vibraciones",
    "capacitación ultrasonido",
    "formación mantenimiento predictivo",
    "cursos industriales México",
  ],
  alternates: {
    canonical: "/cursos",
  },
  openGraph: {
    title: "Cursos de Capacitación en Mantenimiento Predictivo | DIAPSA",
    description:
      "Formación profesional certificada en termografía, vibraciones y ultrasonido. Modalidad presencial y en línea.",
    url: "/cursos",
    type: "website",
  },
};

export default function CursosPage() {
  return (
    <main>
      <PageHeader
        title="CURSOS"
        subtitle="Capacitación profesional certificada en mantenimiento predictivo"
      />

      <section className="w-full bg-white">
        <CoursesNCerts />
      </section>
      <CoursesListSection />

    </main>
  );
}
