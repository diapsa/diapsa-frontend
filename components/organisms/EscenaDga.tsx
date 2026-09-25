"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaDga
 * "DGA en línea": el monitor junto al transformador crítico toma aceite,
 * extrae y mide los gases cada hora, la tendencia sale de su nivel normal,
 * los algoritmos e IA reconocen el patrón, un especialista lo confirma y
 * llega la alerta. Es la apertura de DGA en línea.
 *
 * Mismo montaje que las demás escenas: la lógica vive en lib/escena-dga.js
 * (diseño en docs/designs/dga-en-linea-escena.html), Three.js se carga por
 * import dinámico cerca de la pantalla y todo se limpia al desmontar.
 * Mientras carga, y sin WebGL, se ve la foto real del transformador.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaDga({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-dga")])
        .then(([THREE, { montarEscenaDga }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaDga(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escdga] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escdga] no se pudo cargar la escena:", e);
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
          className="escdga overflow-hidden rounded-md shadow-xl ring-1 ring-black/10"
          style={{ width: "100%", aspectRatio: "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="Un monitor en línea junto al transformador crítico toma aceite, extrae los gases y los mide cada hora; el acetileno y el hidrógeno suben, los algoritmos e IA reconocen una descarga interna, un especialista la confirma y la alerta llega al teléfono."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
