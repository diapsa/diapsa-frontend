import { GRIS, MID, Marco, NARANJA, NAVY, Trafo } from "./IlustracionDga";

/**
 * IlustracionesServicio
 * Ilustraciones de las pestañas "¿Qué nos hace diferentes?" de cámaras
 * térmicas (cam-), sensores de huella acústica (hue-), análisis de aceite
 * (ace-), sensores de vibración (sen-) y tierras físicas (tie-), en lugar de
 * fotos.
 *
 * Por qué existen: esas pestañas repetían fotos de la galería de la misma
 * página (aceite y acústicos) o fotos de termografía con cámara de mano que
 * no enseñan una cámara fija. Cada pestaña afirma algo concreto (dónde va
 * el sensor, qué distingue una tarde de calor de una conexión floja, por
 * qué importa la serie de muestras) y un esquema lo enseña mejor que una
 * foto de planta.
 *
 * Mismo criterio que IlustracionDga: dibujo en SVG, rótulos en HTML que
 * conservan su tamaño en teléfono, ninguna cifra de cliente, y cada una se
 * declara esquema en su pie.
 */

type Props = { clave: string };

const Tarjeta = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex min-h-0 flex-col rounded-sm bg-white p-2.5 shadow-sm ring-1 ring-black/5 lg:p-4 ${className}`}>{children}</div>
);
const Rotulo = ({ children, color = "text-secondary" }: { children: React.ReactNode; color?: string }) => (
  <p className={`text-[9px] font-bold uppercase tracking-wider lg:text-xs ${color}`}>{children}</p>
);
const Texto = ({ children, fuerte = false }: { children: React.ReactNode; fuerte?: boolean }) => (
  <p className={`text-[10px] leading-snug text-primary lg:text-sm ${fuerte ? "font-bold" : ""}`}>{children}</p>
);
const Sello = ({ bien }: { bien: boolean }) => (
  <span
    className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white lg:h-5 lg:w-5 lg:text-[11px] ${bien ? "bg-emerald-500" : "bg-red-500"}`}
    aria-hidden="true"
  >
    {bien ? "✓" : "✕"}
  </span>
);

/* La alerta: revisada por DIAPSA, directo a tu sistema, o las dos. */
function Aviso({ origen, equipo, detalle, firma, fila }: { origen: string; equipo: string; detalle: string; firma: string; fila: string[] }) {
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 lg:gap-4">
      <div className="mx-auto w-full max-w-[11rem] rounded-[1.4rem] p-1.5 shadow-lg" style={{ background: NAVY }}>
        <div className="rounded-[1.1rem] bg-[#f3f6f8] p-2 pt-4 lg:p-3 lg:pt-6">
          <div className="rounded-lg bg-white p-2 shadow-sm lg:p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-tertiary lg:text-[11px]">{origen}</p>
            <p className="mt-1 text-[11px] font-extrabold leading-tight text-primary lg:text-sm">{equipo}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-primary lg:text-xs">{detalle}</p>
            <p className="mt-1.5 text-[9px] font-bold leading-tight lg:text-[11px]" style={{ color: MID }}>✓ {firma}</p>
          </div>
        </div>
      </div>
      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-primary shadow-sm ring-1 ring-black/5 lg:text-xs">o</span>
      <div className="w-full rounded-sm bg-white p-2 shadow-sm ring-1 ring-black/5 lg:p-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-tertiary lg:text-[11px]">Tu sistema de control</p>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {fila.map((t, i) => (
            <span key={t} className="rounded-[3px] py-1 text-center text-[9px] font-bold lg:text-[11px]" style={{ background: i === 1 ? NARANJA : "#eef1f4", color: NAVY }}>
              {t}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-tight text-primary lg:text-xs">Alarma por Modbus o contacto de relé</p>
      </div>
    </div>
  );
}

/* Una fila de equipos, solo los críticos con el sistema continuo. */
function Flota({ equipos, marca, resto }: { equipos: { nombre: string; critico: boolean; icono?: React.ReactNode }[]; marca: string; resto: string }) {
  return (
    <div className="flex h-full flex-col justify-center gap-4 lg:gap-6">
      <div className="grid grid-cols-6 items-end gap-2 lg:gap-4">
        {equipos.map((e, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            {e.icono ?? <Trafo critico={e.critico} />}
            <span className={`text-center text-[9px] font-bold leading-tight lg:text-xs ${e.critico ? "text-primary" : "text-tertiary/60"}`}>{e.nombre}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px] leading-snug lg:gap-4 lg:text-sm">
        <p className="flex items-center gap-2 rounded-sm bg-white p-2 font-bold text-primary shadow-sm ring-1 ring-black/5 lg:p-3">
          <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: NARANJA }} />
          {marca}
        </p>
        <p className="flex items-center gap-2 rounded-sm bg-white p-2 text-tertiary shadow-sm ring-1 ring-black/5 lg:p-3">
          <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: GRIS }} />
          {resto}
        </p>
      </div>
    </div>
  );
}

