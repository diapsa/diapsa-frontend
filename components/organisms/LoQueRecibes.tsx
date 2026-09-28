"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EscenaRecibes, { type ModoRecibes } from "@/components/organisms/EscenaRecibes";
import { FONDO_IDAP, ORO_IDAP, RUTA_IDAP } from "@/lib/idap-estilo";

/**
 * LoQueRecibes
 * Los tres entregables de DIAPSA contados como un recorrido en el tiempo:
 * el aviso inmediato durante la ruta, el informe al cerrarla y el historial
 * en IDAP para siempre.
 *
 * Por qué así (2026-09-27): eran tres tarjetas iguales con una foto chica y
 * dos líneas; no se entendía qué trae cada entrega ni en qué momento llega.
 * Ahora a la izquierda va una línea de tiempo con los tres momentos y lo que
 * contiene cada uno, y a la derecha una vista grande del entregable elegido:
 * el aviso en el teléfono, las dos páginas del informe y la pantalla de
 * IDAP con su azul y su logo. Avanza solo, con barra de progreso, y se
 * detiene con el cursor encima o si se pidió reducir el movimiento.
 *
 * Lo usan la portada y la página de monitoreo de condición; así las dos
 * dicen lo mismo con las mismas imágenes.
 */

const INTERVALO = 8000;

const PASOS = [
  {
    id: "aviso",
    cuando: "Durante el recorrido",
    titulo: "Aviso inmediato",
    texto: "Si un equipo está en riesgo no esperas el informe: te avisamos en ese momento.",
    contiene: ["El equipo y la falla encontrada", "La severidad en semáforo", "La acción recomendada y su plazo"],
  },
  {
    id: "informe",
    cuando: "Al cerrar la ruta",
    titulo: "Informe de la ruta",
    texto: "Un documento que entiende mantenimiento y que se puede presentar a gerencia.",
    contiene: [
      "Estado de cada equipo y resultado por técnica",
      "Hallazgos con su evidencia: espectros, termogramas y fotos",
      "Recomendaciones ordenadas por prioridad",
    ],
  },
  {
    id: "idap",
    cuando: "Siempre, en IDAP",
    titulo: "Historial en línea",
    texto: "Todas las mediciones de todas las rutas, en nuestra plataforma.",
    contiene: ["Tendencias por equipo", "Comparativas entre una ruta y la siguiente", "Trazabilidad para auditorías"],
  },
];

function Flecha() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

/* El aviso tal como llega al teléfono del jefe de mantenimiento. Es un
   ejemplo armado, sin datos de ningún cliente. */
function VistaAviso() {
  return (
    <div className="flex h-full items-center justify-center bg-[#e9eef2] p-6">
      <div className="w-full max-w-[17rem] rounded-[1.8rem] bg-primary p-2 shadow-2xl">
        <div className="rounded-[1.4rem] bg-[#f3f6f8] px-3.5 pb-4 pt-4">
          <p className="mb-3 text-center text-[11px] font-semibold text-tertiary">Hoy, 10:42</p>
          <div className="rounded-xl rounded-tl-none bg-white p-3.5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">Aviso DIAPSA</p>
            <p className="mt-1 text-base font-extrabold leading-tight text-primary">Bomba de alimentación 2</p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
              Alarma en vibraciones
            </p>
            <p className="mt-2 text-xs leading-snug text-primary">Daño en el rodamiento del lado acoplado.</p>
            <p className="mt-2 rounded-md bg-secondary/15 px-2 py-1.5 text-xs font-semibold leading-snug text-primary">
              Recomendación: programar el cambio esta semana.
            </p>
          </div>
          <p className="mt-2.5 text-right text-[11px] font-semibold text-emerald-600">✓ Recibido por mantenimiento</p>
        </div>
      </div>
    </div>
  );
}

