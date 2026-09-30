/**
 * IdapIlustraciones
 * Las ilustraciones animadas de los bloques de
 * /servicios/idap. Reemplazan las infografías que no le gustaron a Emiliano
 * (2026-09-28). Cada una cuenta su beneficio en un bucle corto, en SVG
 * (escala a cualquier ancho) con la paleta de IDAP. Datos de ejemplo: sin
 * nombres de clientes ni de plantas. Con prefers-reduced-motion se ve el
 * estado final quieto. Las de "Anticipa", "Prioriza" y "Técnicas" se reemplazaron por
 * videos de Remotion (public/videos/idap/).
 */

const VERDE = "#22c55e";
const AMARILLO = "#facc15";
const NARANJA = "#fc9f01";
const ROJO = "#ef4444";
const TEXTO = "#e6edf8";
const TENUE = "#8ea3c7";
const TARJETA = "#0f1f40";
const FUENTE = "inherit";

/* Animaciones compartidas: todas en bucle de 8 s */
const CSS = `
.ii text { font-family: ${FUENTE}; }
@keyframes ii-trazo { 0% { stroke-dashoffset: var(--l) } 55%, 100% { stroke-dashoffset: 0 } }
@keyframes ii-toast { 0%, 58% { opacity: 0; transform: translateY(-14px) } 64%, 94% { opacity: 1; transform: none } 100% { opacity: 0 } }
@keyframes ii-estado-b { 0%, 30% { opacity: 1 } 34%, 100% { opacity: 0 } }
@keyframes ii-estado-o { 0%, 30% { opacity: 0 } 34%, 52% { opacity: 1 } 56%, 100% { opacity: 0 } }
@keyframes ii-estado-p { 0%, 52% { opacity: 0 } 56%, 96% { opacity: 1 } 100% { opacity: 0 } }
@keyframes ii-pulso { 0%, 100% { opacity: .35 } 50% { opacity: 1 } }
@keyframes ii-sube { 0% { transform: scaleY(var(--d)) } 60%, 100% { transform: scaleY(1) } }
@keyframes ii-entra { 0% { opacity: 0; transform: translateX(-16px) } 100% { opacity: 1; transform: none } }
.ii-trazo { stroke-dasharray: var(--l); animation: ii-trazo 8s ease-in-out infinite }
.ii-toast { animation: ii-toast 8s ease-out infinite }
.ii-b { animation: ii-estado-b 8s linear infinite }
.ii-o { animation: ii-estado-o 8s linear infinite }
.ii-p { animation: ii-estado-p 8s linear infinite }
.ii-pulso { animation: ii-pulso 1.6s ease-in-out infinite }
.ii-sube { transform-box: fill-box; transform-origin: bottom; animation: ii-sube 8s cubic-bezier(.2,.8,.2,1) infinite }
.ii-entra { animation: ii-entra .6s ease-out both }
.ii-sec { animation: ii-sec 8s ease-out infinite backwards; animation-delay: var(--a, 0s) }
@keyframes ii-sec { 0% { opacity: 0 } 8%, 86% { opacity: 1 } 96%, 100% { opacity: 0 } }
@media (prefers-reduced-motion: reduce) {
  .ii-trazo, .ii-toast, .ii-pulso, .ii-sube, .ii-entra, .ii-sec { animation: none !important; opacity: 1 !important; stroke-dashoffset: 0 !important; transform: none !important }
  .ii-b, .ii-o { animation: none !important; opacity: 0 !important }
  .ii-p { animation: none !important; opacity: 1 !important }
}
`;

function Marco({ children, titulo }: { children: React.ReactNode; titulo: string }) {
  return (
    <svg viewBox="0 0 640 400" className="ii h-full w-full" role="img" aria-label={titulo}>
      <style>{CSS}</style>
      <rect width="640" height="400" fill="#0a142e" />
      {children}
    </svg>
  );
}

/* 4. Respalda: el historial mejora y se exporta */
export function IlustracionRespalda() {
  const meses = ["Abr", "May", "Jun", "Jul", "Ago", "Sep"];
  // proporción de equipos por estado, mes a mes (ejemplo)
  const datos = [
    [0.52, 0.22, 0.14, 0.12],
    [0.58, 0.2, 0.12, 0.1],
    [0.64, 0.19, 0.1, 0.07],
    [0.7, 0.17, 0.08, 0.05],
    [0.76, 0.14, 0.06, 0.04],
    [0.82, 0.11, 0.05, 0.02],
  ];
  const colores = [VERDE, AMARILLO, NARANJA, ROJO];
  return (
    <Marco titulo="Histórico de seis meses con cada vez más equipos en buen estado, y botones para exportar a PDF, Excel y ERP">
      <rect x="24" y="20" width="400" height="360" rx="14" fill={TARJETA} />
      <text x="44" y="56" fill={TEXTO} fontSize="18" fontWeight="700">Equipos por estado</text>
      <text x="44" y="78" fill={TENUE} fontSize="13">Últimos seis meses</text>
      {datos.map((d, i) => {
        const x = 60 + i * 58;
        let y = 340;
        return (
          <g key={meses[i]} className="ii-sube" style={{ ["--d" as string]: 0.15 + i * 0.1, animationDelay: `${i * 0.12}s` }}>
            {d.map((v, j) => {
              const h = v * 230;
              y -= h;
              return <rect key={j} x={x} y={y} width="36" height={h} fill={colores[j]} rx={j === 3 ? 4 : 0} opacity={0.9} />;
            })}
            <text x={x + 18} y="362" textAnchor="middle" fill={TENUE} fontSize="11">{meses[i]}</text>
          </g>
        );
      })}
      {/* Exportar */}
      <text x="452" y="56" fill={TEXTO} fontSize="16" fontWeight="700">Llévalo a gerencia</text>
      {[
        { t: "Informe PDF", c: ROJO },
        { t: "Datos en Excel", c: VERDE },
        { t: "Tu ERP o CMMS", c: "#38bdf8" },
      ].map((b, i) => (
        <g key={b.t} className="ii-sec" style={{ ["--a" as string]: `${(30 + i * 10) * 0.08}s` }}>
          <rect x="452" y={84 + i * 74} width="164" height="56" rx="12" fill={TARJETA} stroke={b.c} strokeWidth="1.5" />
          <rect x="468" y={100 + i * 74} width="24" height="24" rx="5" fill={b.c} />
          <path d={`M476 ${107 + i * 74}v10m-4-4l4 4 4-4`} stroke="#0a142e" strokeWidth="2" fill="none" strokeLinecap="round" />
          <text x="502" y={117 + i * 74} fill={TEXTO} fontSize="13" fontWeight="700">{b.t}</text>
        </g>
      ))}
      <g className="ii-sec" style={{ ["--a" as string]: "3.6s" }}>
        <rect x="452" y="312" width="164" height="48" rx="24" fill={`${VERDE}22`} stroke={VERDE} />
        <text x="534" y="341" textAnchor="middle" fill={VERDE} fontSize="12" fontWeight="800">Más equipos en buen estado</text>
      </g>
    </Marco>
  );
}
