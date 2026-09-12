/**
 * GraficoPunto
 * Gráfico esquemático que acompaña a un punto clave del servicio, en lugar
 * de una foto.
 *
 * Por qué existe: "Qué ganas" promete menos paros no programados. Una foto
 * de la planta no enseña eso; un gráfico de barras que baja, sí. Es un
 * esquema, no datos de un cliente: no tiene eje numérico a propósito, para
 * no inventar cifras. Las barras crecen al aparecer, bajo motion-safe.
 *
 * Se elige por clave desde el JSON del servicio (`grafico: "paros"`).
 */

type Props = {
  clave: string;
  className?: string;
};

/* Doce meses. Los primeros cuatro sin monitoreo; después arranca el
   programa y los paros bajan. Alturas relativas, de 0 a 100. */
const PAROS = [78, 92, 70, 88, 64, 48, 36, 30, 22, 18, 16, 14];
const ARRANQUE = 4;

function colorBarra(altura: number) {
  if (altura >= 60) return "fill-red-500";
  if (altura >= 30) return "fill-amber-400";
  return "fill-emerald-500";
}

function Paros() {
  const ancho = 800;
  const alto = 600;
  const izq = 48;
  const der = 32;
  const base = 470;
  const techo = 130;
  const paso = (ancho - izq - der) / PAROS.length;
  const anchoBarra = paso * 0.62;
  const xLinea = izq + ARRANQUE * paso;

  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      className="h-full w-full"
      role="img"
      aria-label="Esquema: los paros no programados bajan mes a mes a partir de que arranca el monitoreo de condición"
    >
      {/* Título dentro del gráfico */}
      <text x={izq} y={56} className="fill-primary text-[26px] font-extrabold">
        Paros no programados por mes
      </text>
      <text x={izq} y={86} className="fill-tertiary text-[17px]">
        Esquema ilustrativo, sin cifras de un cliente en particular
      </text>

      {/* Línea base */}
      <line x1={izq} y1={base} x2={ancho - der} y2={base} className="stroke-gray-300" strokeWidth={2} />

      {/* Barras */}
      {PAROS.map((h, i) => {
        const x = izq + i * paso + (paso - anchoBarra) / 2;
        const altura = ((base - techo) * h) / 100;
        return (
          <rect
            key={i}
            x={x}
            y={base - altura}
            width={anchoBarra}
            height={altura}
            rx={4}
            className={`${colorBarra(h)} motion-safe:animate-[crecer_.7s_cubic-bezier(.2,.8,.2,1)_both]`}
            style={{ transformOrigin: `${x + anchoBarra / 2}px ${base}px`, animationDelay: `${i * 55}ms` }}
          />
        );
      })}

      {/* Arranque del programa */}
      <line
        x1={xLinea}
        y1={techo - 24}
        x2={xLinea}
        y2={base}
        className="stroke-primary"
        strokeWidth={2}
        strokeDasharray="8 6"
      />
      <text x={xLinea + 12} y={techo - 6} className="fill-primary text-[18px] font-bold">
        Arranca el monitoreo
      </text>

      {/* Tramos */}
      <text x={izq + (ARRANQUE * paso) / 2} y={base + 34} textAnchor="middle" className="fill-tertiary text-[17px] font-semibold">
        Sin monitoreo
      </text>
      <text
        x={xLinea + ((PAROS.length - ARRANQUE) * paso) / 2}
        y={base + 34}
        textAnchor="middle"
        className="fill-tertiary text-[17px] font-semibold"
      >
        Con monitoreo de condición
      </text>

      {/* Leyenda */}
      {[
        ["fill-red-500", "Paro por falla"],
        ["fill-amber-400", "Intervención programada"],
        ["fill-emerald-500", "Ruta normal"],
      ].map(([color, texto], i) => (
        <g key={texto} transform={`translate(${izq + i * 250}, ${base + 76})`}>
          <rect width={16} height={16} rx={3} className={color} />
          <text x={24} y={13} className="fill-tertiary text-[16px]">
            {texto}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function GraficoPunto({ clave, className = "" }: Props) {
  if (clave !== "paros") return null;
  return (
    <div className={`flex h-full w-full items-center bg-white p-4 lg:p-6 ${className}`}>
      <Paros />
    </div>
  );
}
