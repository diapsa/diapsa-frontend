"use client";

import { useEffect, useRef, useState } from "react";
import Antetitulo from "../atoms/Antetitulo";
import type { ServiceComparadorSonoro } from "@/types/servicio";

/**
 * ComparadorSonoro
 * Dos grabaciones reales de ultrasonido, lado a lado: un componente en
 * condición normal y uno con hallazgo. Cada una con su botón de
 * reproducción, su forma de onda y su nivel en decibeles.
 *
 * Por qué existe: es el diferenciador de ultrasonido, como el par visual y
 * térmico lo es de termografía. El ultrasonido se decide con el oído: el
 * analista escucha el heterodinado del sensor y distingue el siseo parejo
 * de un rodamiento sano del crepitar de uno dañado. Dejar que el visitante
 * lo oiga demuestra la técnica mejor que cualquier párrafo.
 *
 * La forma de onda no se calcula en el navegador: viene precalculada en el
 * JSON (120 valores de envolvente entre 0 y 1) para que se pinte al
 * instante y no haga falta descargar el audio hasta que alguien pulse
 * reproducir. Solo suena una grabación a la vez.
 */

type Props = {
  comparador: ServiceComparadorSonoro;
  paso?: string;
};

export default function ComparadorSonoro({ comparador, paso }: Props) {
  const [activo, setActivo] = useState<number | null>(null);
  const [progreso, setProgreso] = useState(0);
  const audios = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    const lista = audios.current;
    return () => lista.forEach((a) => a?.pause());
  }, []);

  const alternar = (i: number) => {
    const a = audios.current[i];
    if (!a) return;
    if (activo === i) {
      a.pause();
      setActivo(null);
      return;
    }
    audios.current.forEach((otro, j) => { if (j !== i && otro) { otro.pause(); otro.currentTime = 0; } });
    a.currentTime = 0;
    a.play();
    setActivo(i);
  };

  return (
    <section className="w-full bg-primary py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>Lo que oye el analista</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white lg:text-[2.75rem]">
            {comparador.titulo}
          </h2>
          {comparador.texto && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-white/75">{comparador.texto}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {comparador.clips.map((clip, i) => {
            const sonando = activo === i;
            const alarma = clip.estado === "alarma";
            return (
              <div
                key={clip.src}
                className={`rounded-sm border p-6 transition-colors duration-300 ${
                  sonando ? "border-secondary bg-white/10" : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">{clip.etiqueta}</p>
                    <h3 className="mt-1 text-xl font-extrabold text-white">{clip.titulo}</h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      alarma ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {clip.nivel}
                  </span>
                </div>

                {/* Forma de onda: barras de la envolvente, coloreadas hasta el punto de reproducción */}
                <button
                  type="button"
                  onClick={() => alternar(i)}
                  aria-pressed={sonando}
                  aria-label={`${sonando ? "Pausar" : "Reproducir"}: ${clip.titulo}`}
                  className="group mt-5 flex w-full items-center gap-4 rounded-sm text-left"
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                      sonando ? "bg-secondary text-primary" : "bg-white text-primary group-hover:bg-secondary"
                    }`}
                  >
                    {sonando ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <rect x={6} y={5} width={4} height={14} rx={1} />
                        <rect x={14} y={5} width={4} height={14} rx={1} />
                      </svg>
                    ) : (
                      <svg className="ml-1 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 5.5v13a1 1 0 001.5.87l11-6.5a1 1 0 000-1.74l-11-6.5A1 1 0 008 5.5z" />
                      </svg>
                    )}
                  </span>
                  <svg viewBox={`0 0 ${clip.envolvente.length * 3} 40`} className="h-14 w-full" preserveAspectRatio="none" aria-hidden="true">
                    {clip.envolvente.map((v, k) => {
                      const h = Math.max(1.5, v * 38);
                      const pasado = sonando && k / clip.envolvente.length <= progreso;
                      return (
                        <rect
                          key={k}
                          x={k * 3}
                          y={(40 - h) / 2}
                          width={2}
                          height={h}
                          rx={1}
                          className={pasado ? "fill-secondary" : alarma ? "fill-red-400/70" : "fill-emerald-400/70"}
                        />
                      );
                    })}
                  </svg>
                </button>

                <p className="mt-4 text-justify text-sm leading-relaxed text-white/70">{clip.descripcion}</p>

                <audio
                  ref={(el) => { audios.current[i] = el; }}
                  src={clip.src}
                  preload="none"
                  onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setProgreso(a.currentTime / a.duration); }}
                  onEnded={() => { setActivo(null); setProgreso(0); }}
                />
              </div>
            );
          })}
        </div>

        {comparador.pie && (
          <p className="mt-6 max-w-3xl text-justify text-sm leading-relaxed text-white/50">{comparador.pie}</p>
        )}
      </div>
    </section>
  );
}
