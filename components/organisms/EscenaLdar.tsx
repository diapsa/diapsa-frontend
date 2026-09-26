"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaLdar
 * "Proceso LDAR": el programa completo, de inventario a expediente, sobre
 * un plano de la instalación. Va en la sección del ciclo LDAR de la página
 * de gas, en lugar del circuito dibujado.
 *
 * Mismo montaje que las demás escenas: la lógica vive en lib/escena-ldar.js
 * (diseño en docs/designs/proceso-ldar-escena.html), Three.js se carga por
 * import dinámico cerca de la pantalla y todo se limpia al desmontar. En
 * teléfono la escena crece hacia abajo, así que el cuadro deja de ser 4:3
 * una vez montada.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaLdar({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-ldar")])
        .then(([THREE, { montarEscenaLdar }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaLdar(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escldar] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escldar] no se pudo cargar la escena:", e);
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
          className="escldar overflow-hidden rounded-md shadow-xl ring-1 ring-black/10"
          style={{ width: "100%", aspectRatio: montada ? undefined : "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="Plano de una instalación de gas: se inventarían y clasifican los componentes, se detectan tres fugas con cámara OGI o cámara acústica con láser TDLAS, se priorizan y reparan, se reinspeccionan y el trimestre queda documentado para la ASEA."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
