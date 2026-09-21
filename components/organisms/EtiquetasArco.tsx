import Antetitulo from "../atoms/Antetitulo";
import type { ServiceArco, EtiquetaArco as Etiqueta } from "@/types/servicio";

/**
 * EtiquetasArco
 * Lo que produce un estudio de arco eléctrico, tal como se ve: la etiqueta
 * que va pegada en cada tablero, y todos los tableros de una planta
 * ordenados por energía incidente.
 *
 * Por qué es el diferenciador de arco eléctrico. El estudio es cálculo, no
 * medición: no hay foto de un hallazgo ni una gráfica de una señal. Lo que
 * hay es un número por tablero (calorías por centímetro cuadrado a la
 * distancia de trabajo) y una etiqueta que lo traduce en ropa y distancias.
 * Enseñar la etiqueta reconstruida, con sus renglones reales, dice mejor
 * que cualquier párrafo qué se recibe; y ponerla junto a la de un tablero
 * de bajo riesgo enseña que el estudio discrimina: no es "todo con traje",
 * es cada tablero con lo suyo.
 *
 * La lista de barras de abajo es la tabla del anexo convertida en barras
 * HTML, con la línea de 1.2 cal/cm² (por debajo, ropa normal ignífuga) y
 * los topes de cada categoría de EPP. Datos reales de un estudio, con la
 * planta omitida y los tableros nombrados por su función.
 */

type Props = {
  arco: ServiceArco;
  paso?: string;
};

const NIVEL: Record<string, { barra: string; chip: string }> = {
  "1": { barra: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  "2": { barra: "bg-amber-500", chip: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  "3": { barra: "bg-orange-600", chip: "bg-orange-50 text-orange-700 ring-orange-600/20" },
  "4": { barra: "bg-red-600", chip: "bg-red-50 text-red-700 ring-red-600/20" },
};

function nivelDe(n: string) {
  return NIVEL[n] ?? NIVEL["1"];
}

/** La etiqueta de advertencia, con los renglones en el orden de la real. */
function EtiquetaArcoVista({ e, destacada }: { e: Etiqueta; destacada?: boolean }) {
  const filas: { valor: string; texto: string }[] = [
    { valor: `${e.energia} cal/cm²`, texto: `Energía incidente a ${e.distanciaTrabajo} cm` },
    { valor: `${e.fronteraArco} cm`, texto: "Frontera de arco" },
    { valor: `Categoría ${e.nivel}`, texto: e.ropa },
    { valor: e.tension, texto: "Riesgo de choque si se remueve la tapa" },
    { valor: `Clase ${e.guantes}`, texto: "Clase de guantes" },
    { valor: `${e.fronteraLimitada} cm`, texto: "Frontera limitada" },
    { valor: `${e.fronteraRestringida} cm`, texto: "Frontera restringida" },
  ];
  return (
    <div
      className={`overflow-hidden rounded-sm bg-white text-primary shadow-xl ring-1 ring-black/10 ${
        destacada ? "lg:-translate-y-2" : ""
      }`}
    >
      <div className="flex items-center justify-center gap-2 bg-[#f59e0b] px-4 py-2.5">
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-sm bg-black text-sm font-extrabold text-[#f59e0b]"
        >
          !
        </span>
        <span className="text-xl font-extrabold uppercase tracking-wide text-black">Advertencia</span>
      </div>
      <p className="border-b border-gray-200 px-4 py-1.5 text-center text-sm font-extrabold">Riesgo de arco y choque</p>
      <p className="border-b border-gray-200 px-4 py-1.5 text-center text-xs font-bold">Se requiere EPP adecuado</p>
      <dl className="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1 px-4 py-3 text-xs">
        {filas.map((f) => (
          <div key={f.texto} className="contents">
            <dt className="font-extrabold tabular-nums text-red-600">{f.valor}</dt>
            <dd className="leading-snug text-primary">{f.texto}</dd>
          </div>
        ))}
      </dl>
      <div className="grid grid-cols-[5rem_1fr] border-t border-gray-200 bg-[#f59e0b]/90">
        <span className="px-3 py-2 text-xs font-extrabold uppercase text-black">Equipo</span>
        <span className="bg-white px-3 py-2 text-sm font-extrabold uppercase leading-snug">{e.equipo}</span>
      </div>
    </div>
  );
}

export default function EtiquetasArco({ arco, paso }: Props) {
  const maximo = Math.max(...arco.barras.map((b) => b.energia), arco.escala);
  const pct = (v: number) => `${Math.min(100, (v / maximo) * 100).toFixed(1)}%`;
  const ordenadas = [...arco.barras].sort((a, b) => b.energia - a.energia);

  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{arco.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{arco.titulo}</h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{arco.texto}</p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          {/* Todos los tableros, ordenados por energía incidente */}
          <div className="rounded-sm bg-gray-50 p-5 ring-1 ring-black/5 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">{arco.barrasTitulo}</p>
            <p className="mt-1 text-sm text-tertiary">{arco.barrasTexto}</p>

            {/* El ancho de la columna de nombres cambia con la pantalla; los
                umbrales lo leen de la misma variable para caer sobre la barra. */}
            <div className="relative mt-5 pt-2 sm:pt-6 [--col:7rem] [--val:3.25rem] sm:[--col:11.5rem] sm:[--val:4rem]">
              {/* Umbrales, como líneas verticales sobre las barras */}
              {arco.umbrales.map((u) => (
                <div
                  key={u.valor}
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 top-2 z-10 border-l border-dashed border-primary/40 sm:top-6"
                  style={{ left: `calc(var(--col) + (100% - var(--col) - var(--val)) * ${Math.min(1, u.valor / maximo)})` }}
                >
                  <span
                    className={`absolute -top-5 hidden whitespace-nowrap text-[10px] font-bold text-primary/70 sm:block ${
                      u.valor / maximo > 0.7 ? "right-1" : "left-1"
                    }`}
                  >
                    {u.texto}
                  </span>
                </div>
              ))}
              <ol className="space-y-1.5">
                {ordenadas.map((b) => {
                  const n = nivelDe(b.nivel);
                  return (
                    <li key={b.nombre} className="grid grid-cols-[var(--col)_1fr_var(--val)] items-center gap-x-0 text-xs">
                      <span className="truncate pr-3 text-primary" title={b.nombre}>
                        {b.nombre}
                        <span className="ml-1 text-tertiary/70">{b.tension}</span>
                      </span>
                      <span className="relative block h-3.5 rounded-sm bg-gray-200/70">
                        <span
                          className={`absolute inset-y-0 left-0 rounded-sm ${n.barra}`}
                          style={{ width: pct(b.energia) }}
                        />
                      </span>
                      <span className="pl-1.5 text-right font-bold tabular-nums text-primary">{b.energia.toFixed(2)}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <p className="mt-2 text-right text-[10px] uppercase tracking-wider text-tertiary">cal/cm² a la distancia de trabajo</p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-tertiary">
              {arco.leyenda.map((l) => (
                <span key={l.nivel} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-sm ${nivelDe(l.nivel).barra}`} aria-hidden="true" />
                  {l.texto}
                </span>
              ))}
            </div>
          </div>

          {/* Dos etiquetas reales: la del tablero de más riesgo y una típica */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">{arco.etiquetasTitulo}</p>
            <p className="mt-1 text-sm text-tertiary">{arco.etiquetasTexto}</p>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {arco.etiquetas.map((e, i) => (
                <EtiquetaArcoVista key={e.equipo} e={e} destacada={i === 0} />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-justify text-xs leading-relaxed text-tertiary/70">{arco.nota}</p>
      </div>
    </section>
  );
}
