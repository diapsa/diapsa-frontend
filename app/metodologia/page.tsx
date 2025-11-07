import PageHeader from "@/components/molecules/PageHeader";

export default function MetodologiaPage() {
  const etapas = [
    {
      numero: "01",
      title: "Evaluación Inicial",
      description:
        "Realizamos un diagnóstico completo de tu planta para identificar equipos críticos, prioridades y riesgos potenciales.",
      items: [
        "Levantamiento de equipos",
        "Clasificación por criticidad",
        "Definición de objetivos",
        "Plan de implementación",
      ],
    },
    {
      numero: "02",
      title: "Monitoreo y Medición",
      description:
        "Implementamos tecnologías de monitoreo predictivo usando termografía, vibraciones, ultrasonido y análisis de lubricantes.",
      items: [
        "Instalación de sensores",
        "Mediciones periódicas",
        "Recolección de datos",
        "Análisis en tiempo real",
      ],
    },
    {
      numero: "03",
      title: "Análisis y Diagnóstico",
      description:
        "Nuestro equipo de expertos analiza los datos recopilados utilizando software especializado e inteligencia artificial.",
      items: [
        "Análisis espectral",
        "Identificación de patrones",
        "Diagnóstico de fallas",
        "Predicción de comportamiento",
      ],
    },
    {
      numero: "04",
      title: "Reportes y Recomendaciones",
      description:
        "Entregamos reportes detallados con recomendaciones específicas, prioridades de acción y estimaciones de tiempo.",
      items: [
        "Reportes técnicos detallados",
        "Priorización de acciones",
        "Estimación de costos",
        "Plan de mantenimiento",
      ],
    },
    {
      numero: "05",
      title: "Seguimiento Continuo",
      description:
        "Mantenemos un seguimiento constante del estado de tus equipos, ajustando estrategias según sea necesario.",
      items: [
        "Monitoreo continuo",
        "Actualización de tendencias",
        "Ajuste de estrategias",
        "Mejora continua",
      ],
    },
  ];

  return (
    <div>
      <PageHeader
        title="NUESTRA METODOLOGÍA"
        subtitle="Un enfoque sistemático para maximizar la confiabilidad de tus equipos"
      />

      <section className="w-full bg-white py-16 lg:py-24">

      </section>
    </div>
  );
}
