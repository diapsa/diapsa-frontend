/**
 * IlustracionEquipo
 * Dibujo propio de un equipo industrial para las tarjetas de "¿Dónde
 * aplica?", en lugar de fotos genéricas.
 *
 * Por qué existe: las tarjetas usaban fotos de Wikimedia Commons de estilos
 * muy distintos (un motor recortado sobre negro, una bomba en un sótano, un
 * compresor de museo) que no se veían como parte del sitio y obligaban a
 * dar crédito a terceros. Estos dibujos comparten la paleta y el trazo de
 * las escenas 3D y de las ilustraciones de las pestañas: azul marino para
 * el cuerpo, azul medio para detalles, gris para bases y naranja como
 * acento. Son SVG, así que pesan casi nada y se ven nítidos a cualquier
 * tamaño.
 *
 * Cada equipo se dibuja en un lienzo de 160 × 120 con el piso en y = 100.
 */

type Props = { clave: string; className?: string };

const N = "#002e46"; // azul marino
const M = "#2b5671"; // azul medio
const L = "#4d7a96"; // azul claro para caras iluminadas
const G = "#c6d1d9"; // gris base
const P = "#eef1f4"; // porcelana
const O = "#fc9f01"; // naranja

const Piso = () => <ellipse cx="80" cy="101" rx="62" ry="6" fill="#002e46" opacity=".12" />;

function Motor() {
  return (
    <g>
      <Piso />
      <rect x="42" y="92" width="10" height="8" fill={M} /><rect x="96" y="92" width="10" height="8" fill={M} />
      <rect x="22" y="61" width="22" height="8" rx="2" fill={G} />
      <rect x="40" y="44" width="72" height="50" rx="12" fill={N} />
      {[50, 58, 66, 74, 82, 90, 98].map((x) => <rect key={x} x={x} y="47" width="3" height="44" rx="1.5" fill={M} />)}
      <rect x="108" y="48" width="18" height="42" rx="8" fill={M} />
      {[54, 60, 66, 72, 78, 84].map((y) => <rect key={y} x="112" y={y} width="10" height="2" rx="1" fill={N} opacity=".6" />)}
      <rect x="62" y="32" width="24" height="14" rx="2" fill={M} />
      <rect x="66" y="58" width="16" height="10" rx="1.5" fill={O} />
    </g>
  );
}

function Bomba() {
  return (
    <g>
      <Piso />
      <rect x="20" y="92" width="120" height="8" rx="2" fill={G} />
      <circle cx="48" cy="66" r="24" fill={N} />
      <circle cx="48" cy="66" r="11" fill={M} />
      <rect x="38" y="30" width="16" height="16" fill={N} /><rect x="34" y="26" width="24" height="6" rx="1.5" fill={M} />
      <rect x="16" y="60" width="10" height="14" rx="1.5" fill={M} />
      <rect x="70" y="62" width="14" height="8" fill={G} />
      <rect x="82" y="58" width="10" height="16" rx="2" fill={O} />
      <rect x="92" y="46" width="42" height="40" rx="9" fill={N} />
      {[98, 105, 112, 119, 126].map((x) => <rect key={x} x={x} y="49" width="2.5" height="34" rx="1" fill={M} />)}
      <rect x="40" y="86" width="16" height="6" fill={M} /><rect x="100" y="86" width="28" height="6" fill={M} />
    </g>
  );
}

function Ventilador() {
  return (
    <g>
      <Piso />
      <rect x="18" y="92" width="124" height="8" rx="2" fill={G} />
      <path d="M30 88 V58 A34 34 0 0 1 98 50 V24 H118 V60 A38 38 0 0 1 80 88 Z" fill={N} />
      <circle cx="66" cy="60" r="18" fill={M} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1="66" y1="60" x2={66 + 16 * Math.cos((a * Math.PI) / 180)} y2={60 + 16 * Math.sin((a * Math.PI) / 180)} stroke={L} strokeWidth="2.5" />)}
      <circle cx="66" cy="60" r="4" fill={O} />
      <rect x="112" y="64" width="26" height="24" rx="6" fill={M} />
      <rect x="94" y="20" width="28" height="6" rx="1.5" fill={M} />
    </g>
  );
}

