"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SuccessCase } from "@/types/post";

/**
 * CasosDestacados
 * Los resultados de la portada: los casos de éxito destacados del CMS en un
 * visor con una pestaña por industria. El caso elegido ocupa todo el ancho:
 * su portada, el servicio, el reto en una frase y sus métricas en grande.
 *
 * Por qué así (2026-09-27): Emiliano pidió dejar como resultados solo los
 * casos de éxito y los entregables, sin la franja de cifras de IDAP que
 * todavía no tenía datos reales. Las métricas de los casos sí están
 * documentadas, y en grande dicen más que cuatro tarjetas chicas con una
 * sola cifra cada una. Cambia de caso solo cada nueve segundos y se detiene
 * con el cursor encima o si el visitante pidió reducir el movimiento.
 */

const INTERVALO = 9000;

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function CasosDestacados({ casos }: { casos: SuccessCase[] }) {
  const lista = casos.slice(0, 4);
  const [activo, setActivo] = useState(0);
  const [pausa, setPausa] = useState(false);

  useEffect(() => {
    if (pausa || lista.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reloj = window.setTimeout(() => setActivo((a) => (a + 1) % lista.length), INTERVALO);
    return () => window.clearTimeout(reloj);
  }, [activo, pausa, lista.length]);

  if (lista.length === 0) return null;
  const c = lista[activo];
  const sc = c.success_case;
  const metricas = (sc.metrics ?? []).slice(0, 4);

  return (
    <section className="w-full bg-gray-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6" onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)}>
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Resultados</span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              CASOS DOCUMENTADOS <span className="text-secondary">CON NUESTROS CLIENTES</span>
            </h2>
            <p className="mt-3 text-justify text-tertiary">
              Lo que encontramos y lo que se ahorró, medido en cada planta. Elige una industria.
            </p>
          </div>
          <Link
            href="/casos-exito"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xs bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-secondary hover:text-primary lg:self-auto"
          >
            Ver todos los casos <Flecha />
          </Link>
        </div>

        {/* Una pestaña por caso, con su industria */}
        <div role="tablist" className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
          {lista.map((k, i) => {
            const sel = i === activo;
            return (
              <button
                key={k.id}
                type="button"
                role="tab"
                aria-selected={sel}
                onClick={() => setActivo(i)}
                className={`relative overflow-hidden rounded-sm px-4 py-3 text-left transition-colors ${
                  sel ? "bg-primary text-white" : "bg-white text-primary ring-1 ring-black/5 hover:ring-secondary"
                }`}
              >
                <span className={`block text-xs font-semibold uppercase tracking-wider ${sel ? "text-secondary" : "text-tertiary"}`}>
                  {k.success_case.industry}
                </span>
                <span className="mt-0.5 block text-sm font-bold leading-snug">{k.success_case.service}</span>
                {/* Barra de avance hacia el siguiente caso */}
                {sel && !pausa && lista.length > 1 && (
                  <span
                    key={`barra-${activo}`}
                    className="absolute bottom-0 left-0 h-0.5 bg-secondary motion-safe:animate-[avance_9s_linear_forwards]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
        <style>{`@keyframes avance { from { width: 0 } to { width: 100% } }`}</style>

        {/* El caso elegido */}
        <article
          key={c.id}
          className="grid grid-cols-1 overflow-hidden rounded-sm bg-primary shadow-xl motion-safe:animate-[fadeIn_.4s_ease-out] lg:grid-cols-[5fr_7fr]"
        >
          <div className="relative min-h-[16rem] lg:min-h-full">
            {c.cover_image && (
              <Image src={c.cover_image} alt={c.title} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
              {sc.industry}
            </span>
          </div>
          <div className="flex flex-col p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary">{sc.methodology_name || sc.service}</p>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight lg:text-3xl">{c.title}</h3>
            {(sc.challenge || sc.introduction) && (
              <p className="mt-3 text-justify text-sm leading-relaxed text-white/75">{sc.challenge || sc.introduction}</p>
            )}
            {metricas.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {metricas.map((m) => (
                  <div key={m.label} className="flex flex-col-reverse rounded-sm border border-white/10 bg-white/5 p-4">
                    <dt className="mt-1 text-xs leading-snug text-white/70">{m.label}</dt>
                    <dd className="break-words text-2xl font-extrabold leading-tight text-secondary lg:text-3xl">{m.number}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-auto lg:pt-6">
              <Link
                href={`/casos-exito/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-xs bg-secondary px-6 py-3 font-bold text-primary transition-colors hover:bg-white"
              >
                Ver caso completo <Flecha />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-xs border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:border-secondary hover:text-secondary"
              >
                Quiero resultados así
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
