import Image from "next/image";
import Escena360 from "./Escena360";
import EscenaSensores from "./EscenaSensores";
import type { ServicePorQue } from "@/types/servicio";

/**
 * PorQueMuestrear
 * Qué contesta una muestra de aceite y cómo se toma, con fotos reales.
 *
 * Por qué abre la página de aceite. Antes de esto se probaron tres cosas en
 * este lugar: la muestra de laboratorio con sus dieciséis valores, la misma
 * muestra reducida a tres preguntas con un número cada una, y una curva de
 * cuándo detecta cada técnica. Las tres eran abstractas para quien entra sin
 * saber qué es un análisis de lubricante, y las dos primeras empezaban por
 * un resultado, que es el final de la historia.
 *
 * Esto empieza por el principio. A la izquierda, un analista de DIAPSA
 * tomando la muestra sobre un equipo en operación: eso es el servicio, y es
 * una foto real de una ruta. A la derecha, las tres preguntas que la
 * muestra contesta, en lenguaje llano y sin un solo valor de laboratorio,
 * cada una con lo que se hace si sale mal, porque eso es lo que convierte la
 * pregunta en razón de compra. Debajo, cómo se toma la muestra, en tres fotos
 * de la misma ruta con una línea cada una.
 *
 * Va dentro de la sección "Qué hacemos", en el lugar del acordeón, así que
 * no trae encabezado propio. Componente de servidor: todo viene del JSON.
 */

type Props = {
  porQue: ServicePorQue;
};

export default function PorQueMuestrear({ porQue }: Props) {
  // Sensores: la escena manda. Va a lo ancho de la página, con el sello de
  // quién instala y tres ideas de una línea debajo, sin párrafos. La escena
  // ya explica el servicio; el texto solo tiene que confirmar lo que se ve.
  if (porQue.escena === "sensores") {
    return (
      <div>
        <div className="mx-auto w-full max-w-5xl">
          <EscenaSensores foto={porQue.foto} />
        </div>

        {porQue.destacado && (
          <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-4 rounded-sm bg-primary px-6 py-6 text-white sm:flex-row sm:items-center sm:gap-6 lg:px-8">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-extrabold text-primary" aria-hidden="true">
              III
            </span>
            <div>
              <p className="text-xl font-extrabold leading-snug lg:text-2xl">{porQue.destacado.titulo}</p>
              <p className="mt-1 text-justify text-sm leading-relaxed text-white/75 lg:text-base">{porQue.destacado.texto}</p>
            </div>
          </div>
        )}

        <ol className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {porQue.preguntas.map((p, i) => (
            <li key={p.pregunta} className="border-t-2 border-secondary pt-4">
              <span className="text-xs font-extrabold text-secondary" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 text-lg font-extrabold leading-snug text-primary">{p.pregunta}</h3>
              <p className="mt-1.5 text-justify text-sm leading-relaxed text-tertiary">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* La foto: el servicio ocurriendo. En diagnóstico integral, en su
            lugar va la escena 360 con la máquina y las técnicas en órbita. */}
        {porQue.escena360 ? (
          <Escena360 escena={porQue.escena360} />
        ) : (
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5">
            <Image
              src={porQue.foto.src}
              alt={porQue.foto.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {porQue.pie && (
            <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">
              {porQue.pie}
            </figcaption>
          )}
        </figure>
        )}

        {/* Las tres preguntas que contesta la muestra */}
        <ol className="divide-y divide-gray-200">
          {porQue.preguntas.map((p, i) => (
            <li key={p.pregunta} className="flex gap-4 py-5 first:pt-0 last:pb-0 lg:gap-5">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary text-sm font-extrabold text-secondary"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="text-xl font-extrabold leading-snug text-primary lg:text-2xl">{p.pregunta}</h3>
                <p className="mt-2 text-justify text-base leading-relaxed text-tertiary">{p.texto}</p>
                {p.siSaleMal && (
                <p className="mt-2 text-justify text-sm leading-relaxed text-primary">
                  <span className="mr-2 text-[11px] font-bold uppercase tracking-wider text-secondary">
                    Si sale mal
                  </span>
                  {p.siSaleMal}
                </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Cómo se toma la muestra, en fotos de la misma ruta */}
      {porQue.comoSeHace && (
      <div className="mt-12 lg:mt-16">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">{porQue.comoSeHace.titulo}</p>
        <ol className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
          {porQue.comoSeHace.pasos.map((paso, i) => (
            <li key={paso.foto.src}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-black/5">
                <Image
                  src={paso.foto.src}
                  alt={paso.foto.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
                <span
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-sm bg-white/90 text-sm font-extrabold text-primary"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
              </div>
              <p className="mt-3 text-justify text-sm leading-relaxed text-tertiary">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>
      )}
    </div>
  );
}
