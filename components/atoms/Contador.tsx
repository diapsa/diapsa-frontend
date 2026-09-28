"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Contador
 * Cuenta de 0 al valor cuando entra en pantalla ("300%" cuenta hasta 300 y
 * conserva el %). El valor final va en el HTML del servidor; con
 * prefers-reduced-motion no cuenta.
 */
export default function Contador({ valor, duracion = 1600 }: { valor: string; duracion?: number }) {
  const m = valor.match(/^([^\d]*)(\d+)(.*)$/);
  const meta = m ? Number(m[2]) : 0;
  const cuenta = m !== null;
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !cuenta) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      io.disconnect();
      // El primer cuadro marca el inicio: la marca de tiempo del cuadro puede
      // ser anterior a performance.now() y daba valores negativos
      let t0 = -1;
      const paso = (t: number) => {
        if (t0 < 0) t0 = t;
        const k = Math.max(0, Math.min(1, (t - t0) / duracion));
        setN(Math.round(meta * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [meta, duracion, cuenta]);

  return <span ref={ref}>{m && n !== null ? `${m[1]}${n}${m[3]}` : valor}</span>;
}
