"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaCalidad
 * "Análisis de calidad de energía": el analizador en el tablero general con
 * la planta operando, la semana de registro, los armónicos fuera de
 * referencia, los variadores que los provocan y la corrección. Es la
 * apertura de calidad de energía.
 *
 * Mismo montaje que las demás escenas: la lógica vive en
 * lib/escena-calidad.js (diseño en docs/designs/calidad-energia-escena.html),
 * Three.js se carga por import dinámico cerca de la pantalla y todo se
 * limpia al desmontar. Mientras carga, y sin WebGL, se ve la foto real del
 * analizador en el tablero.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaCalidad({ foto, pie }: Props) {
  const cuadro = useRef<HTMLDivElement>(null);
  const [montada, setMontada] = useState(false);

  useEffect(() => {
    const root = cuadro.current;
    if (!root) return;
    let cancelado = false;
    let iniciada = false;
    let limpiar: (() => void) | null = null;

    const iniciar = () => {
      if (iniciada || cancelado) return;
      iniciada = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      window.removeEventListener("resize", comprobar);
      root.dataset.escena = "cargando";
      Promise.all([import("three"), import("@/lib/escena-calidad")])
        .then(([THREE, { montarEscenaCalidad }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaCalidad(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[esccal] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[esccal] no se pudo cargar la escena:", e);
        });
    };
    const comprobar = () => {
      const r = root.getBoundingClientRect();
      if (r.bottom > -400 && r.top < window.innerHeight + 400) iniciar();
    };
    const observador = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) iniciar();
    }, { rootMargin: "400px" });

    root.dataset.escena = "esperando";
    observador.observe(root);
    window.addEventListener("scroll", comprobar, { passive: true });
    window.addEventListener("resize", comprobar);
    comprobar();

    return () => {
      cancelado = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      window.removeEventListener("resize", comprobar);
      limpiar?.();
    };
  }, []);

  return (
    <figure>
      <div className="relative">
        {/* Foto real mientras carga la escena, y si no hay WebGL */}
        {!montada && (
          <div className="absolute inset-0 z-10 overflow-hidden rounded-md">
            <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" priority />
          </div>
        )}
        <div
          ref={cuadro}
          className="esccal overflow-hidden rounded-md shadow-xl ring-1 ring-black/10"
          style={{ width: "100%", aspectRatio: montada ? undefined : "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="Un analizador de calidad de energía se conecta al tablero general sin detener la planta, registra una semana, encuentra armónicos por variadores sin filtro y un factor de potencia bajo, y con el filtro y el banco de capacitores desintonizado la energía queda dentro de norma."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
