"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import IconoMenu from "@/components/atoms/IconoMenu";

/**
 * MegaMenu
 * Panel desplegable a lo ancho de la barra, con columnas de entradas que
 * llevan ícono, nombre y una línea de descripción.
 *
 * Por qué sustituye al Dropdown: el menú anterior era una lista angosta con
 * un subpanel lateral que aparecía al pasar el ratón. Funcionaba, pero
 * escondía los servicios detrás de dos niveles y no decía nada de cada uno.
 * Las referencias del sector (Dynamox, Fracttal) abren un panel completo
 * donde se ven todos los servicios de golpe, agrupados y con una línea que
 * explica qué es cada uno. Eso es lo que hace este componente.
 *
 * Se abre al pasar el ratón y también al hacer clic, para teclado y táctil.
 * Se cierra al salir con el ratón, con Escape, al perder el foco o al elegir
 * una entrada. El panel se posiciona respecto a la barra (que es `relative`),
 * no respecto al disparador, para que ocupe todo el ancho.
 */

export type EntradaMenu = {
  label: string;
  href: string;
  descripcion?: string;
  icono?: string;
};

export type ColumnaMenu = {
  titulo: string;
  /** Enlace de "Ver todo" al pie del título, si la columna tiene página propia. */
  href?: string;
  items: EntradaMenu[];
  /** Cuántas columnas de la rejilla ocupa. Con 2, las entradas se reparten en dos. */
  ancho?: 1 | 2;
};

type Props = {
  trigger: string;
  columnas: ColumnaMenu[];
};

const RETRASO_CIERRE_MS = 120;

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
        className={`flex min-h-11 items-center gap-1 rounded-sm px-3 py-2.5 font-medium transition-colors duration-200 ${
          abierto ? "bg-white/10 text-secondary" : "hover:text-secondary"
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
      </button>

      {/* El panel vive en el DOM aunque esté cerrado, para que el contenido
          esté en el HTML y el lector de pantalla lo anuncie con aria. */}
      <div
        id={idPanel}
        hidden={!abierto}
        className="absolute inset-x-0 top-full whitespace-normal border-t border-gray-100 bg-white text-primary shadow-2xl motion-safe:animate-[fadeIn_.2s_ease-out]"
      >
        <div
          className="container mx-auto grid gap-x-10 gap-y-8 px-4 py-8 sm:px-6 lg:py-10"
          style={{ gridTemplateColumns: `repeat(${totalColumnas}, minmax(0, 1fr))` }}
        >
          {columnas.map((columna, indice) => (
            <div
              key={columna.titulo}
              className={indice > 0 ? "border-l border-gray-200 pl-10" : ""}
              style={{ gridColumn: `span ${columna.ancho ?? 1}` }}
            >
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <p className="text-sm font-semibold text-tertiary">{columna.titulo}</p>
                {columna.href && (
                  <Link
                    href={columna.href}
                    onClick={cerrarYa}
                    className="text-xs font-bold uppercase tracking-wider text-secondary hover:underline"
                  >
                    Ver todo
                  </Link>
                )}
              </div>

              <ul
                className={`grid gap-x-8 ${columna.ancho === 2 ? "sm:grid-cols-2" : ""}`}
              >
                {columna.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={cerrarYa}
                      className="group flex items-start gap-4 rounded-sm py-3 pr-2 transition-colors duration-200"
                    >
                      <IconoMenu icono={item.icono} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-semibold leading-snug text-primary transition-colors duration-200 group-hover:text-secondary">
                          {item.label}
                          <svg
                            className="h-4 w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.2}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                        {item.descripcion && (
                          <span className="mt-0.5 block text-sm leading-snug text-tertiary">
                            {item.descripcion}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
