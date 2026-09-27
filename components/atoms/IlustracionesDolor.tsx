import { GRIS, MID, NARANJA, NAVY } from "./IlustracionDga";

/**
 * IlustracionesDolor
 * Los dibujos de las cuatro tarjetas de "¿Te suena familiar?" en la página
 * general de monitoreo de condición.
 *
 * Por qué este dolor y no otro: a la mayoría de las plantas no les falta
 * convencerse del predictivo, les falta capacidad para hacerlo. Medir y
 * analizar equipo por equipo consume horas, la plantilla no alcanza para
 * tantos activos, gestionarlos rebasa al equipo y los sistemas que ya
 * pagaron (SAP, SCADA, el CMMS) juntan datos que nadie convierte en
 * decisiones. Cada dibujo enseña uno de esos cuatro en un vistazo. Son
 * esquemas, sin cifras de clientes.
 */

const ROJO = "#ef4444";
const VERDE = "#10b981";
const TXT = { fontFamily: "inherit", fontWeight: 700 } as const;

/* La ruta del turno: pocos equipos medidos, el resto pendiente, y el reloj
   que ya se acabó. */
function Tiempo() {
  const equipos = Array.from({ length: 12 }, (_, i) => i);
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Ruta de inspección con pocos equipos medidos y el tiempo del turno agotado">
      <text x="14" y="18" fontSize="10" fill={MID} style={TXT}>RUTA DE HOY</text>
      <path d="M26 40 H206 V76 H26 V108 H206" fill="none" stroke={GRIS} strokeWidth="3" strokeDasharray="6 5" />
      {equipos.map((i) => {
        const fila = Math.floor(i / 4);
        const col = fila === 1 ? 3 - (i % 4) : i % 4;
        const x = 26 + col * 60;
        const y = [40, 76, 108][fila];
        const hecho = i < 3;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="10" fill={hecho ? VERDE : "#fff"} stroke={hecho ? VERDE : MID} strokeWidth="2" />
            {hecho && <path d={`M${x - 4} ${y} l3 3 l5 -6`} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />}
          </g>
        );
      })}
      <g transform="translate(266 62)">
        <circle r="34" fill="#fff" stroke={NAVY} strokeWidth="3" />
        <path d="M0 0 L0 -34 A34 34 0 1 1 -32 -11 Z" fill={ROJO} opacity="0.18" />
        <line x1="0" y1="0" x2="0" y2="-22" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="0" x2="-19" y2="-7" stroke={ROJO} strokeWidth="3" strokeLinecap="round" />
        <circle r="3.5" fill={NAVY} />
        <text y="52" fontSize="9.5" fill={ROJO} textAnchor="middle" style={TXT}>SE ACABÓ EL TURNO</text>
      </g>
      <text x="116" y="132" fontSize="10" fill={MID} textAnchor="middle" style={TXT}>3 medidos, 9 pendientes y nada analizado</text>
    </svg>
  );
}

/* Muchos equipos contra dos personas. */
function Personal() {
  const puntos = Array.from({ length: 60 }, (_, i) => i);
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Cientos de equipos para dos técnicos">
      <text x="14" y="18" fontSize="10" fill={MID} style={TXT}>EQUIPOS DE LA PLANTA</text>
      {puntos.map((i) => {
        const x = 20 + (i % 12) * 17;
        const y = 34 + Math.floor(i / 12) * 19;
        const critico = i % 7 === 3;
        return <rect key={i} x={x} y={y} width="12" height="12" rx="2" fill={critico ? NARANJA : MID} opacity={critico ? 0.9 : 0.35} />;
      })}
      <line x1="228" y1="30" x2="228" y2="126" stroke={GRIS} strokeWidth="2" />
      <text x="276" y="18" fontSize="10" fill={MID} textAnchor="middle" style={TXT}>TU EQUIPO</text>
      {[256, 296].map((x) => (
        <g key={x} fill={NAVY}>
          <circle cx={x} cy="58" r="11" />
          <path d={`M${x - 17} 102 a17 22 0 0 1 34 0 Z`} />
          <rect x={x - 12} y="44" width="24" height="7" rx="3" fill={NARANJA} />
        </g>
      ))}
      <text x="276" y="124" fontSize="11" fill={ROJO} textAnchor="middle" style={TXT}>No alcanza</text>
    </svg>
  );
}

