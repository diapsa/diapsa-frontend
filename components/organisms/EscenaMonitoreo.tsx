"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EscenaMonitoreo
 * La escena 3D de la página general de monitoreo continuo
 * (lib/escena-monitoreo-continuo.js), hecha por Emiliano en Claude Diseño:
 * los sensores vigilan cuatro equipos, las lecturas llegan a IDAP y en cada
 * vuelta un equipo se alarma con los valores de su disciplina.
 *
 * Mismo montaje que las demás escenas: Three.js por import dinámico cuando
 * la sección se acerca a la pantalla, respaldo por scroll si el
 * IntersectionObserver no avisa y limpieza al desmontar. Mientras carga se
 * reserva el alto con la misma proporción 16:10 de la escena.
 */

export default function EscenaMonitoreo() {
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
      Promise.all([import("three"), import("@/lib/escena-monitoreo-continuo")])
        .then(([THREE, { montarEscenaMonitoreo }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaMonitoreo(THREE, root, { fuente: getComputedStyle(document.body).fontFamily });
            setMontada(true);
          } catch (e) {
            console.warn("[escena monitoreo] no pudo montarse:", e);
          }
        })
        .catch((e) => console.warn("[escena monitoreo] no se pudo cargar:", e));
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
      className={`relative w-full overflow-hidden rounded-2xl ring-1 ring-primary/10 transition-opacity duration-700 ${
        montada ? "opacity-100" : "aspect-[16/10] bg-[#f7faff] opacity-60"
      }`}
    />
  );
}
