/**
 * GraficoAhorro
 * Dos barras apiladas: lo que cuesta un paro por falla inesperada contra lo
 * que cuesta la misma intervención hecha a tiempo. La diferencia es el
 * ahorro que produce el proceso de cinco pasos.
 *
 * Por qué existe: el flujo "Del dato a la decisión" explica el método, pero
 * no dice en qué se traduce. Un comprador quiere ver el resultado: el paro
 * inesperado arrastra horas de línea parada, daño colateral, refacción y
 * flete urgentes y horas extra; la intervención planeada solo cuesta la
 * refacción a precio normal y mano de obra en ventana programada.
 *
 * Es un esquema y lo dice: sin eje ni cifras, para no inventar números de
 * cliente. Las alturas son relativas. Las barras crecen desde la base al
 * aparecer, bajo motion-safe.
 */

type Segmento = { texto: string; peso: number; clase: string };

const FALLA: Segmento[] = [
  { texto: "Horas de línea parada", peso: 40, clase: "fill-red-600" },
  { texto: "Daño colateral en el equipo", peso: 22, clase: "fill-red-500" },
  { texto: "Refacción y flete urgentes", peso: 18, clase: "fill-red-400" },
  { texto: "Horas extra de mantenimiento", peso: 12, clase: "fill-red-300" },
];

const PLANEADA: Segmento[] = [
  { texto: "Refacción a precio normal", peso: 14, clase: "fill-emerald-600" },
  { texto: "Mano de obra en ventana programada", peso: 10, clase: "fill-emerald-400" },
];

const ANCHO = 1100;
const ALTO = 520;
const BASE = 430;
const TECHO = 90;
const ESCALA = (BASE - TECHO) / 92; // la barra de falla llena la altura útil

function Barra({
  segmentos,
  x,
  ancho,
  etiqueta,
  ladoTexto,
  retraso,
}: {
  segmentos: Segmento[];
  x: number;
  ancho: number;
  etiqueta: string;
  ladoTexto: "izquierda" | "derecha";
  retraso: number;
}) {
  // Altura acumulada bajo cada segmento, calculada de antemano para no
  // mutar nada durante el render.
  const bases = segmentos.reduce<number[]>((acc, seg, i) => {
    acc.push((acc[i - 1] ?? 0) + seg.peso * ESCALA);
    return acc;
  }, []);
  const xTexto = ladoTexto === "derecha" ? x + ancho + 16 : x - 16;
  const anclaTexto = ladoTexto === "derecha" ? "start" : "end";

  return (
    <g>
      <g
        className="motion-safe:animate-[crecer_.8s_cubic-bezier(.2,.8,.2,1)_both]"
        style={{ transformOrigin: `${x + ancho / 2}px ${BASE}px`, animationDelay: `${retraso}ms` }}
      >
        {segmentos.map((seg, i) => {
          const h = seg.peso * ESCALA;
          const y = BASE - bases[i];
          return (
            <g key={seg.texto}>
              <rect x={x} y={y} width={ancho} height={h - 3} rx={3} className={seg.clase} />
              <text
                x={xTexto}
                y={y + (h - 3) / 2 + 6}
                textAnchor={anclaTexto}
                className="fill-tertiary text-[16px]"
              >
                {seg.texto}
              </text>
            </g>
          );
        })}
      </g>
      <text x={x + ancho / 2} y={BASE + 30} textAnchor="middle" className="fill-primary text-[18px] font-bold">
        {etiqueta}
      </text>
    </g>
  );
}

export default function GraficoAhorro() {
  const anchoBarra = 120;
  const xFalla = 300;
  const xPlaneada = 560;
  const totalFalla = FALLA.reduce((s, seg) => s + seg.peso, 0);
  const totalPlaneada = PLANEADA.reduce((s, seg) => s + seg.peso, 0);
  const yFalla = BASE - totalFalla * ESCALA;
  const yPlaneada = BASE - totalPlaneada * ESCALA;
  // Al borde derecho, después de las etiquetas de la barra planeada.
  const xCorchete = ANCHO - 40;

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className="h-auto w-full"
      role="img"
      aria-label="Esquema: un paro por falla inesperada cuesta horas de línea parada, daño colateral, refacción y flete urgentes y horas extra; la misma intervención planeada solo cuesta la refacción a precio normal y mano de obra en ventana programada. La diferencia es el ahorro."
    >
      <text x={40} y={44} className="fill-primary text-[24px] font-extrabold">
        Lo que cuesta el mismo problema, según cuándo lo atiendes
      </text>
      <text x={40} y={70} className="fill-tertiary text-[16px]">
        Esquema ilustrativo, sin cifras de un cliente en particular
      </text>

      <line x1={40} y1={BASE} x2={ANCHO - 40} y2={BASE} className="stroke-gray-300" strokeWidth={2} />

      <Barra segmentos={FALLA} x={xFalla} ancho={anchoBarra} etiqueta="Paro por falla inesperada" ladoTexto="izquierda" retraso={0} />
      <Barra segmentos={PLANEADA} x={xPlaneada} ancho={anchoBarra} etiqueta="Intervención planeada" ladoTexto="derecha" retraso={250} />

      {/* Corchete del ahorro: de la cima de la barra planeada a la cima de la de falla */}
      <g className="motion-safe:animate-[fadeIn_.5s_ease-out_both]" style={{ animationDelay: "900ms" }}>
        <line x1={xFalla + anchoBarra} y1={yFalla} x2={xCorchete} y2={yFalla} className="stroke-primary/30" strokeWidth={1.5} strokeDasharray="5 5" />
        <line x1={xPlaneada + anchoBarra} y1={yPlaneada} x2={xCorchete} y2={yPlaneada} className="stroke-primary/30" strokeWidth={1.5} strokeDasharray="5 5" />
        <line x1={xCorchete} y1={yFalla} x2={xCorchete} y2={yPlaneada} className="stroke-secondary" strokeWidth={4} strokeLinecap="round" />
        <text x={xCorchete - 14} y={(yFalla + yPlaneada) / 2 - 4} textAnchor="end" className="fill-primary text-[22px] font-extrabold">
          Ahorro
        </text>
        <text x={xCorchete - 14} y={(yFalla + yPlaneada) / 2 + 18} textAnchor="end" className="fill-tertiary text-[15px]">
          lo que el proceso evita
        </text>
      </g>
    </svg>
  );
}