/* Las dos páginas del informe, una sobre otra, como se entregan. */
function VistaInforme() {
  return (
    <div className="relative h-full bg-[#e9eef2] p-6">
      <div className="absolute right-6 top-6 h-[78%] w-[70%] rotate-3 overflow-hidden rounded-sm bg-white shadow-lg ring-1 ring-black/5">
        <Image src="/images/informe/pagina-2.png" alt="" fill sizes="40vw" className="object-cover object-top" />
      </div>
      <div className="absolute bottom-6 left-6 h-[78%] w-[72%] -rotate-2 overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/5">
        <Image
          src="/images/informe/pagina-1.png"
          alt="Página de un informe integral de DIAPSA: estado del equipo, resultado por disciplina y recomendaciones"
          fill
          sizes="40vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/* IDAP con su identidad: su azul, su logo y una pantalla real. */
function VistaIdap() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6" style={{ background: FONDO_IDAP }}>
      <Image src="/images/idap/idap-bco.png" alt="IDAP" width={1632} height={486} className="h-9 w-auto" />
      <div className="relative w-full flex-1 overflow-hidden rounded-md shadow-2xl ring-1 ring-white/15">
        <Image
          src="/images/idap/capturas/inspeccion-vibraciones.jpg"
          alt="Pantalla de IDAP con el estado por técnica y las lecturas de vibración de un equipo"
          fill
          sizes="45vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

export default function LoQueRecibes() {
  const [activo, setActivo] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [escenaLista, setEscenaLista] = useState(false);

  useEffect(() => {
    if (pausa) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reloj = window.setTimeout(() => setActivo((a) => (a + 1) % PASOS.length), INTERVALO);
    return () => window.clearTimeout(reloj);
  }, [activo, pausa]);

  const paso = PASOS[activo];

  return (
    <section className="relative w-full overflow-hidden bg-primary py-14 lg:py-20">
      <style>{`@keyframes avance-recibes { from { height: 0 } to { height: 100% } }`}</style>
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-6" onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)}>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Entregables</span>
          <h2 className="mb-4 text-3xl font-extrabold text-white lg:text-4xl">
            LO QUE <span className="text-secondary">RECIBES</span>
          </h2>
          <p className="text-justify text-lg text-white/70 sm:text-center">
            Tres entregas en tres momentos: lo urgente en el momento, el informe al cerrar la ruta y el historial siempre a la mano.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
          {/* La línea de tiempo */}
          <ol role="tablist" aria-orientation="vertical" className="relative flex flex-col gap-3">
            <span className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-white/15" aria-hidden="true" />
            {PASOS.map((p, i) => {
              const sel = i === activo;
              const idap = p.id === "idap";
              return (
                <li key={p.id} className="relative">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={sel}
                    onClick={() => setActivo(i)}
                    className={`flex w-full gap-4 rounded-sm p-3 text-left transition-colors sm:p-4 ${sel ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-extrabold ${
                        sel ? "text-primary" : "bg-primary text-white ring-1 ring-white/30"
                      }`}
                      style={sel ? { background: idap ? ORO_IDAP : "#fc9f01" } : undefined}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-widest" style={{ color: idap ? ORO_IDAP : "#fc9f01" }}>
                        {p.cuando}
                      </span>
                      <span className="mt-0.5 block text-lg font-extrabold text-white">{p.titulo}</span>
                      <span className="mt-1 block text-justify text-sm leading-relaxed text-white/70">{p.texto}</span>
                      {sel && (
                        <ul className="mt-3 flex flex-col gap-1.5 motion-safe:animate-[fadeIn_.3s_ease-out]">
                          {p.contiene.map((c) => (
                            <li key={c} className="flex items-start gap-2 text-sm font-semibold leading-snug text-white">
                              <svg
                                className="mt-0.5 h-4 w-4 shrink-0"
                                style={{ color: idap ? ORO_IDAP : "#fc9f01" }}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {c}
                            </li>
                          ))}
                        </ul>
                      )}
                    </span>
                  </button>
                  {/* Avance hacia el siguiente paso */}
                  {sel && !pausa && (
                    <span
                      key={`avance-${activo}`}
                      className="absolute left-0 top-0 w-0.5 motion-safe:animate-[avance-recibes_8s_linear_forwards]"
                      style={{ background: idap ? ORO_IDAP : "#fc9f01" }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
            <li className="mt-3 flex flex-wrap gap-3 pl-3 sm:pl-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-xs bg-secondary px-6 py-3 font-bold text-primary shadow-md transition-colors hover:bg-white"
              >
                Quiero ver un informe de ejemplo <Flecha />
              </Link>
              <Link
                href={RUTA_IDAP}
                className="inline-flex items-center gap-2 rounded-xs border px-6 py-3 font-bold transition-colors hover:bg-white/10"
                style={{ borderColor: ORO_IDAP, color: ORO_IDAP }}
              >
                Conocer IDAP
              </Link>
            </li>
          </ol>

          {/* La vista del entregable elegido: la escena 3D, y debajo las
              vistas planas mientras carga o si no hay WebGL */}
          <div className="relative aspect-[4/3] min-h-[22rem] w-full overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/10 lg:aspect-auto lg:min-h-[32rem]">
            {!escenaLista && (
              <div key={paso.id} className="absolute inset-0 motion-safe:animate-[fadeIn_.4s_ease-out]">
                {paso.id === "aviso" && <VistaAviso />}
                {paso.id === "informe" && <VistaInforme />}
                {paso.id === "idap" && <VistaIdap />}
              </div>
            )}
            <EscenaRecibes modo={paso.id as ModoRecibes} onMontada={() => setEscenaLista(true)} />
            <span
              className="absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-bold text-primary shadow"
              style={{ background: paso.id === "idap" ? ORO_IDAP : "#fc9f01" }}
            >
              {paso.cuando}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