function Compresor() {
  return (
    <g>
      <Piso />
      <rect x="18" y="68" width="124" height="26" rx="13" fill={N} />
      <rect x="22" y="92" width="8" height="8" fill={M} /><rect x="130" y="92" width="8" height="8" fill={M} />
      <rect x="34" y="36" width="36" height="32" rx="4" fill={M} />
      {[40, 48, 56, 64].map((x) => <rect key={x} x={x} y="30" width="4" height="8" rx="1" fill={G} />)}
      <rect x="82" y="44" width="40" height="24" rx="8" fill={N} stroke={M} strokeWidth="2" />
      <rect x="70" y="50" width="12" height="6" fill={G} />
      <circle cx="132" cy="56" r="7" fill="#fff" stroke={N} strokeWidth="2" /><line x1="132" y1="56" x2="136" y2="52" stroke={O} strokeWidth="2" />
      <rect x="130" y="62" width="4" height="7" fill={N} />
      <rect x="70" y="76" width="18" height="10" rx="1.5" fill={O} />
    </g>
  );
}

function Turbina() {
  const etapas = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <g>
      <Piso />
      <path d="M20 50 L34 22 H130 L146 50" stroke={M} strokeWidth="2" strokeDasharray="4 3" fill="none" />
      <path d="M18 66 L32 94 H132 L148 66 Z" fill={N} />
      <rect x="18" y="94" width="130" height="6" rx="1.5" fill={G} />
      <rect x="8" y="60" width="150" height="6" rx="3" fill={G} />
      {etapas.map((i) => {
        const x = 40 + i * 12, h = 16 + i * 5;
        return <rect key={i} x={x - 3} y={63 - h / 2} width="6" height={h} rx="1.5" fill={i > 5 ? O : L} />;
      })}
    </g>
  );
}

function TableroBT() {
  return (
    <g>
      <Piso />
      <rect x="44" y="18" width="62" height="82" rx="2" fill={N} />
      <rect x="50" y="24" width="50" height="70" rx="1.5" fill={M} />
      {[30, 44, 58, 72].map((y) => (
        <g key={y}>{[54, 66, 78, 90].map((x) => <rect key={x} x={x} y={y} width="8" height="10" rx="1" fill={P} />)}</g>
      ))}
      {[54, 66, 78, 90].map((x) => <rect key={x} x={x + 2} y="33" width="4" height="3" fill={O} />)}
      <path d="M106 20 L132 30 V96 L106 100 Z" fill={L} />
      <rect x="124" y="56" width="3" height="12" rx="1.5" fill={G} />
    </g>
  );
}

function TableroMT() {
  return (
    <g>
      <Piso />
      {[20, 62, 104].map((x, i) => (
        <g key={x}>
          <rect x={x} y="16" width="38" height="84" rx="2" fill={i === 1 ? M : N} />
          <rect x={x + 8} y="26" width="22" height="12" rx="1.5" fill={P} />
          <rect x={x + 12} y="30" width="14" height="4" fill={i === 1 ? O : G} />
          <rect x={x + 6} y="48" width="26" height="30" rx="1.5" fill="none" stroke={L} strokeWidth="1.5" />
          <rect x={x + 28} y="58" width="3" height="10" rx="1.5" fill={G} />
          <circle cx={x + 10} cy="88" r="2.5" fill={O} />
        </g>
      ))}
    </g>
  );
}

function CCM() {
  return (
    <g>
      <Piso />
      <rect x="16" y="16" width="128" height="84" rx="2" fill={N} />
      {[20, 52, 84, 116].map((x) => (
        <g key={x}>{[20, 36, 52, 68, 84].map((y) => (
          <g key={y}><rect x={x} y={y} width="26" height="13" rx="1" fill={M} /><circle cx={x + 5} cy={y + 6.5} r="2" fill={(x + y) % 3 === 0 ? O : G} /><rect x={x + 16} y={y + 5} width="6" height="3" rx="1" fill={G} /></g>
        ))}</g>
      ))}
    </g>
  );
}

