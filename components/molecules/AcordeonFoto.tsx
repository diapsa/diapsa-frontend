"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PuntoIndustria } from "@/types/industria";

/**
 * AcordeonFoto
 * Acordeón de tres puntos con una foto al lado que cambia según el punto
 * abierto, como en las páginas por sector de Fracttal. Solo uno abierto a
 * la vez; el primero empieza abierto. `invertir` pone la foto a la
 * izquierda para alternar bloques.
 */
export default function AcordeonFoto({ items, invertir = false }: { items: PuntoIndustria[]; invertir?: boolean }) {
  const [abierto, setAbierto] = useState(0);
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={`divide-y divide-gray-200 border-y border-gray-200 ${invertir ? "lg:order-2" : ""}`}>
        {items.map((it, k) => {
          const activo = k === abierto;
          return (
            <div key={it.titulo} className="py-5">
              <button
                type="button"
                onClick={() => setAbierto(k)}
                aria-expanded={activo}
                className="flex w-full items-center justify-between gap-4 text-left text-lg font-extrabold text-primary"
              >
                {it.titulo}
                <span aria-hidden="true" className={`shrink-0 text-2xl font-extrabold text-secondary transition-transform duration-200 ${activo ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${activo ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="text-justify text-base leading-relaxed text-tertiary">{it.texto}</p>
                  {it.enlaces && it.enlaces.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                      {it.enlaces.map((e) => (
                        <Link
                          key={e.href + e.nombre}
                          href={e.href}
                          tabIndex={activo ? 0 : -1}
                          className="text-sm font-bold text-primary underline decoration-secondary decoration-2 underline-offset-4 hover:text-secondary"
                        >
                          {e.nombre}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 ${invertir ? "lg:order-1" : ""}`}>
        {items.map((it, k) => (
          <Image
            key={it.foto.src}
            src={it.foto.src}
            alt={it.foto.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={`object-cover transition-opacity duration-500 ${k === abierto ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    </div>
  );
}