/* Ícono genérico de equipo con cámara encima si es crítico. */
function Equipo({ critico, forma }: { critico: boolean; forma: "tablero" | "rack" | "horno" | "motor" | "bomba" | "luz" }) {
  const c = critico ? NAVY : GRIS, d = critico ? MID : "#c3ced6";
  return (
    <svg viewBox="0 0 40 44" className="w-full" aria-hidden="true">
      {forma === "tablero" && (<><rect x="8" y="8" width="24" height="33" rx="1.5" fill={c} />{[14, 20, 26].map((y) => <rect key={y} x="12" y={y} width="16" height="3" rx="1" fill={d} />)}</>)}
      {forma === "rack" && (<><rect x="10" y="6" width="20" height="35" rx="1.5" fill={c} />{[10, 15, 20, 25, 30, 35].map((y) => <rect key={y} x="13" y={y} width="14" height="2.5" rx=".8" fill={d} />)}</>)}
      {forma === "horno" && (<><rect x="5" y="14" width="30" height="27" rx="2" fill={c} /><rect x="12" y="24" width="16" height="11" rx="1.5" fill={critico ? "#f6a24b" : "#c3ced6"} /><rect x="16" y="6" width="6" height="9" fill={c} /></>)}
      {forma === "motor" && (<><rect x="6" y="20" width="22" height="16" rx="3" fill={c} /><rect x="28" y="26" width="8" height="4" rx="1" fill={d} /><rect x="4" y="36" width="26" height="4" rx="1" fill={d} /></>)}
      {forma === "bomba" && (<><circle cx="20" cy="28" r="10" fill={c} /><rect x="28" y="25" width="9" height="6" fill={d} /><rect x="8" y="38" width="24" height="3" rx="1" fill={d} /></>)}
      {forma === "luz" && (<><rect x="8" y="16" width="24" height="24" rx="1.5" fill={c} /><circle cx="20" cy="28" r="5" fill={d} /></>)}
      {critico && (<><rect x="26" y="1" width="12" height="7" rx="1.5" fill={NARANJA} stroke="#fff" strokeWidth="1" /><path d="M26 6 16 16" stroke={NARANJA} strokeWidth="1" strokeDasharray="2 1.5" /></>)}
    </svg>
  );
}

/* ============================== CÁMARAS TÉRMICAS ============================== */

function PanelApunte({ bien }: { bien: boolean }) {
  return (
  <Tarjeta>
    <div className="flex items-center gap-1.5"><Sello bien={bien} /><Rotulo color={bien ? "text-emerald-700" : "text-red-600"}>{bien ? "Bien apuntada" : "Mal apuntada"}</Rotulo></div>
    <div className="relative mt-2 min-h-0 flex-1">
      <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect x="52" y="8" width="42" height="56" rx="2" fill={NAVY} />
        {[20, 34, 48].map((y) => <circle key={y} cx="73" cy={y} r="4" fill={y === 34 ? NARANJA : "#6aa0c2"} />)}
        <rect x="6" y={bien ? 30 : 12} width="12" height="9" rx="2" fill={NARANJA} />
        {bien
          ? <polygon points="18,34 70,12 70,56" fill={NARANJA} opacity=".18" />
          : <polygon points="18,16 52,2 52,26" fill="#dc2f27" opacity=".15" />}
      </svg>
    </div>
    <Texto fuerte>{bien ? "Ve las tres conexiones" : "Mide la puerta, no el punto"}</Texto>
  </Tarjeta>
  );
}

function CamTermografos() {
  return (
    <Marco titulo="Dónde va la cámara lo decide un termógrafo" pie="Esquema: el ángulo decide qué se mide">
      <div className="grid h-full grid-cols-2 gap-3 lg:gap-5"><PanelApunte bien /><PanelApunte bien={false} /></div>
    </Marco>
  );
}

function PanelIaCam({ titulo, falla }: { titulo: string; falla: boolean }) {
  return (
  <Tarjeta>
    <span className={`self-start rounded-full px-2 py-0.5 text-[9px] font-bold ring-1 lg:text-xs ${falla ? "bg-amber-50 text-amber-800 ring-amber-600/30" : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"}`}>{titulo}</span>
    <div className="relative mt-2 min-h-0 flex-1">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M2 70 C 30 70, 40 40, 60 40 S 90 70, 98 70" fill="none" stroke={GRIS} strokeWidth="6" vectorEffect="non-scaling-stroke" />
        <path d={falla ? "M2 62 C 30 62, 40 34, 60 30 S 90 22, 98 8" : "M2 62 C 30 62, 40 32, 60 32 S 90 62, 98 62"} fill="none" stroke={falla ? NARANJA : MID} strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d="M2 66 C 30 66, 40 36, 60 36 S 90 66, 98 66" fill="none" stroke={MID} strokeWidth="1.5" strokeDasharray="4 3" opacity=".6" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
    <Texto fuerte>{falla ? "Solo la fase B sigue subiendo: conexión floja" : "Todas suben con la tarde y bajan con la noche: normal"}</Texto>
  </Tarjeta>
  );
}

function CamIa() {
  return (
    <Marco titulo="La IA distingue una tarde de calor de una falla" pie="Esquema: temperatura de un tablero en un día; en gris, el ambiente">
      <div className="grid h-full grid-cols-2 gap-3 lg:gap-5"><PanelIaCam titulo="Tarde de calor" falla={false} /><PanelIaCam titulo="Conexión floja" falla /></div>
    </Marco>
  );
}

function CamAlcance() {
  return (
    <Marco titulo="La cámara va donde es indispensable" pie="Esquema: una planta con seis equipos">
      <Flota
        marca="Cámara fija, las 24 horas"
        resto="Ruta con cámara de mano"
        equipos={[
          { nombre: "Tablero principal", critico: true, icono: <Equipo forma="tablero" critico /> },
          { nombre: "Centro de datos", critico: true, icono: <Equipo forma="rack" critico /> },
          { nombre: "Horno", critico: true, icono: <Equipo forma="horno" critico /> },
          { nombre: "Motor auxiliar", critico: false, icono: <Equipo forma="motor" critico={false} /> },
          { nombre: "Bomba de respaldo", critico: false, icono: <Equipo forma="bomba" critico={false} /> },
          { nombre: "Alumbrado", critico: false, icono: <Equipo forma="luz" critico={false} /> },
        ]}
      />
    </Marco>
  );
}

