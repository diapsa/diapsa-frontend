import Antetitulo from "../atoms/Antetitulo";
import type { ServiceMapaPuntos } from "@/types/servicio";

/**
 * MapaPuntos
 * Un plano esquemático de la planta con los puntos de tierra encima: cada uno
 * con su valor medido y su color, y el que falló a la vista.
 *
 * Por qué es el diferenciador de tierras físicas. Termografía tiene el par
 * visual y térmico, ultrasonido la gráfica sonora, aceite la serie de
 * muestras. Tierras no tiene una imagen que impresione: es un número por
 * punto contra un límite. Lo que sí impresiona es ver la planta completa de
 * un golpe, con sus zonas y sus veinticinco puntos, y encontrar el rojo en
 * dos segundos. Eso es lo que el jefe de mantenimiento quiere del reporte y
 * lo que la STPS pregunta primero.
 *
 * Por qué un plano y no una rejilla. La primera versión eran veinticinco
 * cuadros en fila. Se leía como una tabla de colores, no como una planta.
 * El plano no es a escala ni es el de ningún cliente: son zonas genéricas
 * (naves, subestación, tanques, almacenes) acomodadas para que se entienda
 * que los puntos están repartidos por toda la instalación.
 *
 * Las zonas se dibujan en SVG estirado al marco; los marcadores y todos los
 * textos van en HTML posicionado en porcentaje, para que en teléfono el
 * texto conserve su tamaño. En pantalla chica los valores no caben junto al
 * marcador, así que el plano se queda solo con los números y los colores,
 * que es lo que importa: cuántos verdes y dónde están los rojos.
 */

type Props = {
  mapa: ServiceMapaPuntos;
  paso?: string;
};

const ESTILO: Record<string, { marcador: string; valor: string; punto: string }> = {
  cumple: { marcador: "bg-emerald-500 ring-white", valor: "text-emerald-700", punto: "bg-emerald-500" },
  observacion: { marcador: "bg-amber-400 ring-white", valor: "text-amber-700", punto: "bg-amber-400" },
  falla: { marcador: "bg-red-600 ring-white", valor: "text-red-700", punto: "bg-red-600" },
};

/** El valor con su unidad si es un número; si no, el texto tal cual
    ("Sin continuidad"), y "Sin lectura" si viene vacío. */
function lectura(valor: string) {
  if (!valor) return "Sin lectura";
  return /^[\d.,]+$/.test(valor) ? `${valor} Ω` : valor;
}

