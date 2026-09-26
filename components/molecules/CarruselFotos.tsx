"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * CarruselFotos
 * Fotos que se van cambiando solas, con un fundido, sin texto encima.
 * Para las aperturas donde la foto acompaña al texto de al lado (el
 * catálogo de cursos): la explicación ya está en el texto, así que aquí
 * solo va la imagen y unos puntos para saltar de una a otra.
 *
 * Se pausa con el mouse encima o con el foco, y no avanza solo si el
 * usuario pidió menos movimiento.
 */

type Foto = { src: string; alt: string };
type Props = { fotos: Foto[]; intervalo?: number; prioridad?: boolean };

export default function CarruselFotos({ fotos, intervalo = 3000, prioridad = false }: Props) {
  const [activa, setActiva] = useState(0);
  const [pausa, setPausa] = useState(false);
  const total = fotos.length;

  useEffect(() => {
    if (pausa || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reloj = window.setTimeout(() => setActiva((a) => (a + 1) % total), intervalo);
    return () => window.clearTimeout(reloj);
  }, [activa, pausa, total, intervalo]);

  if (total === 0) return null;

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-md bg-primary shadow-xl ring-1 ring-black/10"
      role="group"
      aria-roledescription="carrusel"
      aria-label="Fotografías de cursos de DIAPSA"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      {fotos.map((f, i) => {
        // Solo se montan la anterior (que se desvanece), la activa y la siguiente
        const cerca = i === activa || i === (activa + 1) % total || i === (activa - 1 + total) % total;
        return (
          <div
            key={f.src}
            className={`absolute inset-0 transition-opacity duration-700 ${i === activa ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== activa}
          >
            {cerca && (
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" priority={prioridad && i === 0} />
            )}
          </div>
        );
      })}
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {fotos.map((f, i) => (
          <button
            key={f.src}
            type="button"
            onClick={() => setActiva(i)}
            aria-label={`Ver foto ${i + 1} de ${total}`}
            aria-current={i === activa}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === activa ? "w-6 bg-secondary" : "w-1.5 bg-white/70 hover:bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}
