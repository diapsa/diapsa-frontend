import type { EstimadoFalla } from "@/types/servicio";
import { dolares } from "@/lib/utils/dolares";

/**
 * GraficoEstimado
 * Lo que cuesta el mismo hallazgo atendido a tiempo y lo que cuesta si se
 * deja llegar a la falla, partida por partida.
 *
 * Por qué no es una gráfica: las cifras son estimadas, y una gráfica bonita
 * las haría parecer medidas. Presentarlas como cuenta obliga a enseñar de
 * dónde sale cada peso, que es lo único que vuelve discutible un estimado. Si
 * al cliente no le cuadra el valor de su hora de paro, ve exactamente qué
 * renglón mover.
 *
 * La barra debajo de cada total es la única parte visual, y está a escala
 * entre las dos columnas: la de atender a tiempo se ve diminuta al lado de la
 * de la falla, que es todo el argumento. El múltiplo se calcula, no se
 * escribe, para que no se desalinee si cambian las partidas.
 *
 * En aire comprimido esta cuenta va debajo de GraficoFugas y no en su lugar:
 * la curva enseña el aire que se deja de perder mes a mes y la cuenta le
 * descuenta lo que costó repararlo, así que las dos cifras no son la misma y
 * el pie lo explica.
 */

type Props = {
  estimado: EstimadoFalla;
};

export default function GraficoEstimado({ estimado }: Props) {
  const totales = estimado.escenarios.map((e) => e.partidas.reduce((s, p) => s + p.monto, 0));
  const mayor = Math.max(...totales, 1);
  const barato = Math.min(...totales);
  const caro = Math.max(...totales);
  const diferencia = caro - barato;
  const veces = barato > 0 ? Math.round(caro / barato) : 0;

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">Impacto económico</p>
      <h3 className="mt-1 text-xl font-extrabold text-white lg:text-2xl">{estimado.titulo}</h3>
      {estimado.texto && (
        <p className="mt-2 max-w-3xl text-justify text-sm leading-relaxed text-white/60">{estimado.texto}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {estimado.escenarios.map((e, i) => {
          const total = totales[i];
          const grave = total === caro;
          return (
            <div
              key={e.etiqueta}
              className={`rounded-sm border p-5 ${
                grave ? "border-red-400/30 bg-red-500/5" : "border-emerald-400/30 bg-emerald-500/5"
              }`}
            >
              <p
                className={`text-[11px] font-bold uppercase tracking-widest ${
                  grave ? "text-red-300" : "text-emerald-300"
                }`}
              >
                {e.etiqueta}
              </p>

              <ul className="mt-4 space-y-2">
                {e.partidas.map((p) => (
                  <li key={p.texto} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-white/60">{p.texto}</span>
                    <span className="shrink-0 tabular-nums text-white/80">{dolares(p.monto)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-white/10 pt-3">
                <span className="text-sm font-bold text-white">Total</span>
                <span
                  className={`shrink-0 text-2xl font-extrabold tabular-nums ${
                    grave ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {dolares(total)}
                </span>
              </div>

              {/* A escala entre las dos columnas: ahí se ve la desproporción. */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <span
                  className={`block h-full rounded-full ${grave ? "bg-red-400" : "bg-emerald-400"} motion-safe:animate-[crecerX_.8s_ease-out_both]`}
                  style={{
                    width: `${Math.max(1.5, (total / mayor) * 100)}%`,
                    transformOrigin: "left",
                    animationDelay: `${300 + i * 200}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-justify text-base leading-relaxed text-white">
        <span className="font-extrabold text-secondary">{dolares(diferencia)}</span> de diferencia{" "}
        {estimado.unidad}: {estimado.frase ?? "dejar que falle"} sale{" "}
        <span className="font-extrabold text-secondary">{veces} veces</span> más caro.
      </p>

      <p className="mt-4 max-w-3xl text-justify text-xs leading-relaxed text-white/40">{estimado.supuesto}</p>
    </div>
  );
}