export default function MapaPuntos({ mapa, paso }: Props) {
  const total = mapa.puntos.length;
  const cumplen = mapa.puntos.filter((p) => p.clave !== "falla").length;
  const porcentaje = total ? Math.round((cumplen / total) * 100) : 0;
  const conPlano = Boolean(mapa.zonas && mapa.zonas.length > 0);

  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{mapa.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {mapa.titulo}
          </h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{mapa.texto}</p>
        </div>

        <div className="rounded-sm bg-gray-50 p-5 ring-1 ring-black/5 lg:p-8">
          {/* Las cifras que resumen la ruta, derivadas de los puntos */}
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <p>
              <span className="text-3xl font-extrabold tabular-nums text-primary lg:text-4xl">{total}</span>
              <span className="ml-2 text-xs font-bold uppercase tracking-wider text-tertiary">puntos medidos</span>
            </p>
            <p>
              <span className="text-3xl font-extrabold tabular-nums text-emerald-600 lg:text-4xl">{cumplen}</span>
              <span className="ml-2 text-xs font-bold uppercase tracking-wider text-tertiary">conformes</span>
            </p>
            <p>
              <span className="text-3xl font-extrabold tabular-nums text-red-600 lg:text-4xl">{total - cumplen}</span>
              <span className="ml-2 text-xs font-bold uppercase tracking-wider text-tertiary">por corregir</span>
            </p>
            <p className="ml-auto">
              <span className="text-3xl font-extrabold tabular-nums text-primary lg:text-4xl">{porcentaje} %</span>
              <span className="ml-2 text-xs font-bold uppercase tracking-wider text-tertiary">cumplimiento</span>
            </p>
          </div>

          {conPlano ? (
            <>
              {/* El plano: zonas al fondo, marcadores encima */}
              <div
                className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-sm bg-white ring-1 ring-black/10 sm:aspect-[16/9]"
                role="img"
                aria-label={`Plano esquemático de la planta con ${total} puntos de puesta a tierra: ${cumplen} cumplen y ${
                  total - cumplen
                } no.`}
              >
                {/* Cuadrícula tenue, como papel de plano */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
                    backgroundSize: "5% 6.6667%",
                  }}
                />
                {mapa.zonas!.map((z) => (
                  <div
                    key={z.nombre}
                    aria-hidden="true"
                    className="absolute rounded-[3px] border border-primary/25 bg-primary/[0.06]"
                    style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
                  >
                    <span className="absolute left-1.5 top-1 max-w-[calc(100%-0.75rem)] truncate text-[9px] font-bold uppercase leading-tight tracking-wider text-primary/60 sm:text-[10px]">
                      {z.nombre}
                    </span>
                  </div>
                ))}

                {/* Perímetro de la planta */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-sm border-2 border-dashed border-primary/20" />

                {mapa.puntos.map((p, i) => {
                  const e = ESTILO[p.clave] ?? ESTILO.cumple;
                  const falla = p.clave === "falla";
                  return (
                    <div
                      key={i}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${p.x ?? 50}%`, top: `${p.y ?? 50}%` }}
                      title={`${p.tipo}: ${lectura(p.valor)}`}
                    >
                      {falla && (
                        <span
                          aria-hidden="true"
                          className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/25 motion-safe:animate-ping"
                        />
                      )}
                      <span
                        className={`relative flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-extrabold text-white ring-2 sm:h-6 sm:w-6 sm:text-[10px] ${e.marcador} ${
                          falla ? "h-7 w-7 text-[11px] sm:h-8 sm:w-8" : ""
                        }`}
                      >
                        {i + 1}
                      </span>
                      {/* El valor, solo donde cabe */}
                      <span
                        className={`absolute left-1/2 top-full mt-0.5 hidden -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tabular-nums leading-none lg:block ${e.valor}`}
                      >
                        {lectura(p.valor)}
                      </span>
                    </div>
                  );
                })}
              </div>

            </>
          ) : (
            /* Sin plano: un cuadro por punto */
            <ol className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9 lg:gap-3">
              {mapa.puntos.map((p, i) => {
                const e = ESTILO[p.clave] ?? ESTILO.cumple;
                return (
                  <li key={i} className="rounded-sm bg-white p-2.5 ring-1 ring-black/5">
                    <span className="text-[10px] font-bold text-tertiary/70">{String(i + 1).padStart(2, "0")}</span>
                    <p className={`mt-1 text-lg font-extrabold tabular-nums ${e.valor}`}>{p.valor ? `${p.valor} Ω` : "Sin lectura"}</p>
                    <p className="mt-1 text-[11px] text-tertiary">{p.tipo}</p>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Leyenda */}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-tertiary">
            {mapa.leyenda.map((l) => {
              const e = ESTILO[l.clave] ?? ESTILO.cumple;
              return (
                <span key={l.clave} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${e.punto}`} aria-hidden="true" />
                  {l.texto}
                </span>
              );
            })}
          </div>

          {mapa.hallazgo && (
            <div className="mt-6 rounded-sm border-l-4 border-red-600 bg-white p-4 lg:p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-red-600">{mapa.hallazgo.etiqueta}</p>
              <p className="mt-1 text-justify text-sm leading-relaxed text-primary">{mapa.hallazgo.texto}</p>
            </div>
          )}
        </div>

        <p className="mt-4 max-w-3xl text-justify text-xs leading-relaxed text-tertiary/70">{mapa.nota}</p>
      </div>
    </section>
  );
}
