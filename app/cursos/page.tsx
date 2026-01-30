import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import Button from "@/components/atoms/Button";
import WipState from "@/components/molecules/wip/wipState";

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
  const cursos = [
    {
      categoria: "Termografía",
      cursos: [
        {
          title: "Termografía Categoría 1",
          duracion: "40 horas",
          modalidad: "Presencial / En línea",
          descripcion:
            "Introducción a los fundamentos de la termografía infrarroja, teoría del calor, radiación y aplicaciones básicas en el mantenimiento industrial.",
          temas: [
            "Fundamentos de la termografía",
            "Física del calor y radiación",
            "Equipos y cámaras termográficas",
            "Aplicaciones en equipos eléctricos",
            "Interpretación de termogramas",
          ],
        },
        {
          title: "Termografía Categoría 2",
          duracion: "40 horas",
          modalidad: "Presencial",
          descripcion:
            "Curso avanzado que profundiza en técnicas de medición, análisis cuantitativo y resolución de problemas complejos en termografía.",
          temas: [
            "Análisis cuantitativo avanzado",
            "Emisividad y corrección de temperatura",
            "Termografía en equipos mecánicos",
            "Normas y estándares internacionales",
            "Casos de estudio complejos",
          ],
        },
      ],
    },
    {
      categoria: "Vibraciones Mecánicas",
      cursos: [
        {
          title: "Análisis de Vibraciones Categoría 1",
          duracion: "32 horas",
          modalidad: "Presencial / En línea",
          descripcion:
            "Fundamentos del análisis de vibraciones, recolección de datos y diagnóstico básico de fallas en maquinaria rotativa.",
          temas: [
            "Introducción a las vibraciones",
            "Parámetros de medición",
            "Equipos de medición",
            "Diagnóstico de desbalance",
            "Identificación de fallas comunes",
          ],
        },
        {
          title: "Análisis de Vibraciones Categoría 2",
          duracion: "40 horas",
          modalidad: "Presencial",
          descripcion:
            "Análisis avanzado espectral, diagnóstico complejo de fallas y técnicas de monitoreo predictivo continuo.",
          temas: [
            "Análisis espectral avanzado",
            "FFT y análisis en frecuencia",
            "Diagnóstico de rodamientos",
            "Análisis de fase",
            "Programas de monitoreo predictivo",
          ],
        },
      ],
    },
    {
      categoria: "Ultrasonido",
      cursos: [
        {
          title: "Ultrasonido Pasivo Categoría 1",
          duracion: "24 horas",
          modalidad: "Presencial / En línea",
          descripcion:
            "Introducción al ultrasonido pasivo, detección de fugas, inspección de válvulas y análisis de rodamientos.",
          temas: [
            "Fundamentos del ultrasonido",
            "Equipos de ultrasonido",
            "Detección de fugas de aire y gas",
            "Inspección de válvulas",
            "Diagnóstico preliminar de rodamientos",
          ],
        },
      ],
    },
  ];

  return (
    <main>
      <PageHeader
        title="CURSOS"
        subtitle="Capacitación profesional certificada en mantenimiento predictivo"
      />

      <section className="w-full bg-white py-16 lg:py-24">
        <WipState />
      </section>
    </main>
  );
}
