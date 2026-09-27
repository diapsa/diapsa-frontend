"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaCursos
 * "Del aula a la planta y a la certificación": la apertura del catálogo de
 * cursos. La lógica vive en lib/escena-cursos.js (diseño en
 * docs/designs/cursos-escena.html); Three.js se carga por import dinámico
 * cerca de la pantalla y todo se limpia al desmontar. En teléfono la escena
 * puede crecer hacia abajo, así que el cuadro deja de ser 4:3 una vez
 * montada.
 */

type Props = {
  foto: { src: string; alt: string };
  pie?: string;
};

export default function EscenaCursos({ foto, pie }: Props) {
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
      Promise.all([import("three"), import("@/lib/escena-cursos")])
        .then(([THREE, { montarEscenaCursos }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaCursos(THREE, root);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[esccur] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[esccur] no se pudo cargar la escena:", e);
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
          className="esccur overflow-hidden rounded-md shadow-xl ring-1 ring-black/10"
          style={{ width: "100%", aspectRatio: montada ? undefined : "4 / 3", background: "linear-gradient(180deg, #fbfcfd 0%, #eef1f4 100%)" }}
          role="img"
          aria-label="Participantes de un curso de DIAPSA aprenden en el aula con casos reales, miden un motor en planta con vibraciones, termografía y ultrasonido, encuentran la falla del rodamiento y obtienen su certificación por categoría."
        />
      </div>
      {pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{pie}</figcaption>}
    </figure>
  );
}
