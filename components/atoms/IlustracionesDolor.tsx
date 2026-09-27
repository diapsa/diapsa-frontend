import { GRIS, MID, NARANJA, NAVY } from "./IlustracionDga";

/**
 * IlustracionesDolor
 * Los dibujos de las cuatro tarjetas de "¿Te suena familiar?" en la página
 * general de monitoreo de condición.
 *
 * Por qué existen: antes eran fotos de banco (un técnico preocupado, un
 * hombre confundido) que no decían nada. Cada dibujo enseña el problema en
 * un vistazo: la producción que cae a cero, el cambio de pieza que se hace
 * aunque la condición era buena, el anaquel lleno de refacciones sin usar y
 * el tablero sin lecturas. Son esquemas, sin cifras de clientes.
 */

const ROJO = "#ef4444";
const VERDE = "#10b981";
const TXT = { fontFamily: "inherit", fontWeight: 700 } as const;

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
};

export default function IlustracionDolor({ clave }: { clave: string }) {
  const Dibujo = MAPA[clave];
  return Dibujo ? <Dibujo /> : null;
}
