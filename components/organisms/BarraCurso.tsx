"use client";

import { useEffect, useState } from "react";

/**
 * BarraCurso
 * En celular, la ficha de inscripción queda arriba del todo y al bajar a
 * leer el temario se pierde. Esta barra fija aparece cuando la ficha ya
 * salió de la pantalla y regresa a ella con un toque; deja libre la esquina
 * derecha, donde está el botón flotante de WhatsApp. En escritorio la ficha
 * es fija, así que la barra no se muestra.
 */
export default function BarraCurso({ texto, detalle }: { texto: string; detalle?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ficha = document.getElementById("grupos");
    if (!ficha || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    obs.observe(ficha);
    return () => obs.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-[7.5rem] z-40 lg:hidden motion-safe:animate-[aparecer_.3s_ease-out]">
      <a href="#grupos" className="flex items-center justify-between gap-3 rounded-sm bg-secondary px-4 py-3 text-primary shadow-2xl ring-1 ring-black/10">
        <span className="min-w-0">
          <span className="block text-sm font-extrabold leading-tight">{texto}</span>
          {detalle && <span className="block truncate text-xs leading-tight text-primary/80">{detalle}</span>}
        </span>
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </a>
    </div>
  );
}
