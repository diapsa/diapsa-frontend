/**
 * AnimacionIdap
 * El dibujo animado de la franja de resultados: plantas a los lados, IDAP
 * al centro y hallazgos que viajan por las líneas hacia la plataforma,
 * donde cada uno enciende su semáforo y suma al total.
 *
 * Por qué así: Emiliano pidió algo con movimiento para los hallazgos
 * (2026-09-27). Es un esquema, sin datos de ningún cliente: las etiquetas
 * son tipos de hallazgo, no eventos reales. Todo es SVG con animaciones
 * CSS (offset-path para los puntos que viajan), sin Three.js: pesa poco y
 * se detiene si el visitante pidió reducir el movimiento.
 */

const NARANJA = "#fc9f01";
const VERDE = "#10b981";
const AMARILLO = "#f5c542";
const ROJO = "#ef4444";

// Plantas a la izquierda y a la derecha, y la ruta de cada una hasta IDAP (500, 110).
const PLANTAS = [
  { x: 60, y: 40 }, { x: 60, y: 110 }, { x: 60, y: 180 },
  { x: 940, y: 40 }, { x: 940, y: 110 }, { x: 940, y: 180 },
];
const ruta = (x: number, y: number) => {
  const dx = x < 500 ? 1 : -1;
  return `M${x + dx * 34} ${y} C ${x + dx * 200} ${y}, ${500 - dx * 200} 110, ${500 - dx * 70} 110`;
};
const COLORES = [ROJO, AMARILLO, VERDE, AMARILLO, VERDE, ROJO];
const TIPOS = ["Rodamiento dañado", "Punto caliente", "Desalineación", "Fuga de aire", "Desbalanceo", "Descarga parcial"];

export default function AnimacionIdap() {
  return (
    <div className="relative w-full" aria-hidden="true">
      <style>{`
        .idap-punto { offset-rotate: 0deg; animation: idap-viaje 3.6s cubic-bezier(.45,0,.55,1) infinite; opacity: 0; }
        @keyframes idap-viaje { 0% { offset-distance: 0%; opacity: 0 } 8% { opacity: 1 } 85% { opacity: 1 } 100% { offset-distance: 100%; opacity: 0 } }
        .idap-anillo { transform-origin: 500px 110px; animation: idap-latido 3.6s ease-out infinite; }
        @keyframes idap-latido { 0% { transform: scale(.8); opacity: .6 } 100% { transform: scale(1.9); opacity: 0 } }
        .idap-linea { stroke-dasharray: 4 7; animation: idap-flujo 1.2s linear infinite; }
        @keyframes idap-flujo { to { stroke-dashoffset: -22 } }
        .idap-tipo { animation: idap-tipo 10.8s ease-in-out infinite; opacity: 0; }
        @keyframes idap-tipo { 0%, 2% { opacity: 0; transform: translateY(6px) } 6%, 28% { opacity: 1; transform: translateY(0) } 33%, 100% { opacity: 0 } }
        .idap-planta { animation: idap-planta 3.6s ease-in-out infinite; }
        @keyframes idap-planta { 0%, 100% { opacity: .55 } 10% { opacity: 1 } 30% { opacity: .55 } }
        @media (prefers-reduced-motion: reduce) {
          .idap-punto, .idap-anillo, .idap-linea, .idap-planta { animation: none; }
          .idap-punto { opacity: 0; }
          .idap-tipo { animation: none; opacity: 0; }
          .idap-tipo:first-of-type { opacity: 1; }
        }
      `}</style>
      <svg viewBox="0 0 1000 220" className="h-auto w-full">
        {/* Rutas */}
        {PLANTAS.map((p, i) => (
          <path key={`r${i}`} d={ruta(p.x, p.y)} fill="none" stroke="#ffffff" strokeOpacity=".22" strokeWidth="2" className="idap-linea" />
        ))}

        {/* Plantas: una nave con techo de dos aguas */}
        {PLANTAS.map((p, i) => (
          <g key={`p${i}`} transform={`translate(${p.x} ${p.y})`} className="idap-planta" style={{ animationDelay: `${i * 0.6}s` }}>
            <path d="M-30 14 V-6 L-18 -16 L-6 -6 L6 -16 L18 -6 L30 -16 V14 Z" fill="#ffffff" fillOpacity=".1" stroke="#ffffff" strokeOpacity=".5" strokeWidth="1.5" />
            <rect x="-22" y="0" width="8" height="8" fill={NARANJA} opacity=".8" />
            <rect x="-4" y="0" width="8" height="8" fill="#ffffff" opacity=".5" />
            <rect x="14" y="0" width="8" height="8" fill="#ffffff" opacity=".5" />
          </g>
        ))}

        {/* Hallazgos que viajan hacia IDAP */}
        {PLANTAS.map((p, i) => (
          <circle
            key={`d${i}`}
            r="6"
            fill={COLORES[i]}
            className="idap-punto"
            style={{ offsetPath: `path("${ruta(p.x, p.y)}")`, animationDelay: `${i * 0.6}s` } as React.CSSProperties}
          />
        ))}

        {/* IDAP al centro */}
        <circle cx="500" cy="110" r="46" fill="none" stroke={NARANJA} strokeWidth="2" className="idap-anillo" />
        <circle cx="500" cy="110" r="46" fill="#0f1f40" stroke={NARANJA} strokeWidth="2.5" />
        <image href="/images/idap/idap-bco.png" x="466" y="95" width="68" height="20" preserveAspectRatio="xMidYMid meet" />
        <text x="500" y="130" textAnchor="middle" fontSize="8" fontWeight="700" fill={NARANJA} style={{ fontFamily: "inherit", letterSpacing: "0.12em" }}>HISTORIAL</text>

        {/* Tipo de hallazgo que acaba de llegar */}
        {TIPOS.map((t, i) => (
          <g key={t} className="idap-tipo" style={{ animationDelay: `${i * 1.8}s` }}>
            <rect x="420" y="170" width="160" height="28" rx="14" fill="#ffffff" />
            <circle cx="438" cy="184" r="5" fill={COLORES[i]} />
            <text x="450" y="188.5" fontSize="12" fontWeight="700" fill="#002e46" style={{ fontFamily: "inherit" }}>{t}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