function CamMonitoreo() {
  return (
    <Marco titulo="La alerta llega como tú prefieras" pie="Revisada por un termógrafo, directo a tu sistema, o las dos">
      <Aviso origen="DIAPSA" equipo="Tablero principal" detalle="Fase B a 91 °C" firma="Revisada por termógrafo" fila={["T1", "T2", "Rack", "Horno", "T3", "T4"]} />
    </Marco>
  );
}

function CamCamara() {
  const casos = [
    { lugar: "Tablero interior", cam: "Resolución media, lente estándar", cono: 0.5 },
    { lugar: "Horno o secador", cam: "Rango alto de temperatura y carcasa con enfriamiento", cono: 0.35 },
    { lugar: "Patio o almacén", cam: "Lente gran angular y carcasa para intemperie", cono: 0.85 },
  ];
  return (
    <Marco titulo="La cámara que pide cada punto" pie="Esquema: el lugar define resolución, lente y protección">
      <div className="grid h-full grid-cols-3 gap-2 lg:gap-4">
        {casos.map((c) => (
          <Tarjeta key={c.lugar}>
            <Rotulo>{c.lugar}</Rotulo>
            <div className="relative mt-2 min-h-0 flex-1">
              <svg viewBox="0 0 60 60" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <polygon points={`14,30 58,${30 - 26 * c.cono} 58,${30 + 26 * c.cono}`} fill={NARANJA} opacity=".18" />
                <rect x="2" y="24" width="14" height="12" rx="2.5" fill={NAVY} />
                <circle cx="16" cy="30" r="3" fill={NARANJA} />
              </svg>
            </div>
            <Texto>{c.cam}</Texto>
          </Tarjeta>
        ))}
      </div>
    </Marco>
  );
}

/* ============================== HUELLA ACÚSTICA ============================== */

function HueEspecialistas() {
  return (
    <Marco titulo="El punto del tanque lo elige un especialista" pie="Esquema: donde se escucha el interior del transformador">
      <div className="grid h-full grid-cols-[1.2fr_1fr] items-center gap-3 lg:gap-6">
        <div className="relative h-full">
          <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {[28, 50, 72].map((x) => <rect key={x} x={x - 3} y="4" width="6" height="12" rx="2" fill="#eef1f4" stroke={NAVY} strokeWidth=".8" />)}
            <rect x="14" y="16" width="72" height="50" rx="3" fill={NAVY} />
            {[20, 26, 32, 38].map((x) => <rect key={x} x={x + 60} y="22" width="3" height="38" rx="1" fill={MID} />)}
            <rect x="30" y="26" width="30" height="30" rx="2" fill={MID} opacity=".6" />
            <circle cx="46" cy="41" r="10" fill="none" stroke={NARANJA} strokeWidth="1" opacity=".6" />
            <rect x="8" y="36" width="7" height="10" rx="1.5" fill={NARANJA} stroke="#fff" strokeWidth="1" />
            <rect x="92" y="32" width="7" height="10" rx="1.5" fill="#dc2f27" stroke="#fff" strokeWidth="1" />
            <rect x="0" y="66" width="100" height="6" rx="1" fill="#c6d1d9" />
          </svg>
        </div>
        <div className="space-y-2 lg:space-y-3">
          <p className="flex items-start gap-2 text-[10px] leading-snug text-primary lg:text-sm"><Sello bien /> En la pared del tanque, frente a núcleo y devanados</p>
          <p className="flex items-start gap-2 text-[10px] leading-snug text-primary lg:text-sm"><Sello bien={false} /> Sobre los radiadores: escucha el ventilador, no el interior</p>
        </div>
      </div>
    </Marco>
  );
}

const BARRAS_HUELLA = [30, 42, 55, 48, 38, 30, 34, 40, 36, 28, 24, 22, 20, 18, 16, 14];

function PanelHuella({ titulo, picos, falla, texto }: { titulo: string; picos: number[]; falla: boolean; texto: string }) {
  return (
  <Tarjeta>
    <span className={`self-start rounded-full px-2 py-0.5 text-[9px] font-bold ring-1 lg:text-xs ${falla ? "bg-amber-50 text-amber-800 ring-amber-600/30" : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"}`}>{titulo}</span>
    <div className="relative mt-2 flex min-h-0 flex-1 items-end gap-[2px]">
      <div className="absolute inset-x-0 bottom-0 rounded-t-sm bg-primary/10" style={{ height: "62%" }} />
      {BARRAS_HUELLA.map((v, i) => {
        const pico = picos.includes(i);
        return <span key={i} className="relative flex-1 rounded-t-[2px]" style={{ height: `${pico ? 92 : v}%`, background: pico ? (falla ? NARANJA : "#9fb3c2") : MID, opacity: pico || falla ? 1 : 0.7 }} />;
      })}
    </div>
    <Texto fuerte>{texto}</Texto>
  </Tarjeta>
  );
}

