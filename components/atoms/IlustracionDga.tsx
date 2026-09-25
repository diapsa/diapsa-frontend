/**
 * IlustracionDga
 * Ilustraciones de las pestañas "¿Qué nos hace diferentes?" de DGA en línea,
 * en lugar de fotos.
 *
 * Por qué existen: las pestañas repetían las mismas cinco fotos que ya
 * aparecían en la apertura y en la galería, y de DGA en línea no hay más
 * fotos propias. Además, lo que cada pestaña dice (qué falla indica el
 * triángulo de Duval, que la velocidad de un gas pesa más que su valor, que
 * el laboratorio confirma) no se enseña con una foto de un transformador.
 *
 * Mismo criterio que GraficoPunto: dibujo en SVG escalable, rótulos en HTML
 * para que en teléfono conserven su tamaño, y ninguna cifra de cliente.
 */

type Props = { clave: string };

const NAVY = "#002e46";
const MID = "#2b5671";
const GRIS = "#d9e2e8";
const NARANJA = "#fc9f01";

function Marco({ titulo, pie, children }: { titulo: string; pie: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#fbfcfd] to-[#eef1f4] p-4 sm:p-6 lg:p-8">
      <p className="text-sm font-extrabold leading-tight text-primary lg:text-xl">{titulo}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-tertiary lg:text-sm">{pie}</p>
      <div className="relative mt-3 min-h-0 flex-1 lg:mt-5">{children}</div>
    </div>
  );
}

/* Triángulo de Duval simplificado: zonas aproximadas, sin escala. */
function Duval() {
  return (
    <Marco titulo="El triángulo de Duval dice qué falla es" pie="Esquema: cada combinación de gases cae en una zona">
      <div className="flex h-full items-center gap-4 lg:gap-8">
        <div className="relative aspect-[1.15] h-full max-h-full max-w-[52%] shrink-0 sm:max-w-none">
          <svg viewBox="0 0 115 100" className="h-full w-full" aria-hidden="true">
            <defs>
              <clipPath id="dga-tri">
                <polygon points="57.5,4 111,96 4,96" />
              </clipPath>
            </defs>
            <g clipPath="url(#dga-tri)">
              <rect x="0" y="0" width="115" height="100" fill="#eaf0f4" />
              <polygon points="57.5,4 64,15 51,15" fill="#c8d6e0" />
              <polygon points="4,96 38,96 48,62 27,57" fill="#fde7bd" />
              <polygon points="38,96 70,96 66,78 48,62" fill="#fbcf7d" />
              <polygon points="70,96 111,96 90,60 66,78" fill="#f6a24b" />
              <polygon points="27,57 48,62 66,78 90,60 70,26 45,26" fill="#dbe6ee" />
            </g>
            <polygon points="57.5,4 111,96 4,96" fill="none" stroke={NAVY} strokeWidth="1.2" />
            <circle cx="36" cy="72" r="7" fill={NARANJA} opacity=".25" className="motion-safe:animate-ping" style={{ transformOrigin: "36px 72px" }} />
            <circle cx="36" cy="72" r="3.4" fill={NARANJA} stroke="#fff" strokeWidth="1.2" />
          </svg>
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full text-[10px] font-bold text-tertiary lg:text-xs">CH₄</span>
          <span className="absolute bottom-0 left-0 translate-y-full text-[10px] font-bold text-tertiary lg:text-xs">C₂H₂</span>
          <span className="absolute bottom-0 right-0 translate-y-full text-[10px] font-bold text-tertiary lg:text-xs">C₂H₄</span>
        </div>
        <ul className="min-w-0 flex-1 space-y-1 text-[10px] leading-tight text-primary sm:space-y-2 sm:text-[11px] lg:space-y-3 lg:text-sm">
          <li className="flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: "#fde7bd" }} />Descarga de baja energía</li>
          <li className="flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: "#fbcf7d" }} />Arco de alta energía</li>
          <li className="flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: "#f6a24b" }} />Sobrecalentamiento</li>
          <li className="flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: "#c8d6e0" }} />Descargas parciales</li>
          <li className="mt-1.5 rounded-sm bg-white p-1.5 font-bold shadow-sm ring-1 ring-black/5 sm:mt-3 sm:p-2 lg:p-3">
            <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: NARANJA }} />
            Esta muestra: descarga de baja energía
          </li>
        </ul>
      </div>
    </Marco>
  );
}

