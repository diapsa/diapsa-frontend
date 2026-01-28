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
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      ],
    },
  },
  {
    id: "metodologia",
    title: "METODOLOGÍA",
    content: {
      text: [
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      ],
    },
  },
  {
    id: "resultados",
    title: "RESULTADOS",
    content: {
      text: [
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      ],
    },
  },
];

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <section className="relative w-full bg-white py-16 lg:py-24 overflow-hidden">
      {/* Patrón de fondo decorativo (opcional) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {/* Línea derecha */}
        <div className="absolute hidden lg:block  top-1/2 right-0 w-1/2 h-[140%] border-l-4 border-secondary transform rotate-12 -translate-y-1/2"></div>

        {/* Línea izquierda */}
        <div className="absolute hidden lg:block top-1/2 left-0 w-1/2 h-[140%] border-r-4 border-secondary transform -rotate-12 -translate-y-1/2"></div>
        {/* Círculo inferior izquierdo */}
        <div className="absolute -bottom-40 -left-40 w-125 h-125 rounded-full border-4 border-secondary"></div>

        {/* Círculo superior derecho */}
        <div className="absolute -top-40 -right-40 w-125 h-125 rounded-full border-4 border-secondary"></div>
      </div>

      <div className="max-w-7xl mx-auto bg-gray-400/20">
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
      </div>
    </section>
  );
}
