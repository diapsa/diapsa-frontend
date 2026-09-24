import Image from "next/image";
import Antetitulo from "../atoms/Antetitulo";
import EscenaIdap from "./EscenaIdap";
import HojaInforme from "./HojaInforme";
import AlertaSensor from "./AlertaSensor";
import ResumenRuta from "./ResumenRuta";
import { nivel } from "@/lib/semaforo";
import type { ServiceEntregable as Entregable } from "@/types/servicio";

/**
 * ServiceEntregable
 * Enseña el informe que recibe el cliente y dice qué trae. Nada más.
 *
 * Por qué ya no se descarga: la versión anterior pedía nombre, correo y
 * empresa a cambio del PDF. Eso convierte la sección en una captura de datos
 * y el visitante lo nota; además obligaba a publicar un informe de un cliente
 * real, aunque anonimizado. Ahora es una afirmación: esto es lo que recibes,
 * así se ve, esto contiene. Las páginas siguen siendo reales, escalonadas y
 * con un ligero movimiento al pasar el cursor, porque describir un informe
 * convence menos que verlo.
 *
 * Los servicios correctivos no entregan un informe de inspección sino la
 * prueba de que el equipo quedó mejor, así que en lugar de la vitrina de
 * páginas muestran `resultado`: una ficha con el valor de antes y el de
 * después, renglón por renglón. Es el mismo bloque, con otra vitrina.
 *
 * Debajo, si el servicio trae captura, va la misma inspección como se ve en
 * IDAP, a todo lo ancho; y si trae `escena`, en lugar de la captura va la
 * recreación animada de la plataforma (EscenaIdap) abierta en la pestaña
 * de la disciplina de la página. Se probó como pestaña junto al PDF, a media
 * columna, y se veía como un rectángulo oscuro con letra ilegible; una
 * captura de aplicación necesita ancho. La imagen viene recortada al tramo
 * que dice algo a ese tamaño: las disciplinas con su estado y el panel de
 * la disciplina de la página.
 *
 * Componente de servidor: sin estado, sin formulario, sin JavaScript.
 */

type Props = {
  entregable: Entregable;
  paso?: string;
};

