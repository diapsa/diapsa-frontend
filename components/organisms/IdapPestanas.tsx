"use client";

import { useState } from "react";
import Image from "next/image";
import { ORO_IDAP } from "@/lib/idap-estilo";

/**
 * IdapPestanas
 * Pestañas con texto, puntos y una captura de IDAP, como los bloques de
 * Fracttal One ("Evita el downtime", "Tu centro de mando"). Se usa dos
 * veces en /servicios/idap: los beneficios (con puntos) y los módulos de
 * la plataforma (solo texto). Las capturas no muestran nombres de clientes.
 */

export type PestanaIdap = {
  id: string;
  nombre: string;
  titulo: string;
  texto: string;
  puntos?: string[];
  imagen: string;
  alt: string;
  /** "contain" para gráficos con fondo propio; "cover" para capturas. */
  ajuste?: "contain" | "cover";
};

export default function IdapPestanas({ pestanas, vertical = false }: { pestanas: PestanaIdap[]; vertical?: boolean }) {
  const [activa, setActiva] = useState(0);
  const p = pestanas[activa];

  const lista = (
    <div
      role="tablist"
      className={
        vertical
          ? "flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          : "flex gap-2 overflow-x-auto pb-2 lg:justify-center"
      }
    >
      {pestanas.map((x, i) => {
        const sel = i === activa;
        return (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={sel}
            onClick={() => setActiva(i)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-left text-sm font-bold transition-colors ${
              sel ? "text-[#0a142e]" : "bg-white/5 text-white/75 ring-1 ring-white/15 hover:text-white hover:ring-white/40"
            } ${vertical ? "lg:rounded-sm lg:px-5 lg:py-4 lg:text-base" : ""}`}
            style={sel ? { background: ORO_IDAP } : undefined}
          >
            {x.nombre}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={vertical ? "grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]" : "space-y-8"}>
      {lista}
      <div role="tabpanel" className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <h3 className="text-2xl font-extrabold leading-snug text-white lg:text-3xl">{p.titulo}</h3>
          <p className="mt-4 text-justify leading-relaxed text-white/75">{p.texto}</p>
          {p.puntos && (
            <ul className="mt-6 space-y-3">
              {p.puntos.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: ORO_IDAP }}>
                    <svg className="h-3 w-3 text-[#0a142e]" fill="none" stroke="currentColor" strokeWidth={3.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <span className="text-justify">{t}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#060b1c] shadow-2xl ring-1 ring-white/10">
          <Image
            key={p.imagen}
            src={p.imagen}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={p.ajuste === "contain" ? "object-contain p-3" : "object-cover object-top"}
          />
        </div>
      </div>
    </div>
  );
}
