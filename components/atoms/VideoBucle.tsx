"use client";

import { useEffect, useRef } from "react";

/**
 * VideoBucle
 * Video corto en bucle al estilo Fracttal: sin sonido ni controles, con su
 * imagen fija mientras carga. Arranca con el autoplay del navegador y,
 * además, se pausa fuera de pantalla y se reanuda al volver (el autoplay
 * a veces lo deja detenido). Con prefers-reduced-motion se queda en la
 * imagen fija.
 */
export default function VideoBucle({ src, poster, descripcion, className = "" }: { src: string; poster: string; descripcion: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    const observador = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    observador.observe(v);
    return () => observador.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={descripcion}
    />
  );
}
