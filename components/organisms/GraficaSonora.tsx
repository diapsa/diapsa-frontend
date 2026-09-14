import Antetitulo from "../atoms/Antetitulo";
import type { ServiceComparadorSonoro } from "@/types/servicio";

/**
 * GraficaSonora
 * Gráfica de referencia con dos señales de ultrasonido, una encima de la
 * otra: la línea base de un rodamiento sano y la de uno con falla, más la
 * escala de decibeles con los umbrales que usa el analista.
 *
 * Por qué existe: es el diferenciador de ultrasonido. Emiliano prefirió una
 * gráfica de referencia a un reproductor de audio, así que aquí no suena
 * nada: se ve. Las dos formas de onda son reales, la envolvente de dos
 * grabaciones de la misma ruta traída del JSON (120 valores entre 0 y 1),
 * dibujada como onda simétrica. La amplitud de cada una va en proporción a
 * su nivel medido, para que la diferencia de decibeles también se vea.
 *
 * La escala de abajo es la regla de dedo del ultrasonido en rodamientos:
 * sobre la línea base, 8 dB indica falta de lubricación, 16 dB daño
 * incipiente y 35 dB daño avanzado. Las barras crecen al aparecer, bajo
 * motion-safe.
 */

type Props = {
  comparador: ServiceComparadorSonoro;
  paso?: string;
};

const ANCHO = 1100;
const ALTO_FILA = 150;
const IZQ = 300;
const DER = 40;

function decibeles(nivel: string) {
  const n = parseFloat(nivel);
  return Number.isFinite(n) ? n : 0;
}

