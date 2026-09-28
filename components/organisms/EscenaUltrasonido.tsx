"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EscenaUltrasonido
 * La escena 3D de "Lo que oye el analista" (lib/escena-ultrasonido.js),
 * hecha por Emiliano en Claude Diseño. Cambia de modo con la pestaña de la
 * sección sin volver a montarse (limpiar.modo).
 *
 * Mismo montaje que las demás escenas: Three.js por import dinámico cerca
 * de la pantalla, respaldo por scroll si el IntersectionObserver no avisa,
 * limpieza al desmontar. Mientras carga, o sin WebGL, el recuadro queda
 * vacío y la sección se sigue leyendo con las ondas de al lado.
 */

export type ModoUltrasonido = "rodamiento" | "fuga" | "descarga";
type Limpieza = (() => void) & { modo?: (m: ModoUltrasonido) => void };

export default function EscenaUltrasonido({ modo }: { modo: ModoUltrasonido }) {
  const cuadro = useRef<HTMLDivElement>(null);
  const escena = useRef<Limpieza | null>(null);
  const modoInicial = useRef(modo);
  const [montada, setMontada] = useState(false);

  useEffect(() => {
    const root = cuadro.current;
    if (!root) return;
    let cancelado = false;
    let iniciada = false;

    const iniciar = () => {
      if (iniciada || cancelado) return;
      iniciada = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      Promise.all([import("three"), import("@/lib/escena-ultrasonido")])
        .then(([THREE, { montarEscenaUltrasonido }]) => {
          if (cancelado) return;
          try {
            escena.current = montarEscenaUltrasonido(THREE, root, {
              modo: modoInicial.current,
              fuente: getComputedStyle(document.body).fontFamily,
            });
            setMontada(true);
          } catch (e) {
            console.warn("[escena ultrasonido] no pudo montarse:", e);
          }
        })
        .catch((e) => console.warn("[escena ultrasonido] no se pudo cargar:", e));
    };
    const comprobar = () => {
      const r = root.getBoundingClientRect();
      if (r.bottom > -300 && r.top < window.innerHeight + 300) iniciar();
    };
    const observador = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) iniciar();
    }, { rootMargin: "300px" });
    observador.observe(root);
    window.addEventListener("scroll", comprobar, { passive: true });
    comprobar();

    return () => {
      cancelado = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      escena.current?.();
      escena.current = null;
    };
  }, []);

  // Cambio de pestaña: la escena montada cambia de modo con su transición
  useEffect(() => {
    modoInicial.current = modo;
    escena.current?.modo?.(modo);
  }, [modo]);

  return (
    <div
      ref={cuadro}
      className={`absolute inset-0 transition-opacity duration-700 ${montada ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    />
  );
}
