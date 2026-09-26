/**
 * MiniCalidad
 * Esquema chico de cada problema de calidad de la energía, para las
 * tarjetas de "Lo que se busca en el registro": la onda deformada, el
 * factor de potencia contra el mínimo, las tres fases desiguales y la
 * caída de tensión. Son esquemas, sin datos de un cliente.
 */

type Clave = "armonicos" | "fp" | "desbalance" | "eventos";

const NAVY = "#002e46";
const GRIS = "#d9e2e8";
const NARANJA = "#fc9f01";

function Armonicos() {
  // Senoide limpia de fondo y la misma onda con 5ª y 7ª encima
  const limpia: string[] = [];
  const sucia: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = 6 + i * 1.88;
    const a = (i / 100) * Math.PI * 4;
    limpia.push(`${i ? "L" : "M"}${x.toFixed(1)} ${(35 - 22 * Math.sin(a)).toFixed(1)}`);
    const y = 35 - 22 * (Math.sin(a) - 0.28 * Math.sin(5 * a) + 0.16 * Math.sin(7 * a));
    sucia.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return (
    <>
      <line x1="6" x2="194" y1="35" y2="35" stroke={GRIS} strokeWidth="1" />
      <path d={limpia.join("")} fill="none" stroke={GRIS} strokeWidth="2" />
      <path d={sucia.join("")} fill="none" stroke={NARANJA} strokeWidth="2.2" strokeLinejoin="round" />
    </>
  );
}

function Fp() {
  // Escala de 0.80 a 1.00: zona de cargo, mínimo 0.90 y la lectura en 0.86
  const x = (v: number) => 10 + ((v - 0.8) / 0.2) * 180;
  return (
    <>
      <rect x={x(0.8)} y="26" width={x(0.9) - x(0.8)} height="12" rx="2" fill="#fecaca" />
      <rect x={x(0.9)} y="26" width={x(1) - x(0.9)} height="12" rx="2" fill="#bbf7d0" />
      <line x1={x(0.9)} x2={x(0.9)} y1="18" y2="46" stroke={NAVY} strokeWidth="1.5" strokeDasharray="3 2" />
      <text x={x(0.9)} y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill={NAVY}>mín. 0.90</text>
      <path d={`M${x(0.86)} 24 l-5 -8 h10 z`} fill="#b91c1c" />
      <text x={x(0.8)} y="60" fontSize="10" fontWeight="600" fill="#b91c1c">Cargo en el recibo</text>
      <text x={x(1)} y="60" textAnchor="end" fontSize="10" fontWeight="600" fill="#047857">Bonificación</text>
    </>
  );
}

function Desbalance() {
  const fases = [
    { f: "A", h: 40 },
    { f: "B", h: 26 },
    { f: "C", h: 46 },
  ];
  return (
    <>
      <line x1="20" x2="180" y1="55" y2="55" stroke={NAVY} strokeWidth="1.5" />
      <line x1="20" x2="180" y1={55 - 37} y2={55 - 37} stroke={NAVY} strokeWidth="1" strokeDasharray="3 3" />
      <text x="148" y={55 - 41} fontSize="9" fontWeight="600" fill={NAVY}>Promedio</text>
      {fases.map((p, i) => (
        <g key={p.f}>
          <rect x={24 + i * 44} y={55 - p.h} width="28" height={p.h} rx="2" fill={NARANJA} />
          <text x={38 + i * 44} y="67" textAnchor="middle" fontSize="10" fontWeight="700" fill={NAVY}>{p.f}</text>
        </g>
      ))}
    </>
  );
}

function Eventos() {
  // Tensión eficaz estable, una caída breve y un pico
  return (
    <>
      <line x1="6" x2="194" y1="26" y2="26" stroke={GRIS} strokeWidth="1" strokeDasharray="3 3" />
      <path d="M6 26 H70 L74 48 H92 L96 26 H140 L143 10 L146 26 H194" fill="none" stroke={NAVY} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="83" cy="48" r="4" fill={NARANJA} />
      <text x="83" y="64" textAnchor="middle" fontSize="10" fontWeight="700" fill={NAVY}>Caída</text>
      <circle cx="143" cy="10" r="4" fill={NARANJA} />
      <text x="160" y="12" fontSize="10" fontWeight="700" fill={NAVY}>Pico</text>
    </>
  );
}

const MAPA: Record<Clave, () => React.ReactElement> = {
  armonicos: Armonicos,
  fp: Fp,
  desbalance: Desbalance,
  eventos: Eventos,
};

export default function MiniCalidad({ clave }: { clave: Clave }) {
  const Dibujo = MAPA[clave];
  return (
    <div className="rounded-sm bg-gray-50 px-3 py-3 ring-1 ring-black/5">
      <svg viewBox="0 0 200 70" className="h-auto w-full" role="img" aria-hidden="true">
        <Dibujo />
      </svg>
    </div>
  );
}
