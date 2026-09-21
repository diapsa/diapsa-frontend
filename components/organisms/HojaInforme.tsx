import Image from "next/image";
import { nivel } from "@/lib/semaforo";
import type { HojaInforme as Hoja } from "@/types/servicio";

/**
 * HojaInforme
 * La hoja de un equipo tal como sale en el informe, reconstruida en HTML.
 *
 * Por qué sustituye a la ficha de la ruta: aquella enseñaba el resumen
 * (cuántos equipos en cada nivel y cuatro renglones de ejemplo) y se leía
 * como una lista más, no como un documento. Lo que el cliente recibe es una
 * hoja por equipo con su condición, el diagnóstico escrito por el
 * especialista, las recomendaciones numeradas, la tabla de laboratorio con
 * todas las muestras anteriores y las fotos de evidencia. Esa hoja es la que
 * hay que enseñar, y en el mismo orden en que viene en el PDF, para que quien
 * la vea aquí reconozca después el informe que le llega.
 *
 * Es HTML y no una captura por tres razones: se lee en teléfono, se anonimiza
 * sin retocar imágenes, y el JSON del servicio puede cambiar el equipo de
 * ejemplo sin volver a exportar nada. Los datos son los de una hoja real,
 * con la planta y el número de equipo omitidos.
 *
 * Detrás asoma una segunda hoja, en blanco y girada, para que se lea como un
 * documento de varias páginas y no como una tarjeta.
 */

type Props = {
  hoja: Hoja;
};

export default function HojaInforme({ hoja }: Props) {
  const condicion = nivel(hoja.condicion.clave);
  // La columna de límite solo si algún renglón trae uno; en la versión
  // corta de la hoja no hay, y una columna vacía descuadra la tabla.
  const conLimite = hoja.resultados.some((r) => r.limite);

  return (
    <div className="group relative mx-auto w-full max-w-2xl">
      {/* La hoja de atrás */}
      <div
        aria-hidden="true"
        className="absolute inset-x-3 top-3 hidden h-full rotate-[2.5deg] rounded-sm bg-white shadow-xl ring-1 ring-black/5 transition-transform duration-500 motion-safe:group-hover:rotate-[4deg] sm:block"
      />

      <article className="relative overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10 transition-transform duration-500 motion-safe:group-hover:-translate-y-1">
        {/* Encabezado del documento */}
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 bg-primary px-5 py-4 lg:px-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">{hoja.etiqueta}</p>
            <p className="mt-1 text-lg font-extrabold leading-tight text-white lg:text-xl">{hoja.titulo}</p>
          </div>
          <p className="text-xs text-white/70">{hoja.subtitulo}</p>
        </header>

        {/* Datos del equipo */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-gray-200 px-5 py-4 sm:grid-cols-3 lg:px-7">
          {hoja.datos.map((d) => (
            <div key={d.etiqueta} className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-tertiary">{d.etiqueta}</dt>
              <dd className="mt-0.5 truncate text-sm font-semibold text-primary">{d.valor}</dd>
            </div>
          ))}
        </dl>

        <div className="px-5 py-5 lg:px-7">
          {/* Condición */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Condición del aceite</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${condicion.chip}`}
            >
              {hoja.condicion.etiqueta}
            </span>
          </div>

          {/* Diagnóstico */}
          <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-tertiary">Diagnóstico</p>
          <p className="mt-2 text-justify text-sm leading-relaxed text-primary">{hoja.diagnostico}</p>

          {/* Recomendaciones */}
          <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-tertiary">Recomendaciones</p>
          <ol className="mt-2 space-y-1.5">
            {hoja.recomendaciones.map((r, i) => (
              <li key={r} className="flex gap-3 text-sm leading-relaxed text-primary">
                <span className="w-4 shrink-0 font-extrabold text-secondary" aria-hidden="true">
                  {i + 1}.
                </span>
                <span className="text-justify">{r}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Resultados de laboratorio: todas las muestras del equipo */}
        <div className="border-t border-gray-200 px-5 py-5 lg:px-7">
          <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">
            Historial de muestras
          </p>
          <div className="-mx-5 mt-3 overflow-x-auto px-5 lg:-mx-7 lg:px-7">
            <table className="w-full min-w-[30rem] border-collapse text-xs">
              <thead>
                <tr className="bg-primary text-left text-[10px] uppercase tracking-wider text-white">
                  <th className="px-2 py-2 font-bold">Análisis</th>
                  {conLimite && <th className="px-2 py-2 text-right font-bold">Límite</th>}
                  {hoja.fechas.map((f) => (
                    <th key={f} className="px-2 py-2 text-right font-bold text-secondary">
                      {f}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hoja.resultados.map((r) => (
                  <tr key={r.analisis} className="border-b border-gray-100">
                    <td className="px-2 py-2 font-semibold text-primary">
                      {r.analisis}
                      {r.unidad && <span className="ml-1 font-normal text-tertiary">{r.unidad}</span>}
                    </td>
                    {conLimite && (
                      <td className="px-2 py-2 text-right tabular-nums text-tertiary">{r.limite}</td>
                    )}
                    {r.valores.map((v, i) => {
                      const marcado = r.resaltar?.includes(i);
                      return (
                        <td
                          key={i}
                          className={`px-2 py-2 text-right tabular-nums ${
                            marcado ? "bg-amber-100 font-extrabold text-amber-800" : "text-primary"
                          }`}
                        >
                          {v}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evidencia */}
        {hoja.evidencia && hoja.evidencia.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-5 lg:px-7">
            <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Evidencia</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {hoja.evidencia.map((foto) => (
                <div key={foto.src} className="relative aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-black/5">
                  <Image src={foto.src} alt={foto.alt} fill sizes="200px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-justify text-xs leading-relaxed text-tertiary lg:px-7">
          {hoja.nota}
        </p>
      </article>
    </div>
  );
}
