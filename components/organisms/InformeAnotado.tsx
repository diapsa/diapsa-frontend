"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * InformeAnotado
 * "Esto es lo que recibes" con el informe real señalado: cada punto de la
 * lista ilumina la zona de la página donde aparece y la muestra ampliada.
 * Avanza solo cada pocos segundos; al pasar el cursor o tocar un punto se
 * queda en él. Pedido de Emiliano (2026-09-29): la lista de tarjetas y las
 * páginas sueltas no decían dónde estaba cada cosa.
 *
 * Los recuadros van en porcentaje de cada página, así que sirven a
 * cualquier tamaño.
 */

type Pagina = { src: string; ancho: number; alto: number };
type Punto = { texto: string; pagina: number; recuadro: [number, number, number, number] };

type Props = {
  paginas: Pagina[];
  puntos: Punto[];
  alt: string;
};

const INTERVALO = 4200;

export default function InformeAnotado({ paginas, puntos, alt }: Props) {
  const [activo, setActivo] = useState(0);
  const pausa = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!pausa.current) setActivo((a) => (a + 1) % puntos.length);
    }, INTERVALO);
    return () => window.clearInterval(id);
  }, [puntos.length]);

  const p = puntos[activo];
  const pag = paginas[p.pagina];
  const [x, y, w, h] = p.recuadro;
  // la ampliación: la zona ocupa todo el ancho del recuadro de zoom
  const escala = 100 / w;

  return (
    <div
      className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12"
      onMouseLeave={() => (pausa.current = false)}
    >
      <ol className="space-y-2">
        {puntos.map((pt, i) => {
          const on = i === activo;
          return (
            <li key={pt.texto}>
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
                {pt.texto}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative">
        {/* La página con la zona iluminada */}
        <div className="relative overflow-hidden rounded-md bg-white shadow-[0_30px_70px_-35px_rgba(13,26,56,0.45)] ring-1 ring-black/10">
          <Image
            key={pag.src}
            src={pag.src}
            alt={alt}
            width={pag.ancho}
            height={pag.alto}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <div
            className="pointer-events-none absolute rounded-sm ring-4 ring-secondary transition-all duration-500 ease-out"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${w}%`,
              height: `${h}%`,
              boxShadow: "0 0 0 9999px rgba(13,26,56,0.35)",
            }}
          />
          <span
            className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-black text-primary shadow-lg transition-all duration-500 ease-out"
            style={{ left: `calc(${x}% - 14px)`, top: `calc(${y}% - 14px)` }}
          >
            {activo + 1}
          </span>
        </div>

        {/* La zona ampliada */}
        <div
          className="relative mx-auto -mt-10 w-[88%] overflow-hidden rounded-md bg-white shadow-2xl ring-2 ring-secondary sm:-mt-16"
          style={{ aspectRatio: `${(w * pag.ancho) / (h * pag.alto)}` }}
          aria-hidden="true"
        >
          <div
            className="absolute transition-all duration-500 ease-out"
            style={{
              width: `${escala * 100}%`,
              left: `${-x * escala}%`,
              top: `${(-y / h) * 100}%`,
            }}
          >
            <Image src={pag.src} alt="" width={pag.ancho} height={pag.alto} className="h-auto w-full" sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
        </div>
      </div>
    </div>
  );
}
