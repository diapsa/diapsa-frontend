"use client";

import { useState } from "react";
import Antetitulo from "../atoms/Antetitulo";
import EscenaUltrasonido, { type ModoUltrasonido } from "./EscenaUltrasonido";
import type { GrupoSonoro, ServiceComparadorSonoro } from "@/types/servicio";

/**
 * GraficaSonora
 * Gráfica de referencia del ultrasonido: por cada familia de aplicación, la
 * señal de un punto sano y la del mismo punto con hallazgo, más la escala de
 * decibeles con los umbrales de severidad que usa el analista.
 *
 * Por qué existe: es el diferenciador de ultrasonido. Emiliano prefirió una
 * gráfica de referencia a un reproductor de audio, así que aquí no suena
 * nada: se ve. Y como el ultrasonido no es solo para equipos rotativos, el
 * selector separa rodamientos, aire comprimido y tableros eléctricos, que es
 * donde está el resto del mercado. Cada familia tiene su propia firma: el
 * rodamiento dañado crepita con impactos, la fuga es un chorro parejo y la
 * descarga eléctrica estalla a intervalo constante.
 *
 * Las señales de rodamiento son reales, la envolvente de dos grabaciones de
 * una inspección; las otras dos son la firma característica reconstruida, y
 * el marbete de cada familia lo dice. La amplitud de cada onda va en
 * proporción a su nivel medido, para que la diferencia de decibeles también
 * se vea.
 *
 * La maquetación es HTML y no un solo lienzo: los rótulos van encima de cada
 * onda y la escala se arma con posiciones en porcentaje, de modo que en un
 * teléfono todo cabe y el texto conserva su tamaño, sin arrastrar de lado.
 * Lo único dibujado en SVG son las ondas, que se estiran a lo ancho. Las
 * barras crecen al aparecer y al cambiar de familia, bajo motion-safe.
 */

// La pestaña de cada familia y el modo de la escena 3D que le corresponde
const MODO_ESCENA: Record<string, ModoUltrasonido> = { rodamientos: "rodamiento", aire: "fuga", electrico: "descarga" };

type Props = {
  comparador: ServiceComparadorSonoro;
  paso?: string;
};

const COLOR_UMBRAL = [
  { punto: "bg-amber-300", letra: "text-amber-300" },
  { punto: "bg-orange-400", letra: "text-orange-400" },
  { punto: "bg-red-400", letra: "text-red-400" },
];

function decibeles(nivel: string) {
  const n = parseFloat(nivel);
  return Number.isFinite(n) ? n : 0;
}

function primeraFrase(texto: string) {
  const i = texto.indexOf(". ");
  return i > 0 ? texto.slice(0, i + 1) : texto;
}

