"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaHuella
 * "Sensores de huella acústica": el transformador crítico escuchado por un
 * sensor en el tanque, la huella aprendida, el patrón de descarga parcial,
 * los algoritmos e IA, el especialista y la alerta. Es la apertura de
 * sensores acústicos.
 *
 * Misma serie y mismo montaje que EscenaSensores y EscenaTermicas: la
 * lógica vive en lib/escena-huella.js (diseño en
 * docs/designs/huella-acustica-escena.html), Three.js se carga por import
 * dinámico cerca de la pantalla y todo se limpia al desmontar. Mientras
 * carga, y sin WebGL, se ve la foto real de la subestación.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaHuella({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-huella")])
        .then(([THREE, { montarHuellaAcustica }]) => {
          if (cancelado) return;
          try {
            limpiar = montarHuellaAcustica(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[eschue] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[eschue] no se pudo cargar la escena:", e);
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
          className="eschue overflow-hidden rounded-md shadow-xl ring-1 ring-black/10"
          style={{ width: "100%", aspectRatio: "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="Un sensor de huella acústica fijado al tanque escucha un transformador de potencia; los algoritmos e IA detectan una descarga parcial en la fase C, un especialista la confirma y la alerta llega al teléfono."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