function Subestacion() {
  return (
    <g>
      <Piso />
      {[26, 80, 134].map((x) => (
        <g key={x} stroke={M} strokeWidth="2.5" fill="none">
          <path d={`M${x - 8} 100 L${x - 3} 22 H${x + 3} L${x + 8} 100`} />
          <path d={`M${x - 7} 80 L${x + 7} 60 M${x + 7} 80 L${x - 7} 60 M${x - 5} 55 L${x + 5} 38 M${x + 5} 55 L${x - 5} 38`} strokeWidth="1.2" />
        </g>
      ))}
      <rect x="18" y="20" width="124" height="5" fill={N} />
      {[40, 60, 100, 120].map((x) => <g key={x}><rect x={x - 1.5} y="25" width="3" height="10" fill={P} stroke={N} strokeWidth=".6" /><path d={`M${x} 35 Q${x + 10} 50 ${x + 2} 64`} stroke={N} strokeWidth="1.2" fill="none" /></g>)}
      <rect x="44" y="70" width="30" height="24" rx="2" fill={N} /><rect x="86" y="70" width="30" height="24" rx="2" fill={N} />
      {[48, 90].map((x) => <rect key={x} x={x} y="74" width="22" height="16" rx="1" fill={M} />)}
      <rect x="62" y="64" width="4" height="6" fill={O} /><rect x="104" y="64" width="4" height="6" fill={O} />
    </g>
  );
}

function Interruptor() {
  const aislador = (x: number) => (
    <g key={x}>
      <rect x={x - 3} y="18" width="6" height="44" fill={P} stroke={N} strokeWidth=".8" />
      {[22, 28, 34, 40, 46, 52, 58].map((y) => <rect key={y} x={x - 7} y={y} width="14" height="3" rx="1.5" fill={P} stroke={N} strokeWidth=".6" />)}
      <rect x={x - 5} y="12" width="10" height="6" rx="1" fill={M} />
    </g>
  );
  return (
    <g>
      <Piso />
      <path d="M30 100 V66 H130 V100 M40 100 V66 M120 100 V66" stroke={M} strokeWidth="3" fill="none" />
      <rect x="28" y="62" width="104" height="6" fill={N} />
      {[50, 80, 110].map(aislador)}
      <rect x="66" y="72" width="28" height="20" rx="2" fill={N} /><rect x="74" y="78" width="12" height="4" fill={O} />
    </g>
  );
}

function CableMT() {
  const fase = (x: number, color: string) => (
    <g key={x}>
      <path d={`M${x} 100 V58`} stroke={N} strokeWidth="9" strokeLinecap="round" />
      <rect x={x - 7} y="40" width="14" height="22" rx="3" fill={color} />
      {[44, 50, 56].map((y) => <rect key={y} x={x - 10} y={y} width="20" height="3" rx="1.5" fill={color} />)}
      <rect x={x - 3} y="26" width="6" height="14" fill={G} /><rect x={x - 6} y="22" width="12" height="5" rx="1" fill={M} />
    </g>
  );
  return (
    <g>
      <Piso />
      <rect x="20" y="18" width="120" height="5" fill={M} />
      {[[48, O], [80, M], [112, N]].map(([x, c]) => fase(x as number, c as string))}
    </g>
  );
}

function GIS() {
  return (
    <g>
      <Piso />
      <rect x="12" y="92" width="136" height="8" rx="2" fill={G} />
      {[62, 80].map((y, i) => <rect key={y} x="14" y={y} width="132" height="12" rx="6" fill={i ? M : N} />)}
      {[24, 58, 92, 126].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="30" width="18" height="34" rx="9" fill={N} />
          <rect x={x - 11} y="44" width="22" height="3" fill={G} />
          <circle cx={x} cy="30" r="9" fill={M} />
          <rect x={x - 2} y="84" width="4" height="8" fill={M} />
        </g>
      ))}
      <rect x="54" y="48" width="8" height="6" rx="1" fill={O} />
    </g>
  );
}

