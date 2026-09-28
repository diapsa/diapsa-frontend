"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EscenaRecibes
 * La escena 3D de "Lo que recibes": un objeto por entregable (teléfono,
 * informe, monitor de IDAP) que cambia con el paso elegido.
 *
 * Mismo montaje que las demás escenas: la lógica vive en
 * lib/escena-recibes.js (diseño en docs/designs/lo-que-recibes-escena.html),
 * Three.js se carga por import dinámico cerca de la pantalla y todo se
 * limpia al desmontar. Cubre el panel que la contiene; mientras carga, o si
 * no hay WebGL, se ven debajo las vistas planas de LoQueRecibes. Al cambiar
 * de paso no se vuelve a montar: se le pide limpiar.modo().
 */

export type ModoRecibes = "aviso" | "informe" | "idap";
type Limpieza = (() => void) & { modo?: (m: ModoRecibes) => void };

export default function EscenaRecibes({ modo, onMontada }: { modo: ModoRecibes; onMontada?: () => void }) {
  const cuadro = useRef<HTMLDivElement>(null);
  const escena = useRef<Limpieza | null>(null);
  const modoInicial = useRef(modo);
  const avisar = useRef(onMontada);
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
      root.dataset.escena = "cargando";
      Promise.all([import("three"), import("@/lib/escena-recibes")])
        .then(([THREE, { montarEscenaRecibes }]) => {
          if (cancelado) return;
          try {
            escena.current = montarEscenaRecibes(THREE, root, { modo: modoInicial.current });
            root.dataset.escena = "montada";
            setMontada(true);
            avisar.current?.();
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escrecibes] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escrecibes] no se pudo cargar la escena:", e);
        });
    };
    const observador = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) iniciar();
    }, { rootMargin: "400px" });

    root.dataset.escena = "esperando";
    observador.observe(root);

    return () => {
      cancelado = true;
      observador.disconnect();
      escena.current?.();
      escena.current = null;
    };
  }, []);

  // Cambio de paso: la escena montada cambia de objeto con su transición.
  useEffect(() => {
    modoInicial.current = modo;
    escena.current?.modo?.(modo);
  }, [modo]);

  return (
    <div
      ref={cuadro}
      className={`absolute inset-0 transition-opacity duration-500 ${montada ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    />
  );
}
