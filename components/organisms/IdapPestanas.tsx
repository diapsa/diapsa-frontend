"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { ORO_IDAP } from "@/lib/idap-estilo";

/**
 * IdapPestanas
 * Pestañas con texto corto, puntos y una captura de IDAP, como los bloques
 * de Fracttal One. Avanzan solas cada 7 segundos con una barra de
 * progreso (se detienen cuando el visitante elige una o pasa el cursor),
 * el contenido entra con un deslizamiento y la captura va en un marco de
 * navegador que se inclina en 3D siguiendo el cursor.
 *
 * Se usa dos veces en /servicios/idap: los beneficios y los módulos. Las
 * capturas no muestran nombres de clientes.
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

const CICLO = 7000;

export default function IdapPestanas({ pestanas, vertical = false }: { pestanas: PestanaIdap[]; vertical?: boolean }) {
  const [activa, setActiva] = useState(0);
  const [auto, setAuto] = useState(true);
  const [pausa, setPausa] = useState(false);
  const marco = useRef<HTMLDivElement>(null);
  const p = pestanas[activa];

  useEffect(() => {
    if (!auto || pausa) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActiva((a) => (a + 1) % pestanas.length), CICLO);
    return () => clearTimeout(t);
  }, [activa, auto, pausa, pestanas.length]);

  // Inclinación 3D del marco siguiendo el cursor (sin volver a pintar React)
  const inclinar = (e: MouseEvent<HTMLDivElement>) => {
    const el = marco.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };
  const soltar = () => {
    if (marco.current) marco.current.style.transform = "perspective(1100px) rotateY(-6deg) rotateX(3deg)";
    setPausa(false);
  };

  return (
    <div
      className={vertical ? "grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]" : "space-y-10"}
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={soltar}
    >
      <style>{`
        @keyframes idap-barra { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes idap-entra { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
        .idap-entra { animation: idap-entra .6s ease-out both }
        @media (prefers-reduced-motion: reduce) { .idap-entra { animation: none } }
      `}</style>
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
              onClick={() => {
                setActiva(i);
                setAuto(false);
              }}
              className={`relative shrink-0 overflow-hidden rounded-full px-5 py-2.5 text-left text-sm font-bold transition-colors ${
                sel ? "text-[#0a142e]" : "bg-white/5 text-white/75 ring-1 ring-white/15 hover:text-white hover:ring-white/40"
              } ${vertical ? "lg:rounded-sm lg:px-5 lg:py-4 lg:text-base" : ""}`}
              style={sel ? { background: ORO_IDAP } : undefined}
            >
              {x.nombre}
              {sel && auto && (
                <span
                  key={`${activa}-${pausa}`}
                  className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[#0a142e]/35"
                  style={{ animation: pausa ? "none" : `idap-barra ${CICLO}ms linear both` }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div key={p.id} role="tabpanel" className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="idap-entra">
          <h3 className="text-2xl font-extrabold leading-snug text-white lg:text-3xl">{p.titulo}</h3>
          <p className="mt-3 text-justify leading-relaxed text-white/70">{p.texto}</p>
          {p.puntos && (
            <ul className="mt-5 space-y-3">
              {p.puntos.map((t, i) => (
                <li key={t} className="idap-entra flex items-start gap-3 text-sm leading-relaxed text-white/85" style={{ animationDelay: `${150 + i * 120}ms` }}>
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

        {/* Captura en un marco de navegador que se inclina con el cursor */}
        <div className="idap-entra relative" style={{ animationDelay: "120ms" }} onMouseMove={inclinar}>
          <div className="pointer-events-none absolute -inset-6 rounded-full opacity-40 blur-3xl" style={{ background: `radial-gradient(circle, ${ORO_IDAP}40, transparent 70%)` }} />
          <div
            ref={marco}
            className="relative overflow-hidden rounded-lg bg-[#060b1c] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15 transition-transform duration-300 ease-out"
            style={{ transform: "perspective(1100px) rotateY(-6deg) rotateX(3deg)" }}
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <span className="ml-3 flex-1 truncate rounded bg-white/5 px-3 py-0.5 text-[11px] text-white/45">idap · {p.nombre.toLowerCase()}</span>
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src={p.imagen}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={p.ajuste === "contain" ? "object-contain p-3" : "object-cover object-top"}
              />
              {/* Brillo que cruza la pantalla al entrar */}
              <span className="idap-brillo pointer-events-none absolute inset-0" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes idap-brillo { from { transform: translateX(-120%) } to { transform: translateX(120%) } }
        .idap-brillo { background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.12) 50%, transparent 70%); animation: idap-brillo 1.4s .3s ease-out both }
        @media (prefers-reduced-motion: reduce) { .idap-brillo { animation: none; opacity: 0 } }
      `}</style>
    </div>
  );
}