/* El monitor vigila cada hora; el laboratorio confirma con el detalle. */
function Laboratorio() {
  const lecturas = [22, 24, 23, 25, 24, 26, 25, 27, 26, 28, 31, 35, 40, 46, 53, 61];
  const max = 64;
  return (
    <Marco titulo="El monitor avisa, el laboratorio confirma" pie="Esquema: el cambio que ve el monitor se revisa con una muestra">
      <div className="grid h-full min-h-0 grid-cols-[1fr_auto_1fr] items-stretch gap-2 lg:gap-4">
        <div className="flex min-h-0 flex-col rounded-sm bg-white p-3 shadow-sm ring-1 ring-black/5 lg:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary lg:text-xs">Monitor · cada hora</p>
          <div className="mt-2 flex min-h-0 flex-1 items-end gap-[2px]">
            {lecturas.map((v, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-[2px]"
                style={{ height: `${(v / max) * 100}%`, background: i >= 11 ? NARANJA : MID, opacity: i >= 11 ? 1 : 0.55 }}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] font-bold text-primary lg:text-sm">El hidrógeno empieza a subir</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <svg viewBox="0 0 40 16" className="w-8 lg:w-12" aria-hidden="true">
            <path d="M2 8h32m-7-6 7 6-7 6" fill="none" stroke={NARANJA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="max-w-[4.5rem] text-[9px] font-bold leading-tight text-tertiary lg:max-w-[6rem] lg:text-xs">Se toma una muestra</span>
        </div>
        <div className="flex min-h-0 flex-col rounded-sm bg-white p-3 shadow-sm ring-1 ring-black/5 lg:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary lg:text-xs">Laboratorio acreditado</p>
          <div className="mt-2 flex min-h-0 flex-1 items-center gap-2 lg:gap-3">
            <svg viewBox="0 0 24 48" className="h-16 w-auto shrink-0 lg:h-20" aria-hidden="true">
              <rect x="5" y="2" width="14" height="5" rx="1" fill={NAVY} />
              <path d="M6 7h12v33a6 6 0 0 1-12 0Z" fill="#fff" stroke={NAVY} strokeWidth="1.5" />
              <path d="M7 24h10v16a5 5 0 0 1-10 0Z" fill="#e8a126" opacity=".85" />
            </svg>
            <ul className="space-y-1 text-[10px] leading-tight text-primary lg:space-y-1.5 lg:text-sm">
              <li>✓ Nueve gases</li>
              <li>✓ Humedad</li>
              <li>✓ Calidad del aceite</li>
            </ul>
          </div>
          <p className="mt-2 text-[11px] font-bold text-primary lg:text-sm">Diagnóstico completo</p>
        </div>
      </div>
    </Marco>
  );
}

/* Mismo valor de gas, distinta velocidad: la pendiente es la que alerta. */
function Velocidad() {
  return (
    <Marco titulo="No importa solo cuánto gas hay, sino qué tan rápido crece" pie="Esquema: dos transformadores con el mismo valor hoy">
      <div className="grid h-full grid-cols-2 gap-3 lg:gap-5">
        {[
          { t: "Estable", d: "Lleva meses igual: se vigila", c: MID, p: "M4 34 L96 30", tag: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
          { t: "Crece rápido", d: "Subió en días: se actúa", c: NARANJA, p: "M4 86 C 50 84, 70 70, 96 30", tag: "bg-amber-50 text-amber-800 ring-amber-600/30" },
        ].map((x) => (
          <div key={x.t} className="flex flex-col rounded-sm bg-white p-3 shadow-sm ring-1 ring-black/5 lg:p-4">
            <span className={`self-start rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 lg:text-xs ${x.tag}`}>{x.t}</span>
            <div className="relative mt-2 flex-1">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <line x1="0" x2="100" y1="30" y2="30" stroke={GRIS} strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                <path d={x.p} fill="none" stroke={x.c} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="absolute right-0 top-[30%] h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-white" style={{ background: x.c }} />
            </div>
            <p className="mt-2 text-[11px] font-bold leading-snug text-primary lg:text-sm">{x.d}</p>
          </div>
        ))}
      </div>
    </Marco>
  );
}

function Trafo({ critico }: { critico: boolean }) {
  const c = critico ? NAVY : GRIS;
  return (
    <svg viewBox="0 0 40 44" className="w-full" aria-hidden="true">
      {[10, 20, 30].map((x) => <rect key={x} x={x - 1.5} y="2" width="3" height="9" rx="1" fill={critico ? "#eef1f4" : "#c3ced6"} stroke={c} strokeWidth=".8" />)}
      <rect x="4" y="11" width="32" height="26" rx="2" fill={c} />
      {[8, 13, 18, 23, 28].map((x) => <rect key={x} x={x} y="15" width="2.2" height="18" rx="1" fill={critico ? MID : "#c3ced6"} />)}
      <rect x="2" y="37" width="36" height="4" rx="1" fill={critico ? MID : "#c3ced6"} />
      {critico && <rect x="30" y="24" width="9" height="12" rx="1.5" fill={NARANJA} stroke="#fff" strokeWidth="1" />}
    </svg>
  );
}

/* Solo algunos transformadores llevan monitor. */
function Criticos() {
  const flota = [false, true, false, false, true, false];
  return (
    <Marco titulo="El monitor va donde es indispensable" pie="Esquema: una planta con seis transformadores">
      <div className="flex h-full flex-col justify-center gap-4 lg:gap-6">
        <div className="grid grid-cols-6 items-end gap-2 lg:gap-4">
          {flota.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Trafo critico={c} />
              <span className={`text-center text-[9px] font-bold leading-tight lg:text-xs ${c ? "text-primary" : "text-tertiary/60"}`}>
                {c ? "Crítico" : "Normal"}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] leading-snug lg:gap-4 lg:text-sm">
          <p className="flex items-center gap-2 rounded-sm bg-white p-2 font-bold text-primary shadow-sm ring-1 ring-black/5 lg:p-3">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: NARANJA }} />
            Monitor en línea, cada hora
          </p>
          <p className="flex items-center gap-2 rounded-sm bg-white p-2 text-tertiary shadow-sm ring-1 ring-black/5 lg:p-3">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: GRIS }} />
            Muestra al laboratorio, una o dos veces al año
          </p>
        </div>
      </div>
    </Marco>
  );
}

