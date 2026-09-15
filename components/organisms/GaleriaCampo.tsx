"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GaleriaFoto } from "@/types/servicio";

/**
 * GaleriaCampo
 * La franja "DIAPSA en campo": fotos reales de los analistas trabajando,
 * en carrusel.
 *
 * Por qué existe: antes eran tres fotos en una cuadrícula, y tres es todo lo
 * que cabía sin que la página se estirara. En carrusel caben las que haga
 * falta y cada una se ve grande, que es lo que hace el trabajo: la evidencia
 * de que son mediciones propias y no banco de imágenes.
 *
 * Todas las fotos quedan en el HTML y solo se desplaza la tira, así que el
 * buscador las ve todas y el pie de cada una se lee aunque el JavaScript no
 * haya cargado. Se avanza con los botones, con las miniaturas, con las
 * flechas del teclado y arrastrando el dedo. Sin reproducción automática:
 * mueve solo cuando el visitante quiere.
 *
 * Las fotos vienen del JSON del servicio, todas en 4:3, que es el formato en
 * que salen de la cámara, para que el marco no tenga que recortarlas.
 */

type Props = {
  fotos: GaleriaFoto[];
  titulo?: string;
  texto?: string;
};

export default function GaleriaCampo({ fotos, titulo, texto }: Props) {
  const [activa, setActiva] = useState(0);
  const total = fotos.length;
  const marco = useRef<HTMLDivElement>(null);
  const arrastre = useRef<number | null>(null);

  const ir = (i: number) => setActiva(((i % total) + total) % total);

  // Flechas del teclado, solo cuando el carrusel tiene el foco dentro.
  useEffect(() => {
    const nodo = marco.current;
    if (!nodo) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") ir(activa - 1);
      if (e.key === "ArrowRight") ir(activa + 1);
    };
    nodo.addEventListener("keydown", alTeclear);
    return () => nodo.removeEventListener("keydown", alTeclear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa, total]);

  if (total === 0) return null;

  const foto = fotos[activa];

  return (
    <section className="w-full bg-gray-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 lg:mb-10">
          <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {titulo ?? (
              <>
                DIAPSA <span className="text-secondary">en campo</span>
              </>
            )}
          </h2>
          <p className="mt-2 max-w-2xl text-justify text-lg text-tertiary">
            {texto ?? "Nuestros analistas, nuestros equipos y mediciones reales. Sin fotos de banco de imágenes."}
          </p>
        </div>

        <div
          ref={marco}
          tabIndex={-1}
          role="group"
          aria-roledescription="carrusel"
          aria-label="Fotografías de DIAPSA en campo"
          className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-10"
        >
          {/* La foto */}
          <div className="lg:col-span-3">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-primary shadow-md"
              onTouchStart={(e) => {
                arrastre.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const inicio = arrastre.current;
                if (inicio === null) return;
                const corrido = e.changedTouches[0].clientX - inicio;
                if (Math.abs(corrido) > 40) ir(activa + (corrido < 0 ? 1 : -1));
                arrastre.current = null;
              }}
            >
              <div
                className="flex h-full w-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activa * 100}%)` }}
              >
                {fotos.map((f, i) => (
                  <div key={f.src} className="relative h-full w-full shrink-0">
                    <Image
                      src={f.src}
                      alt={f.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Controles sobre la foto */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => ir(activa - 1)}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary/70 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-primary"
                  >
                    <span aria-hidden="true" className="-mt-0.5 text-xl leading-none">
                      ‹
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => ir(activa + 1)}
                    aria-label="Foto siguiente"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary/70 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-primary"
                  >
                    <span aria-hidden="true" className="-mt-0.5 text-xl leading-none">
                      ›
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Pie, cuenta y miniaturas */}
          <div className="flex flex-col lg:col-span-2">
            <p className="text-sm font-bold uppercase tracking-widest text-secondary" aria-live="polite">
              {activa + 1} de {total}
            </p>
            <p className="mt-3 text-justify text-lg leading-relaxed text-primary">{foto.alt}</p>

            {total > 1 && (
              <ul className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:mt-auto lg:grid-cols-4">
                {fotos.map((f, i) => (
                  <li key={f.src}>
                    <button
                      type="button"
                      onClick={() => ir(i)}
                      aria-label={`Ver foto ${i + 1}`}
                      aria-current={i === activa}
                      className={`relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-sm transition-opacity duration-200 ${
                        i === activa ? "ring-2 ring-secondary" : "opacity-50 hover:opacity-90"
                      }`}
                    >
                      <Image src={f.src} alt="" fill className="object-cover" sizes="120px" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