function HueIa() {
  return (
    <Marco titulo="La IA separa el ruido de la falla" pie="Esquema: espectro del transformador sobre su huella aprendida">
      <div className="grid h-full grid-cols-2 gap-3 lg:gap-5">
        <PanelHuella titulo="Ruido de planta" picos={[1]} falla={false} texto="Un camión que pasa: no es patrón de falla, se ignora" />
        <PanelHuella titulo="Descarga parcial" picos={[10, 11, 13, 14]} falla texto="Picos con el patrón de una descarga: alerta" />
      </div>
    </Marco>
  );
}

function HueSinAbrir() {
  return (
    <Marco titulo="Escucha el interior sin abrir el equipo" pie="Esquema: corte del tanque con el sensor por fuera">
      <div className="grid h-full grid-cols-[1.2fr_1fr] items-center gap-3 lg:gap-6">
        <div className="relative h-full">
          <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="10" y="8" width="62" height="64" rx="3" fill="#eef4f8" stroke={NAVY} strokeWidth="3" />
            <rect x="24" y="20" width="12" height="40" rx="2" fill={MID} />
            <rect x="46" y="20" width="12" height="40" rx="2" fill={MID} />
            <rect x="20" y="16" width="42" height="6" rx="1" fill={NAVY} />
            <rect x="20" y="58" width="42" height="6" rx="1" fill={NAVY} />
            {[10, 17, 24].map((r) => <path key={r} d={`M${60 + r * 0.3} ${40 - r} A ${r} ${r} 0 0 1 ${60 + r * 0.3} ${40 + r}`} fill="none" stroke={NARANJA} strokeWidth="1.4" opacity={1 - r / 34} />)}
            <rect x="73" y="33" width="4" height="14" fill={MID} />
            <rect x="77" y="31" width="12" height="18" rx="2" fill={NARANJA} />
          </svg>
        </div>
        <ul className="space-y-2 text-[10px] leading-snug text-primary lg:space-y-3 lg:text-sm">
          <li><span className="font-bold">Por fuera del tanque:</span> no se abre ni se interviene el equipo.</li>
          <li><span className="font-bold">Montaje</span> magnético, adhesivo o con tornillo.</li>
          <li><span className="font-bold">Escucha</span> el núcleo, los devanados y las conexiones internas.</li>
        </ul>
      </div>
    </Marco>
  );
}

function HueCriticos() {
  return (
    <Marco titulo="El sensor va donde es indispensable" pie="Esquema: una planta con seis transformadores">
      <Flota
        marca="Sensor de huella acústica"
        resto="Pruebas periódicas en el paro"
        equipos={[false, true, false, true, false, false].map((c) => ({ nombre: c ? "Crítico" : "Normal", critico: c, icono: <Trafo critico={c} /> }))}
      />
    </Marco>
  );
}

function HueMonitoreo() {
  return (
    <Marco titulo="La alerta llega como tú prefieras" pie="Revisada por un especialista, directo a tu sistema, o las dos">
      <Aviso origen="DIAPSA" equipo="Transformador principal" detalle="Descarga parcial, fase C" firma="Revisada por especialista" fila={["T1", "T2", "T3", "GIS", "R1", "C1"]} />
    </Marco>
  );
}

/* ============================== ANÁLISIS DE ACEITE ============================== */