export default function ServiceEntregable({ entregable, paso }: Props) {
  // Un servicio puede no tener todavía vitrina: ni ficha de resultado ni
  // páginas del informe. Sin esto, la rejilla de dos columnas deja la mitad
  // derecha en blanco y la sección se ve a medio hacer. En ese caso el texto
  // pasa a una sola columna de ancho de lectura.
  const conVitrina = Boolean(
    entregable.alerta ||
      entregable.resumenRuta ||
      entregable.hoja ||
      entregable.informe ||
      entregable.resultado ||
      (entregable.paginas && entregable.paginas.length > 1)
  );

  return (
    <section className="w-full overflow-hidden bg-white py-12 lg:py-20">
      <div
        className={`mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:gap-16 ${
          entregable.hoja
            ? "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            : conVitrina
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
              : ""
        }`}
      >
        {/* Texto. Sin vitrina se limita el ancho de lectura, pero se mantiene
            el borde izquierdo de las demás secciones: centrarlo rompería la
            alineación de toda la página. */}
        <div className={conVitrina ? "" : "max-w-3xl"}>
          <Antetitulo paso={paso}>{entregable.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {entregable.titulo}
          </h2>
          <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
            {entregable.descripcion}
          </p>

          <ul className="mt-7 space-y-3">
            {entregable.contenido.map((punto) => (
              <li key={punto} className="flex items-start gap-3 text-base leading-relaxed text-primary">
                <svg
                  className="mt-1.5 h-4 w-4 shrink-0 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{punto}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Vitrina C: la ficha del informe de una ruta.
            Las páginas de los laboratorios explican cómo leer un informe pero
            no enseñan el suyo: ni Bureau Veritas, ni Trico, ni TestOil ponen
            una sola captura ni una etiqueta de color. Aquí se enseña, porque
            lo que compra el cliente no es la medición sino la ruta ya
            priorizada: cuántos equipos hay en cada nivel y qué toca hacer con
            los que salieron mal. Los colores son los mismos del semáforo que
            va justo abajo, y esa es la relación: aquí se ven aplicados, ahí
            se explica qué obliga cada uno. */}
        {entregable.alerta ? (
          /* Vitrina F: la alerta como llega al teléfono (sensores) */
          <AlertaSensor alerta={entregable.alerta} />
        ) : entregable.resumenRuta ? (
          /* Vitrina E: la portada de una ruta, con la barra por estado */
          <ResumenRuta resumen={entregable.resumenRuta} />
        ) : entregable.hoja ? (
          /* Vitrina D: la hoja de un equipo, tal como sale en el informe */
          <HojaInforme hoja={entregable.hoja} />
        ) : entregable.informe ? (
          <div className="mx-auto w-full max-w-xl overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10">
            <div className="bg-primary px-5 py-4 lg:px-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">
                {entregable.informe.etiqueta}
              </p>
              <p className="mt-1 text-lg font-extrabold text-white lg:text-xl">
                {entregable.informe.titulo}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                {entregable.informe.resumen.map((r) => {
                  const color = nivel(r.clave);
                  return (
                    <li key={r.clave} className="flex items-baseline gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 shrink-0 translate-y-[-1px] rounded-full ${color.punto}`}
                      />
                      <span className={`text-xl font-extrabold tabular-nums ${color.cifra}`}>
                        {r.total}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-white/60">
                        {r.etiqueta}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <ul className="px-5 lg:px-6">
              {entregable.informe.filas.map((f) => (
                <li key={f.equipo} className="border-t border-gray-100 py-4 first:border-t-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-snug text-primary">{f.equipo}</p>
                      <p className="mt-0.5 text-xs text-tertiary">{f.componente}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${nivel(f.clave).chip}`}
                    >
                      {f.estado}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-tertiary">{f.accion}</p>
                </li>
              ))}
            </ul>

            <p className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-justify text-xs leading-relaxed text-tertiary lg:px-6">
              {entregable.informe.nota}
            </p>
          </div>
        ) : /* Vitrina A: la ficha de resultado, para lo correctivo */
        entregable.resultado ? (
          <div className="mx-auto w-full max-w-xl overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10">
            <div className="bg-primary px-5 py-4 lg:px-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">
                {entregable.resultado.etiqueta}
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="text-lg font-extrabold text-white lg:text-xl">{entregable.resultado.equipo}</p>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {entregable.resultado.estado}
                </span>
              </div>
            </div>

            <div className="px-5 py-2 lg:px-6">
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 py-2 text-[10px] font-bold uppercase tracking-wider text-tertiary lg:gap-x-6">
                <span aria-hidden="true" />
                <span className="text-right">Antes</span>
                <span className="text-right">Después</span>
              </div>
              {entregable.resultado.filas.map((f) => (
                <div
                  key={f.concepto}
                  className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-4 border-t border-gray-100 py-3 lg:gap-x-6"
                >
                  <span className="text-sm leading-snug text-primary">{f.concepto}</span>
                  <span className="text-right text-sm font-semibold tabular-nums text-red-500">{f.antes}</span>
                  <span className="text-right text-base font-extrabold tabular-nums text-emerald-600">
                    {f.despues}
                  </span>
                </div>
              ))}
            </div>

            <p className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-justify text-xs leading-relaxed text-tertiary lg:px-6">
              {entregable.resultado.nota}
            </p>
          </div>
        ) : entregable.paginas && entregable.paginas.length > 1 ? (
        /* Vitrina B: las páginas reales del informe, escalonadas */
        <div className="group relative mx-auto w-full max-w-xl">
          {/* Página 2 al fondo, girada, asomando por detrás */}
          <div className="absolute right-0 top-6 hidden w-[78%] rotate-[4deg] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5 transition-transform duration-500 motion-safe:group-hover:rotate-[6deg] motion-safe:group-hover:-translate-y-2 sm:block">
            <Image
              src={entregable.paginas[1]}
              alt=""
              aria-hidden="true"
              width={1253}
              height={1457}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 60vw, 380px"
            />
          </div>

          {/* Página 1 al frente */}
          <div className="relative w-[88%] overflow-hidden rounded-sm shadow-2xl ring-1 ring-black/10 transition-transform duration-500 motion-safe:group-hover:-translate-y-1.5">
            <Image
              src={entregable.paginas[0]}
              alt={entregable.altPaginas ?? ""}
              width={1253}
              height={890}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 90vw, 460px"
            />
          </div>

          {/* Sello flotante con lo que trae el informe */}
          {entregable.dato && (
            <div className="absolute -bottom-4 right-0 rounded-sm bg-primary px-5 py-3 text-white shadow-xl sm:right-4">
              <p className="text-2xl font-extrabold leading-none text-secondary">{entregable.dato}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/80">{entregable.datoTexto}</p>
            </div>
          )}
        </div>
        ) : null}
      </div>

      {/* La misma inspección dentro de IDAP, a todo lo ancho */}
      {entregable.idap && (
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:mt-24">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Y en la plataforma</p>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight text-primary lg:text-3xl">
              {entregable.idap.titulo ?? "Así se ve la misma inspección en IDAP"}
            </h3>
            {entregable.idap.texto && (
              <p className="mt-3 text-justify text-base leading-relaxed text-tertiary lg:text-lg">
                {entregable.idap.texto}
              </p>
            )}
          </div>

          {/* Marco de navegador oscuro, como se ve la plataforma */}
          <div className="mx-auto max-w-5xl overflow-hidden rounded-md bg-[#0b0f19] shadow-2xl ring-1 ring-black/20">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 rounded-sm bg-white/5 px-3 py-0.5 text-[11px] text-white/50">idap.app</span>
            </div>
            {entregable.idap.escena ? (
              <EscenaIdap disciplina={entregable.idap.escena} imagenes={entregable.idap.imagenes} />
            ) : (
              <Image
                src={entregable.idap.src}
                alt={entregable.idap.alt}
                width={entregable.idap.ancho ?? 1945}
                height={entregable.idap.alto ?? 1240}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