function Horno() {
  return (
    <g>
      <Piso />
      <rect x="24" y="34" width="112" height="66" rx="3" fill={N} />
      {[40, 52, 64, 76, 88].map((y) => <line key={y} x1="24" y1={y} x2="136" y2={y} stroke={M} strokeWidth="1" />)}
      <rect x="52" y="52" width="56" height="40" rx="2" fill="#7a2b12" />
      <rect x="56" y="56" width="48" height="34" rx="2" fill={O} />
      <path d="M64 90 Q70 70 76 84 Q82 64 88 84 Q94 72 98 90 Z" fill="#ffd27a" />
      <rect x="96" y="10" width="16" height="24" fill={M} />
      <rect x="92" y="6" width="24" height="6" rx="1" fill={N} />
    </g>
  );
}

function Rodamiento() {
  const bolas = Array.from({ length: 10 }, (_, i) => (i * 2 * Math.PI) / 10);
  return (
    <g>
      <Piso />
      <circle cx="80" cy="56" r="40" fill={N} />
      <circle cx="80" cy="56" r="31" fill={M} />
      {bolas.map((a, i) => <circle key={i} cx={80 + 25 * Math.cos(a)} cy={56 + 25 * Math.sin(a)} r="5.5" fill={i === 2 ? O : P} />)}
      <circle cx="80" cy="56" r="19" fill={N} />
      <circle cx="80" cy="56" r="12" fill="#eaf0f4" />
    </g>
  );
}

function Hidraulico() {
  return (
    <g>
      <Piso />
      <rect x="18" y="62" width="70" height="38" rx="2" fill={N} />
      <rect x="24" y="68" width="14" height="10" rx="1" fill={P} /><rect x="27" y="72" width="8" height="3" fill={O} />
      <rect x="44" y="40" width="30" height="22" rx="6" fill={M} />
      <rect x="30" y="46" width="14" height="14" rx="2" fill={N} />
      <path d="M74 52 C96 52 96 36 108 36" stroke={O} strokeWidth="3" fill="none" />
      <path d="M74 58 C104 58 100 44 112 44" stroke={M} strokeWidth="3" fill="none" />
      <rect x="104" y="30" width="44" height="18" rx="3" fill={N} />
      <rect x="148" y="36" width="10" height="6" rx="1" fill={G} />
      <rect x="116" y="48" width="4" height="52" fill={M} /><rect x="136" y="48" width="4" height="52" fill={M} />
    </g>
  );
}

function Tanque() {
  return (
    <g>
      <Piso />
      <rect x="44" y="26" width="72" height="74" fill={N} />
      <ellipse cx="80" cy="26" rx="36" ry="9" fill={M} />
      <ellipse cx="80" cy="100" rx="36" ry="4" fill={N} />
      {[46, 66, 86].map((y) => <line key={y} x1="44" y1={y} x2="116" y2={y} stroke={M} strokeWidth="1.5" />)}
      <path d="M120 100 V22 M128 100 V22" stroke={G} strokeWidth="2" />
      {[30, 40, 50, 60, 70, 80, 90].map((y) => <line key={y} x1="120" y1={y} x2="128" y2={y} stroke={G} strokeWidth="1.5" />)}
      <rect x="58" y="56" width="18" height="10" rx="1.5" fill={O} />
      <circle cx="96" cy="18" r="3" fill={O} />
    </g>
  );
}

function TorreEnfriamiento() {
  return (
    <g>
      <Piso />
      <rect x="18" y="40" width="124" height="60" rx="2" fill={N} />
      {[48, 56, 64, 72, 80, 88].map((y) => <line key={y} x1="22" y1={y} x2="138" y2={y} stroke={L} strokeWidth="2" />)}
      {[46, 80, 114].map((x) => (
        <g key={x}>
          <path d={`M${x - 14} 40 L${x - 11} 22 H${x + 11} L${x + 14} 40 Z`} fill={M} />
          <ellipse cx={x} cy="22" rx="11" ry="3" fill={N} />
          <path d={`M${x - 4} 16 Q${x} 8 ${x + 4} 16`} stroke={G} strokeWidth="1.5" fill="none" />
        </g>
      ))}
      <rect x="18" y="92" width="124" height="4" fill={O} opacity=".8" />
    </g>
  );
}

