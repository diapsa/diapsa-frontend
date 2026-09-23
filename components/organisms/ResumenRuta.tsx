import { nivel } from "@/lib/semaforo";
import type { ResumenRuta as Resumen } from "@/types/servicio";

/**
 * ResumenRuta
 * La portada de una ruta: cuántos equipos se midieron, cómo quedaron
 * repartidos por estado en una sola barra, y qué se atiende primero.
 *
 * Por qué sustituye a la hoja del informe en diagnóstico integral. Arriba,
 * en "Lo que detectamos", ya va la ficha de una máquina; repetir aquí otra
 * hoja con recuadros y párrafos era leer dos veces lo mismo. Lo que falta
 * en ese punto de la página es la escala: que una ruta son diecisiete
 * equipos y que el informe los ordena. Una barra apilada lo dice en un
 * segundo, y las tres prioridades dicen qué se hace con eso.
 *
 * Los estados que no son del semáforo (fuera de operación, no medido) van
 * en gris; el JSON los manda con clave "otro".
 */

type Props = {
  resumen: Resumen;
};

const GRIS = { barra: "bg-gray-300", texto: "text-tertiary", punto: "bg-gray-300" };

function estilo(clave: string) {
  if (clave === "otro") return GRIS;
  const n = nivel(clave);
  return { barra: n.lampara.fondo, texto: n.lampara.texto, punto: n.punto };
}

export default function ResumenRuta({ resumen }: Props) {
  const total = resumen.estados.reduce((s, e) => s + e.total, 0);

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10">
      <div className="bg-primary px-5 py-4 lg:px-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">{resumen.etiqueta}</p>
        <p className="mt-1 text-lg font-extrabold text-white lg:text-xl">{resumen.titulo}</p>
        <p className="mt-0.5 text-xs text-white/70">{resumen.subtitulo}</p>
      </div>

      {/* Las cifras de la ruta */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-200">
        {resumen.cifras.map((c) => (
          <div key={c.etiqueta} className="px-4 py-4 text-center">
            <p className="text-3xl font-extrabold tabular-nums text-primary">{c.valor}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-tertiary">{c.etiqueta}</p>
          </div>
        ))}
      </div>

      {/* Cómo quedaron repartidos: una barra, un color por estado */}
      <div className="px-5 py-5 lg:px-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Cómo quedaron los {total} componentes</p>
        <div className="mt-3 flex h-5 w-full overflow-hidden rounded-sm bg-gray-100" role="img" aria-label={resumen.estados.map((e) => `${e.total} ${e.nombre}`).join(", ")}>
          {resumen.estados.map((e) => (
            <span key={e.nombre} className={`${estilo(e.clave).barra} h-full`} style={{ width: `${(e.total / total) * 100}%` }} />
          ))}
        </div>
        <ul className="mt-4 divide-y divide-gray-100">
          {resumen.estados.map((e) => {
            const s = estilo(e.clave);
            return (
              <li key={e.nombre} className="grid grid-cols-[auto_2.25rem_1fr] items-baseline gap-x-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.punto}`} aria-hidden="true" />
                  <span className={`w-24 font-bold ${s.texto}`}>{e.nombre}</span>
                </span>
                <span className="text-right text-base font-extrabold tabular-nums text-primary">{e.total}</span>
                <span className="text-justify text-xs leading-relaxed text-tertiary">{e.texto}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Qué se atiende primero */}
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-5 lg:px-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Qué se atiende primero</p>
        <ol className="mt-3 space-y-2">
          {resumen.prioridades.map((p, i) => (
            <li key={p} className="flex gap-3 text-sm leading-relaxed text-primary">
              <span className="w-4 shrink-0 font-extrabold text-secondary" aria-hidden="true">
                {i + 1}.
              </span>
              <span className="text-justify">{p}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="border-t border-gray-200 px-5 py-3 text-justify text-xs leading-relaxed text-tertiary lg:px-6">{resumen.nota}</p>
    </div>
  );
}
