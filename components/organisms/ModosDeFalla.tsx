"use client";

import { useState } from "react";
import PatronEspectral from "../atoms/PatronEspectral";
import Antetitulo from "../atoms/Antetitulo";
import type { ServiceTabla } from "@/types/servicio";

/**
 * ModosDeFalla
 * Los modos de falla como píldoras, con un espectro grande del seleccionado.
 *
 * Por qué sustituye a la tabla: la tabla pesaba 278 palabras y nueve renglones,
 * el segundo bloque más pesado de la página. De los ocho sitios del sector
 * revisados en Brasil y Estados Unidos, CERO usan tablas; el patrón que se
 * repite es una banda oscura con píldoras de modos de falla y un solo gráfico
 * grande, no ocho miniaturas.
 *
 * No se pierde información: al elegir una píldora se ve su patrón espectral en
 * grande y el detalle de dónde aparece, en qué dirección y cómo se confirma.
 * Texto visible: ~40 palabras en lugar de 278.
 */

type Props = {
  tabla: ServiceTabla;
  paso?: string;
};

export default function ModosDeFalla({ tabla, paso }: Props) {
  const [activo, setActivo] = useState(0);
  const fila = tabla.filas[activo];
  const patron = tabla.patrones?.[activo];

  return (
    <section className="w-full bg-primary py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 max-w-3xl">
          <Antetitulo paso={paso}>Qué detectamos</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white lg:text-[2.75rem]">
            {tabla.titulo}
          </h2>
          {tabla.subtitulo && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-white/75">
              {tabla.subtitulo}
            </p>
          )}
        </div>

        {/* Píldoras */}
        <div className="flex flex-wrap gap-2.5">
          {tabla.filas.map((f, indice) => {
            const seleccionada = indice === activo;
            return (
              <button
                key={f[0]}
                type="button"
                onClick={() => setActivo(indice)}
                aria-pressed={seleccionada}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  seleccionada
                    ? "bg-secondary text-primary"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                {f[0]}
              </button>
            );
          })}
        </div>

        {/* Detalle del modo seleccionado */}
        <div className="mt-8 grid grid-cols-1 gap-8 rounded-sm bg-white/5 p-6 ring-1 ring-white/10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12 lg:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">
              Así se ve en el espectro
            </p>
            <div className="mt-4">
              {patron && (
                <PatronEspectral
                  patron={patron}
                  etiqueta={fila[0]}
                  className="!h-32 !w-full"
                />
              )}
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {tabla.columnas.slice(1).map((columna, i) => (
              <div key={columna}>
                <dt className="text-xs font-bold uppercase tracking-wider text-secondary">
                  {columna}
                </dt>
                <dd className="mt-1 text-base leading-relaxed text-white/85">
                  {fila[i + 1]}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {tabla.nota && (
          <p className="mt-5 max-w-3xl text-justify text-sm leading-relaxed text-white/50">
            {tabla.nota}
          </p>
        )}
      </div>
    </section>
  );
}
