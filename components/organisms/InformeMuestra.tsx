"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * InformeMuestra
 * "Esto es lo que recibes" con una hoja de informe de ultrasonido dibujada
 * en HTML, limpia y a la escala de la página. Emiliano no quiso la captura
 * del informe real (2026-09-29): muy cargada y con la tabla de severidad
 * que no cuadraba con las lecturas. Aquí cada punto de la lista resalta su
 * sección de la hoja; avanza solo y se queda donde el visitante pasa el
 * cursor. Datos de ejemplo, los mismos de los videos de la página.
 */

type Props = { puntos: string[] };

const INTERVALO = 4200;
const LECTURAS = [
  { p: "1H · lado acople", db: 47, base: 15, e: "Alarma", c: "#dc2626" },
  { p: "2H · lado libre", db: 29, base: 15, e: "Observación", c: "#d97706" },
  { p: "3H · bomba", db: 18, base: 15, e: "Bueno", c: "#16a34a" },
];
const ESCALA = [
  { t: "Bueno", r: "15 a 23", c: "#16a34a" },
  { t: "Observación", r: "24 a 31", c: "#ca8a04" },
  { t: "Precaución", r: "32 a 39", c: "#ea580c" },
  { t: "Alarma", r: "más de 39", c: "#dc2626" },
];

/** El número del punto sobre la sección resaltada */
function Numero({ i, activo }: { i: number; activo: number }) {
  if (i !== activo) return null;
  return (
    <span className="absolute -left-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-black text-primary shadow">
      {i + 1}
    </span>
  );
}

export default function InformeMuestra({ puntos }: Props) {
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
          <p className="text-sm font-bold text-white">Informe de ultrasonido</p>
        </div>
        <div className="space-y-3 p-5 text-primary">
          {/* 2. Estado en semáforo */}
          <div className={seccion(1)}>
            <Numero i={1} activo={activo} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-extrabold">Motor de bomba de alimentación B</p>
                <p className="text-xs text-tertiary">Ruta mensual · 28/09/2026 · analista Nivel II</p>
              </div>
              <span className="rounded-full bg-red-600 px-4 py-1 text-xs font-extrabold text-white">Alarma</span>
            </div>
          </div>

          {/* 1. Nivel contra línea base */}
          <div className={seccion(0)}>
            <Numero i={0} activo={activo} />
            <p className="text-xs font-bold uppercase tracking-wider text-tertiary">Lecturas por punto · dB</p>
            <div className="mt-3 space-y-2.5">
              {LECTURAS.map((l) => (
                <div key={l.p} className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 text-sm">
                  <span className="font-semibold">{l.p}</span>
                  <div className="relative h-2.5 rounded-full bg-gray-100">
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(l.db / 60) * 100}%`, background: l.c }} />
                    <div className="absolute -top-1 h-[18px] w-0.5 bg-primary/60" style={{ left: `${(l.base / 60) * 100}%` }} title="Línea base" />
                  </div>
                  <span className="w-24 text-right font-bold" style={{ color: l.c }}>
                    {l.db} dB <span className="text-xs font-semibold text-tertiary">/ {l.base}</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-tertiary">La marca es la línea base de cada punto.</p>
          </div>

          {/* 3. Umbrales */}
          <div className={seccion(2)}>
            <Numero i={2} activo={activo} />
            <p className="text-xs font-bold uppercase tracking-wider text-tertiary">Criterios de severidad · dB sobre la línea base</p>
            <div className="mt-3 grid grid-cols-4 overflow-hidden rounded-md text-center text-[11px] font-bold text-white sm:text-xs">
              {ESCALA.map((e) => (
                <div key={e.t} className="px-1 py-2" style={{ background: e.c }}>
                  {e.t}
                  <span className="block font-semibold opacity-90">{e.r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* 4. Componente y causa */}
            <div className={seccion(3)}>
              <Numero i={3} activo={activo} />
              <p className="text-xs font-bold uppercase tracking-wider text-tertiary">Hallazgo</p>
              <p className="mt-1 text-sm font-extrabold">Rodamiento lado acople</p>
              <p className="text-sm text-tertiary">Daño incipiente por falta de lubricación; impactos periódicos al escucharlo.</p>
            </div>
            {/* 5. Acción y urgencia */}
            <div className={seccion(4)}>
              <Numero i={4} activo={activo} />
              <p className="text-xs font-bold uppercase tracking-wider text-tertiary">Recomendación</p>
              <p className="mt-1 text-sm font-extrabold">Lubricar y volver a medir en 7 días</p>
              <p className="text-sm text-tertiary">
                Urgencia: <b className="text-red-600">esta semana</b>. Si no baja, cambiar el rodamiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
