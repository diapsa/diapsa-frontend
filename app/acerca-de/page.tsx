import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import WipState from "@/components/molecules/wip/wipState";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Acerca de Nosotros",
  description:
    "Conoce a Grupo DIAPSA: Más de 22 años de experiencia en mantenimiento predictivo industrial. Nuestra historia, misión, visión y el equipo de expertos que respalda la confiabilidad de tu maquinaria.",
  keywords: [
    "Grupo DIAPSA",
    "empresa mantenimiento predictivo",
    "historia DIAPSA",
    "expertos termografía México",
    "consultoría industrial",
  ],
  alternates: {
    canonical: "/acerca-de",
  },
  openGraph: {
    title: "Acerca de Grupo DIAPSA",
    description:
      "Más de 22 años de experiencia en mantenimiento predictivo industrial. Conoce nuestra historia y equipo de expertos.",
    url: "/acerca-de",
    type: "website",
  },
};

export default function AcercaDePage() {
  return (
    <main>
      <PageHeader
        title="ACERCA DE DIAPSA"
        subtitle="Más de 22 años de experiencia en mantenimiento predictivo industrial"
      />

      <section className="w-full bg-white py-16 lg:py-24">
        <WipState />
      </section>
    </main>
  );
}
