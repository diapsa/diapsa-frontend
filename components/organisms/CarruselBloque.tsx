"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import IconoMenu from "@/components/atoms/IconoMenu";
import { FONDO_IDAP, ORO_IDAP, PIE_IDAP, RUTA_IDAP } from "@/lib/idap-estilo";
import { AZUL_CLARO_DIPLOMADO, FONDO_DIPLOMADO, PIE_DIPLOMADO, RUTA_DIPLOMADO } from "@/lib/diplomado-estilo";

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
  /** Resumen general del apartado, antes del carrusel. */
  descripcion?: string;
  /** Tres ideas clave del apartado, a un lado del resumen. */
  puntos?: string[];
  /** Ícono del menú (components/atoms/IconoMenu) para la pestaña. */
  icono?: string;
  tarjetas: TarjetaBloque[];
};

type Props = {
  etiqueta?: string;
  titulo: React.ReactNode;
  texto?: string;
  apartados: ApartadoBloque[];
  /** Enlace general del bloque, cuando el apartado no trae el suyo. */
  href?: string;
  /** Foto de fondo del panel azul; cada bloque lleva la suya. */
  fondo?: string;
  intervalo?: number;
};

function Flecha({ izquierda = false }: { izquierda?: boolean }) {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={izquierda ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function CarruselBloque({ etiqueta, titulo, texto, apartados, href, fondo = "/images/screen.webp", intervalo = 5000 }: Props) {
  const [activo, setActivo] = useState(apartados[0]?.id);
  const [pausa, setPausa] = useState(false);
  const pista = useRef<HTMLUListElement>(null);
  const apartado = apartados.find((a) => a.id === activo) ?? apartados[0];
  const [posicion, setPosicion] = useState(0);
  const total = apartado?.tarjetas.length ?? 0;

  const alDesplazar = () => {
    const el = pista.current;
    const tarjeta = el?.querySelector("li");
    if (!el || !tarjeta) return;
    setPosicion(Math.round(el.scrollLeft / (tarjeta.getBoundingClientRect().width + 24)));
  };

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
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-8"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      {/* Panel: el bloque, sus apartados y el resumen del elegido */}
      <div className="relative flex flex-col overflow-hidden rounded-sm bg-primary p-6 text-white shadow-xl sm:p-7">
        {/* De fondo una foto de campo propia del bloque, velada en azul marino */}
        <Image src={fondo} alt="" fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
        <div className="relative">
          {etiqueta && <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">{etiqueta}</span>}
          <h3 className="text-2xl font-extrabold leading-tight text-white lg:text-[1.7rem]">{titulo}</h3>
          {texto && <p className="mt-2 text-justify text-sm leading-relaxed text-white/70">{texto}</p>}

          {apartados.length > 1 && (
            <div role="tablist" aria-orientation="vertical" className="mt-6 flex flex-col gap-2">
              {apartados.map((a) => {
                const sel = a.id === apartado?.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="tab"
                    aria-selected={sel}
                    onClick={() => {
                      setActivo(a.id);
                      setPosicion(0);
                    }}
                    className={`group flex items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors ${
                      sel ? "bg-secondary text-primary" : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {a.icono && (
                      <IconoMenu
                        icono={a.icono}
                        oscuro
                        className={`h-8 w-8 ${sel ? "!text-primary" : "text-white"}`}
                      />
                    )}
                    <span className="min-w-0 flex-1 text-sm font-bold leading-snug">{a.nombre}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${sel ? "bg-primary text-white" : "bg-white/10 text-white/80"}`}>
                      {a.tarjetas.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {(apartado?.descripcion || apartado?.puntos?.length) && (
            <div key={`info-${apartado.id}`} className="mt-6 border-t border-white/10 pt-5 motion-safe:animate-[fadeIn_.3s_ease-out]">
              {apartado.descripcion && <p className="text-justify text-sm leading-relaxed text-white/80">{apartado.descripcion}</p>}
              {apartado.puntos && apartado.puntos.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2">
                  {apartado.puntos.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm font-semibold leading-snug text-white">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {verTodo && (
          <Link prefetch={false}
            href={verTodo}
            className="relative mt-6 inline-flex items-center justify-center gap-2 self-start rounded-xs bg-secondary px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-white lg:mt-auto"
          >
            Ver todo {apartado && apartados.length > 1 ? apartado.nombre.toLowerCase() : ""} <Flecha />
          </Link>
        )}
      </div>

      {/* Carrusel */}
      <div className="flex min-w-0 flex-col">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="font-mono text-sm tabular-nums text-tertiary">
            <span className="font-bold text-primary">{String(Math.min(posicion + 1, total)).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-2">
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

        <ul
          ref={pista}
          onScroll={alDesplazar}
          className="flex flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {apartado?.tarjetas.map((t) => {
            const idap = t.href === RUTA_IDAP;
            const dipl = t.href === RUTA_DIPLOMADO;
            return (
            <li key={t.href + t.titulo} className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)]">
              <Link prefetch={false}
                href={t.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-sm bg-primary shadow-lg transition-shadow duration-300 hover:shadow-2xl"
                style={idap ? { background: PIE_IDAP } : dipl ? { background: PIE_DIPLOMADO } : undefined}
              >
                <div
                  className={`relative min-h-60 w-full flex-1 overflow-hidden lg:min-h-72 ${t.contener ? "bg-white" : ""}`}
                  style={t.href === RUTA_IDAP ? { background: FONDO_IDAP } : dipl ? { background: FONDO_DIPLOMADO } : undefined}
                >
                  {dipl ? (
                    // El diplomado con la identidad de su brochure.
                    <>
                      {t.imagen && (
                        <Image src={t.imagen.src} alt={t.imagen.alt} fill sizes="(min-width: 1024px) 33vw, 85vw" className="object-cover opacity-25 mix-blend-luminosity" />
                      )}
                      <span className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                        <span className="text-4xl font-black leading-none tracking-tight text-white transition-transform duration-500 group-hover:scale-105 lg:text-5xl">
                          DIPLOMADO
                        </span>
                        <span className="mt-3 text-xs font-bold uppercase tracking-widest" style={{ color: AZUL_CLARO_DIPLOMADO }}>
                          Confiabilidad operativa
                        </span>
                      </span>
                    </>
                  ) : t.href === RUTA_IDAP ? (
                    // IDAP conserva su identidad: su logo sobre el azul de la plataforma.
                    <Image
                      src="/images/idap/idap-bco.png"
                      alt="IDAP"
                      width={1632}
                      height={486}
                      className="absolute left-1/2 top-1/2 h-auto w-3/5 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : t.imagen && (
                    <Image
                      src={t.imagen.src}
                      alt={t.imagen.alt}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      className={`transition-transform duration-500 group-hover:scale-105 ${t.contener ? "object-contain p-6" : "object-cover"}`}
                    />
                  )}
                  {!t.contener && t.href !== RUTA_IDAP && !dipl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent" />
                  )}
                </div>
                <div className="flex flex-col p-5">
                  <p
                    className={`mb-1.5 font-bold text-white transition-colors ${
                      idap ? "group-hover:text-[#ffc34d]" : dipl ? "group-hover:text-[#5b8cff]" : "group-hover:text-secondary"
                    }`}
                  >
                    {t.titulo}
                  </p>
                  {t.texto && <p className="text-justify text-sm leading-relaxed text-gray-200">{t.texto}</p>}
                  <span
                    className={`inline-flex items-center gap-1.5 pt-4 text-xs font-bold uppercase tracking-wider ${idap || dipl ? "" : "text-secondary"}`}
                    style={idap ? { color: ORO_IDAP } : dipl ? { color: AZUL_CLARO_DIPLOMADO } : undefined}
                  >
                    {idap ? "Entrar a IDAP" : "Ver más"} <Flecha />
                  </span>
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${idap || dipl ? "" : "bg-secondary"}`}
                  style={idap ? { background: ORO_IDAP } : dipl ? { background: AZUL_CLARO_DIPLOMADO } : undefined}
                />
              </Link>
            </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
