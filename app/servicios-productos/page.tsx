import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import Button from "@/components/atoms/Button";

export const metadata: Metadata = {
  title: "Servicios y Productos",
  description:
    "Servicios de mantenimiento predictivo industrial: Termografía Infrarroja, Análisis de Vibraciones, Ultrasonido, Estudios Eléctricos y Diagnóstico de Maquinaria. Soluciones integrales para tu industria en México.",
  keywords: [
    "servicios mantenimiento predictivo",
    "termografía industrial México",
    "análisis de vibraciones",
    "ultrasonido industrial",
    "diagnóstico de maquinaria",
    "estudios eléctricos industriales",
  ],
  alternates: {
    canonical: "/servicios-productos",
  },
  openGraph: {
    title: "Servicios y Productos | Grupo DIAPSA",
    description:
      "Soluciones integrales de mantenimiento predictivo: termografía, vibraciones, ultrasonido y diagnóstico de maquinaria.",
    url: "/servicios-productos",
    type: "website",
  },
};

export default function ServiciosProductosPage() {
  const servicios = [
    {
      title: "Termografía Infrarroja",
      description:
        "Detección temprana de puntos calientes, conexiones flojas, sobrecargas y fallas en equipos eléctricos y mecánicos mediante cámaras termográficas de alta precisión.",
      features: [
        "Inspección de tableros eléctricos",
        "Análisis de motores y equipos rotativos",
        "Detección de fugas térmicas",
        "Reportes detallados con imágenes térmicas",
      ],
    },
    {
      title: "Análisis de Vibraciones",
      description:
        "Monitoreo continuo y diagnóstico de fallas en maquinaria rotativa mediante análisis espectral de vibraciones, identificando desbalances, desalineaciones y desgastes.",
      features: [
        "Monitoreo de rodamientos",
        "Detección de desbalances",
        "Análisis de desalineaciones",
        "Diagnóstico de holguras mecánicas",
      ],
    },
    {
      title: "Ultrasonido Pasivo",
      description:
        "Detección de fugas de aire comprimido, vapor, gases y fallas en rodamientos mediante equipos de ultrasonido de alta sensibilidad.",
      features: [
        "Detección de fugas de aire",
        "Inspección de válvulas",
        "Análisis de rodamientos en fase temprana",
        "Reducción de costos energéticos",
      ],
    },
    {
      title: "Análisis de Lubricación",
      description:
        "Análisis físico-químico de aceites lubricantes para determinar el estado del lubricante y detectar desgaste prematuro en componentes internos de maquinaria.",
      features: [
        "Análisis de viscosidad",
        "Conteo de partículas",
        "Detección de contaminación",
        "Recomendaciones de cambio de aceite",
      ],
    },
  ];

  return (
    <main>
      <PageHeader
        title="SERVICIOS Y PRODUCTOS"
        subtitle="Soluciones integrales de mantenimiento predictivo para tu industria"
      />

      <section className="w-full bg-white py-16 lg:py-24">

      </section>
    </main>
  );
}
