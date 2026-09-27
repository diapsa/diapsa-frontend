"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * CarruselBloque
 * Un bloque (servicios, cursos, productos) con sus apartados como pestañas
 * y, debajo, un carrusel de tarjetas con foto: tres a la vista en
 * escritorio, dos en tableta y una en teléfono.
 *
 * Por qué así: el navegador de fichas con ícono que había en la portada
 * resultó complejo (23 fichas de golpe). Emiliano prefiere las tarjetas con
 * foto real y pie azul marino de la portada anterior, pocas a la vista y que
 * las demás vayan pasando (2026-09-27). El carrusel es un contenedor con
 * desplazamiento y "scroll snap": se arrastra con el dedo de forma nativa,
 * avanza solo cada cinco segundos y se detiene con el cursor encima, con el
 * foco dentro o si el visitante pidió reducir el movimiento. Todas las
 * tarjetas quedan en el HTML, así el buscador las lee todas.
 */

export type TarjetaBloque = {
  titulo: string;
  texto?: string;
  href: string;
  imagen?: { src: string; alt: string };
  /** Foto de producto con fondo blanco: se muestra completa, sin recortar. */
  contener?: boolean;
};

export type ApartadoBloque = {
  id: string;
  nombre: string;
  /** Página del apartado, para el enlace "Ver todo". */
  href?: string;
  tarjetas: TarjetaBloque[];
};

type Props = {
  etiqueta?: string;
  titulo: React.ReactNode;
  texto?: string;
  apartados: ApartadoBloque[];
  /** Enlace general del bloque, cuando el apartado no trae el suyo. */
  href?: string;
  intervalo?: number;
};

function Flecha({ izquierda = false }: { izquierda?: boolean }) {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={izquierda ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function CarruselBloque({ etiqueta, titulo, texto, apartados, href, intervalo = 5000 }: Props) {
  const [activo, setActivo] = useState(apartados[0]?.id);
  const [pausa, setPausa] = useState(false);
  const pista = useRef<HTMLUListElement>(null);
  const apartado = apartados.find((a) => a.id === activo) ?? apartados[0];

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const tarjeta = el.querySelector("li");
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 24 : el.clientWidth;
    const alFinal = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    const alInicio = el.scrollLeft <= 8;
    if (dir === 1 && alFinal) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && alInicio) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * paso, behavior: "smooth" });
  };

  // Al cambiar de apartado, el carrusel vuelve al principio.
  useEffect(() => {
    pista.current?.scrollTo({ left: 0 });
  }, [activo]);

  useEffect(() => {
    if (pausa) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reloj = window.setInterval(() => mover(1), intervalo);
    return () => window.clearInterval(reloj);
  }, [pausa, intervalo, activo]);

  const verTodo = apartado?.href ?? href;

  return (
    <div
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {etiqueta && <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">{etiqueta}</span>}
          <h3 className="text-2xl font-extrabold text-primary lg:text-3xl">{titulo}</h3>
          {texto && <p className="mt-2 text-justify text-tertiary">{texto}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => mover(-1)}
            aria-label="Anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:border-secondary hover:bg-secondary"
          >
            <Flecha izquierda />
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            aria-label="Siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:border-secondary hover:bg-secondary"
          >
            <Flecha />
          </button>
        </div>
      </div>

      {apartados.length > 1 && (
        <div role="tablist" className="mb-6 flex flex-wrap gap-2">
          {apartados.map((a) => {
            const sel = a.id === apartado?.id;
            return (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={sel}
                onClick={() => setActivo(a.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  sel ? "bg-primary text-white" : "bg-white text-primary ring-1 ring-primary/15 hover:ring-secondary"
                }`}
              >
                {a.nombre}
                <span className={`ml-2 text-xs ${sel ? "text-secondary" : "text-tertiary"}`}>{a.tarjetas.length}</span>
              </button>
            );
          })}
        </div>
      )}

      <ul
        ref={pista}
        className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {apartado?.tarjetas.map((t) => (
          <li key={t.href + t.titulo} className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
            <Link
              href={t.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-sm bg-primary shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className={`relative h-56 w-full overflow-hidden lg:h-64 ${t.contener ? "bg-white" : ""}`}>
                {t.imagen && (
                  <Image
                    src={t.imagen.src}
                    alt={t.imagen.alt}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                    className={`transition-transform duration-500 group-hover:scale-105 ${t.contener ? "object-contain p-6" : "object-cover"}`}
                  />
                )}
                {!t.contener && <div className="absolute inset-0 bg-primary/25 transition-colors duration-300 group-hover:bg-primary/5" />}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="mb-1.5 font-bold text-white transition-colors group-hover:text-secondary">{t.titulo}</p>
                {t.texto && <p className="text-justify text-sm leading-relaxed text-gray-200">{t.texto}</p>}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-secondary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </li>
        ))}
      </ul>

      {verTodo && (
        <div className="mt-4">
          <Link href={verTodo} className="inline-flex items-center gap-2 text-sm font-bold text-secondary transition-colors hover:text-primary">
            Ver todo {apartado && apartados.length > 1 ? apartado.nombre.toLowerCase() : ""} <Flecha />
          </Link>
        </div>
      )}
    </div>
  );
}
