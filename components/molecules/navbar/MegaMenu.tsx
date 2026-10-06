"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import IconoMenu from "@/components/atoms/IconoMenu";
import { FONDO_IDAP, RUTA_IDAP } from "@/lib/idap-estilo";
import { AZUL_CLARO_DIPLOMADO, FONDO_DIPLOMADO, RUTA_DIPLOMADO } from "@/lib/diplomado-estilo";

/**
 * MegaMenu
 * Panel desplegable a lo ancho de la barra, oscuro como la barra, con
 * columnas que pueden tener formatos distintos.
 *
 * Por qué así: el panel anterior era blanco y todas las columnas eran la
 * misma lista de ícono, nombre y descripción; con diecisiete entradas todo
 * pesaba igual y nada destacaba. La referencia es el menú de Logitech G,
 * que mezcla en un mismo panel un mosaico de íconos para lo principal, una
 * lista simple para lo secundario y tarjetas con foto para lo que se vende
 * con imagen. Cada columna declara su formato:
 *   mosaico   rejilla de fichas con ícono grande y nombre (los nueve
 *             servicios de monitoreo de condición)
 *   lista     solo nombres (monitoreo continuo)
 *   tarjetas  foto con el nombre encima (START, IDAP, gas, situacional)
 *   detalle   ícono, nombre y descripción (cursos y empresa), el formato
 *             de antes, ahora en oscuro
 *
 * Se abre al pasar el ratón y también al hacer clic, para teclado y táctil.
 * Se cierra al salir con el ratón, con Escape, con la equis, al perder el
 * foco o al elegir una entrada. El panel se posiciona respecto a la barra
 * (que es `relative`), no respecto al disparador, para ocupar todo el ancho.
 */

export type EntradaMenu = {
  label: string;
  href: string;
  descripcion?: string;
  icono?: string;
  /** Foto para el formato tarjetas. */
  imagen?: string;
};

export type FormatoColumna = "mosaico" | "lista" | "tarjetas" | "detalle";

export type ColumnaMenu = {
  titulo: string;
  /** Enlace de "Ver todo" junto al título, si la columna tiene página propia. */
  href?: string;
  items: EntradaMenu[];
  /** Cuántas columnas de la rejilla ocupa. */
  ancho?: 1 | 2;
  formato?: FormatoColumna;
};

type Props = {
  trigger: string;
  columnas: ColumnaMenu[];
};

const RETRASO_CIERRE_MS = 120;