export default function GraficaSonora({ comparador, paso }: Props) {
  const clips = comparador.clips;
  const maxDb = Math.max(...clips.map((c) => decibeles(c.nivel)), 1);
  const base = decibeles(clips.find((c) => c.estado === "normal")?.nivel ?? "0");
  const anchoOnda = ANCHO - IZQ - DER;
  const altoOndas = ALTO_FILA * clips.length;
  const yEscala = altoOndas + 70;
  const alto = yEscala + 80;
  const ESCALA_MAX = 70;
  const xDb = (db: number) => IZQ + (Math.min(db, ESCALA_MAX) / ESCALA_MAX) * anchoOnda;
  const umbrales = [
    { db: base + 8, texto: "Falta de lubricación", clase: "fill-amber-300" },
    { db: base + 16, texto: "Daño incipiente", clase: "fill-orange-400" },
    { db: base + 35, texto: "Daño avanzado", clase: "fill-red-400" },
  ];

  return (
    <section className="w-full bg-primary py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>Lo que oye el analista</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white lg:text-[2.75rem]">
            {comparador.titulo}
          </h2>
          {comparador.texto && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-white/75">{comparador.texto}</p>
          )}
        </div>

        <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/5 p-4 lg:p-8">
          <svg
            viewBox={`0 0 ${ANCHO} ${alto}`}
            className="h-auto w-full min-w-[720px]"
            role="img"
            aria-label={`Gráfica de referencia: ${clips.map((c) => `${c.titulo}, ${c.nivel}`).join("; ")}. Escala de decibeles con umbrales de lubricación, daño incipiente y daño avanzado sobre la línea base.`}
          >
            {clips.map((clip, fila) => {
              const yMedio = fila * ALTO_FILA + ALTO_FILA / 2;
              const alarma = clip.estado === "alarma";
              // Amplitud en proporción al nivel medido, con un mínimo para que la onda sana se vea.
              const amp = (ALTO_FILA / 2 - 12) * Math.max(0.28, decibeles(clip.nivel) / maxDb);
              const paso = anchoOnda / clip.envolvente.length;
              return (
                <g key={clip.titulo}>
                  {/* Etiquetas */}
                  <text x={0} y={yMedio - 26} className="fill-white/50 text-[13px] font-bold uppercase tracking-widest">
                    {clip.etiqueta}
                  </text>
                  <text x={0} y={yMedio} className="fill-white text-[20px] font-extrabold">
                    {clip.titulo}
                  </text>
                  <rect x={0} y={yMedio + 12} width={74} height={26} rx={13} className={alarma ? "fill-red-500/25" : "fill-emerald-500/25"} />
                  <text x={37} y={yMedio + 30} textAnchor="middle" className={`text-[14px] font-bold ${alarma ? "fill-red-300" : "fill-emerald-300"}`}>
                    {clip.nivel}
                  </text>

                  {/* Línea media y onda simétrica */}
                  <line x1={IZQ} y1={yMedio} x2={ANCHO - DER} y2={yMedio} className="stroke-white/15" strokeWidth={1} />
                  {clip.envolvente.map((v, k) => {
                    const h = Math.max(2, v * amp * 2);
                    return (
                      <rect
                        key={k}
                        x={IZQ + k * paso}
                        y={yMedio - h / 2}
                        width={Math.max(1.5, paso - 1.5)}
                        height={h}
                        rx={1}
                        className={`${alarma ? "fill-red-400" : "fill-emerald-400"} motion-safe:animate-[crecer_.5s_ease-out_both]`}
                        style={{ transformOrigin: `${IZQ + k * paso}px ${yMedio}px`, animationDelay: `${fila * 400 + k * 8}ms` }}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Separador */}
            <line x1={0} y1={altoOndas + 24} x2={ANCHO} y2={altoOndas + 24} className="stroke-white/10" strokeWidth={1} />

            {/* Escala de decibeles con umbrales sobre la línea base */}
            <text x={0} y={yEscala - 18} className="fill-white/50 text-[13px] font-bold uppercase tracking-widest">
              Escala de referencia
            </text>
            <text x={0} y={yEscala + 6} className="fill-white text-[15px] font-semibold">
              Decibeles sobre la línea base
            </text>
            <line x1={IZQ} y1={yEscala} x2={ANCHO - DER} y2={yEscala} className="stroke-white/30" strokeWidth={2} />
            {[0, 10, 20, 30, 40, 50, 60, 70].map((d) => (
              <g key={d}>
                <line x1={xDb(d)} y1={yEscala - 4} x2={xDb(d)} y2={yEscala + 4} className="stroke-white/30" strokeWidth={1} />
                <text x={xDb(d)} y={yEscala + 22} textAnchor="middle" className="fill-white/40 text-[11px]">
                  {d}
                </text>
              </g>
            ))}
            {umbrales.map((u, i) => (
              <g key={u.texto}>
                <line x1={xDb(u.db)} y1={yEscala - 30} x2={xDb(u.db)} y2={yEscala} className="stroke-white/40" strokeWidth={1} strokeDasharray="3 3" />
                <text x={xDb(u.db)} y={yEscala - 36 - (i % 2) * 16} textAnchor="middle" className={`text-[12px] font-semibold ${u.clase}`}>
                  {u.texto}
                </text>
              </g>
            ))}
            {clips.map((clip) => {
              const alarma = clip.estado === "alarma";
              return (
                <g key={clip.nivel} className="motion-safe:animate-[fadeIn_.5s_ease-out_both]" style={{ animationDelay: "1.2s" }}>
                  <circle cx={xDb(decibeles(clip.nivel))} cy={yEscala} r={7} className={alarma ? "fill-red-400" : "fill-emerald-400"} />
                  <text x={xDb(decibeles(clip.nivel))} y={yEscala + 44} textAnchor="middle" className={`text-[13px] font-bold ${alarma ? "fill-red-300" : "fill-emerald-300"}`}>
                    {clip.nivel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {comparador.pie && (
          <p className="mt-6 max-w-3xl text-justify text-sm leading-relaxed text-white/50">{comparador.pie}</p>
        )}
      </div>
    </section>
  );
}
