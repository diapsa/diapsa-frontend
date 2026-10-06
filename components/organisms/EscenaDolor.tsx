"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * EscenaDolor
 * La escena 3D de "¿Te suena familiar?" en la página general de monitoreo
 * de condición: la misma planta con dos historias, una por pestaña.
 *
 * Mismo montaje que las demás escenas: la lógica vive en lib/escena-dolor.js
 * (diseño en docs/designs/te-suena-familiar-escena.html), Three.js se carga
 * por import dinámico cerca de la pantalla y todo se limpia al desmontar.
 * Cuando cambia la pestaña no se vuelve a montar: se le pide a la escena que
 * cambie de historia con limpiar.modo().
 */

type Modo = "sin" | "con";
type Limpieza = (() => void) & { modo?: (m: Modo) => void };

const ETIQUETAS: Record<Modo, string> = {
  sin: "Planta sin predictivo: un motor empieza a fallar sin que nadie lo vea, la línea se para y llega el correctivo de emergencia. Con predictivo, la misma falla se detecta semanas antes.",
  con: "Planta con cientos de activos: dos técnicos no terminan la ruta, SAP, SCADA, el CMMS y Excel acumulan datos sin decisión y un equipo se pone en rojo sin que nadie lo note. El analista de DIAPSA recorre toda la ruta y deja tres hallazgos priorizados en IDAP.",
};

type Props = {
  modo: Modo;
  /** Segundo de la historia en que arranca (la portada empieza en el cierre). */
  inicio?: number;
  /** Imagen fija para pantallas chicas: en celular no se monta Three.js
      (Clarity, 2026-10-05: INP de 590 ms y LCP de 5.4 s en la portada). */
  poster?: { src: string; alt: string };
};

export default function EscenaDolor({ modo, inicio = 0, poster }: Props) {
  const cuadro = useRef<HTMLDivElement>(null);
  const escena = useRef<Limpieza | null>(null);
  const modoInicial = useRef(modo);
  const inicioRef = useRef(inicio);
  const [montada, setMontada] = useState(false);
  // undefined mientras no se sabe el ancho (servidor); true en celular
  const [chica, setChica] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (!poster) return setChica(false);
    const mq = window.matchMedia("(max-width: 1023px)");
    setChica(mq.matches);
  }, [poster]);

  useEffect(() => {
    const root = cuadro.current;
    if (!root || chica !== false) return;
    let cancelado = false;
    let iniciada = false;

    const iniciar = () => {
      if (iniciada || cancelado) return;
      iniciada = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      window.removeEventListener("resize", comprobar);
      root.dataset.escena = "cargando";
      // Se carga cuando el navegador está libre, para no competir con la
      // primera pintura ni con el primer toque
      const cuandoLibre = (fn: () => void) =>
        typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 300);
      cuandoLibre(() => Promise.all([import("three"), import("@/lib/escena-dolor")])
        .then(([THREE, { montarEscenaDolor }]) => {
          if (cancelado) return;
          try {
            escena.current = montarEscenaDolor(THREE, root, { modo: modoInicial.current, inicio: inicioRef.current });
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escdolor] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escdolor] no se pudo cargar la escena:", e);
        }));
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
      escena.current?.();
      escena.current = null;
    };
  }, [chica]);

  // Cambio de pestaña: la escena ya montada cambia de historia; si todavía
  // no carga, arrancará con el modo que tenga en ese momento.
  useEffect(() => {
    modoInicial.current = modo;
    escena.current?.modo?.(modo);
  }, [modo]);

  if (poster && chica !== false) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] shadow-2xl ring-1 ring-white/10">
        <Image src={poster.src} alt={poster.alt} fill sizes="100vw" priority className="object-cover" />
      </div>
    );
  }

  return (
    <div
      ref={cuadro}
      className="w-full"
      style={{
        aspectRatio: montada ? undefined : "16 / 9",
        background: montada ? undefined : "#f3f6f8",
        borderRadius: 14,
      }}
      role="img"
      aria-label={ETIQUETAS[modo]}
    />
  );
}
