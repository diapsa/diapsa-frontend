import type { Metadata } from "next";
import ContactLandingForm from "@/components/organisms/ContactLandingForm";
import PageHeader from "@/components/organisms/PageHeader";

export const metadata: Metadata = {
  title: "Expo DIAPSA | Soluciones en Mantenimiento Predictivo Industrial",
  description:
    "Descubre las soluciones de Grupo DIAPSA en mantenimiento predictivo. Regístrate para recibir información sobre nuestros servicios, cursos especializados y tecnología de vanguardia.",
  keywords: [
    "expo DIAPSA",
    "mantenimiento predictivo",
    "cursos industriales",
    "termografía",
    "vibraciones mecánicas",
    "ultrasonido",
  ],
  openGraph: {
    title: "Expo DIAPSA | Soluciones en Mantenimiento Predictivo",
    description:
      "Regístrate y conoce nuestras soluciones industriales. Expertos en mantenimiento predictivo.",
    type: "website",
  },
};

export default function ExpoPage() {
  return (
    <main className="min-h-screen">
        <PageHeader
        title="Solicita más información"
        subtitle="Descubre nuestras soluciones en mantenimiento predictivo industrial. Completa el formulario y recibe información exclusiva sobre nuestros servicios y cursos especializados."
        />
      <ContactLandingForm />
    </main>
  );
}
