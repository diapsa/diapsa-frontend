"use client";

import { useState } from "react";
import Image from "next/image";

interface TabContent {
  id: string;
  title: string;
  content: {
    text: string[];
    image?: string;
  };
}

const tabs: TabContent[] = [
  {
    id: "problema",
    title: "EL PROBLEMA COMÚN EN LA INDUSTRIA",
    content: {
      text: [
        "En la operación industrial, cada máquina habla: ruidos, vibraciones, temperaturas inusuales: son señales que revelan el estado real de los equipos. Si estas señales no se interpretan a tiempo, pueden convertirse en fallas críticas, paros imprevistos y pérdidas millonarias.",
        "El reto no está solo en detectar anomalías, sino en darles sentido. Sin una interpretación adecuada, las empresas enfrentan altos costos de mantenimiento correctivo, paradas continuas de producción y falta de visibilidad sobre la condición de sus activos.",
      ],

    },
  },
  {
    id: "solucion",
    title: "SOLUCIÓN: DIAPSA 360",
    content: {
      text: [
        "Al igual que en la medicina, un diagnóstico certero no se obtiene con un solo estudio. Revisar únicamente vibraciones, termografía o ultrasonido de manera aislada ofrece una visión parcial del problema. En DIAPSA integramos estas disciplinas dentro de un mismo servicio para obtener una visión 360° del equipo, validar hallazgos entre técnicas y entender la causa real de las fallas."

      ],
    },
  },
  {
    id: "metodologia",
    title: "METODOLOGÍA",
    content: {
      text: [
        "Nuestro servicio ofrece una visión integral del estado y desempeño de los activos mediante un levantamiento técnico especializado. Este proceso permite identificar riesgos, condiciones críticas y áreas de oportunidad que no siempre son evidentes a simple vista. A partir de este entendimiento global, se establece un marco claro para orientar evaluaciones, definir prioridades y alinear las acciones técnicas con las necesidades reales de la operación, generando información confiable que respalda decisiones sólidas y una gestión operativa más efectiva."
      ],
    },
  },
  {
    id: "resultados",
    title: "RESULTADOS",
    content: {
      text: [
        "• 95 % de efectividad en la detección temprana de fallas críticas.",
        "• 150 % de retorno de inversión durante el primer año.",
        "• 90 % de reducción en paros no planificados.",
        "En conjunto, estos resultados demuestran un impacto económico significativo, reflejado en ahorros medibles en miles o incluso millones, gracias a la mejora en eficiencia operativa y prevención de fallas."
      ],
    },
  },
];

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <section className="relative w-full bg-white py-16 lg:py-40 overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <Image
          src="/images/FONDO-360-DIANAS.png"
          alt="Fondo decorativo"
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto bg-gray-400/20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:py-8">
          {/* Tabs verticales - Izquierda */}
          <div className="lg:col-span-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full text-left px-6 py-6  font-semibold text-sm lg:text-base
                  transition-all duration-300 
                  ${activeTab === tab.id
                    ? "bg-linear-to-r from-gray-500/80 to-gray-400/10 text-gray-900  shadow-lg"
                    : " border-transparent  hover:bg-linear-to-r from-gray-500/80 to-gray-400/10 text-gray-900  shadow-lg"
                  }
                `}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Contenido - Derecha */}
          <div className="lg:col-span-7 lg:border-l-gray-300 lg:border-2 p-8 lg:p-16">
            <div className="grid grid-cols-1 gap-8 items-center">
              {/* Texto */}
              <div className="space-y-4">
                {currentTab.content.text.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-700 text-base lg:text-lg leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Imagen (si existe) */}
              {currentTab.content.image && (
                <div className="relative w-full h-64 lg:h-80">
                  <Image
                    src={currentTab.content.image}
                    alt={currentTab.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Motor superpuesto */}
        <div className="hidden lg:block lg:absolute -bottom-60 left-1/2 -translate-x-1/2 lg:w-96 lg:h-96 z-10">
          <Image src="/images/motor.png" alt="Motor" fill className="object-contain drop-shadow-2xl" />
        </div>
      </div>


    </section>
  );
}
