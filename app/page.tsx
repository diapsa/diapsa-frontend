import type { Metadata } from "next";
import Hero from "@/components/organisms/Hero";
import AboutUs from "@/components/organisms/AboutUs";
import TabsSection from "@/components/organisms/TabsSection";
import BlogSection from "@/components/organisms/BlogSection";
import ContactForm from "@/components/organisms/ContactForm";
import { Clients } from "@/components/organisms/Clients";
import IdapIntro from "@/components/organisms/IdapIntro";

export const metadata: Metadata = {
  title: "Inicio | Mantenimiento Predictivo Industrial",
  description:
    "Grupo DIAPSA: Más de 22 años de experiencia en mantenimiento predictivo industrial en México. Termografía infrarroja, análisis de vibraciones, ultrasonido y estudios eléctricos para maximizar la confiabilidad de tus equipos.",
  keywords: [
    "mantenimiento predictivo México",
    "termografía infrarroja industrial",
    "análisis de vibraciones",
    "ultrasonido industrial",
    "diagnóstico de maquinaria",
    "confiabilidad de equipos",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Grupo DIAPSA | Mantenimiento Predictivo Industrial",
    description:
      "Más de 22 años liderando el mantenimiento predictivo industrial en México. Soluciones integrales para la confiabilidad de tus equipos.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutUs />
      <TabsSection />
      <IdapIntro />
      <Clients />
      <BlogSection />
      <ContactForm />
    </main>
  );
}
