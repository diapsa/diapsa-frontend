"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { HojaMuestra } from "@/types/servicio";

/**
 * InformeMuestra
 * "Esto es lo que recibes" con una hoja de informe dibujada en HTML, limpia
 * y a la escala de la página. Emiliano no quiso las capturas del informe
 * real (2026-09-29): muy cargadas y con tablas que no cuadraban. Cada punto
 * de la lista resalta la sección de la hoja que le corresponde (`punto` de
 * cada sección); avanza solo y se queda donde el visitante pasa el cursor.
 *
 * El contenido de la hoja viene del JSON del servicio (entregable.muestra),
 * así sirve igual para ultrasonido que para termografía. Datos de ejemplo,
 * los mismos de los videos de cada página.
 */

type Props = { puntos: string[]; hoja: HojaMuestra };

const INTERVALO = 4200;

/** El número del punto sobre la sección resaltada */
function Numero({ i, activo }: { i: number; activo: number }) {
  if (i !== activo) return null;
  return (
    <span className="absolute -left-3 -top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-black text-primary shadow">
      {i + 1}
    </span>
  );
}

const Titulo = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-wider text-tertiary">{children}</p>
);

export default function InformeMuestra({ puntos, hoja }: Props) {
  const [activo, setActivo] = useState(0);
  const pausa = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!pausa.current) setActivo((a) => (a + 1) % puntos.length);
    }, INTERVALO);
    return () => window.clearInterval(id);
  }, [puntos.length]);

  // Cada sección de la hoja responde a un punto de la lista (por índice)
  const seccion = (i: number) =>
    `relative rounded-lg p-4 transition-all duration-500 ${
      i === activo ? "bg-primary/[0.04] opacity-100 ring-2 ring-secondary" : "opacity-45"
    }`;
  const { lecturas } = hoja;

  return (
    <div
      className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12"
      onMouseLeave={() => (pausa.current = false)}
    >
      <ol className="space-y-2">
        {puntos.map((texto, i) => {
          const on = i === activo;
          return (
            <li key={texto}>
              <button
                type="button"
                onMouseEnter={() => {
                  pausa.current = true;
                  setActivo(i);
                }}
                onFocus={() => setActivo(i)}
                onClick={() => {
                  pausa.current = true;
                  setActivo(i);
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold leading-snug transition-all duration-200 lg:text-base ${
                  on ? "bg-primary text-white shadow-lg" : "bg-gray-50 text-primary ring-1 ring-black/5 hover:bg-white hover:shadow"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    on ? "bg-secondary text-primary" : "bg-primary text-secondary"
                  }`}
                >
                  {i + 1}
                </span>
                {texto}
              </button>
            </li>
          );
        })}
      </ol>

      {/* La hoja del informe */}
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_30px_70px_-35px_rgba(13,26,56,0.45)] ring-1 ring-primary/10">
        <div className="flex items-center justify-between bg-primary px-5 py-3">
          <Image src="/images/logo-diapsa.webp" alt="DIAPSA" width={300} height={69} className="h-7 w-auto" />
          <p className="text-sm font-bold text-white">{hoja.titulo}</p>
        </div>
        <div className="space-y-3 p-5 text-primary">
          {/* Equipo y estado en semáforo */}
          <div className={seccion(hoja.estado.punto)}>
            <Numero i={hoja.estado.punto} activo={activo} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-extrabold">{hoja.equipo}</p>
                <p className="text-xs text-tertiary">{hoja.subtitulo}</p>
              </div>
              <span className="rounded-full px-4 py-1 text-xs font-extrabold text-white" style={{ background: hoja.estado.color }}>
                {hoja.estado.texto}
              </span>
            </div>
          </div>

          {/* Imagen térmica y visual, si el informe las lleva */}
          {hoja.imagen && (
            <div className={seccion(hoja.imagen.punto)}>
              <Numero i={hoja.imagen.punto} activo={activo} />
              <Titulo>{hoja.imagen.titulo}</Titulo>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[hoja.imagen.termica, hoja.imagen.visual].map((src, k) => (
                  <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                    <Image src={src} alt={k === 0 ? hoja.imagen!.altTermica : hoja.imagen!.altVisual} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lecturas por punto contra su referencia */}
          <div className={seccion(lecturas.punto)}>
            <Numero i={lecturas.punto} activo={activo} />
            <Titulo>{lecturas.titulo}</Titulo>
            <div className="mt-3 space-y-2.5">
              {lecturas.filas.map((l) => (
                <div key={l.p} className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 text-sm">
                  <span className="font-semibold">{l.p}</span>
                  <div className="relative h-2.5 rounded-full bg-gray-100">
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(l.valor / lecturas.max) * 100}%`, background: l.color }} />
                    <div className="absolute -top-1 h-[18px] w-0.5 bg-primary/60" style={{ left: `${(l.ref / lecturas.max) * 100}%` }} />
                  </div>
                  <span className="w-24 text-right font-bold" style={{ color: l.color }}>
                    {l.valor} {lecturas.unidad} <span className="text-xs font-semibold text-tertiary">/ {l.ref}</span>
                  </span>
                </div>
              ))}
            </div>
            {lecturas.nota && <p className="mt-2 text-xs text-tertiary">{lecturas.nota}</p>}
          </div>

          {/* Criterios de severidad */}
          {hoja.escala && (
            <div className={seccion(hoja.escala.punto)}>
              <Numero i={hoja.escala.punto} activo={activo} />
              <Titulo>{hoja.escala.titulo}</Titulo>
              <div
                className="mt-3 grid overflow-hidden rounded-md text-center text-[11px] font-bold text-white sm:text-xs"
                style={{ gridTemplateColumns: `repeat(${hoja.escala.niveles.length}, minmax(0, 1fr))` }}
              >
                {hoja.escala.niveles.map((e) => (
                  <div key={e.t} className="px-1 py-2" style={{ background: e.c }}>
                    {e.t}
                    <span className="block font-semibold opacity-90">{e.r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={seccion(hoja.hallazgo.punto)}>
              <Numero i={hoja.hallazgo.punto} activo={activo} />
              <Titulo>Hallazgo</Titulo>
              <p className="mt-1 text-sm font-extrabold">{hoja.hallazgo.titulo}</p>
              <p className="text-sm text-tertiary">{hoja.hallazgo.texto}</p>
            </div>
            <div className={seccion(hoja.recomendacion.punto)}>
              <Numero i={hoja.recomendacion.punto} activo={activo} />
              <Titulo>Recomendación</Titulo>
              <p className="mt-1 text-sm font-extrabold">{hoja.recomendacion.titulo}</p>
              <p className="text-sm text-tertiary">
                Urgencia: <b className="text-red-600">{hoja.recomendacion.urgencia}</b>. {hoja.recomendacion.texto}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
