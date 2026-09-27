"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EscenaDolor from "@/components/organisms/EscenaDolor";

/**
 * Hero
 * La primera pantalla de la portada: un carrusel de cuatro diapositivas,
 * una por puerta de entrada (monitoreo de condición, monitoreo continuo,
 * detección de gas y cursos), que rota solo y se puede mover a mano.
 *
 * Por qué carrusel: Emiliano lo prefiere en movimiento (2026-09-27). Lo que
 * sí cambió respecto al original es el contenido: se fueron las cifras que
 * no se sostenían ("+50 cursos", "IA analítica"), la alianza con Hertzinno
 * y la moneda de ITZAM. La primera diapositiva lleva la escena 3D de la
 * planta arrancando en su cierre (el analista recorre la planta y los
 * hallazgos quedan en IDAP); las otras tres, fotos reales. Todas viven en el
 * DOM y se funden por opacidad, así la escena se monta una sola vez.
 */

type Slide = {
  id: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  cta: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  /** Foto de la columna derecha; si falta, va la escena 3D. */
  image?: { src: string; alt: string };
};

const SLIDES: Slide[] = [
  {
    id: "monitoreo",
    badge: "Más de 20 años · Especialistas Categoría 3",
    title: "SABEMOS CÓMO ESTÁ CADA EQUIPO DE TU PLANTA",
    titleHighlight: "ANTES DE QUE FALLE",
    description:
      "Medimos vibraciones, temperatura, ultrasonido, aceite y energía con tus equipos en operación, y te decimos qué intervenir, cuándo y por qué.",
    cta: { label: "Hablar con un especialista", href: "/contacto" },
    ctaSecondary: { label: "Ver monitoreo de condición", href: "/servicios/monitoreo-condicion" },
  },
  {
    id: "continuo",
    badge: "Monitoreo continuo",
    title: "SENSORES EN TUS EQUIPOS CRÍTICOS",
    titleHighlight: "LAS 24 HORAS",
    description:
      "Sensores de vibración, cámaras térmicas fijas, sensores acústicos y DGA en línea para cuando la falla no da tiempo de esperar la siguiente ruta.",
    cta: { label: "Ver monitoreo continuo", href: "/servicios/monitoreo-continuo" },
    ctaSecondary: { label: "Solicitar demo", href: "/contacto" },
    image: { src: "/images/header-sensores.png", alt: "Sensor de vibración instalado en maquinaria industrial" },
  },
  {
    id: "gas",
    badge: "Detección de fugas de gas",
    title: "VE LA FUGA",
    titleHighlight: "ANTES QUE LA MULTA",
    description:
      "Cámara OGI o cámara acústica con láser TDLAS para encontrar fugas invisibles, y programas LDAR para el cumplimiento del PPCIEM ante la ASEA.",
    cta: { label: "Ver detección de gas", href: "/servicios/deteccion-gas" },
    ctaSecondary: { label: "Cotizar inspección", href: "/contacto" },
    image: { src: "/images/deteccion-gas/campo/inspeccion-planta.webp", alt: "Analista de DIAPSA inspeccionando fugas de gas en una planta" },
  },
  {
    id: "cursos",
    badge: "Cursos y certificaciones",
    title: "FORMA A TU GENTE",
    titleHighlight: "CON QUIEN TRABAJA EN CAMPO",
    description:
      "Formación técnica, talleres y certificaciones en vibraciones, termografía y ultrasonido, con respaldo de ITZAM, y el diplomado en confiabilidad operativa.",
    cta: { label: "Ver los cursos", href: "/cursos" },
    ctaSecondary: { label: "Conocer el diplomado", href: "/cursos/diplomado-confiabilidad-operativa" },
    image: { src: "/images/cursos/vibraciones/vibraciones-01.webp", alt: "Grupo en un curso de vibraciones de DIAPSA" },
  },
];

const AUTOPLAY_MS = 7000;
// Segundo de la historia "con" en que entra el analista.
const INICIO_CIERRE = 12.5;

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function Hero() {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);
  const reloj = useRef<number | null>(null);

  useEffect(() => {
    if (pausa) return;
    reloj.current = window.setTimeout(() => setActual((a) => (a + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => {
      if (reloj.current) window.clearTimeout(reloj.current);
    };
  }, [actual, pausa]);

  const irA = (i: number) => setActual((i + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative w-full overflow-hidden bg-primary"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
    >
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-28 lg:min-h-[calc(100vh-5rem)] lg:py-24">
        <div className="relative grid min-h-[36rem] grid-cols-1 items-center gap-10 lg:min-h-[32rem] lg:grid-cols-[5fr_6fr] lg:gap-12">
          {SLIDES.map((s, i) => {
            const activa = i === actual;
            return (
              <div
                key={s.id}
                aria-hidden={!activa}
                className={`col-start-1 row-start-1 grid grid-cols-1 items-center gap-10 transition-opacity duration-700 ease-in-out lg:grid-cols-[5fr_6fr] lg:gap-12 ${
                  activa ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                style={{ gridColumn: "1 / -1" }}
              >
                <div className="flex flex-col">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-secondary lg:text-sm">{s.badge}</p>
                  {i === 0 ? (
                    <h1 className="mb-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                      {s.title} <span className="text-secondary">{s.titleHighlight}</span>
                    </h1>
                  ) : (
                    <p role="heading" aria-level={2} className="mb-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                      {s.title} <span className="text-secondary">{s.titleHighlight}</span>
                    </p>
                  )}
                  <p className="mb-8 max-w-xl text-justify text-base leading-relaxed text-white/80 lg:text-lg">{s.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={s.cta.href}
                      tabIndex={activa ? 0 : -1}
                      className="inline-flex items-center gap-2 rounded-xs bg-secondary px-7 py-3 font-bold text-primary shadow-md transition-colors hover:bg-white"
                    >
                      {s.cta.label} <Flecha />
                    </Link>
                    <Link
                      href={s.ctaSecondary.href}
                      tabIndex={activa ? 0 : -1}
                      className="inline-flex items-center gap-2 rounded-xs border border-white/40 px-7 py-3 font-bold text-white transition-colors hover:border-secondary hover:text-secondary"
                    >
                      {s.ctaSecondary.label}
                    </Link>
                  </div>
                </div>

                <div className="w-full">
                  {s.image ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] shadow-2xl ring-1 ring-white/10">
                      <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" priority={i === 1} />
                    </div>
                  ) : (
                    <EscenaDolor modo="con" inicio={INICIO_CIERRE} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Controles */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => irA(actual - 1)}
            aria-label="Diapositiva anterior"
            className="p-2 text-white/50 transition-colors hover:text-secondary"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ir a ${s.badge}`}
              aria-current={i === actual}
              className={`h-2 rounded-full transition-all duration-300 ${i === actual ? "w-7 bg-secondary" : "w-2 bg-white/35 hover:bg-white/60"}`}
            />
          ))}
          <button
            type="button"
            onClick={() => irA(actual + 1)}
            aria-label="Siguiente diapositiva"
            className="p-2 text-white/50 transition-colors hover:text-secondary"
          >
            <Flecha />
          </button>
        </div>
        <div className="absolute bottom-7 right-6 font-mono text-xs tabular-nums text-white/40">
          {String(actual + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}
