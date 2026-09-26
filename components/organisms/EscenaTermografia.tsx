"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaTermografia
 * "Termografía infrarroja": ruta con cámara, visor en infrarrojo, conexión
 * caliente, ΔT contra su vecino, prioridad, analista certificado e informe.
 * Va en la primera pestaña de "Qué hacemos" de termografía, como la escena
 * de vibraciones en su página.
 *
 * Mismo montaje que las demás escenas: la lógica vive en
 * lib/escena-termografia.js (diseño en docs/designs/termografia-escena.html),
 * Three.js se carga por import dinámico cerca de la pantalla y todo se
 * limpia al desmontar. Mientras carga, y sin WebGL, se ve la foto.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaTermografia({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-termografia")])
        .then(([THREE, { montarEscenaTermografia }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaTermografia(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escterm] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escterm] no se pudo cargar la escena:", e);
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
          className="escterm overflow-hidden"
          style={{ width: "100%", aspectRatio: "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="Un termógrafo recorre la planta con la cámara; en infrarrojo aparece una conexión caliente en el tablero, se mide su diferencia contra la fase vecina, se clasifica como prioridad 1 y sale en el informe con la acción."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
