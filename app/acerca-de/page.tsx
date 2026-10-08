import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import { MisionVisionSection } from "@/components/organisms/MisionVisionSection";
import { ValuesSection } from "@/components/organisms/ValuesSection";
// import { AITalkAboutUs } from "@/components/organisms/AITalkAboutUs";
import { WhoIsDiapsaSection } from "@/components/organisms/WhoIsDiapsaSection";
import { IdapAdvertisementSection } from "@/components/organisms/IdapAdvertisement";
import { GallerySection } from "@/components/organisms/GallerySection";


export const metadata: Metadata = {
  // Tablero 2026-10-01: 195 impresiones y 1.0 % de clics con "Acerca de Nosotros".
  // Quien llega aquí busca la empresa: el título dice quién es y qué hace.
  title: { absolute: "Grupo DIAPSA: mantenimiento predictivo en México" },
  description:
    "Más de 20 años, +1,500 servicios y +50,000 fallas detectadas antes de parar una planta. Conoce al equipo de monitoreo de condición de Grupo DIAPSA.",
  keywords: [
    "Grupo DIAPSA",
    "empresa mantenimiento predictivo",
    "mantenimiento predictivo",
    "monitoreo de condicion",
    "servicios de mantenimiento",
    "mantenimiento predictivo Sudamerica",
    "historia DIAPSA",
    "expertos termografía México",
    "consultoría industrial",
  ],
  alternates: {
    canonical: "/acerca-de",
  },
  openGraph: {
    title: "Grupo DIAPSA: empresa de mantenimiento predictivo industrial en México",
    description:
      "Especialistas en mantenimiento predictivo, monitoreo de condicion y servicios de mantenimiento para Mexico y Sudamerica.",
    url: "/acerca-de",
    type: "website",
  },
};
export default function AcercaDePage() {
  return (
    <main>
      <PageHeader
        title="Acerca de DIAPSA"
        subtitle="Mantenimiento predictivo y monitoreo de condición para México y Sudamérica"
      />

      <WhoIsDiapsaSection />
      <IdapAdvertisementSection />
      {/* Sección de Misión y Visión */}
      <MisionVisionSection />
      {/* {Valores} */}
      <ValuesSection />

      {/* <AITalkAboutUs /> */}

      <GallerySection />
      {/* Clientes, Servicios, Origen */}
    </main>
  );
}