function AceAnalistas() {
  const filas = [["Hierro", "48 ppm"], ["Silicio", "22 ppm"], ["Agua", "0.08 %"], ["Viscosidad", "225 cSt"]];
  return (
    <Marco titulo="Un número no es un diagnóstico" pie="Esquema: el mismo resultado, antes y después del analista">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-stretch gap-2 lg:gap-4">
        <Tarjeta>
          <Rotulo color="text-tertiary">Lo que da el laboratorio</Rotulo>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[10px] text-primary lg:text-sm">
            {filas.map(([k, v]) => (<div key={k} className="contents"><dt className="text-tertiary">{k}</dt><dd className="text-right font-bold tabular-nums">{v}</dd></div>))}
          </dl>
          <p className="mt-auto pt-2 text-[10px] text-tertiary lg:text-xs">¿Y ahora qué?</p>
        </Tarjeta>
        <div className="flex items-center">
          <svg viewBox="0 0 40 16" className="w-7 lg:w-10" aria-hidden="true"><path d="M2 8h32m-7-6 7 6-7 6" fill="none" stroke={NARANJA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <Tarjeta className="ring-secondary/40">
          <Rotulo>Lo que escribe el analista</Rotulo>
          <Texto fuerte>Desgaste de engranes por polvo.</Texto>
          <ol className="mt-1.5 space-y-1 text-[10px] leading-snug text-primary lg:text-sm">
            <li>1. Cambiar el respiradero.</li>
            <li>2. Filtrar el aceite.</li>
            <li>3. Nueva muestra en 30 días.</li>
          </ol>
        </Tarjeta>
      </div>
    </Marco>
  );
}

function AceMuestra() {
  const puntos = [
    { y: 22, bien: false, t: "Parte alta: aceite quieto" },
    { y: 58, bien: true, t: "Zona de flujo, con el equipo operando" },
    { y: 86, bien: false, t: "Fondo del cárter: sedimento" },
  ];
  return (
    <Marco titulo="Una muestra bien tomada, siempre del mismo punto" pie="Esquema: corte de un reductor y sus posibles puntos de muestreo">
      <div className="grid h-full grid-cols-[1fr_1.2fr] items-center gap-3 lg:gap-6">
        <div className="relative h-full">
          <svg viewBox="0 0 80 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="8" y="10" width="56" height="84" rx="4" fill="#eef4f8" stroke={NAVY} strokeWidth="3" />
            <rect x="10" y="48" width="52" height="44" rx="2" fill="#e8a126" opacity=".55" />
            <circle cx="30" cy="42" r="14" fill="none" stroke={MID} strokeWidth="4" strokeDasharray="4 3" />
            <circle cx="48" cy="62" r="10" fill="none" stroke={MID} strokeWidth="4" strokeDasharray="4 3" />
            {[84, 87, 89].map((y, i) => <circle key={y} cx={20 + i * 12} cy={y} r="1.6" fill="#7a5a2a" />)}
            {puntos.map((p) => <g key={p.y}><rect x="64" y={p.y - 3} width="10" height="6" rx="1.5" fill={p.bien ? NARANJA : "#c3ced6"} /></g>)}
          </svg>
        </div>
        <ul className="space-y-2 lg:space-y-3">
          {puntos.map((p) => (
            <li key={p.y} className="flex items-start gap-2 text-[10px] leading-snug text-primary lg:text-sm"><Sello bien={p.bien} />{p.t}</li>
          ))}
        </ul>
      </div>
    </Marco>
  );
}

function AceLaboratorio() {
  const pruebas = [
    ["Espectrometría", "Metales de desgaste y contaminantes"],
    ["Viscosidad", "Si el aceite sigue siendo el correcto"],
    ["Agua", "Humedad que corroe y degrada"],
    ["Oxidación", "Cuánta vida le queda al aceite"],
    ["Partículas", "Limpieza del aceite, por tamaño"],
  ];
  return (
    <Marco titulo="Cinco pruebas en laboratorio acreditado" pie="Esquema: qué contesta cada una">
      <div className="grid h-full grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
        {pruebas.map(([p, d], i) => (
          <Tarjeta key={p} className={i === 4 ? "col-span-2 lg:col-span-1" : ""}>
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-extrabold text-secondary lg:h-5 lg:w-5 lg:text-[11px]">{i + 1}</span>
              <Texto fuerte>{p}</Texto>
            </div>
            <p className="mt-1 text-[10px] leading-snug text-tertiary lg:text-xs">{d}</p>
          </Tarjeta>
        ))}
      </div>
    </Marco>
  );
}

function AceTendencia() {
  const serie = [18, 20, 19, 24, 31, 40];
  const limite = 50, tope = 60;
  return (
    <Marco titulo="La serie avisa antes que el límite" pie="Esquema: hierro en seis muestras del mismo equipo">
      <div className="grid h-full grid-cols-[1.4fr_1fr] items-stretch gap-3 lg:gap-6">
        <div className="relative flex items-end gap-2 border-b border-primary/30 pt-4 lg:gap-3">
          <div className="absolute inset-x-0 border-t-2 border-dashed border-red-400" style={{ bottom: `${(limite / tope) * 100}%` }}>
            <span className="absolute -top-4 right-0 text-[9px] font-bold text-red-600 lg:text-xs">Límite</span>
          </div>
          {serie.map((v, i) => (
            <span key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / tope) * 100}%`, background: i >= 3 ? NARANJA : MID, opacity: i >= 3 ? 1 : 0.55 }} />
          ))}
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Texto fuerte>La última muestra sigue bajo el límite.</Texto>
          <Texto>Pero tres seguidas suben: la serie ya dice que algo se desgasta, y hay tiempo de actuar.</Texto>
        </div>
      </div>
    </Marco>
  );
}

function AceTransformadores() {
  const gases = ["H₂", "CH₄", "C₂H₂", "C₂H₄", "C₂H₆", "CO", "CO₂"];
  return (
    <Marco titulo="En transformadores, el aceite también avisa" pie="Esquema: gases disueltos que deja cada falla interna">
      <div className="grid h-full grid-cols-[1fr_1.3fr] items-center gap-3 lg:gap-6">
        <div className="relative h-full">
          <svg viewBox="0 0 60 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="24" y="4" width="12" height="6" rx="1" fill={NAVY} />
            <rect x="28" y="10" width="4" height="10" fill={NAVY} />
            <rect x="16" y="20" width="28" height="56" rx="3" fill="#fff" stroke={NAVY} strokeWidth="2" />
            <rect x="18" y="44" width="24" height="30" rx="2" fill="#e8a126" opacity=".8" />
            {[[24, 52], [34, 60], [28, 66], [36, 50]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={NARANJA} stroke="#fff" strokeWidth=".6" />)}
            <rect x="28" y="76" width="4" height="10" fill={NAVY} />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {gases.map((g) => <span key={g} className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-primary ring-1 ring-black/10 lg:text-xs">{g}</span>)}
          </div>
          <Texto>Muestra con jeringa, con el transformador en servicio.</Texto>
          <Texto fuerte>Revela arco, descargas, sobrecalentamiento y humedad.</Texto>
        </div>
      </div>
    </Marco>
  );
}

/* ============================== SENSORES DE VIBRACIÓN ============================== */

function SenEspecialistas() {
  return (
    <Marco titulo="El punto de cada sensor lo elige un Categoría III" pie="Esquema: dónde se ve bien la falla de un rodamiento">
      <div className="grid h-full grid-cols-[1.2fr_1fr] items-center gap-3 lg:gap-6">
        <div className="relative h-full">
          <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="6" y="58" width="88" height="6" rx="1" fill="#c6d1d9" />
            <rect x="14" y="22" width="44" height="30" rx="5" fill={NAVY} />
            {[20, 27, 34, 41, 48].map((x) => <rect key={x} x={x} y="25" width="2.5" height="24" rx="1" fill={MID} />)}
            <rect x="4" y="26" width="10" height="22" rx="2" fill="#c3ced6" />
            <rect x="58" y="30" width="12" height="16" rx="2" fill={MID} />
            <rect x="70" y="35" width="22" height="6" rx="2" fill={MID} />
            <rect x="60" y="20" width="9" height="9" rx="1.5" fill={NARANJA} stroke="#fff" strokeWidth="1" />
            <rect x="1" y="16" width="9" height="9" rx="1.5" fill="#dc2f27" stroke="#fff" strokeWidth="1" />
            <rect x="14" y="52" width="44" height="6" rx="1" fill={MID} />
          </svg>
        </div>
        <div className="space-y-2 lg:space-y-3">
          <p className="flex items-start gap-2 text-[10px] leading-snug text-primary lg:text-sm"><Sello bien /> Sobre el alojamiento del rodamiento, en la zona de carga</p>
          <p className="flex items-start gap-2 text-[10px] leading-snug text-primary lg:text-sm"><Sello bien={false} /> En la tapa del ventilador: mide lámina, no el rodamiento</p>
        </div>
      </div>
    </Marco>
  );
}

const fallaSen = (x: number) => (x < 62 ? 20 : 20 + (x - 62) * 1.6);
const LINEA_SENSOR = Array.from({ length: 50 }, (_, i) => {
  const x = 2 + i * 1.96;
  return `${i ? "L" : "M"}${x.toFixed(1)} ${(100 - fallaSen(x) - (i % 3) * 2).toFixed(1)}`;
}).join(" ");

function SenContinuo() {
  return (
    <Marco titulo="La falla que nace entre dos rutas, el sensor la ve" pie="Esquema: el mismo rodamiento durante un mes">
      <div className="grid h-full grid-rows-2 gap-2 lg:gap-3">
        {[{ t: "Ruta mensual", sensor: false }, { t: "Sensor, cada 10 minutos", sensor: true }].map((f) => (
          <Tarjeta key={f.t}>
            <Rotulo color={f.sensor ? "text-secondary" : "text-tertiary"}>{f.t}</Rotulo>
            <div className="relative mt-1 min-h-0 flex-1">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {f.sensor
                  ? <path d={LINEA_SENSOR} fill="none" stroke={NARANJA} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                  : [4, 96].map((x) => <circle key={x} cx={x} cy={x === 4 ? 80 : 100 - fallaSen(x)} r="4" fill={MID} />)}
              </svg>
            </div>
            <Texto fuerte={f.sensor}>{f.sensor ? "Se ve el día en que empieza a subir" : "Dos lecturas: se entera cuando ya subió"}</Texto>
          </Tarjeta>
        ))}
      </div>
    </Marco>
  );
}

function SenEstandar() {
  const puntos = [
    { n: "Punto 1", normal: 22, actual: 34, avisa: false },
    { n: "Punto 2", normal: 62, actual: 66, avisa: true },
  ];
  return (
    <Marco titulo="Cada punto tiene su propio normal" pie="Esquema: la misma alarma para todos se equivoca en los dos">
      <div className="grid h-full grid-cols-2 gap-3 lg:gap-5">
        {puntos.map((p) => (
          <Tarjeta key={p.n}>
            <Rotulo>{p.n}</Rotulo>
            <div className="relative mt-5 min-h-0 flex-1">
              <div className="absolute inset-x-0 rounded-sm bg-primary/10" style={{ bottom: `${p.normal - 10}%`, height: "20%" }} />
              <div className="absolute inset-x-0 border-t-2 border-dashed border-red-400" style={{ bottom: "50%" }}>
                <span className="absolute -top-4 right-0 text-[9px] font-bold text-red-600 lg:text-xs">Alarma genérica</span>
              </div>
              <span className="absolute left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-white" style={{ bottom: `${p.actual}%`, background: p.avisa ? MID : NARANJA }} />
            </div>
            <Texto fuerte>{p.avisa ? "Está en su normal: la genérica da falsa alarma" : "Ya salió de su normal: la genérica no avisa"}</Texto>
          </Tarjeta>
        ))}
      </div>
    </Marco>
  );
}

const ESPECTRO_SEN = [8, 10, 9, 12, 44, 11, 9, 30, 10, 8, 22, 9, 8, 7];

function SenAlertas() {
  return (
    <Marco titulo="Antes de avisarte, el especialista lee el espectro" pie="Esquema: de un cambio de tendencia a un diagnóstico">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-stretch gap-2 lg:gap-4">
        <Tarjeta>
          <Rotulo color="text-tertiary">Espectro del punto</Rotulo>
          <div className="mt-2 flex min-h-0 flex-1 items-end gap-[2px]">
            {ESPECTRO_SEN.map((v, i) => {
              const pico = i === 4 || i === 7 || i === 10;
              return <span key={i} className="flex-1 rounded-t-[2px]" style={{ height: `${(v / 46) * 100}%`, background: pico ? NARANJA : MID, opacity: pico ? 1 : 0.5 }} />;
            })}
          </div>
          <p className="mt-2 text-[10px] text-tertiary lg:text-xs">Picos en la frecuencia de la pista externa</p>
        </Tarjeta>
        <div className="flex items-center">
          <svg viewBox="0 0 40 16" className="w-7 lg:w-10" aria-hidden="true"><path d="M2 8h32m-7-6 7 6-7 6" fill="none" stroke={NARANJA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <Tarjeta>
          <Rotulo>Lo que te llega</Rotulo>
          <Texto fuerte>Rodamiento lado acoplamiento</Texto>
          <span className="mt-1.5 self-start rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-800 ring-1 ring-amber-600/30 lg:text-xs">Precaución</span>
          <p className="mt-1.5 text-[10px] leading-snug text-primary lg:text-sm">Daño inicial en la pista externa. Programar el cambio en la siguiente ventana.</p>
        </Tarjeta>
      </div>
    </Marco>
  );
}

const PUNTOS_PRUEBA = [[80, 52], [64, 40], [70, 46], [58, 72], [75, 44], [60, 38]];

function SenPrueba() {
  return (
    <Marco titulo="Después de reparar, el sensor dice si sirvió" pie="Esquema: cada punto antes y después, con la máquina operando igual">
      <div className="flex h-full flex-col gap-2 lg:gap-3">
        <div className="flex min-h-0 flex-1 items-end gap-2 border-b border-primary/30 lg:gap-4">
          {PUNTOS_PRUEBA.map(([a, d], i) => (
            <div key={i} className="flex h-full flex-1 items-end gap-[2px]">
              <span className="flex-1 rounded-t-[2px] bg-primary/40" style={{ height: `${a}%` }} />
              <span className="flex-1 rounded-t-[2px]" style={{ height: `${d}%`, background: d > a ? "#dc2f27" : "#10b981" }} />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-tertiary lg:text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/40" />Antes</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />Después, bajó</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-red-600" />Después, subió</span>
        </div>
        <Texto fuerte>Cinco puntos mejoraron y uno empeoró: la siguiente acción ya sabe a dónde ir.</Texto>
      </div>
    </Marco>
  );
}

/* ============================== TIERRAS FÍSICAS ============================== */

const CURVA_CAIDA = "M4 90 C 18 50, 30 42, 44 40 S 70 38, 78 37 C 86 34, 92 20, 97 6";

function TieMetodo() {
  return (
    <Marco titulo="Medido por caída de potencial, no a ojo" pie="Esquema: electrodo bajo prueba, electrodos auxiliares y la lectura estable">
      <div className="grid h-full grid-rows-[1fr_1.1fr] gap-2 lg:gap-3">
        <div className="relative">
          <svg viewBox="0 0 200 60" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="0" y="30" width="200" height="30" fill="#e7ddcb" />
            <line x1="0" y1="30" x2="200" y2="30" stroke="#b9a883" strokeWidth="1" />
            <rect x="14" y="16" width="5" height="40" rx="1" fill={NAVY} />
            <rect x="110" y="20" width="4" height="22" rx="1" fill={MID} />
            <rect x="184" y="20" width="4" height="22" rx="1" fill={MID} />
            <path d="M16.5 16 Q100 -6 186 20 M16.5 16 Q64 4 112 20" stroke={NARANJA} strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
            <rect x="52" y="4" width="26" height="12" rx="2" fill={NAVY} /><rect x="56" y="7" width="12" height="5" rx="1" fill={NARANJA} />
          </svg>
          <span className="absolute bottom-0 left-[4%] text-[9px] font-bold text-primary lg:text-xs">Electrodo</span>
          <span className="absolute bottom-0 left-[50%] text-[9px] font-bold text-tertiary lg:text-xs">Potencial</span>
          <span className="absolute bottom-0 right-0 text-[9px] font-bold text-tertiary lg:text-xs">Corriente</span>
        </div>
        <Tarjeta>
          <div className="relative min-h-0 flex-1">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <rect x="40" y="0" width="40" height="100" fill={NARANJA} opacity=".12" />
              <path d={CURVA_CAIDA} fill="none" stroke={NAVY} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="absolute left-[42%] top-0 text-[9px] font-bold text-amber-800 lg:text-xs">Valor estable</span>
          </div>
          <Texto>Se mide en varias distancias hasta que la lectura se estabiliza: ese es el valor real del electrodo.</Texto>
        </Tarjeta>
      </div>
    </Marco>
  );
}

function TieContinuidad() {
  const equipos = [
    { x: 30, n: "Tablero", ok: true },
    { x: 80, n: "Motor", ok: true },
    { x: 130, n: "Estructura", ok: false },
    { x: 180, n: "Tanque", ok: true },
  ];
  return (
    <Marco titulo="Continuidad hasta cada equipo" pie="Esquema: cada equipo debe llegar a la red de tierras">
      <div className="flex h-full flex-col gap-2 lg:gap-3">
        <div className="relative min-h-0 flex-1">
          <svg viewBox="0 0 210 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="10" y="74" width="190" height="6" rx="2" fill="#b8683a" />
            {equipos.map((e) => (
              <g key={e.n}>
                <rect x={e.x - 14} y="8" width="28" height="30" rx="2" fill={NAVY} />
                {e.ok
                  ? <line x1={e.x} y1="38" x2={e.x} y2="74" stroke="#10b981" strokeWidth="3" />
                  : (<><line x1={e.x} y1="38" x2={e.x} y2="52" stroke="#dc2f27" strokeWidth="3" /><line x1={e.x} y1="62" x2={e.x} y2="74" stroke="#dc2f27" strokeWidth="3" /><path d={`M${e.x - 6} 51 l12 12 M${e.x + 6} 51 l-12 12`} stroke="#dc2f27" strokeWidth="2.5" /></>)}
              </g>
            ))}
          </svg>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-bold text-primary lg:text-xs">
          {equipos.map((e) => <span key={e.n} className={e.ok ? "" : "text-red-600"}>{e.n}</span>)}
        </div>
        <Texto fuerte>Sin continuidad, esa estructura queda energizada en una falla, y no hay por dónde irse la corriente.</Texto>
      </div>
    </Marco>
  );
}

const PUNTOS_TIERRA = [
  { n: "R1", v: 8, lim: 25 },
  { n: "R2", v: 18, lim: 25 },
  { n: "R3", v: 31, lim: 25 },
  { n: "P1", v: 6, lim: 10 },
  { n: "P2", v: 14, lim: 10 },
  { n: "R4", v: 12, lim: 25 },
];

function TieLimite() {
  const tope = 36;
  return (
    <Marco titulo="Cada punto contra el límite que le toca" pie="Esquema: red general a 25 Ω y pararrayos a 10 Ω">
      <div className="flex h-full flex-col gap-2 lg:gap-3">
        <div className="flex min-h-0 flex-1 items-end gap-2 border-b border-primary/30 lg:gap-3">
          {PUNTOS_TIERRA.map((p) => {
            const mal = p.v > p.lim;
            return (
              <div key={p.n} className="relative flex h-full flex-1 flex-col justify-end">
                <div className="absolute inset-x-0 border-t-2 border-dashed border-red-400" style={{ bottom: `${(p.lim / tope) * 100}%` }} />
                <span className="rounded-t-[2px]" style={{ height: `${(p.v / tope) * 100}%`, background: mal ? "#dc2f27" : "#10b981" }} />
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 text-center text-[9px] font-bold text-primary lg:gap-3 lg:text-xs">
          {PUNTOS_TIERRA.map((p) => <span key={p.n} className="flex-1">{p.n}</span>)}
        </div>
        <Texto>R: registros de la red general. P: bajantes de pararrayos, con límite más estricto.</Texto>
      </div>
    </Marco>
  );
}

function TieCausa() {
  const causas = [
    { t: "Terreno seco", d: "Se mejora el suelo alrededor del electrodo", es: false },
    { t: "Electrodo corroído", d: "Se cambia o se agrega un electrodo", es: true },
    { t: "Conexión floja", d: "Se limpia y se reaprieta", es: false },
  ];
  return (
    <Marco titulo="Un valor alto no siempre es un electrodo malo" pie="Esquema: el reporte dice cuál de las causas es">
      <div className="flex h-full flex-col gap-2 lg:gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 ring-1 ring-red-600/30 lg:text-sm">Registro R3 · 31 Ω</span>
          <span className="text-[10px] text-tertiary lg:text-sm">¿por qué?</span>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 lg:gap-3">
          {causas.map((c) => (
            <Tarjeta key={c.t} className={c.es ? "ring-2 ring-secondary" : ""}>
              <div className="flex items-center gap-1.5">{c.es && <Sello bien />}<Texto fuerte>{c.t}</Texto></div>
              <p className="mt-1 text-[10px] leading-snug text-tertiary lg:text-xs">{c.d}</p>
            </Tarjeta>
          ))}
        </div>
        <Texto fuerte>La acción correcta depende de la causa, no del número.</Texto>
      </div>
    </Marco>
  );
}

function TieStps() {
  const puntos = ["Resistencia de cada punto", "Continuidad de los equipos", "Registro de las mediciones", "Bajantes de pararrayos señalizadas"];
  return (
    <Marco titulo="Listo para la inspección de la STPS" pie="Esquema: lo que pide la NOM-022-STPS-2015, punto por punto">
      <div className="grid h-full grid-cols-[1.3fr_1fr] items-center gap-3 lg:gap-6">
        <Tarjeta>
          <Rotulo>Reporte de tierras físicas</Rotulo>
          <ul className="mt-2 space-y-1.5 lg:space-y-2">
            {puntos.map((p) => <li key={p} className="flex items-start gap-2 text-[10px] leading-snug text-primary lg:text-sm"><Sello bien />{p}</li>)}
          </ul>
        </Tarjeta>
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 text-[10px] font-extrabold leading-tight text-primary lg:h-24 lg:w-24 lg:text-sm" style={{ borderColor: NARANJA }}>
            Unidad<br />Verificadora
          </span>
          <Texto fuerte>Reporte validado</Texto>
        </div>
      </div>
    </Marco>
  );
}

const MAPA: Record<string, () => React.ReactElement> = {
  "tie-metodo": TieMetodo,
  "tie-continuidad": TieContinuidad,
  "tie-limite": TieLimite,
  "tie-causa": TieCausa,
  "tie-stps": TieStps,
  "sen-especialistas": SenEspecialistas,
  "sen-continuo": SenContinuo,
  "sen-estandar": SenEstandar,
  "sen-alertas": SenAlertas,
  "sen-prueba": SenPrueba,
  "cam-termografos": CamTermografos,
  "cam-ia": CamIa,
  "cam-alcance": CamAlcance,
  "cam-monitoreo": CamMonitoreo,
  "cam-camara": CamCamara,
  "hue-especialistas": HueEspecialistas,
  "hue-ia": HueIa,
  "hue-sinabrir": HueSinAbrir,
  "hue-criticos": HueCriticos,
  "hue-monitoreo": HueMonitoreo,
  "ace-analistas": AceAnalistas,
  "ace-muestra": AceMuestra,
  "ace-laboratorio": AceLaboratorio,
  "ace-tendencia": AceTendencia,
  "ace-transformadores": AceTransformadores,
};

export default function IlustracionesServicio({ clave }: Props) {
  const C = MAPA[clave];
  return C ? <C /> : null;
}
