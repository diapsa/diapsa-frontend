import Antetitulo from "../atoms/Antetitulo";
import type { ServiceTendenciaIntervencion } from "@/types/servicio";

/**
 * TendenciaIntervencion
 * Un punto de medición día por día, con su banda de comportamiento normal,
 * el día en que se intervino, y lo que pasó después; al lado, el efecto de
 * esa intervención en todos los canales de la línea.
 *
 * Por qué es el diferenciador de sensores de vibración. La primera versión
 * era un esquema de sesenta días que comparaba el sensor con la ruta
 * mensual. Era claro y era inventado. Esta es real: la tubería de un
 * homogeneizador, medida cada diez minutos, con la reparación del piso a
 * mitad de la serie. Enseña las dos cosas que la ruta mensual no puede
 * dar: la línea base de cada punto construida con días de lecturas, y la
 * prueba de si una intervención sirvió, con la máquina operando igual
 * antes y después.
 *
 * Las barras van en HTML con altura en porcentaje, sin SVG, para que en
 * teléfono los textos conserven su tamaño.
 */

type Props = {
  tendencia: ServiceTendenciaIntervencion;
  paso?: string;
};

export default function TendenciaIntervencion({ tendencia, paso }: Props) {
  const t = tendencia;
  const tope = Math.max(...t.serie.map((s) => s.valor ?? 0), t.base * (1 + t.banda)) * 1.12;
  const h = (v: number) => `${(v / tope) * 100}%`;
  const bajo = t.base * (1 - t.banda);
  const alto = t.base * (1 + t.banda);
  const iInter = t.serie.findIndex((s) => s.dia === t.intervencion.dia);
  const bajaron = t.canales.filter((c) => c.cambio <= -10).length;

  return (
    <section className="w-full bg-gray-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{t.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{t.titulo}</h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{t.texto}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Un punto, día por día */}
          <div className="rounded-sm bg-white p-5 shadow-xl ring-1 ring-black/5 lg:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">{t.punto}</p>
                <p className="mt-1 text-sm text-tertiary">{t.medida}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-tertiary">Antes</p>
                  <p className="text-2xl font-extrabold tabular-nums text-primary">{t.antes.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-tertiary">Después</p>
                  <p className="text-2xl font-extrabold tabular-nums text-emerald-600">{t.despues.toFixed(1)}</p>
                </div>
                {!t.resultados && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-tertiary">Cambio</p>
                  <p className="text-2xl font-extrabold tabular-nums text-emerald-600">{Math.round(((t.despues - t.antes) / t.antes) * 100)} %</p>
                </div>
                )}
              </div>
            </div>

            <div className="relative mt-8 h-56 lg:h-64">
              {/* Banda de comportamiento normal */}
              <div
                className="absolute inset-x-0 bg-primary/[0.06] ring-1 ring-inset ring-primary/10"
                style={{ bottom: h(bajo), height: `${((alto - bajo) / tope) * 100}%` }}
              >
                <span className="absolute left-1 top-0.5 text-[10px] font-bold uppercase tracking-wider text-primary/60">
                  Estándar ± {Math.round(t.banda * 100)} %
                </span>
              </div>
              <div className="absolute inset-x-0 border-t border-dashed border-primary/30" style={{ bottom: h(t.base) }} />

              <ol className="absolute inset-0 flex items-end gap-[3px] sm:gap-1.5">
                {t.serie.map((s, i) => {
                  const despues = i > iInter;
                  const esInter = i === iInter;
                  return (
                    <li key={s.dia} className="relative flex h-full flex-1 flex-col justify-end">
                      {esInter ? (
                        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-secondary" title={t.intervencion.texto} />
                      ) : (
                        <span
                          className={`block w-full rounded-t-sm ${despues ? "bg-emerald-500" : "bg-primary/70"}`}
                          style={{ height: h(s.valor ?? 0) }}
                          title={`${s.dia}: ${s.valor} mm/s`}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="mt-2 flex gap-[3px] sm:gap-1.5">
              {t.serie.map((s, i) => (
                <span key={s.dia} className="flex-1 text-center text-[9px] tabular-nums text-tertiary sm:text-[10px]">
                  {i % 2 === 0 || i === iInter ? s.dia.split(" ")[0] : ""}
                </span>
              ))}
            </div>
            <p className="mt-1 text-right text-[10px] uppercase tracking-wider text-tertiary">{t.eje}</p>

            <p className="mt-4 flex items-baseline gap-2 text-justify text-sm leading-relaxed text-primary">
              <span className="h-3 w-0.5 shrink-0 translate-y-0.5 bg-secondary" aria-hidden="true" />
              <span className="font-bold text-secondary">{t.intervencion.dia}: </span>
              {t.intervencion.texto}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-tertiary">
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-primary/70" /> Antes de la reparación</span>
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Después</span>
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-primary/10 ring-1 ring-primary/20" /> Su comportamiento normal</span>
            </div>
          </div>

          {/* Lo que dejó la reparación: tres resultados grandes, o la tabla
              de canales si el servicio no trae resultados. */}
          {t.resultados ? (
            <ul className="flex flex-col justify-center gap-4">
              {t.resultados.map((r) => (
                <li key={r.cifra} className="rounded-sm bg-white p-5 shadow-xl ring-1 ring-black/5 lg:p-6">
                  <p className={`text-4xl font-extrabold tabular-nums lg:text-5xl ${r.tono === "mal" ? "text-red-600" : r.tono === "bien" ? "text-emerald-600" : "text-primary"}`}>
                    {r.cifra}
                  </p>
                  <p className="mt-1 text-justify text-base leading-snug text-primary">{r.texto}</p>
                </li>
              ))}
            </ul>
          ) : (
          <div className="rounded-sm bg-white p-5 shadow-xl ring-1 ring-black/5 lg:p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Toda la línea</p>
            <p className="mt-1 text-3xl font-extrabold text-primary">
              {bajaron} de {t.canales.length}
            </p>
            <p className="text-sm text-tertiary">canales bajaron más de 10 %</p>
            <ul className="mt-4 divide-y divide-gray-100">
              {t.canales.map((c) => {
                const color = c.cambio <= -10 ? "text-emerald-600" : c.cambio >= 10 ? "text-red-600" : "text-tertiary";
                return (
                  <li key={c.nombre} className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-3 py-1.5 text-xs">
                    <span className="text-primary">{c.nombre}</span>
                    <span className="tabular-nums text-tertiary">
                      {c.antes.toFixed(1)} → {c.despues.toFixed(1)}
                    </span>
                    <span className={`w-12 text-right font-bold tabular-nums ${color}`}>
                      {c.cambio > 0 ? "+" : ""}
                      {c.cambio} %
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-justify text-xs leading-relaxed text-tertiary">{t.lectura}</p>
          </div>
          )}
        </div>

        <p className="mt-4 max-w-3xl text-justify text-xs leading-relaxed text-tertiary/70">{t.nota}</p>
      </div>
    </section>
  );
}
