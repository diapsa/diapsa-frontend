"use client";

import { useState } from "react";
import Link from "next/link";
import IlustracionDolor from "@/components/atoms/IlustracionesDolor";
import EscenaDolor from "@/components/organisms/EscenaDolor";

/**
 * DoloresMonitoreo
 * Las tarjetas de "¿Te suena familiar?" en la página general de monitoreo
 * de condición, con dos pestañas.
 *
 * Por qué dos: la planta que no tiene nada de predictivo y la que ya lo
 * tiene pero no le da la capacidad sufren cosas distintas, y cada una tiene
 * que reconocerse en su propia versión. Cada pestaña trae sus cuatro
 * tarjetas y su propia franja de cierre. Las dos quedan en el HTML (la
 * otra solo se oculta), así el buscador lee ambas.
 */

const CASOS = [
  {
    clave: "sin" as const,
    pestana: "Todavía no tengo predictivo",
    dolores: [
      {
        dibujo: "paro",
        titulo: "El paro llegó sin aviso",
        texto: "Una falla inesperada detiene la línea horas o días. El costo no es solo la reparación: es cada hora que la planta no produce.",
      },
      {
        dibujo: "calendario",
        titulo: "Mantenimiento por calendario",
        texto: "Se cambian piezas que todavía sirven y se engrasa lo que no lo necesita porque el manual lo dice. Hasta el exceso de grasa acaba con un rodamiento.",
      },
      {
        dibujo: "almacen",
        titulo: "Almacén lleno de refacciones",
        texto: "Para no quedarse parados, se compra de más por si acaso. Es dinero detenido en un anaquel.",
      },
      {
        dibujo: "datos",
        titulo: "Decisiones sin datos",
        texto: "Nadie sabe con certeza cómo están los equipos. Se decide por intuición, por historial o por urgencia.",
      },
    ],
    cierre: {
      titulo: "Empezar no requiere",
      acento: "comprar nada",
      texto: "No necesitas equipos ni especialistas propios para arrancar. Levantamos el inventario, definimos qué medir en cada equipo y hacemos la primera ruta. Desde ahí ya tienes línea base, hallazgos priorizados e historial en IDAP.",
      boton: "Arrancar mi programa",
    },
  },
  {
    clave: "con" as const,
    pestana: "Ya tengo, pero no me da el tiempo",
    dolores: [
      {
        dibujo: "tiempo",
        titulo: "No hay tiempo para medir y analizar",
        texto: "Recorrer la ruta, tomar la lectura, bajar los datos y analizar cada espectro o cada termograma consume horas que el turno no tiene. Se mide poco y se analiza menos.",
      },
      {
        dibujo: "personal",
        titulo: "Demasiados equipos para tan poca gente",
        texto: "Cientos de motores, bombas, tableros y transformadores para un equipo de mantenimiento que además atiende las urgencias del día. No da para todo.",
      },
      {
        dibujo: "gestion",
        titulo: "Gestionar tantos activos rebasa al equipo",
        texto: "Órdenes de trabajo, rutas, historiales, prioridades e informes se acumulan más rápido de lo que se atienden. El predictivo es lo primero que se queda para después.",
      },
      {
        dibujo: "sistemas",
        titulo: "Sistemas que nadie aprovecha",
        texto: "SAP, SCADA, el CMMS y las hojas de cálculo juntan datos todos los días, pero nadie tiene tiempo de convertirlos en una decisión sobre qué equipo intervenir.",
      },
    ],
    cierre: {
      titulo: "Nosotros ponemos la",
      acento: "capacidad",
      texto: "Nuestros analistas recorren la ruta, miden, analizan y cargan todo en IDAP. Tu equipo recibe solo lo que tiene que decidir: qué equipo, qué falla, qué tan grave y qué hacer. Sin contratar más gente ni aprender otro sistema.",
      boton: "Hablar con un especialista",
    },
  },
];

export default function DoloresMonitoreo() {
  const [activo, setActivo] = useState<"sin" | "con">("sin");

  return (
    <div>
      <div role="tablist" aria-label="Tu situación" className="mx-auto mb-8 grid max-w-2xl grid-cols-2 gap-1 rounded-sm bg-white p-1 shadow-sm ring-1 ring-black/5">
        {CASOS.map((c) => {
          const sel = c.clave === activo;
          return (
            <button
              key={c.clave}
              role="tab"
              id={`tab-dolor-${c.clave}`}
              aria-selected={sel}
              aria-controls={`panel-dolor-${c.clave}`}
              onClick={() => setActivo(c.clave)}
              className={`rounded-sm px-3 py-3 text-sm font-bold leading-snug transition-colors sm:text-base ${
                sel ? "bg-primary text-white" : "text-primary hover:bg-gray-50"
              }`}
            >
              {c.pestana}
            </button>
          );
        })}
      </div>

      <div className="mb-8">
        <EscenaDolor modo={activo} />
      </div>

      {CASOS.map((c) => (
        <div
          key={c.clave}
          role="tabpanel"
          id={`panel-dolor-${c.clave}`}
          aria-labelledby={`tab-dolor-${c.clave}`}
          hidden={c.clave !== activo}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {c.dolores.map((d) => (
              <div key={d.titulo} className="overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
                <div className="h-36 border-b border-gray-100 bg-[#f3f6f8] px-4 py-3 sm:h-40">
                  <IlustracionDolor clave={d.dibujo} />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-bold leading-snug text-primary">{d.titulo}</h3>
                  <p className="text-justify text-sm leading-relaxed text-tertiary">{d.texto}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start gap-5 rounded-sm bg-primary p-6 sm:p-8 md:flex-row md:items-center">
            <div className="flex-1">
              <p className="text-xl font-extrabold text-white">
                {c.cierre.titulo} <span className="text-secondary">{c.cierre.acento}</span>
              </p>
              <p className="mt-2 text-justify text-sm leading-relaxed text-white/75">{c.cierre.texto}</p>
            </div>
            <Link
              href="/contacto?motivo=servicios"
              className="inline-flex shrink-0 items-center gap-2 rounded-xs bg-secondary px-6 py-3 font-bold text-primary transition-colors hover:bg-white"
            >
              {c.cierre.boton}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
