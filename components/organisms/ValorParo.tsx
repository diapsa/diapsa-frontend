"use client";

import { useState } from "react";
import Antetitulo from "../atoms/Antetitulo";
import type { ServiceValor } from "@/types/servicio";

/**
 * ValorParo
 * "En qué se traduce", en dinero: lo que cuesta un paro por falla sin aviso
 * contra la misma reparación hecha en una ventana programada, con las cifras
 * de la planta de quien lee.
 *
 * Por qué es una calculadora y no una gráfica. No hay cifras de un cliente
 * que se puedan publicar, y un "ahorra 30 %" genérico no convence a nadie
 * que conozca su planta. Aquí el visitante mueve tres números que sí conoce
 * (lo que le cuesta una hora parada, cuánto dura un paro y cuántos tiene al
 * año) y ve el resultado. Los valores iniciales son un ejemplo y lo dice.
 *
 * El cálculo es conservador a propósito: solo cuenta horas de producción.
 * El daño colateral, la refacción urgente y las horas extra quedan fuera y
 * se dice al pie, porque suman y no se pueden estimar sin conocer el equipo.
 */

type Props = {
  valor: ServiceValor;
  paso?: string;
};

const pesos = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

function Control({
  etiqueta,
  valor,
  min,
  max,
  paso,
  mostrar,
  alCambiar,
}: {
  etiqueta: string;
  valor: number;
  min: number;
  max: number;
  paso: number;
  mostrar: string;
  alCambiar: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-primary">{etiqueta}</span>
        <span className="text-lg font-extrabold tabular-nums text-primary">{mostrar}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => alCambiar(Number(e.target.value))}
        className="mt-2 w-full accent-secondary"
      />
    </label>
  );
}

export default function ValorParo({ valor: v, paso }: Props) {
  const [costoHora, setCostoHora] = useState(v.inicial.costoHora);
  const [horasParo, setHorasParo] = useState(v.inicial.horasParo);
  const [paros, setParos] = useState(v.inicial.paros);

  const sinAviso = costoHora * horasParo;
  const conAviso = costoHora * v.horasPlaneada;
  const porParo = Math.max(0, sinAviso - conAviso);
  const alAnio = porParo * paros;
  const pct = sinAviso > 0 ? (conAviso / sinAviso) * 100 : 0;

  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{v.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{v.titulo}</h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{v.texto}</p>
        </div>

        <div className="grid grid-cols-1 overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Las cifras de tu planta */}
          <div className="space-y-7 bg-gray-50 p-6 lg:p-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Pon las cifras de tu planta</p>
            <Control
              etiqueta="Una hora de línea parada"
              valor={costoHora}
              min={10000}
              max={500000}
              paso={5000}
              mostrar={pesos(costoHora)}
              alCambiar={setCostoHora}
            />
            <Control
              etiqueta="Horas que dura un paro por falla"
              valor={horasParo}
              min={2}
              max={72}
              paso={1}
              mostrar={`${horasParo} h`}
              alCambiar={setHorasParo}
            />
            <Control
              etiqueta="Paros por falla al año en tus equipos críticos"
              valor={paros}
              min={1}
              max={12}
              paso={1}
              mostrar={String(paros)}
              alCambiar={setParos}
            />
            <p className="text-justify text-xs leading-relaxed text-tertiary">{v.supuesto}</p>
          </div>

          {/* El resultado */}
          <div className="flex flex-col justify-center bg-primary p-6 text-white lg:p-10">
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-white/75">Sin aviso: la falla te encuentra</span>
                  <span className="font-bold tabular-nums">{pesos(sinAviso)}</span>
                </div>
                <div className="mt-1.5 h-4 w-full rounded-sm bg-red-500" />
              </div>
              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-white/75">Con aviso: la reparas en ventana</span>
                  <span className="font-bold tabular-nums">{pesos(conAviso)}</span>
                </div>
                <div className="mt-1.5 h-4 w-full rounded-sm bg-white/10">
                  <div className="h-full rounded-sm bg-emerald-400 transition-all duration-300" style={{ width: `${Math.max(pct, 1.5)}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Cada paro que se ve venir</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums lg:text-4xl">{pesos(porParo)}</p>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-secondary">Al año, con tus cifras</p>
              <p className="mt-1 text-4xl font-extrabold tabular-nums text-secondary lg:text-5xl">{pesos(alAnio)}</p>
            </div>
            <p className="mt-6 text-justify text-xs leading-relaxed text-white/60">{v.nota}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