/* La pila de pendientes que ya pasó la línea de lo que el equipo puede
   atender, y sigue creciendo. */
function Gestion() {
  const tareas = ["Órdenes de trabajo", "Rutas por programar", "Historiales", "Prioridades", "Informes", "Refacciones"];
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Pila de pendientes de gestión de activos que rebasa la capacidad del equipo">
      <text x="14" y="18" fontSize="10" fill={MID} style={TXT}>PENDIENTES DE MANTENIMIENTO</text>
      {tareas.map((t, i) => (
        <g key={t} transform={`translate(${20 + (i % 2) * 6} ${114 - i * 16}) rotate(${i % 2 ? -2 : 1.5})`}>
          <rect width="170" height="14" rx="2" fill="#fff" stroke={i > 3 ? ROJO : MID} strokeWidth="1.5" />
          <text x="8" y="10.5" fontSize="9" fill={NAVY} style={TXT}>{t}</text>
        </g>
      ))}
      <line x1="14" y1="62" x2="206" y2="62" stroke={ROJO} strokeWidth="2" strokeDasharray="5 4" />
      <text x="206" y="58" fontSize="9" fill={ROJO} textAnchor="end" style={TXT}>CAPACIDAD</text>
      <g transform="translate(264 76)" className="motion-safe:animate-pulse">
        <circle r="30" fill={ROJO} opacity="0.12" />
        <text y="-2" fontSize="22" fill={ROJO} textAnchor="middle" style={TXT}>+</text>
        <text y="16" fontSize="9" fill={ROJO} textAnchor="middle" style={TXT}>CADA DÍA</text>
      </g>
    </svg>
  );
}

/* Varios sistemas llenos de datos, ninguno conectado a una decisión. */
function Sistemas() {
  const sis = [
    { n: "SAP", x: 14, y: 28 },
    { n: "SCADA", x: 112, y: 28 },
    { n: "CMMS", x: 14, y: 78 },
    { n: "Excel", x: 112, y: 78 },
  ];
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Sistemas SAP, SCADA, CMMS y hojas de cálculo con datos que nadie usa para decidir">
      <text x="14" y="18" fontSize="10" fill={MID} style={TXT}>LO QUE YA TIENES</text>
      {sis.map((s) => (
        <g key={s.n} transform={`translate(${s.x} ${s.y})`}>
          <rect width="88" height="42" rx="4" fill="#fff" stroke={GRIS} strokeWidth="2" />
          <rect width="88" height="11" rx="4" fill={MID} opacity="0.5" />
          <text x="8" y="30" fontSize="11" fill={NAVY} style={TXT}>{s.n}</text>
          <circle cx="82" cy="4" r="8" fill={NARANJA} />
          <text x="82" y="7.5" fontSize="8.5" fill="#fff" textAnchor="middle" style={TXT}>99</text>
        </g>
      ))}
      <path d="M208 70 H240" stroke={GRIS} strokeWidth="3" strokeDasharray="4 4" />
      <g transform="translate(276 70)">
        <circle r="30" fill="#fff" stroke={GRIS} strokeWidth="2" strokeDasharray="5 4" />
        <text y="-2" fontSize="20" fill={MID} textAnchor="middle" style={TXT}>?</text>
        <text y="14" fontSize="8.5" fill={MID} textAnchor="middle" style={TXT}>DECISIÓN</text>
      </g>
      <text x="160" y="134" fontSize="10" fill={ROJO} textAnchor="middle" style={TXT}>Muchos datos y nadie los vuelve acciones</text>
    </svg>
  );
}

const MAPA: Record<string, () => React.ReactElement> = {
  tiempo: Tiempo,
  personal: Personal,
  gestion: Gestion,
  sistemas: Sistemas,
};

export default function IlustracionDolor({ clave }: { clave: string }) {
  const Dibujo = MAPA[clave];
  return Dibujo ? <Dibujo /> : null;
}
