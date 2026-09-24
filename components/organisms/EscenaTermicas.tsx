"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaTermicas
 * "Cámaras térmicas fijas": de la planta a los equipos críticos, la cámara
 * fija midiendo el tablero principal, la fase B saliendo de su
 * comportamiento aprendido, los algoritmos e IA reconociendo el patrón, el
 * sello del termógrafo y la alerta en el teléfono. Es la apertura de
 * cámaras térmicas y cuenta el servicio completo sin párrafos.
 *
 * Generada en Claude Diseño en la misma serie que la escena de sensores
 * (docs/designs/camaras-termicas-escena.html) y portada igual: la lógica
 * vive en lib/escena-termicas.js, Three.js se carga por import dinámico
 * cuando el bloque se acerca a la pantalla (con comprobación manual de
 * respaldo), y todo se limpia al desmontar. Mientras carga, y sin WebGL, se
 * ve un termograma real. El estado queda en `data-escena`.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaTermicas({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-termicas")])
        .then(([THREE, { montarEscenaTermicas }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaTermicas(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escter] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escter] no se pudo cargar la escena:", e);
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
          className="escter overflow-hidden rounded-md shadow-xl ring-1 ring-black/10"
          style={{ width: "100%", aspectRatio: "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="De la planta a los equipos críticos: una cámara térmica fija mide el tablero principal, la fase B sale de su comportamiento aprendido, los algoritmos e IA reconocen el patrón de conexión floja, un termógrafo lo confirma y llega la alerta al teléfono."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
