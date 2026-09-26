"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaAlineacion
 * "Alineación y balanceo": vibración alta por desalineación, láser con el
 * desfase, corrección con calzas, balanceo con contrapeso y el antes y
 * después medido. Va en la primera pestaña de "Qué hacemos" de alineación y
 * balanceo, como las escenas de vibraciones y termografía.
 *
 * Mismo montaje que las demás escenas: la lógica vive en
 * lib/escena-alineacion.js (diseño en
 * docs/designs/alineacion-balanceo-escena.html), Three.js se carga por
 * import dinámico cerca de la pantalla y todo se limpia al desmontar.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaAlineacion({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-alineacion")])
        .then(([THREE, { montarEscenaAlineacion }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaAlineacion(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escalin] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escalin] no se pudo cargar la escena:", e);
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
          className="escalin overflow-hidden"
          style={{ width: "100%", aspectRatio: "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="Un motor acoplado a una bomba vibra por desalineación; los cabezales láser miden el desfase, se corrige con calzas, se balancea el rotor con un contrapeso y la vibración baja de 7.8 a 1.6 mm/s."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