function Flecha({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export default function MegaMenu({ trigger, columnas }: Props) {
  const [abierto, setAbierto] = useState(false);
  const temporizador = useRef<number | null>(null);
  const contenedor = useRef<HTMLDivElement>(null);
  const idPanel = useId();

  const abrir = () => {
    if (temporizador.current) window.clearTimeout(temporizador.current);
    setAbierto(true);
  };
  const cerrar = () => {
    if (temporizador.current) window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setAbierto(false), RETRASO_CIERRE_MS);
  };
  const cerrarYa = () => {
    if (temporizador.current) window.clearTimeout(temporizador.current);
    setAbierto(false);
  };

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarYa();
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  const totalColumnas = columnas.reduce((suma, c) => suma + (c.ancho ?? 1), 0);

  return (
    <div
      ref={contenedor}
      onMouseEnter={abrir}
      onMouseLeave={cerrar}
      onBlur={(e) => {
        if (!contenedor.current?.contains(e.relatedTarget as Node)) cerrarYa();
      }}
    >
      <button
        type="button"
        onClick={() => (abierto ? cerrarYa() : abrir())}
        aria-expanded={abierto}
        aria-controls={idPanel}
        className={`relative flex min-h-11 items-center gap-1 rounded-sm px-3 py-2.5 font-medium transition-colors duration-200 ${
          abierto ? "text-secondary" : "hover:text-secondary"
        }`}
      >
        <span>{trigger}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-300 ${abierto ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {/* La raya bajo la pestaña abierta, como en la referencia */}
        {abierto && <span className="absolute inset-x-3 -bottom-2 h-0.5 bg-secondary" aria-hidden="true" />}
      </button>

      {/* El panel vive en el DOM aunque esté cerrado, para que el contenido
          esté en el HTML y el lector de pantalla lo anuncie con aria. */}
      <div
        id={idPanel}
        hidden={!abierto}
        className="absolute inset-x-0 top-full whitespace-normal border-t border-white/10 bg-[#0d0d0d] text-white shadow-2xl motion-safe:animate-[fadeIn_.2s_ease-out]"
      >
        <div className="container relative mx-auto px-4 pb-10 pt-12 sm:px-6 lg:pb-12 lg:pt-14">
          <button
            type="button"
            onClick={cerrarYa}
            aria-label="Cerrar menú"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-6"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="grid gap-x-10 gap-y-8"
            style={{ gridTemplateColumns: `repeat(${totalColumnas}, minmax(0, 1fr))` }}
          >
            {columnas.map((columna) => {
              const formato = columna.formato ?? "detalle";
              return (
                <div key={columna.titulo} className="flex flex-col" style={{ gridColumn: `span ${columna.ancho ?? 1}` }}>
                  {/* Encabezado de altura fija: "Ver todo" siempre a un lado del título
                      (si no cabe, el título se parte en dos renglones) y el contenido
                      de todas las columnas arranca a la misma altura */}
                  <div className="mb-5 flex min-h-[3.25rem] items-center gap-4">
                    <p className="min-w-0 text-sm font-semibold uppercase leading-snug tracking-widest text-white/50">{columna.titulo}</p>
                    {columna.href && (
                      <Link prefetch={false}
                        href={columna.href}
                        onClick={cerrarYa}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-secondary/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary transition-colors duration-200 hover:bg-secondary hover:text-primary"
                      >
                        Ver todo
                        <Flecha />
                      </Link>
                    )}
                  </div>

                  {formato === "mosaico" && (
                    <ul className="grid grid-cols-3 gap-3">
                      {columna.items.map((item) => (
                        <li key={item.href}>
                          <Link prefetch={false}
                            href={item.href}
                            onClick={cerrarYa}
                            title={item.descripcion}
                            className="group flex aspect-[5/4] flex-col items-center justify-center gap-4 rounded-lg bg-[#1a1a1a] px-3 text-center transition-colors duration-200 hover:bg-[#262626]"
                          >
                            <IconoMenu icono={item.icono} oscuro className="h-14 w-14 group-hover:text-secondary" />
                            <span className="text-xs font-bold uppercase leading-snug tracking-wide text-white transition-colors group-hover:text-secondary">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {formato === "lista" && (
                    <ul className="flex flex-col">
                      {columna.items.map((item) => (
                        <li key={item.href}>
                          <Link prefetch={false}
                            href={item.href}
                            onClick={cerrarYa}
                            title={item.descripcion}
                            className="group flex items-center gap-2 py-3 text-base font-medium text-white transition-colors duration-200 hover:text-secondary"
                          >
                            {item.label}
                            <Flecha className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {formato === "tarjetas" && (
                    <ul className="flex flex-1 flex-col gap-3">
                      {columna.items.map((item) => (
                        <li key={item.href} className="flex-1">
                          {item.href === RUTA_IDAP ? (
                            // IDAP conserva su identidad: su logo sobre el azul de la plataforma.
                            <Link prefetch={false}
                              href={item.href}
                              onClick={cerrarYa}
                              title={item.descripcion}
                              aria-label={item.label}
                              className="group relative flex h-full min-h-[6.5rem] items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10 transition-shadow hover:ring-secondary/60"
                              style={{ background: FONDO_IDAP }}
                            >
                              <Image
                                src="/images/idap/idap-bco.png"
                                alt="IDAP"
                                width={1632}
                                height={486}
                                className="h-9 w-auto transition-transform duration-500 group-hover:scale-105"
                              />
                            </Link>
                          ) : item.href === RUTA_DIPLOMADO ? (
                            // El diplomado con la identidad de su brochure.
                            <Link prefetch={false}
                              href={item.href}
                              onClick={cerrarYa}
                              title={item.descripcion}
                              className="group relative flex h-full min-h-[6.5rem] flex-col items-center justify-center overflow-hidden rounded-lg px-4 text-center ring-1 ring-white/10 transition-shadow hover:ring-[#5b8cff]"
                              style={{ background: FONDO_DIPLOMADO }}
                            >
                              {item.imagen && (
                                <Image src={item.imagen} alt="" fill sizes="320px" className="object-cover opacity-20 mix-blend-luminosity" />
                              )}
                              <span className="relative text-3xl font-black leading-none tracking-tight text-white transition-transform duration-500 group-hover:scale-105">
                                DIPLOMADO
                              </span>
                              <span className="relative mt-2 text-xs font-bold uppercase tracking-widest" style={{ color: AZUL_CLARO_DIPLOMADO }}>
                                Confiabilidad operativa
                              </span>
                            </Link>
                          ) : (
                          <Link prefetch={false}
                            href={item.href}
                            onClick={cerrarYa}
                            title={item.descripcion}
                            className="group relative block h-full min-h-[6.5rem] overflow-hidden rounded-lg bg-[#1a1a1a]"
                          >
                            {item.imagen && (
                              <Image
                                src={item.imagen}
                                alt=""
                                fill
                                sizes="320px"
                                className="object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                              />
                            )}
                            <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" aria-hidden="true" />
                            <span className="absolute inset-0 flex items-center justify-center px-3 text-center text-sm font-bold text-white transition-colors group-hover:text-secondary">
                              {item.label}
                            </span>
                          </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {formato === "detalle" && (
                    <ul className={`grid gap-x-8 ${columna.ancho === 2 ? "sm:grid-cols-2" : ""}`}>
                      {columna.items.map((item) => (
                        <li key={item.href}>
                          <Link prefetch={false}
                            href={item.href}
                            onClick={cerrarYa}
                            className="group flex items-start gap-4 rounded-sm py-3 pr-2 transition-colors duration-200"
                          >
                            <IconoMenu icono={item.icono} oscuro />
                            <span className="min-w-0">
                              <span className="flex items-start gap-1.5 font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-secondary">
                                {item.label}
                                <Flecha className="mt-1 h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                              </span>
                              {item.descripcion && (
                                <span className="mt-1 block text-justify text-sm leading-snug text-white/60">{item.descripcion}</span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