function Almacen() {
  return (
    <g>
      <Piso />
      {[20, 80].map((x) => (
        <g key={x}>
          <path d={`M${x} 100 V18 M${x + 60} 100 V18`} stroke={M} strokeWidth="3" />
          {[40, 66, 92].map((y) => <rect key={y} x={x} y={y} width="60" height="3" fill={O} />)}
          {[[x + 4, 22, 22, 18], [x + 30, 26, 24, 14], [x + 6, 48, 18, 18], [x + 28, 50, 26, 16], [x + 4, 74, 24, 18], [x + 32, 78, 22, 14]].map(([bx, by, bw, bh], i) => (
            <rect key={i} x={bx} y={by} width={bw} height={bh} rx="1" fill={i % 2 ? G : "#d8c7a8"} stroke={N} strokeWidth=".6" />
          ))}
        </g>
      ))}
    </g>
  );
}

function Impulsor() {
  const alabes = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);
  return (
    <g>
      <Piso />
      <circle cx="80" cy="56" r="40" fill={N} />
      {alabes.map((a) => (
        <path key={a} d="M80 56 C 92 44, 108 44, 118 50" stroke={L} strokeWidth="5" fill="none" strokeLinecap="round" transform={`rotate(${a} 80 56)`} />
      ))}
      <circle cx="80" cy="56" r="13" fill={M} />
      <circle cx="80" cy="56" r="6" fill={O} />
    </g>
  );
}

function Banda() {
  return (
    <g>
      <Piso />
      <path d="M22 70 H138" stroke={N} strokeWidth="12" strokeLinecap="round" />
      {[28, 50, 72, 94, 116, 132].map((x) => <circle key={x} cx={x} cy="70" r="4" fill={M} />)}
      {[34, 74, 114].map((x) => <path key={x} d={`M${x} 76 L${x - 6} 100 M${x} 76 L${x + 6} 100`} stroke={M} strokeWidth="3" />)}
      <rect x="34" y="44" width="26" height="20" rx="1.5" fill="#d8c7a8" stroke={N} strokeWidth=".8" />
      <rect x="86" y="48" width="22" height="16" rx="1.5" fill={G} stroke={N} strokeWidth=".8" />
      <circle cx="138" cy="70" r="9" fill={O} />
    </g>
  );
}

function AireComprimido() {
  return (
    <g>
      <Piso />
      <rect x="14" y="54" width="30" height="46" rx="15" fill={N} />
      <circle cx="29" cy="46" r="5" fill="#fff" stroke={N} strokeWidth="2" />
      <path d="M44 66 H144 M72 66 V100 M104 66 V100 M136 66 V88" stroke={M} strokeWidth="5" fill="none" />
      <rect x="84" y="60" width="8" height="12" rx="1.5" fill={N} />
      <circle cx="136" cy="92" r="4" fill={M} />
      <g stroke={O} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M118 58 q4 -6 0 -12" /><path d="M124 56 q5 -8 0 -16" /><path d="M130 58 q4 -6 0 -12" />
      </g>
    </g>
  );
}

function Valvula() {
  return (
    <g>
      <Piso />
      <rect x="10" y="66" width="140" height="14" fill={M} />
      <rect x="46" y="58" width="8" height="30" rx="1" fill={N} /><rect x="106" y="58" width="8" height="30" rx="1" fill={N} />
      <path d="M54 62 H106 L98 88 H62 Z" fill={N} />
      <rect x="76" y="30" width="8" height="32" fill={G} />
      <rect x="70" y="40" width="20" height="10" rx="2" fill={M} />
      <ellipse cx="80" cy="24" rx="26" ry="6" fill="none" stroke={O} strokeWidth="4" />
      <line x1="54" y1="24" x2="106" y2="24" stroke={O} strokeWidth="2.5" />
    </g>
  );
}

