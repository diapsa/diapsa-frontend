"use client";

import { useState } from "react";
import Image from "next/image";
import type { ServiceEntregable } from "@/types/servicio";

/**
 * VitrinaEntregable
 * La parte visual de "Qué recibes": el informe en PDF, escalonado, o la
 * misma inspección como se ve dentro de IDAP, según la pestaña elegida.
 *
 * Por qué existe: Emiliano pidió que "Qué recibes" enseñe cómo se ve en
 * IDAP, no solo el PDF. La captura es de una inspección real en la
 * plataforma (con el equipo, la fecha y los valores, sin el nombre de la
 * planta). Si el servicio no trae captura, se muestra solo el PDF sin
 * pestañas, como antes.
 *
 * Arranca en IDAP porque es lo que diferencia a DIAPSA de quien entrega un
 * PDF por correo. El cambio hace un fundido corto bajo motion-safe.
 */

type Props = {
  entregable: ServiceEntregable;
};

type Vista = "idap" | "pdf";

export default function VitrinaEntregable({ entregable }: Props) {
  const hayIdap = !!entregable.idap;
  const [vista, setVista] = useState<Vista>(hayIdap ? "idap" : "pdf");

  return (
    <div className="mx-auto w-full max-w-xl">
      {hayIdap && (
        <div className="mb-5 flex gap-2" role="tablist" aria-label="Formato del entregable">
          {(
            [
              ["idap", "En IDAP"],
              ["pdf", "Informe PDF"],
            ] as [Vista, string][]
          ).map(([clave, texto]) => {
            const activa = vista === clave;
            return (
              <button
                key={clave}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => setVista(clave)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                  activa ? "bg-primary text-white" : "bg-gray-100 text-tertiary hover:bg-gray-200 hover:text-primary"
                }`}
              >
                {texto}
              </button>
            );
          })}
        </div>
      )}

      {vista === "idap" && entregable.idap && (
        <div key="idap" className="motion-safe:animate-[fadeIn_.4s_ease-out]">
          {/* Marco de navegador oscuro, como se ve la plataforma */}
          <div className="overflow-hidden rounded-md bg-[#0b0f19] shadow-2xl ring-1 ring-black/20">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 rounded-sm bg-white/5 px-3 py-0.5 text-[11px] text-white/50">idap.app</span>
            </div>
            <div className="relative aspect-[1.06] w-full">
              <Image
                src={entregable.idap.src}
                alt={entregable.idap.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>
          {entregable.idap.texto && (
            <p className="mt-4 text-justify text-sm leading-relaxed text-tertiary">{entregable.idap.texto}</p>
          )}
        </div>
      )}

      {vista === "pdf" && (
        <div key="pdf" className="group relative motion-safe:animate-[fadeIn_.4s_ease-out]">
          {/* Página 2 al fondo, girada, asomando por detrás */}
          <div className="absolute right-0 top-6 hidden w-[78%] rotate-[4deg] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5 transition-transform duration-500 motion-safe:group-hover:rotate-[6deg] motion-safe:group-hover:-translate-y-2 sm:block">
            <Image
              src={entregable.paginas[1]}
              alt=""
              aria-hidden="true"
              width={1253}
              height={1457}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 60vw, 380px"
            />
          </div>

          {/* Página 1 al frente */}
          <div className="relative w-[88%] overflow-hidden rounded-sm shadow-2xl ring-1 ring-black/10 transition-transform duration-500 motion-safe:group-hover:-translate-y-1.5">
            <Image
              src={entregable.paginas[0]}
              alt={entregable.altPaginas}
              width={1253}
              height={890}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 90vw, 460px"
            />
          </div>

          {/* Sello flotante con lo que trae el informe */}
          <div className="absolute -bottom-4 right-0 rounded-sm bg-primary px-5 py-3 text-white shadow-xl sm:right-4">
            <p className="text-2xl font-extrabold leading-none text-secondary">{entregable.dato}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/80">{entregable.datoTexto}</p>
          </div>
        </div>
      )}
    </div>
  );
}
