/**
 * IlustracionesGas
 * Dibujos de la página de detección de gas: los tres rasgos que hacen de
 * este un servicio aparte (instrumentos, método y auditoría) y la evidencia
 * del registro de una fuga (imagen acústica, lectura láser, reparación y plano de
 * ubicación). Esquemas en SVG, sin datos de un cliente.
 */

const NAVY = "#002e46";
const MID = "#2b5671";
const GRIS = "#d9e2e8";
const NARANJA = "#fc9f01";

/* 01 · Instrumentos solo para gas: una cámara acústica con láser TDLAS */
export function DibujoInstrumentos() {
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="gas-mic">
          <stop offset="0%" stopColor="#ffe14d" />
          <stop offset="45%" stopColor="#ff8a1f" stopOpacity=".85" />
          <stop offset="100%" stopColor="#e5261f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="96" width="200" height="3" rx="1.5" fill={GRIS} />
      {/* Cuerpo con su pantalla y el mapa de sonido */}
      <rect x="30" y="22" width="92" height="64" rx="10" fill={NAVY} />
      <rect x="38" y="30" width="56" height="44" rx="3" fill="#3b464c" />
      <circle cx="68" cy="54" r="12" fill="url(#gas-mic)" />
      <text x="41" y="38" fontSize="6" fontWeight="700" fill="#fff" fontFamily="monospace">46 dB</text>
      {/* Arreglo de micrófonos */}
      <circle cx="108" cy="54" r="11" fill="#11222c" stroke={MID} strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i * 60 * Math.PI) / 180;
        return <circle key={i} cx={108 + 6 * Math.cos(a)} cy={54 + 6 * Math.sin(a)} r="1.4" fill={GRIS} />;
      })}
      <rect x="60" y="86" width="16" height="10" rx="2" fill={MID} />
      {/* Láser TDLAS integrado */}
      <rect x="120" y="30" width="14" height="10" rx="2" fill={NARANJA} />
      <line x1="134" y1="35" x2="196" y2="35" stroke="#dc2f27" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="76" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill={NAVY}>Cámara acústica</text>
      <text x="165" y="28" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={NAVY}>Láser TDLAS</text>
    </svg>
  );
}

/* 02 · Método LDAR: el mismo ciclo, cada trimestre */
export function DibujoMetodo() {
  const pasos = ["Inventario", "Detección", "Confirmación", "Reparación", "Reinspección"];
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="55" r="36" fill="none" stroke={GRIS} strokeWidth="6" />
      <circle cx="100" cy="55" r="36" fill="none" stroke={NARANJA} strokeWidth="2" strokeDasharray="4 5" />
      {pasos.map((p, i) => {
        const a = (-90 + 72 * i) * (Math.PI / 180);
        const x = 100 + 36 * Math.cos(a), y = 55 + 36 * Math.sin(a);
        const tx = 100 + 54 * Math.cos(a), ty = 55 + 50 * Math.sin(a);
        return (
          <g key={p}>
            <circle cx={x} cy={y} r="7" fill={NAVY} />
            <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fontWeight="800" fill={NARANJA}>{i + 1}</text>
            <text x={tx} y={ty + 3} textAnchor={Math.abs(Math.cos(a)) < 0.3 ? "middle" : Math.cos(a) > 0 ? "start" : "end"} fontSize="8" fontWeight="700" fill={NAVY}>{p}</text>
          </g>
        );
      })}
      <text x="100" y="53" textAnchor="middle" fontSize="7" fontWeight="700" fill={MID}>CADA</text>
      <text x="100" y="63" textAnchor="middle" fontSize="8" fontWeight="800" fill={NAVY}>trimestre</text>
    </svg>
  );
}

/* 03 · Hecho para la auditoría: el expediente con su sello */
export function DibujoAuditoria() {
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
      <rect x="44" y="14" width="78" height="92" rx="4" fill="#fff" stroke={GRIS} strokeWidth="2" transform="rotate(-5 83 60)" />
      <rect x="58" y="8" width="78" height="92" rx="4" fill="#fff" stroke={NAVY} strokeWidth="2" />
      <rect x="58" y="8" width="78" height="16" rx="4" fill={NAVY} />
      <text x="97" y="19" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#fff">EXPEDIENTE</text>
      {[34, 48, 62, 76].map((y, i) => (
        <g key={y}>
          <circle cx="70" cy={y} r="4.5" fill={i < 3 ? "#059669" : GRIS} />
          {i < 3 && <path d={`M67.8 ${y} l1.6 1.6 3-3.2`} stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />}
          <rect x="80" y={y - 2.5} width={i === 1 ? 34 : 44} height="5" rx="2.5" fill={GRIS} />
        </g>
      ))}
      <g transform="rotate(-12 150 78)">
        <circle cx="150" cy="78" r="22" fill="#fff" stroke={NARANJA} strokeWidth="3" />
        <circle cx="150" cy="78" r="17" fill="none" stroke={NARANJA} strokeWidth="1" strokeDasharray="2 2" />
        <text x="150" y="76" textAnchor="middle" fontSize="8" fontWeight="800" fill={NAVY}>LISTO</text>
        <text x="150" y="86" textAnchor="middle" fontSize="7" fontWeight="700" fill={NAVY}>ASEA</text>
      </g>
    </svg>
  );
}

