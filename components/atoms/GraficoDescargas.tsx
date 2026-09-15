import type { AnalisisDescargas } from "@/types/servicio";

/**
 * GraficoDescargas
 * El análisis que acompaña a un hallazgo eléctrico: el patrón PRPD de la
 * descarga, la probabilidad de cada tipo, la gravedad y los parámetros con
 * los que se midió.
 *
 * Por qué existe: en tableros el nivel en decibeles dice que hay algo, pero
 * no qué. Lo que lo dice es dónde cae cada estallido dentro de la onda
 * eléctrica, y esa figura es la huella del tipo de descarga. Aquí el ejemplo
 * es una descarga superficial: dos racimos, uno por semiciclo, los dos en la
 * parte creciente de la onda y con amplitudes parecidas. Es la continuación
 * de la señal que está arriba en la misma pestaña, no un caso aparte.
 *
 * La referencia fue una captura de un analizador de descargas parciales que
 * Emiliano compartió, donde el equipo no había clasificado nada y todas las
 * probabilidades salían en cero; aquí el ejemplo sí clasifica, que es el
 * punto de enseñarlo.
 *
 * Los puntos vienen del JSON, así que el patrón se puede cambiar por el de
 * otra falla sin tocar el componente. La nube va en SVG con su proporción
 * intacta para que los puntos no se deformen, y todos los rótulos en HTML,
 * de modo que en un teléfono se lean igual.
 */

type Props = {
  descargas: AnalisisDescargas;
};

const ANCHO = 360;
const ALTO = 120;
const Y_ARRIBA = 8;
const Y_ABAJO = 112;

export default function GraficoDescargas({ descargas }: Props) {
  const y = (amp: number) => Y_ABAJO - (amp / 100) * (Y_ABAJO - Y_ARRIBA);
  const medio = (Y_ARRIBA + Y_ABAJO) / 2;
  const alturaOnda = (Y_ABAJO - Y_ARRIBA) / 2 - 4;
  // La onda de la red, de fondo: es contra ella que se ordenan los estallidos.
  const onda = Array.from({ length: 73 }, (_, i) => {
    const g = i * 5;
    return `${g},${(medio - Math.sin((g * Math.PI) / 180) * alturaOnda).toFixed(1)}`;
  }).join(" ");
  const maxTipo = Math.max(...descargas.tipos.map((t) => t.valor), 1);
  const gravedadAlta = descargas.gravedad >= 70;

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">Análisis de la descarga</p>
      <h3 className="mt-1 text-xl font-extrabold text-white lg:text-2xl">{descargas.titulo}</h3>
      {descargas.texto && (
        <p className="mt-2 max-w-3xl text-justify text-sm leading-relaxed text-white/60">{descargas.texto}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Patrón PRPD */}
        <div className="lg:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">
            Patrón PRPD · {descargas.frecuencia} Hz
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            Amplitud relativa según la fase de la onda
          </p>

          <div className="mt-4 flex gap-2">
            <div className="relative w-8 shrink-0">
              {[100, 50, 0].map((v, i) => (
                <span
                  key={v}
                  className="absolute right-0 -translate-y-1/2 text-[10px] text-white/40"
                  style={{ top: `${(i / 2) * 100}%` }}
                >
                  {v}%
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <svg
                viewBox={`0 0 ${ANCHO} ${ALTO}`}
                className="h-auto w-full"
                role="img"
                aria-label={`Patrón PRPD con dos racimos de descargas, uno en cada semiciclo de la onda de ${descargas.frecuencia} hercios`}
              >
                {[0, 50, 100].map((v) => (
                  <line
                    key={v}
                    x1={0}
                    y1={y(v)}
                    x2={ANCHO}
                    y2={y(v)}
                    className="stroke-white/10"
                    strokeWidth={0.6}
                  />
                ))}
                {[90, 180, 270].map((g) => (
                  <line
                    key={g}
                    x1={g}
                    y1={Y_ARRIBA}
                    x2={g}
                    y2={Y_ABAJO}
                    className="stroke-white/10"
                    strokeWidth={0.6}
                    strokeDasharray="2 3"
                  />
                ))}
                <polyline
                  points={onda}
                  fill="none"
                  strokeWidth={0.8}
                  className="stroke-white/25"
                  strokeDasharray="3 3"
                />
                {descargas.ruido.map(([g, amp], i) => (
                  <circle key={`r${i}`} cx={g} cy={y(amp)} r={1} className="fill-white/20" />
                ))}
                {descargas.patron.map(([g, amp], i) => (
                  <circle
                    key={`p${i}`}
                    cx={g}
                    cy={y(amp)}
                    r={1.4}
                    className="fill-red-400/80 motion-safe:animate-[fadeIn_.4s_ease-out_both]"
                    style={{ animationDelay: `${300 + i * 4}ms` }}
                  />
                ))}
              </svg>
              <div className="mt-1 flex justify-between text-[10px] text-white/40">
                {[0, 90, 180, 270, 360].map((g) => (
                  <span key={g}>{g}°</span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-justify text-sm leading-relaxed text-white/60">{descargas.lectura}</p>
        </div>

        {/* Clasificación y gravedad */}
        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">Tipo de descarga</p>
          <ul className="mt-4 space-y-3">
            {descargas.tipos.map((t, i) => {
              const dominante = i === 0;
              return (
                <li key={t.texto}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`text-sm ${dominante ? "font-bold text-white" : "text-white/60"}`}>
                      {t.texto}
                    </span>
                    <span
                      className={`shrink-0 text-sm font-bold ${dominante ? "text-red-300" : "text-white/40"}`}
                    >
                      {t.valor}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <span
                      className={`block h-full rounded-full ${dominante ? "bg-red-400" : "bg-white/25"} motion-safe:animate-[crecerX_.7s_ease-out_both]`}
                      style={{
                        width: `${(t.valor / maxTipo) * 100}%`,
                        transformOrigin: "left",
                        animationDelay: `${400 + i * 120}ms`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">
                Gravedad de la descarga
              </p>
              <p className="whitespace-nowrap sm:text-right">
                <span className={`text-sm font-semibold ${gravedadAlta ? "text-red-300" : "text-amber-300"}`}>
                  {descargas.gravedadTexto}
                </span>
                <span
                  className={`ml-2 text-2xl font-extrabold ${gravedadAlta ? "text-red-300" : "text-amber-300"}`}
                >
                  {descargas.gravedad}
                </span>
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <span
                className={`block h-full rounded-full ${gravedadAlta ? "bg-red-400" : "bg-amber-400"} motion-safe:animate-[crecerX_.8s_ease-out_both]`}
                style={{ width: `${descargas.gravedad}%`, transformOrigin: "left", animationDelay: "900ms" }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-white/40">
              <span>Bajo</span>
              <span>Alto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parámetros de la medición */}
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-4">
        {descargas.parametros.map((p) => (
          <div key={p.texto} className="bg-primary p-3">
            <dt className="text-[11px] text-white/50">{p.texto}</dt>
            <dd className="mt-0.5 text-sm font-bold text-white">{p.valor}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 max-w-3xl text-justify text-xs leading-relaxed text-white/40">{descargas.nota}</p>
    </div>
  );
}
