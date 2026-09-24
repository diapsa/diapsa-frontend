"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaSensores
 * "Del sensor a tu teléfono": la bomba con tres sensores inalámbricos, la
 * estación base, la tendencia en la plataforma saliendo de su banda normal,
 * la revisión del analista y el aviso en el teléfono. Es la apertura de
 * sensores de vibración: explica el servicio completo sin texto, que es lo
 * que la foto de la instalación no alcanzaba a decir.
 *
 * Generada en Claude Diseño con el mismo estilo que las escenas de
 * vibraciones y del diagnóstico integral
 * (docs/designs/sensores-vibracion-escena.html) y portada igual que ellas:
 * la lógica vive en lib/escena-sensores.js, Three.js se carga por import
 * dinámico cuando el bloque se acerca a la pantalla (con comprobación
 * manual de respaldo), y todo se limpia al desmontar. Mientras carga, y sin
 * WebGL, se ve la foto real de la instalación. El estado queda en
 * `data-escena`.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaSensores({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-sensores")])
        .then(([THREE, { montarEscenaSensores }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaSensores(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escsen] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escsen] no se pudo cargar la escena:", e);
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
          className="escsen shadow-xl ring-1 ring-black/10"
          style={{ minWidth: 0, maxWidth: "none" }}
          role="img"
          aria-label="Un sensor de vibración mide la bomba, la estación base envía los datos, la tendencia sale de su comportamiento normal, un analista la revisa y llega un aviso al teléfono."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
