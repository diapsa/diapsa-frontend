import { GRIS, MID, NARANJA, NAVY } from "./IlustracionDga";

/**
 * IlustracionesDolor
 * Los dibujos de las cuatro tarjetas de "¿Te suena familiar?" en la página
 * general de monitoreo de condición.
 *
 * Hay dos juegos porque hay dos visitantes. La planta que no tiene nada de
 * predictivo sufre el paro sin aviso, el mantenimiento por calendario, el
 * almacén lleno y las decisiones a ciegas (paro, calendario, almacen,
 * datos). La que ya lo tiene no necesita convencerse: le falta capacidad.
 * Medir y analizar consume horas, la plantilla no alcanza, gestionar tantos
 * activos la rebasa y los sistemas que ya pagó (SAP, SCADA, el CMMS) juntan
 * datos que nadie vuelve decisiones (tiempo, personal, gestion, sistemas).
 * Son esquemas, sin cifras de clientes.
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

/* La producción va estable y de pronto cae a cero. */
function Paro() {
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Gráfica de producción que cae a cero por un paro no programado">
      <line x1="30" y1="112" x2="300" y2="112" stroke={GRIS} strokeWidth="2" />
      <line x1="30" y1="20" x2="30" y2="112" stroke={GRIS} strokeWidth="2" />
      <text x="34" y="16" fontSize="10" fill={MID} style={TXT}>PRODUCCIÓN</text>
      <rect x="182" y="24" width="118" height="88" fill={ROJO} opacity="0.08" />
      <path d="M30 44 L60 40 L90 45 L120 41 L150 44 L178 42 L182 112 L300 112" fill="none" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <path d="M180 30 L172 50 L182 50 L174 70" fill="none" stroke={NARANJA} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g className="motion-safe:animate-pulse">
        <rect x="200" y="60" width="84" height="24" rx="3" fill={ROJO} />
        <text x="242" y="76" fontSize="11" fill="#fff" textAnchor="middle" style={TXT}>LÍNEA PARADA</text>
      </g>
      <text x="100" y="130" fontSize="10" fill={MID} textAnchor="middle" style={TXT}>Todo normal</text>
      <text x="242" y="130" fontSize="10" fill={ROJO} textAnchor="middle" style={TXT}>Sin producir</text>
    </svg>
  );
}

/* Cada mes se cambia la pieza, aunque su condición seguía buena. */
function Calendario() {
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"];
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Calendario con cambios de pieza cada mes mientras la condición del equipo seguía buena">
      {meses.map((m, i) => {
        const x = 14 + i * 50;
        const cambio = i % 2 === 0;
        return (
          <g key={m}>
            <rect x={x} y="10" width="42" height="52" rx="4" fill="#fff" stroke={GRIS} strokeWidth="2" />
            <rect x={x} y="10" width="42" height="14" rx="4" fill={NAVY} />
            <text x={x + 21} y="21" fontSize="9" fill="#fff" textAnchor="middle" style={TXT}>{m}</text>
            {cambio && (
              <path
                transform={`translate(${x + 11} 30)`}
                d="M17 3.5a5.5 5.5 0 0 0-7.1 6.9L3 17.3 4.7 19l6.9-6.9A5.5 5.5 0 0 0 18.5 5l-3.2 3.2-2.4-.6-.6-2.4Z"
                fill={NARANJA}
              />
            )}
            <rect x={x + 3} y="80" width="36" height="12" rx="6" fill={VERDE} opacity={0.85} />
          </g>
        );
      })}
      <text x="14" y="75" fontSize="10" fill={MID} style={TXT}>CONDICIÓN REAL DEL EQUIPO</text>
      <text x="160" y="112" fontSize="11" fill={NAVY} textAnchor="middle" style={TXT}>Se cambió por calendario…</text>
      <text x="160" y="128" fontSize="11" fill={VERDE} textAnchor="middle" style={TXT}>…y la pieza todavía servía</text>
    </svg>
  );
}

/* El anaquel lleno de cajas sin abrir. */
function Almacen() {
  const filas = [22, 58, 94];
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Anaquel lleno de refacciones sin usar">
      <rect x="20" y="12" width="190" height="118" fill="none" stroke={MID} strokeWidth="3" />
      {filas.map((y, f) => (
        <g key={y}>
          <line x1="20" y1={y + 34} x2="210" y2={y + 34} stroke={MID} strokeWidth="3" />
          {[0, 1, 2, 3, 4].map((c) => {
            const w = 28 + ((c + f) % 3) * 4;
            const x = 28 + c * 36;
            const h = 22 + ((c * 2 + f) % 3) * 4;
            return (
              <g key={c}>
                <rect x={x} y={y + 34 - h} width={w} height={h} fill="#e8d7b9" stroke="#b89a6a" strokeWidth="1.5" />
                <line x1={x + w / 2} y1={y + 34 - h} x2={x + w / 2} y2={y + 34} stroke="#b89a6a" strokeWidth="1.5" />
              </g>
            );
          })}
        </g>
      ))}
      <g transform="translate(228 34)">
        <rect width="84" height="74" rx="4" fill="#fff" stroke={GRIS} strokeWidth="2" />
        <circle cx="42" cy="26" r="15" fill={NARANJA} />
        <text x="42" y="32" fontSize="17" fill="#fff" textAnchor="middle" style={TXT}>$</text>
        <text x="42" y="56" fontSize="9.5" fill={NAVY} textAnchor="middle" style={TXT}>DINERO</text>
        <text x="42" y="67" fontSize="9.5" fill={NAVY} textAnchor="middle" style={TXT}>DETENIDO</text>
      </g>
    </svg>
  );
}

/* Un tablero de equipos donde ninguna lectura existe. */
function SinDatos() {
  const equipos = ["Motor", "Bomba", "Ventilador", "Compresor"];
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Tablero de equipos sin lecturas de condición">
      <rect x="10" y="8" width="300" height="124" rx="6" fill={NAVY} />
      <text x="24" y="28" fontSize="10" fill="#fff" opacity="0.7" style={TXT}>ESTADO DE LOS EQUIPOS</text>
      {equipos.map((e, i) => {
        const x = 24 + (i % 2) * 142;
        const y = 38 + Math.floor(i / 2) * 44;
        return (
          <g key={e}>
            <rect x={x} y={y} width="130" height="36" rx="4" fill="#fff" opacity="0.08" />
            <text x={x + 10} y={y + 22} fontSize="11" fill="#fff" style={TXT}>{e}</text>
            <g className={i === 1 ? "motion-safe:animate-pulse" : ""}>
              <circle cx={x + 112} cy={y + 18} r="11" fill={NARANJA} opacity={i === 1 ? 1 : 0.35} />
              <text x={x + 112} y={y + 23} fontSize="14" fill={NAVY} textAnchor="middle" style={TXT}>?</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

const MAPA: Record<string, () => React.ReactElement> = {
  paro: Paro,
  calendario: Calendario,
  almacen: Almacen,
  datos: SinDatos,
  tiempo: Tiempo,
  personal: Personal,
  gestion: Gestion,
  sistemas: Sistemas,
};

export default function IlustracionDolor({ clave }: { clave: string }) {
  const Dibujo = MAPA[clave];
  return Dibujo ? <Dibujo /> : null;
}
