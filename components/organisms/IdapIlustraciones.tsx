/**
 * IdapIlustraciones
 * Las ilustraciones animadas de los bloques de
 * /servicios/idap. Reemplazan las infografías que no le gustaron a Emiliano
 * (2026-09-28). Cada una cuenta su beneficio en un bucle corto, en SVG
 * (escala a cualquier ancho) con la paleta de IDAP. Datos de ejemplo: sin
 * nombres de clientes ni de plantas. Con prefers-reduced-motion se ve el
 * estado final quieto. La de "Anticipa" se reemplazó por un video de
 * Remotion (public/videos/idap/idap-anticipa.mp4).
 */

const ORO = "#ffc34d";
const VERDE = "#22c55e";
const AMARILLO = "#facc15";
const NARANJA = "#fc9f01";
const ROJO = "#ef4444";
const TEXTO = "#e6edf8";
const TENUE = "#8ea3c7";
const TARJETA = "#0f1f40";
const LINEA = "rgba(255,255,255,0.08)";
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

/* 2. Prioriza: la IA ordena los equipos por criticidad y estado */
export function IlustracionPrioriza() {
  const filas = [
    { eq: "Compresor de aire 2", crit: "Alta", cc: ROJO, est: "Precaución", ec: NARANJA },
    { eq: "Bomba de condensado", crit: "Alta", cc: ROJO, est: "Observación", ec: AMARILLO },
    { eq: "Ventilador de torre 1", crit: "Media", cc: AMARILLO, est: "Alarma", ec: ROJO },
    { eq: "Motor banda 4", crit: "Baja", cc: VERDE, est: "Observación", ec: AMARILLO },
  ];
  return (
    <Marco titulo="Lista de equipos ordenada por la IA según criticidad y estado, con el primero resaltado">
      <rect x="24" y="20" width="592" height="360" rx="14" fill={TARJETA} />
      <text x="44" y="56" fill={TEXTO} fontSize="18" fontWeight="700">Orden de atención sugerido</text>
      <g transform="translate(470 38)">
        <rect width="126" height="28" rx="14" fill={`${ORO}22`} stroke={ORO} />
        <text x="63" y="19" textAnchor="middle" fill={ORO} fontSize="12" fontWeight="800">Sugerido por IA</text>
      </g>
      <text x="96" y="92" fill={TENUE} fontSize="11" fontWeight="700">EQUIPO</text>
      <text x="360" y="92" fill={TENUE} fontSize="11" fontWeight="700">CRITICIDAD</text>
      <text x="480" y="92" fill={TENUE} fontSize="11" fontWeight="700">ESTADO</text>
      {filas.map((f, i) => {
        const y = 106 + i * 66;
        return (
          <g key={f.eq} className="ii-sec" style={{ ["--a" as string]: `${(8 + i * 10) * 0.08}s` }}>
            <rect x="40" y={y} width="560" height="56" rx="10" fill={i === 0 ? "#162a55" : "#0c1834"} stroke={i === 0 ? ORO : LINEA} strokeWidth={i === 0 ? 2 : 1} className={i === 0 ? "ii-pulso" : undefined} />
            <circle cx="68" cy={y + 28} r="14" fill={i === 0 ? ORO : "rgba(255,255,255,0.08)"} />
            <text x="68" y={y + 33} textAnchor="middle" fill={i === 0 ? "#0a142e" : TEXTO} fontSize="13" fontWeight="800">{i + 1}</text>
            <text x="96" y={y + 33} fill={TEXTO} fontSize="15" fontWeight="700">{f.eq}</text>
            <rect x="360" y={y + 15} width="80" height="26" rx="13" fill={`${f.cc}22`} stroke={f.cc} />
            <text x="400" y={y + 32} textAnchor="middle" fill={f.cc} fontSize="12" fontWeight="700">{f.crit}</text>
            <rect x="480" y={y + 15} width="100" height="26" rx="13" fill={`${f.ec}22`} stroke={f.ec} />
            <text x="530" y={y + 32} textAnchor="middle" fill={f.ec} fontSize="12" fontWeight="700">{f.est}</text>
          </g>
        );
      })}
    </Marco>
  );
}

/* 3. Todas las técnicas: seis nodos que se conectan al equipo y dan un diagnóstico */
export function IlustracionTecnicas() {
  const nodos = [
    { t: "Termografía", v: "68 °C", c: ROJO, x: 110, y: 90 },
    { t: "Vibraciones", v: "6.8 mm/s", c: "#a78bfa", x: 320, y: 60 },
    { t: "Ultrasonido", v: "32 dBµV", c: "#38bdf8", x: 530, y: 90 },
    { t: "Aceite", v: "Normal", c: AMARILLO, x: 110, y: 300 },
    { t: "Eléctrico", v: "Balanceado", c: NARANJA, x: 320, y: 336 },
    { t: "Sensor en línea", v: "En vivo", c: VERDE, x: 530, y: 300 },
  ];
  return (
    <Marco titulo="Seis técnicas se conectan a un equipo y juntas dan un solo diagnóstico">
      {nodos.map((n, i) => (
        <line
          key={`l${n.t}`}
          x1={n.x}
          y1={n.y}
          x2="320"
          y2="200"
          stroke={n.c}
          strokeWidth="2"
          strokeDasharray="4 6"
          className="ii-sec"
          style={{ ["--a" as string]: `${(4 + i * 7) * 0.08}s` }}
        />
      ))}
      {nodos.map((n, i) => (
        <g key={n.t} className="ii-sec" style={{ ["--a" as string]: `${(4 + i * 7) * 0.08}s` }}>
          <rect x={n.x - 72} y={n.y - 26} width="144" height="52" rx="12" fill={TARJETA} stroke={n.c} strokeWidth="1.5" />
          <circle cx={n.x - 54} cy={n.y} r="6" fill={n.c} />
          <text x={n.x - 40} y={n.y - 4} fill={TEXTO} fontSize="13" fontWeight="700">{n.t}</text>
          <text x={n.x - 40} y={n.y + 14} fill={n.c} fontSize="12" fontWeight="700">{n.v}</text>
        </g>
      ))}
      {/* El equipo al centro */}
      <circle cx="320" cy="200" r="56" fill="#162a55" stroke={ORO} strokeWidth="2" className="ii-pulso" />
      <text x="320" y="194" textAnchor="middle" fill={TEXTO} fontSize="15" fontWeight="800">Motor 4</text>
      <text x="320" y="214" textAnchor="middle" fill={TENUE} fontSize="11">Ficha del equipo</text>
      {/* Diagnóstico combinado */}
      <g className="ii-sec" style={{ ["--a" as string]: "3.2s" }}>
        <rect x="196" y="270" width="248" height="32" rx="16" fill={ORO} />
        <text x="320" y="291" textAnchor="middle" fill="#0a142e" fontSize="13" fontWeight="800">Diagnóstico: desalineación</text>
      </g>
    </Marco>
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