/* Evidencia: imagen de la cámara acústica con el punto de la fuga en la brida */
export function EvidenciaAcustica() {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="90" fill="#3b464c" />
      <rect x="0" y="52" width="120" height="12" fill="#6d7a82" />
      <rect x="46" y="46" width="7" height="24" rx="1.5" fill="#56636a" />
      <rect x="67" y="46" width="7" height="24" rx="1.5" fill="#56636a" />
      <rect x="53" y="49" width="14" height="18" fill="#7a878e" />
      <defs>
        <radialGradient id="gas-ev-sonido">
          <stop offset="0%" stopColor="#ffe14d" />
          <stop offset="40%" stopColor="#ff8a1f" stopOpacity=".9" />
          <stop offset="100%" stopColor="#e5261f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="72" cy="46" r="14" fill="url(#gas-ev-sonido)" />
      <text x="113" y="12" textAnchor="end" fontSize="7" fontWeight="700" fill="#fff" fontFamily="monospace">46 dB</text>
      <rect x="64" y="38" width="16" height="16" fill="none" stroke={NARANJA} strokeWidth="1.5" />
      <circle cx="9" cy="9" r="3" fill="#ef4444" />
      <text x="15" y="12" fontSize="8" fontWeight="700" fill="#fff" fontFamily="monospace">REC</text>
      <text x="7" y="84" fontSize="7" fill="#ffffffb0" fontFamily="monospace">0.72 l/min</text>
      <text x="113" y="84" textAnchor="end" fontSize="7" fill="#ffffffb0" fontFamily="monospace">00:14</text>
    </svg>
  );
}

/* Evidencia: pantalla del láser con la lectura de metano */
export function EvidenciaLaser() {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="90" fill="#e9edf0" />
      <rect x="22" y="10" width="76" height="70" rx="8" fill={NAVY} />
      <rect x="30" y="18" width="60" height="40" rx="3" fill="#0f2a38" />
      <text x="60" y="30" textAnchor="middle" fontSize="7" fontWeight="700" fill={NARANJA} fontFamily="monospace">CH₄</text>
      <text x="60" y="44" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="monospace">1,250</text>
      <text x="60" y="53" textAnchor="middle" fontSize="6" fill="#ffffffb0" fontFamily="monospace">ppm·m</text>
      <rect x="32" y="64" width="56" height="5" rx="2.5" fill="#ffffff26" />
      <rect x="32" y="64" width="44" height="5" rx="2.5" fill="#ef4444" />
    </svg>
  );
}

/* Evidencia: la brida con junta nueva y la palomita de reinspección */
export function EvidenciaReparacion() {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="90" fill="#e9edf0" />
      <rect x="0" y="44" width="120" height="14" fill="#8b979f" />
      <rect x="44" y="36" width="9" height="30" rx="2" fill={MID} />
      <rect x="62" y="36" width="9" height="30" rx="2" fill={MID} />
      <rect x="53" y="36" width="9" height="30" fill={NARANJA} />
      <path d="M18 24 l16 10 -3 5 -16 -10z" fill={NAVY} />
      <circle cx="16" cy="22" r="6" fill="none" stroke={NAVY} strokeWidth="3" />
      <circle cx="96" cy="22" r="11" fill="#059669" />
      <path d="M90.5 22 l4 4 7-8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="60" y="80" textAnchor="middle" fontSize="7" fontWeight="700" fill={NAVY}>Junta nueva</text>
    </svg>
  );
}

/* Plano de la instalación con el punto de la fuga */
export function PlanoUbicacion() {
  return (
    <svg viewBox="0 0 160 70" className="h-full w-full" aria-hidden="true">
      <rect width="160" height="70" rx="4" fill="#f3f6f8" />
      <path d="M10 50 H150 M40 50 V14 H120 V50 M80 14 V50" stroke={GRIS} strokeWidth="5" fill="none" />
      <rect x="18" y="38" width="16" height="22" rx="2" fill={MID} />
      <rect x="124" y="30" width="22" height="30" rx="3" fill={MID} />
      <circle cx="80" cy="14" r="5" fill="#ef4444" />
      <circle cx="80" cy="14" r="10" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity=".5" />
      <text x="92" y="10" fontSize="7" fontWeight="700" fill={NAVY}>Brida de succión</text>
      <text x="135" y="67" textAnchor="middle" fontSize="6" fill={MID}>Compresor</text>
    </svg>
  );
}