/* La alerta: revisada por DIAPSA, directo a tu sistema, o las dos. */
function Aviso() {
  return (
    <Marco titulo="La alerta llega como tú prefieras" pie="Revisada por un especialista, directo a tu sistema, o las dos">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 lg:gap-4">
        <div className="mx-auto w-full max-w-[11rem] rounded-[1.4rem] p-1.5 shadow-lg" style={{ background: NAVY }}>
          <div className="rounded-[1.1rem] bg-[#f3f6f8] p-2 pt-4 lg:p-3 lg:pt-6">
            <div className="rounded-lg bg-white p-2 shadow-sm lg:p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-tertiary lg:text-[11px]">DIAPSA</p>
              <p className="mt-1 text-[11px] font-extrabold leading-tight text-primary lg:text-sm">Transformador principal</p>
              <p className="mt-0.5 text-[10px] leading-tight text-primary lg:text-xs">Descarga de baja energía</p>
              <p className="mt-1.5 text-[9px] font-bold leading-tight lg:text-[11px]" style={{ color: MID }}>✓ Revisada por especialista</p>
            </div>
          </div>
        </div>
        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-primary shadow-sm ring-1 ring-black/5 lg:text-xs">o</span>
        <div className="w-full rounded-sm bg-white p-2 shadow-sm ring-1 ring-black/5 lg:p-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-tertiary lg:text-[11px]">Tu sistema de control</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {["T1", "T2", "T3", "T4", "T5", "T6"].map((t, i) => (
              <span
                key={t}
                className="rounded-[3px] py-1 text-center text-[9px] font-bold lg:text-[11px]"
                style={{ background: i === 1 ? NARANJA : "#eef1f4", color: NAVY }}
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[10px] leading-tight text-primary lg:text-xs">Alarma por Modbus o contacto de relé</p>
        </div>
      </div>
    </Marco>
  );
}

export const CLAVES_DGA = ["dga-duval", "dga-laboratorio", "dga-velocidad", "dga-criticos", "dga-aviso"];

export default function IlustracionDga({ clave }: Props) {
  if (clave === "dga-duval") return <Duval />;
  if (clave === "dga-laboratorio") return <Laboratorio />;
  if (clave === "dga-velocidad") return <Velocidad />;
  if (clave === "dga-criticos") return <Criticos />;
  if (clave === "dga-aviso") return <Aviso />;
  return null;
}
