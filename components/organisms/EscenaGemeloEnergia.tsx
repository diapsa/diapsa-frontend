"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EscenaGemeloEnergia
 * El gemelo digital de la landing de generación de energía
 * (lib/escena-gemelo-energia.js): criticidad, técnicas recomendadas, rutas
 * y sensores, e indicadores de confiabilidad sobre una central de ciclo
 * combinado. Mismo montaje que las demás escenas: Three.js por import
 * dinámico cuando la sección se acerca, respaldo por scroll y limpieza al
 * desmontar. El fondo azul lo pone este cuadro.
 */
export default function EscenaGemeloEnergia() {
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
      Promise.all([import("three"), import("@/lib/escena-gemelo-energia")])
        .then(([THREE, { montarEscenaGemeloEnergia }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaGemeloEnergia(THREE, root, { fuente: getComputedStyle(document.body).fontFamily });
            setMontada(true);
          } catch (e) {
            console.warn("[gemelo energía] no pudo montarse:", e);
          }
        })
        .catch((e) => console.warn("[gemelo energía] no se pudo cargar:", e));
    };
    const comprobar = () => {
      const r = root.getBoundingClientRect();
      if (r.bottom > -200 && r.top < window.innerHeight + 200) iniciar();
    };
    const observador = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) iniciar();
    }, { rootMargin: "200px" });
    observador.observe(root);
    window.addEventListener("scroll", comprobar, { passive: true });
    comprobar();

    return () => {
      cancelado = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      limpiar?.();
    };
  }, []);

  return (
    <div
      ref={cuadro}
      role="img"
      aria-label="Gemelo digital de una central de ciclo combinado: los equipos se califican por criticidad, se les asignan técnicas, se trazan rutas de inspección y se instalan sensores, y mejoran los indicadores de confiabilidad."
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_center,#16324f_0%,#0b1530_70%)] ring-1 ring-white/10 transition-opacity duration-700 sm:aspect-[16/10] lg:aspect-[16/8] ${montada ? "opacity-100" : "opacity-80"}`}
    />
  );
}
