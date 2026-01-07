import React from "react";

export default function Diapsa360Diagram() {
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definición de gradientes */}
        <defs>
          <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0066cc" />
            <stop offset="30%" stopColor="#0052a3" />
            <stop offset="60%" stopColor="#003d7a" />
            <stop offset="100%" stopColor="#002e46" />
          </radialGradient>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fc9f01" />
            <stop offset="100%" stopColor="#ff8c00" />
          </linearGradient>
        </defs>

        {/* Círculo principal con gradiente */}
        <circle
          cx="300"
          cy="300"
          r="180"
          fill="url(#circleGradient)"
          className="drop-shadow-2xl"
        />

        {/* Anillo externo naranja */}
        <circle
          cx="300"
          cy="300"
          r="200"
          fill="none"
          stroke="url(#orangeGradient)"
          strokeWidth="4"
          opacity="0.6"
        />

        {/* Texto central DIAPSA */}
        <text
          x="300"
          y="280"
          textAnchor="middle"
          className="fill-white text-6xl font-bold"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          DIAPSA
        </text>

        {/* Texto 360 */}
        <text
          x="300"
          y="340"
          textAnchor="middle"
          className="fill-secondary text-7xl font-bold"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          360
        </text>

        {/* Logo DAP en la parte inferior */}
        <text
          x="300"
          y="380"
          textAnchor="middle"
          className="fill-white text-2xl font-semibold tracking-wider"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          DAP
        </text>

        {/* Etiquetas alrededor del círculo */}
        {/* Información (arriba) */}
        <text
          x="300"
          y="80"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          Información
        </text>

        {/* Definición de parámetros (arriba derecha) */}
        <text
          x="480"
          y="140"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          Definición de
        </text>
        <text
          x="480"
          y="160"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          parámetros
        </text>

        {/* Medición de variables (derecha) */}
        <text
          x="540"
          y="300"
          textAnchor="start"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          Medición de
        </text>
        <text
          x="540"
          y="320"
          textAnchor="start"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          variables
        </text>

        {/* Servicios aplicados (abajo derecha) */}
        <text
          x="480"
          y="460"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          Servicios
        </text>
        <text
          x="480"
          y="480"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          aplicados
        </text>

        {/* DAP (abajo) */}
        <text
          x="300"
          y="530"
          textAnchor="middle"
          className="fill-primary text-lg font-bold uppercase"
        >
          DAP
        </text>

        {/* Mejora continua (abajo izquierda) */}
        <text
          x="120"
          y="460"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          Mejora
        </text>
        <text
          x="120"
          y="480"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          continua
        </text>

        {/* Monitoreo de Servicios (izquierda) */}
        <text
          x="50"
          y="300"
          textAnchor="end"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          Monitoreo de
        </text>
        <text
          x="50"
          y="320"
          textAnchor="end"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          Servicios
        </text>

        {/* Implementación (arriba izquierda) */}
        <text
          x="120"
          y="150"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-semibold uppercase"
        >
          Implementación
        </text>

        {/* Líneas conectoras decorativas (opcionales) */}
        <circle cx="300" cy="100" r="3" className="fill-secondary" />
        <circle cx="470" cy="150" r="3" className="fill-secondary" />
        <circle cx="520" cy="300" r="3" className="fill-secondary" />
        <circle cx="470" cy="450" r="3" className="fill-secondary" />
        <circle cx="300" cy="510" r="3" className="fill-secondary" />
        <circle cx="130" cy="450" r="3" className="fill-secondary" />
        <circle cx="80" cy="300" r="3" className="fill-secondary" />
        <circle cx="130" cy="160" r="3" className="fill-secondary" />
      </svg>
    </div>
  );
}
