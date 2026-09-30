"use client";

import { useState } from "react";
import Antetitulo from "../atoms/Antetitulo";
import EscenaUltrasonido, { type ModoUltrasonido } from "./EscenaUltrasonido";
import type { ServiceComparadorSonoro } from "@/types/servicio";

/**
 * GraficaSonora
 * "Cada falla tiene su propia firma sonora": la escena 3D del ultrasonido
 * con un selector por familia de aplicación (rodamientos, aire comprimido y
 * tableros eléctricos) y una línea de qué se oye en cada una.
 *
 * Historia: empezó como gráfica de referencia con la señal sana y la de
 * hallazgo por familia y la escala de decibeles; el 2026-09-29 Emiliano
 * pidió quitar ese panel (ya lo cuentan los videos de "Dónde aplica") y un
 * fondo claro en lugar del azul casi negro. Queda la escena, que cambia de
 * modo con la pestaña sin volver a montarse, dentro de una tarjeta oscura.
 * Los clips siguen en el JSON por si se retoman.
 */

// La pestaña de cada familia y el modo de la escena 3D que le corresponde
const MODO_ESCENA: Record<string, ModoUltrasonido> = { rodamientos: "rodamiento", aire: "fuga", electrico: "descarga" };

type Props = {
  comparador: ServiceComparadorSonoro;
  paso?: string;
};

export default function GraficaSonora({ comparador, paso }: Props) {
  const grupos = comparador.grupos;
  const [activo, setActivo] = useState(grupos[0]?.id);

  const grupoActivo = grupos.find((g) => g.id === activo) ?? grupos[0];

  return (
    <section className="w-full bg-gray-50 py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <Antetitulo paso={paso}>Lo que oye el analista</Antetitulo>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight text-primary lg:text-3xl">{comparador.titulo}</h2>
          {comparador.texto && <p className="mt-3 text-justify text-base leading-relaxed text-tertiary sm:text-center">{comparador.texto}</p>}
        </div>

        {/* Selector de familia: dónde se aplica el ultrasonido, no solo rodamientos. */}
        <div className="mb-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Familia de aplicación">
          {grupos.map((g) => {
            const abierto = g.id === activo;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                id={`sonora-tab-${g.id}`}
                aria-selected={abierto}
                aria-controls="sonora-panel"
                onClick={() => setActivo(g.id)}
                className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-200 ${
                  abierto ? "bg-primary text-white" : "border border-primary/20 text-primary/70 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {g.etiqueta}
              </button>
            );
          })}
        </div>

        {/* La escena 3D: una sola para las tres familias; cambia de modo
            con la pestaña sin volver a montarse */}
        <div
          id="sonora-panel"
          role="tabpanel"
          aria-labelledby={`sonora-tab-${activo}`}
          className="overflow-hidden rounded-2xl bg-[#0b0f19] p-2 shadow-[0_30px_70px_-30px_rgba(10,20,46,0.6)] sm:p-3"
        >
          <div className="relative min-h-[320px] overflow-hidden rounded-xl bg-[#0a2233] sm:min-h-[460px]">
            <EscenaUltrasonido modo={MODO_ESCENA[activo ?? ""] ?? "rodamiento"} />
          </div>
        </div>
        {grupoActivo && <p className="mx-auto mt-5 max-w-3xl text-justify text-base leading-relaxed text-tertiary sm:text-center">{grupoActivo.resumen}</p>}
      </div>
    </section>
  );
}