function Panel({ grupo }: { grupo: GrupoSonoro }) {
  const maxDb = Math.max(...grupo.clips.map((c) => decibeles(c.nivel)), 1);
  const pct = (db: number) => (Math.min(Math.max(db, 0), grupo.escalaMax) / grupo.escalaMax) * 100;

  return (
    <>
      {/* Sano contra hallazgo, uno sobre otro junto a la escena */}
      <div className="grid grid-cols-1 gap-4">
        {grupo.clips.map((clip, fila) => {
          const alarma = clip.estado === "alarma";
          const n = clip.envolvente.length;
          // Amplitud en proporción al nivel medido, con un mínimo para que la señal sana se vea.
          const amp = 50 * Math.max(0.22, decibeles(clip.nivel) / maxDb);
          return (
            <div
              key={clip.titulo}
              className={`rounded-sm p-5 ring-1 ${alarma ? "bg-red-500/[0.07] ring-red-400/30" : "bg-emerald-500/[0.06] ring-emerald-400/25"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/55">{clip.etiqueta}</span>
                <span
                  className={`rounded-full px-3 py-0.5 text-sm font-extrabold ${
                    alarma ? "bg-red-500/25 text-red-300" : "bg-emerald-500/25 text-emerald-300"
                  }`}
                >
                  {clip.nivel}
                </span>
              </div>
              <p className="mt-1 text-lg font-extrabold text-white">{clip.titulo}</p>
              <svg
                viewBox={`0 0 ${n} 100`}
                preserveAspectRatio="none"
                className="mt-3 h-14 w-full"
                role="img"
                aria-label={`Señal de ultrasonido de ${clip.titulo}, ${clip.etiqueta.toLowerCase()}, nivel ${clip.nivel}`}
              >
                <line x1={0} y1={50} x2={n} y2={50} className="stroke-white/15" strokeWidth={0.4} />
                {clip.envolvente.map((v, k) => {
                  const h = Math.max(1.5, v * amp * 2);
                  return (
                    <rect
                      key={k}
                      x={k + 0.15}
                      y={50 - h / 2}
                      width={0.7}
                      height={h}
                      className={`${alarma ? "fill-red-400" : "fill-emerald-400"} motion-safe:animate-[crecer_.5s_ease-out_both]`}
                      style={{ transformOrigin: `${k + 0.5}px 50px`, animationDelay: `${fila * 300 + k * 6}ms` }}
                    />
                  );
                })}
              </svg>
              <p className="mt-3 text-justify text-sm leading-relaxed text-white/65">{primeraFrase(clip.descripcion)}</p>
            </div>
          );
        })}
      </div>

      {/* Una sola barra con los umbrales y dónde cayó cada lectura */}
      <div className="mt-8">
        <div className="relative h-3 w-full overflow-visible rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: "100%",
              background: `linear-gradient(90deg, #34d399 0%, #34d399 ${pct(grupo.umbrales[0]?.db ?? 0)}%, #fcd34d ${pct(grupo.umbrales[0]?.db ?? 0)}%, #fb923c ${pct(grupo.umbrales[1]?.db ?? 0)}%, #f87171 ${pct(grupo.umbrales[2]?.db ?? grupo.escalaMax)}%)`,
              opacity: 0.35,
            }}
          />
          {grupo.clips.map((clip) => {
            const alarma = clip.estado === "alarma";
            return (
              <span
                key={clip.nivel}
                className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-primary motion-safe:animate-[fadeIn_.5s_ease-out_both] ${
                  alarma ? "bg-red-400" : "bg-emerald-400"
                }`}
                style={{ left: `${pct(decibeles(clip.nivel))}%`, animationDelay: "0.8s" }}
                title={`${clip.titulo}: ${clip.nivel}`}
              />
            );
          })}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="text-xs font-semibold text-emerald-300">Normal</span>
          </li>
          {grupo.umbrales.map((u, i) => {
            const color = COLOR_UMBRAL[i] ?? COLOR_UMBRAL[COLOR_UMBRAL.length - 1];
            return (
              <li key={u.texto} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${color.punto}`} aria-hidden="true" />
                <span className={`text-xs font-semibold ${color.letra}`}>{u.texto}</span>
                <span className="text-xs text-white/40">desde {u.db} dB</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default function GraficaSonora({ comparador, paso }: Props) {
  const grupos = comparador.grupos;
  const [activo, setActivo] = useState(grupos[0]?.id);

  return (
    <section className="w-full bg-primary py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 max-w-3xl">
          <Antetitulo paso={paso}>Lo que oye el analista</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white lg:text-[2.75rem]">
            {comparador.titulo}
          </h2>
          {comparador.texto && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-white/75">{comparador.texto}</p>
          )}
        </div>

        {/* Selector de familia: dónde se aplica el ultrasonido, no solo rodamientos. */}
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Familia de aplicación">
          {grupos.map((g) => {
            const abierto = g.id === activo;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                id={`sonora-tab-${g.id}`}
                aria-selected={abierto}
                aria-controls={`sonora-panel-${g.id}`}
                onClick={() => setActivo(g.id)}
                className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-200 ${
                  abierto
                    ? "bg-white text-primary"
                    : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                {g.etiqueta}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* La escena 3D: una sola para las tres familias; cambia de modo
              con la pestaña sin volver a montarse */}
          <div className="relative min-h-[320px] overflow-hidden rounded-sm bg-[#002e46] ring-1 ring-white/10 sm:min-h-[420px]">
            <EscenaUltrasonido modo={MODO_ESCENA[activo ?? ""] ?? "rodamiento"} />
          </div>
        {/* Se remonta al cambiar de familia para que las ondas vuelvan a crecer. */}
        <div key={activo}>
          {grupos.map((g) => {
            const abierto = g.id === activo;
            return (
              <div
                key={g.id}
                id={`sonora-panel-${g.id}`}
                role="tabpanel"
                aria-labelledby={`sonora-tab-${g.id}`}
                hidden={!abierto}
                className="rounded-sm border border-white/10 bg-white/5 p-5 lg:p-8"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white/75">{primeraFrase(g.resumen)}</p>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      g.origen === "real" ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {g.origen === "real" ? "Grabación real" : "Firma característica"}
                  </span>
                </div>
                <Panel grupo={g} />
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
