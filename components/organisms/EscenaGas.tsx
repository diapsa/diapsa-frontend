"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaGas
 * "Detección de fugas de gas": de la fuga invisible a la cámara OGI, el
 * láser TDLAS, la reparación y el registro. Va a lo ancho en su propia
 * sección de la página de gas.
 *
 * Mismo montaje que las demás escenas: la lógica vive en lib/escena-gas.js
 * (diseño en docs/designs/deteccion-gas-escena.html), Three.js se carga por
 * import dinámico cerca de la pantalla y todo se limpia al desmontar. En
 * teléfono la escena crece hacia abajo, así que el cuadro deja de ser 4:3
 * una vez montada.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaGas({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-gas")])
        .then(([THREE, { montarEscenaGas }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaGas(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escgas] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escgas] no se pudo cargar la escena:", e);
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
          className="escgas overflow-hidden rounded-md shadow-xl ring-1 ring-black/10"
          style={{ width: "100%", aspectRatio: montada ? undefined : "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="Una fuga de gas invisible en una brida: la cámara OGI la hace visible, el láser TDLAS confirma que es metano, se repara, se vuelve a revisar y queda registrada para la ASEA."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
