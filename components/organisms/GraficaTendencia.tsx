import Antetitulo from "../atoms/Antetitulo";
import GraficoEstimado from "../atoms/GraficoEstimado";
import { nivel } from "@/lib/semaforo";
import type { ServiceTendencia } from "@/types/servicio";

/**
 * GraficaTendencia
 * La misma máquina, muestra tras muestra: cómo subió el valor hasta la
 * alarma, dónde se intervino y cómo bajó después.
 *
 * Por qué existe: en análisis de aceite una muestra suelta dice poco; el
 * programa vale por la serie. Y la serie es además la única prueba de que el
 * servicio funcionó, porque enseña el valor antes de la acción y el valor
 * después. Termografía tiene el par visual y térmico, ultrasonido tiene la
 * gráfica sonora; aceite tiene esto.
 *
 * Los valores vienen del historial real de un equipo en el JSON del
 * servicio. Las tres cifras del encabezado se derivan de esa misma serie, así
 * que no se pueden desalinear de las barras. Cada barra lleva el color con
 * el que el laboratorio calificó esa muestra y su código ISO 4406, que es el
 * número que un jefe de mantenimiento reconoce.
 *
 * La maquetación es HTML, con las barras en porcentaje, para que en un
 * teléfono se lea igual sin arrastrar de lado.
 */

type Props = {
  tendencia: ServiceTendencia;
  paso?: string;
};

/** Miles con coma, sin depender del locale del navegador. */
function miles(n: number) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function GraficaTendencia({ tendencia, paso }: Props) {
  const muestras = tendencia.muestras;
  const total = muestras.length;
  const pico = Math.max(...muestras.map((m) => m.valor), 1);
  const indicePico = muestras.findIndex((m) => m.valor === pico);
  const despues = muestras[tendencia.accion.indice] ?? muestras[total - 1];
  const reduccion = Math.round((1 - despues.valor / pico) * 100);
  const altura = (v: number) => (v / pico) * 100;
  // La marca de la acción va en la frontera entre la última muestra de antes
  // y la primera de después.
  const marcaX = (tendencia.accion.indice / total) * 100;

  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>Lo que prueba la serie</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {tendencia.titulo}
          </h2>
          {tendencia.texto && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">
              {tendencia.texto}
            </p>
          )}
        </div>

        <div className="rounded-sm bg-primary p-6 lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">
            {tendencia.equipo}
          </p>
          <p className="mt-1 text-sm text-white/60">{tendencia.medida}</p>

          {/* Las tres cifras, todas derivadas de la misma serie. */}
          <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-3">
            <div className="bg-primary p-4">
              <dt className="text-xs text-white/50">En la muestra de alarma</dt>
              <dd className="mt-1 text-2xl font-extrabold text-red-300 lg:text-3xl">
                {miles(pico)}
                <span className="ml-2 text-sm font-bold text-white/50">
                  ISO {muestras[indicePico]?.codigo}
                </span>
              </dd>
            </div>
            <div className="bg-primary p-4">
              <dt className="text-xs text-white/50">Primera muestra después de intervenir</dt>
              <dd className="mt-1 text-2xl font-extrabold text-sky-300 lg:text-3xl">
                {miles(despues.valor)}
                <span className="ml-2 text-sm font-bold text-white/50">ISO {despues.codigo}</span>
              </dd>
            </div>
            <div className="bg-primary p-4">
              <dt className="text-xs text-white/50">Reducción</dt>
              <dd className="mt-1 text-2xl font-extrabold text-emerald-300 lg:text-3xl">{reduccion} %</dd>
            </div>
          </dl>

          <div className="mt-8 flex gap-3">
            {/* Eje */}
            <div className="relative h-52 w-14 shrink-0 lg:h-72">
              {[1, 0.5, 0].map((f) => (
                <span
                  key={f}
                  className="absolute right-0 -translate-y-1/2 text-[11px] text-white/40"
                  style={{ top: `${(1 - f) * 100}%` }}
                >
                  {miles(pico * f)}
                </span>
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <div
                className="relative h-52 lg:h-72"
                role="img"
                aria-label={`${tendencia.medida} en ${total} muestras: sube hasta ${miles(pico)} en la alarma y baja a ${miles(despues.valor)} tras la acción, una reducción del ${reduccion} por ciento`}
              >
                {/* Rejilla */}
                {[0, 0.5, 1].map((f) => (
                  <span
                    key={f}
                    className="absolute inset-x-0 h-px bg-white/10"
                    style={{ top: `${f * 100}%` }}
                    aria-hidden="true"
                  />
                ))}

                {/* Barras, cada una con el color con que el laboratorio la calificó */}
                <div className="absolute inset-0 flex items-end gap-2 lg:gap-4">
                  {muestras.map((m, i) => (
                    <div key={m.fecha} className="relative flex h-full flex-1 items-end">
                      <span
                        className="absolute inset-x-0 text-center text-[10px] font-bold text-white/70 lg:text-[11px]"
                        style={{ bottom: `calc(${altura(m.valor)}% + 6px)` }}
                      >
                        {m.codigo}
                      </span>
                      <span
                        className={`block w-full rounded-t-[2px] ${nivel(m.clave).punto} motion-safe:animate-[crecer_.6s_ease-out_both]`}
                        style={{
                          height: `${altura(m.valor)}%`,
                          transformOrigin: "bottom",
                          animationDelay: `${i * 90}ms`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* La acción correctiva, en la frontera entre antes y después */}
                <div
                  className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-secondary motion-safe:animate-[fadeIn_.5s_ease-out_both]"
                  style={{ left: `${marcaX}%`, animationDelay: "700ms" }}
                  aria-hidden="true"
                >
                  <span className="absolute left-2 top-0 whitespace-nowrap rounded-sm bg-secondary px-2 py-1 text-[11px] font-bold text-primary">
                    {tendencia.accion.texto}
                  </span>
                </div>
              </div>

              {/* Fechas */}
              <div className="mt-2 flex gap-2 lg:gap-4">
                {muestras.map((m) => (
                  <span key={m.fecha} className="flex-1 text-center text-[10px] text-white/40 lg:text-[11px]">
                    {m.fecha}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-justify text-xs leading-relaxed text-white/40">{tendencia.nota}</p>

          {/* La serie prueba que bajó; el costo dice por qué importa. Va
              dentro de la misma tarjeta para que se lean como una sola cosa. */}
          {tendencia.estimado && <GraficoEstimado estimado={tendencia.estimado} />}
        </div>
      </div>
    </section>
  );
}