function Transformador({ variante = "potencia" }: { variante?: "potencia" | "generacion" | "horno" | "reactor" }) {
  const fases = variante === "reactor" ? [64, 96] : [52, 80, 108];
  return (
    <g>
      <Piso />
      <rect x="26" y="92" width="108" height="8" rx="2" fill={G} />
      <rect x="36" y="44" width="88" height="48" rx="2" fill={N} />
      {[20, 124].map((x) => <g key={x}>{[48, 54, 60, 66, 72, 78, 84].map((y) => <rect key={y} x={x} y={y} width="16" height="3" rx="1" fill={M} />)}</g>)}
      {variante === "generacion" && [70, 90].map((x) => <circle key={x} cx={x} cy="80" r="7" fill={M} stroke={L} strokeWidth="1.5" />)}
      {fases.map((x) => (
        <g key={x}>
          <rect x={x - 2.5} y="18" width="5" height="26" fill={P} stroke={N} strokeWidth=".6" />
          {[22, 27, 32, 37].map((y) => <rect key={y} x={x - 6} y={y} width="12" height="3" rx="1.5" fill={P} stroke={N} strokeWidth=".5" />)}
          <rect x={x - 3} y="14" width="6" height="4" fill={M} />
        </g>
      ))}
      {variante !== "horno" && <rect x="40" y="30" width="30" height="12" rx="6" fill={M} />}
      {variante === "horno" && [128, 136, 144].map((x) => <rect key={x} x={x} y="50" width="5" height="40" rx="1" fill="#b8683a" />)}
      {variante === "horno" && <rect x="124" y="50" width="26" height="6" fill="#b8683a" />}
      <rect x="48" y="58" width="18" height="10" rx="1.5" fill={O} />
    </g>
  );
}

function TransformadorDistribucion() {
  return (
    <g>
      <Piso />
      <rect x="30" y="92" width="100" height="8" rx="2" fill={G} />
      <path d="M36 92 V40 L46 32 H124 V92 Z" fill={N} />
      <path d="M124 32 L134 40 V92 H124 Z" fill={M} />
      <line x1="80" y1="36" x2="80" y2="90" stroke={M} strokeWidth="2" />
      <rect x="70" y="58" width="4" height="12" rx="1.5" fill={G} /><rect x="86" y="58" width="4" height="12" rx="1.5" fill={G} />
      <rect x="44" y="44" width="16" height="10" rx="1.5" fill={O} />
    </g>
  );
}

function CentroDatos() {
  return (
    <g>
      <Piso />
      {[18, 50, 82, 114].map((x, i) => (
        <g key={x}>
          <rect x={x} y="14" width="28" height="86" rx="2" fill={N} />
          {[20, 30, 40, 50, 60, 70, 80, 90].map((y) => (
            <g key={y}><rect x={x + 4} y={y} width="20" height="7" rx="1" fill={M} /><circle cx={x + 8} cy={y + 3.5} r="1.3" fill={(y + i * 10) % 30 === 0 ? O : "#7fd3a8"} /></g>
          ))}
        </g>
      ))}
    </g>
  );
}

const DIBUJOS: Record<string, () => React.ReactElement> = {
  motor: Motor,
  bomba: Bomba,
  ventilador: Ventilador,
  compresor: Compresor,
  turbina: Turbina,
  "tablero-bt": TableroBT,
  "tablero-mt": TableroMT,
  ccm: CCM,
  subestacion: Subestacion,
  interruptor: Interruptor,
  "cable-mt": CableMT,
  gis: GIS,
  horno: Horno,
  rodamiento: Rodamiento,
  hidraulico: Hidraulico,
  tanque: Tanque,
  "torre-enfriamiento": TorreEnfriamiento,
  almacen: Almacen,
  impulsor: Impulsor,
  banda: Banda,
  "aire-comprimido": AireComprimido,
  valvula: Valvula,
  transformador: () => <Transformador />,
  "transformador-generacion": () => <Transformador variante="generacion" />,
  "transformador-horno": () => <Transformador variante="horno" />,
  reactor: () => <Transformador variante="reactor" />,
  "transformador-dist": TransformadorDistribucion,
  "centro-datos": CentroDatos,
};

export const CLAVES_EQUIPO = Object.keys(DIBUJOS);

export default function IlustracionEquipo({ clave, className = "" }: Props) {
  const Dibujo = DIBUJOS[clave];
  if (!Dibujo) return null;
  return (
    <div className={`h-full w-full bg-gradient-to-b from-[#f4f7f9] to-[#dfe7ed] ${className}`}>
      <svg viewBox="0 0 160 110" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <Dibujo />
      </svg>
    </div>
  );
}
