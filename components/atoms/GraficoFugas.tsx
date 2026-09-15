import type { CostoFugas } from "@/types/servicio";

/**
 * GraficoFugas
 * Lo que cuesta al mes el aire comprimido que se está fugando, desde la
 * primera ruta de ultrasonido hasta un año después, con el costo evitado
 * acumulado encima.
 *
 * Por qué existe: en aire comprimido el argumento no es técnico, es de
 * dinero. Una fuga no tira producto, tira electricidad, y la cuenta corre
 * todas las horas que la planta opera. La captura de IDAP que sirvió de
 * referencia mostraba una sola fuga de 1.4 CFM, cincuenta dólares al año, que
 * no mueve a nadie; aquí la escena es la de una ruta completa, que es como se
 * contrata el servicio.
 *
 * Las barras son el costo mensual del aire fugado y la línea es lo que se
 * dejó de gastar, acumulado. Ambas salen del mismo arreglo de meses del JSON:
 * el primer mes es la foto del día de la inspección y el evitado se cuenta
 * contra él, así que las tres cifras del encabezado no se pueden desalinear
 * de la gráfica. El supuesto de cálculo va escrito abajo para que la cifra se
 * pueda auditar.
 *
 * La maquetación es HTML, con las barras en porcentaje y solo la línea en
 * SVG, para que en un teléfono se lea igual sin arrastrar de lado.
 */

type Props = {
  costos: CostoFugas;
};

/** Miles con coma, sin depender del locale del navegador. */
function pesos(n: number) {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function GraficoFugas({ costos }: Props) {
  const meses = costos.meses;
  const pico = meses[0] ?? 0;
  const evitados = meses.map((_, i) =>
    meses.slice(0, i + 1).reduce((acc, m) => acc + (pico - m), 0),
  );
  const totalEvitado = evitados[evitados.length - 1] ?? 0;
  const maxEvitado = Math.max(totalEvitado, 1);
  const alturaBarra = (v: number) => (pico > 0 ? (v / pico) * 100 : 0);
  const color = (v: number) => {
    const r = pico > 0 ? v / pico : 0;
    if (r > 0.75) return "bg-red-400";
    if (r > 0.3) return "bg-amber-400";
    return "bg-emerald-400";
  };
  // La línea se dibuja en una caja de 100 por 100 que se estira con el lienzo.
  const puntos = evitados
    .map((v, i) => {
      const x = ((i + 0.5) / meses.length) * 100;
      const y = 100 - (v / maxEvitado) * 78;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">Impacto económico</p>
      <h3 className="mt-1 text-xl font-extrabold text-white lg:text-2xl">{costos.titulo}</h3>
      {costos.texto && (
        <p className="mt-2 max-w-3xl text-justify text-sm leading-relaxed text-white/60">{costos.texto}</p>
      )}

      {/* Las tres cifras, todas derivadas de la misma serie de meses. */}
      <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-3">
        <div className="bg-primary p-4">
          <dt className="text-xs text-white/50">Fugas encontradas en la ruta</dt>
          <dd className="mt-1 text-2xl font-extrabold text-white lg:text-3xl">
            {costos.fugas}
            <span className="ml-2 text-base font-bold text-white/50">
              <span className="mr-2 opacity-50">·</span>
              {costos.cfm} CFM
            </span>
          </dd>
        </div>
        <div className="bg-primary p-4">
          <dt className="text-xs text-white/50">Se iban al mes por esas fugas</dt>
          <dd className="mt-1 text-2xl font-extrabold text-red-300 lg:text-3xl">{pesos(pico)}</dd>
        </div>
        <div className="bg-primary p-4">
          <dt className="text-xs text-white/50">Evitados en los doce meses siguientes</dt>
          <dd className="mt-1 text-2xl font-extrabold text-emerald-300 lg:text-3xl">{pesos(totalEvitado)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex gap-3">
        {/* Eje de costo mensual. */}
        <div className="relative h-48 w-12 shrink-0 lg:h-64">
          {[1, 0.5, 0].map((f) => (
            <span
              key={f}
              className="absolute right-0 -translate-y-1/2 text-[11px] text-white/40"
              style={{ top: `${(1 - f) * 100}%` }}
            >
              {pesos(pico * f)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-48 lg:h-64">
            {/* Rejilla */}
            {[0, 0.5, 1].map((f) => (
              <span
                key={f}
                className="absolute inset-x-0 h-px bg-white/10"
                style={{ top: `${f * 100}%` }}
                aria-hidden="true"
              />
            ))}
            {/* Barras del costo mensual */}
            <div className="absolute inset-0 flex items-end gap-[2px] lg:gap-1">
              {meses.map((v, i) => (
                <div key={i} className="flex h-full flex-1 items-end">
                  <span
                    className={`block w-full rounded-t-[2px] ${color(v)} motion-safe:animate-[crecer_.6s_ease-out_both]`}
                    style={{
                      height: `${alturaBarra(v)}%`,
                      transformOrigin: "bottom",
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Costo evitado acumulado */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              role="img"
              aria-label={`Costo evitado acumulado, hasta ${pesos(totalEvitado)} dólares al cabo de ${meses.length} meses`}
            >
              <polyline
                points={puntos}
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className="stroke-emerald-300 motion-safe:animate-[fadeIn_.8s_ease-out_both]"
                style={{ animationDelay: "500ms" }}
              />
            </svg>
            <span
              className="absolute right-0 top-0 hidden rounded-sm bg-emerald-500/20 px-2 py-1 text-[11px] font-bold text-emerald-300 sm:block motion-safe:animate-[fadeIn_.5s_ease-out_both]"
              style={{ animationDelay: "1.2s" }}
            >
              {pesos(totalEvitado)} evitados
            </span>
          </div>

          {/* Meses desde la primera ruta */}
          <div className="mt-2 flex gap-[2px] lg:gap-1">
            {meses.map((_, i) => (
              <span key={i} className="flex-1 text-center text-[10px] text-white/40 lg:text-[11px]">
                {i + 1}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-white/40">Meses desde la primera ruta de ultrasonido</p>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        <li className="flex items-center gap-2">
          <span className="h-2 w-3 rounded-[1px] bg-red-400" aria-hidden="true" />
          <span className="text-xs text-white/60">Costo mensual del aire fugado</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded bg-emerald-300" aria-hidden="true" />
          <span className="text-xs text-white/60">Costo evitado acumulado</span>
        </li>
      </ul>

      <p className="mt-4 max-w-3xl text-justify text-xs leading-relaxed text-white/40">{costos.supuesto}</p>
    </div>
  );
}
