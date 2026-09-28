"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EscenaIdapHero
 * La escena 3D del inicio de /servicios/idap (lib/escena-idap-hero.js):
 * el motor con sensores manda datos al núcleo de IDAP y de ahí al panel
 * con el semáforo.
 *
 * Mismo montaje que las demás escenas: Three.js por import dinámico,
 * respaldo por scroll si el IntersectionObserver no avisa, limpieza al
 * desmontar. Mientras carga, o si no hay WebGL, se ve debajo la imagen
 * que ponga el padre.
 */

export default function EscenaIdapHero() {
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
      Promise.all([import("three"), import("@/lib/escena-idap-hero")])
        .then(([THREE, { montarEscenaIdapHero }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaIdapHero(THREE, root, {});
            setMontada(true);
          } catch (e) {
            console.warn("[escena idap] no pudo montarse:", e);
          }
        })
        .catch((e) => console.warn("[escena idap] no se pudo cargar:", e));
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
      className={`absolute inset-0 transition-opacity duration-1000 ${montada ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    />
  );
}
