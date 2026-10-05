"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AZUL_CLARO_DIPLOMADO, FONDO_DIPLOMADO } from "@/lib/diplomado-estilo";

/**
 * CatalogoFiltros
 * El catálogo de cursos con la estructura que Emiliano tomó de NeoPetrol
 * (2026-09-27): a la izquierda los filtros (por técnica y por tipo de curso)
 * y a la derecha una rejilla de tarjetas con foto, etiqueta de la técnica,
 * tipo de curso, nombre, una línea de descripción, la fecha del próximo
 * grupo y "Más información".
 *
 * Los datos llegan ya armados del servidor (CatalogoCursos), así este
 * componente solo filtra. En teléfono los filtros pasan a una fila de
 * pastillas que se desliza de lado.
 */

export type TarjetaCurso = {
  slug: string;
  href: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  tipoClave: string;
  tecnica: string;
  tecnicaClave: string;
  foto?: { src: string; alt: string };
  fecha?: string | null;
  diplomado?: boolean;
};

type Filtro = { clave: string; nombre: string; n: number };

type Props = {
  tarjetas: TarjetaCurso[];
  tecnicas: Filtro[];
  tipos: Filtro[];
  textoTipo: Record<string, string>;
};

function Calendario() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function Boton({ activo, onClick, children, n }: { activo: boolean; onClick: () => void; children: React.ReactNode; n?: number }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`flex shrink-0 items-center justify-between gap-3 rounded-sm px-4 py-2.5 text-left text-sm font-bold transition-colors lg:w-full ${
        activo ? "bg-secondary text-primary" : "bg-white text-primary ring-1 ring-black/5 hover:bg-gray-50 lg:bg-transparent lg:ring-0"
      }`}
    >
      <span>{children}</span>
      {n !== undefined && <span className={`text-xs ${activo ? "text-primary/70" : "text-tertiary"}`}>{n}</span>}
    </button>
  );
}

export default function CatalogoFiltros({ tarjetas, tecnicas, tipos, textoTipo }: Props) {
  const [tecnica, setTecnica] = useState("todos");
  const [tipo, setTipo] = useState("todos");

  const visibles = tarjetas.filter(
    (t) => (tecnica === "todos" || t.tecnicaClave === tecnica) && (tipo === "todos" || t.tipoClave === tipo),
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      {/* Filtros */}
      <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-tertiary">Técnica</p>
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
            <Boton activo={tecnica === "todos"} onClick={() => setTecnica("todos")} n={tarjetas.length}>
              Todos los cursos
            </Boton>
            {tecnicas.map((t) => (
              <Boton key={t.clave} activo={tecnica === t.clave} onClick={() => setTecnica(t.clave)} n={t.n}>
                {t.nombre}
              </Boton>
            ))}
          </div>
        </div>
        <div className="lg:border-t lg:border-gray-200 lg:pt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-tertiary">Tipo de curso</p>
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
            <Boton activo={tipo === "todos"} onClick={() => setTipo("todos")}>
              Todos los tipos
            </Boton>
            {tipos.map((t) => (
              <Boton key={t.clave} activo={tipo === t.clave} onClick={() => setTipo(t.clave)} n={t.n}>
                {t.nombre}
              </Boton>
            ))}
          </div>
        </div>
        <div className="hidden border-t border-gray-200 pt-6 lg:block">
          <Link href="#contacto" className="text-sm font-bold uppercase tracking-wider text-secondary hover:text-primary">
            Cursos para tu empresa →
          </Link>
          <p className="mt-1 text-xs leading-snug text-tertiary">Cualquier curso se imparte en tu planta, con tus equipos.</p>
        </div>
      </aside>

      {/* Tarjetas */}
      <div>
        {tipo !== "todos" && textoTipo[tipo] && (
          <p className="mb-5 rounded-sm border-l-4 border-secondary bg-white px-4 py-3 text-justify text-sm leading-relaxed text-tertiary shadow-sm">
            {textoTipo[tipo]}
          </p>
        )}
        {visibles.length === 0 ? (
          <p className="rounded-sm bg-white p-8 text-center text-tertiary shadow-sm">
            No hay cursos con esa combinación. Prueba con otro filtro o escríbenos y lo armamos para tu equipo.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibles.map((t) => (
              <li key={t.slug}>
                <article className="group flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl">
                  <Link
                    href={t.href}
                    className="relative block h-44 overflow-hidden bg-primary"
                    style={t.diplomado ? { background: FONDO_DIPLOMADO } : undefined}
                  >
                    {t.foto && (
                      <Image
                        src={t.foto.src}
                        alt={t.foto.alt}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw"
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${t.diplomado ? "opacity-25 mix-blend-luminosity" : ""}`}
                      />
                    )}
                    {t.diplomado && (
                      <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-black leading-none tracking-tight text-white">DIPLOMADO</span>
                        <span className="mt-2 text-xs font-bold uppercase tracking-widest" style={{ color: AZUL_CLARO_DIPLOMADO }}>
                          Programa insignia
                        </span>
                      </span>
                    )}
                    <span className="absolute left-0 top-0 bg-primary px-3 py-1.5 text-xs font-semibold text-white">{t.tecnica}</span>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary">{t.tipo}</p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-extrabold leading-snug text-primary">
                      <Link href={t.href} className="hover:text-secondary">
                        {t.titulo}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-justify text-sm leading-relaxed text-tertiary">{t.descripcion}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-tertiary">
                        <Calendario />
                        {t.fecha ?? "Próximo grupo por anunciar · también en tu planta"}
                      </span>
                      <Link
                        href={t.href}
                        className="shrink-0 rounded-full border border-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-primary"
                      >
                        Más información
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
