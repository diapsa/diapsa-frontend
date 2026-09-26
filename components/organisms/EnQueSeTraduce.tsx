import Antetitulo from "../atoms/Antetitulo";
import type { ServiceTraduccion } from "@/types/servicio";

/**
 * EnQueSeTraduce
 * "En qué se traduce" con una visual propia de cada servicio.
 *
 * Por qué existe: la primera versión era la misma tabla de dos columnas
 * ("sin aviso" contra "con aviso") en cinco páginas, y una gráfica genérica
 * de ahorro en otras siete. Leídas juntas, todas decían lo mismo. Aquí cada
 * página cuenta lo que solo aplica a su servicio: las semanas de margen del
 * sensor de vibración, las horas en que se calienta una conexión, la
 * escalera de una falla del transformador, los meses sin transformador y
 * los cambios de aceite que no hacían falta.
 *
 * Son esquemas y lo dicen: sin cifras de un cliente. Dibujo en HTML con
 * alturas y posiciones en porcentaje, rótulos que conservan su tamaño en
 * teléfono. Componente de servidor.
 */

type Props = { traduccion: ServiceTraduccion; paso?: string };

const NAVY = "#002e46";
const MID = "#2b5671";
const NARANJA = "#fc9f01";

function Marca({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold lg:text-sm" style={{ color }}>
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}

/* Sensores de vibración: semanas entre el aviso y la falla. */
function Margen() {
  const semanas = ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5"];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-5 text-center text-[10px] font-bold uppercase tracking-wider text-tertiary lg:text-xs">
        {semanas.map((s) => <span key={s}>{s}</span>)}
      </div>
      <div className="relative h-24 rounded-sm bg-gradient-to-r from-emerald-50 via-amber-50 to-red-100 lg:h-28">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M0 88 C 40 86, 60 70, 78 45 S 94 8, 100 4" fill="none" stroke={NAVY} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-red-700 lg:text-xs">La falla</span>
      </div>
      <div className="space-y-3">
        <div className="relative h-9 rounded-sm bg-emerald-50 ring-1 ring-emerald-600/20">
          <span className="absolute inset-y-0 left-[3%] right-[30%] rounded-sm bg-emerald-500/25" />
          <span className="absolute left-[3%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-emerald-600 ring-2 ring-white" />
          <span className="absolute left-[7%] top-1/2 -translate-y-1/2 text-[11px] font-bold text-emerald-800 lg:text-sm">Con sensor: avisa aquí, y hay semanas para planear</span>
        </div>
        <div className="relative h-9 rounded-sm bg-red-50 ring-1 ring-red-600/20">
          <span className="absolute right-[4%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-red-600 ring-2 ring-white" />
          <span className="absolute right-[8%] top-1/2 -translate-y-1/2 text-right text-[11px] font-bold text-red-800 lg:text-sm">Ruta mensual: llega cuando ya falló</span>
        </div>
      </div>
    </div>
  );
}

/* Cámaras térmicas: una conexión se calienta en horas. */
function Reloj() {
  const horas = ["06:00", "09:00", "12:00", "15:00", "18:00"];
  return (
    <div className="space-y-4">
      <div className="relative h-40 rounded-sm bg-gray-50 ring-1 ring-black/5 lg:h-48">
        <div className="absolute inset-x-0 border-t-2 border-dashed border-red-400" style={{ top: "22%" }}>
          <span className="absolute -top-5 right-2 text-[10px] font-bold text-red-600 lg:text-xs">Riesgo de falla o incendio</span>
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M0 82 L30 80 C 42 78, 50 60, 62 40 S 80 18, 100 10" fill="none" stroke={NARANJA} strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600 ring-2 ring-white" style={{ left: "36%", top: "76%" }} />
        <span className="absolute -translate-x-1/2 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 shadow-sm lg:text-xs" style={{ left: "36%", top: "84%" }}>La cámara avisa</span>
      </div>
      <div className="grid grid-cols-5 text-center text-[10px] font-bold text-tertiary lg:text-xs">
        {horas.map((h) => <span key={h}>{h}</span>)}
      </div>
      <p className="rounded-sm bg-red-50 px-3 py-2 text-[11px] font-bold text-red-800 ring-1 ring-red-600/20 lg:text-sm">
        La siguiente ruta con cámara de mano llega en semanas.
      </p>
    </div>
  );
}

/* Huella acústica: la escalera de una falla del transformador. */
function Escalera() {
  const escalones = [
    { t: "Descarga parcial", d: "Meses antes", c: "bg-emerald-500" },
    { t: "Daño del aislamiento", d: "Semanas antes", c: "bg-amber-400" },
    { t: "Arco interno", d: "Días antes", c: "bg-orange-500" },
    { t: "Fuera de servicio", d: "Semanas sin energía", c: "bg-red-600" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex h-44 items-end gap-2 lg:h-56 lg:gap-3">
        {escalones.map((e, i) => (
          <div key={e.t} className="flex h-full flex-1 flex-col justify-end">
            {i === 0 && <span className="mb-1 self-start rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white lg:text-xs">El sensor avisa aquí</span>}
            {i === 3 && <span className="mb-1 self-end rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white lg:text-xs">Sin escucha, aquí</span>}
            <div className={`rounded-t-sm ${e.c}`} style={{ height: `${28 + i * 22}%` }} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 lg:gap-3">
        {escalones.map((e) => (
          <div key={e.t}>
            <p className="text-[11px] font-bold leading-tight text-primary lg:text-sm">{e.t}</p>
            <p className="text-[10px] text-tertiary lg:text-xs">{e.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* DGA en línea: meses sin transformador contra días de intervención. */
function Calendario() {
  const meses = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <div className="space-y-6">
      <div>
        <Marca color="#b91c1c">Si el transformador falla</Marca>
        <div className="mt-2 grid grid-cols-12 gap-1">
          {meses.map((m, i) => (
            <div key={i} className={`flex h-12 items-end justify-center rounded-sm pb-1 text-[10px] font-bold lg:h-14 lg:text-xs ${i < 9 ? "bg-red-500 text-white" : "bg-gray-100 text-tertiary"}`}>{m}</div>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-primary lg:text-sm">Fabricar, transportar e instalar uno nuevo puede tomar meses, con la carga en respaldo o parada.</p>
      </div>
      <div>
        <Marca color="#047857">Si el DGA en línea avisa a tiempo</Marca>
        <div className="mt-2 grid grid-cols-12 gap-1">
          {meses.map((m, i) => (
            <div key={i} className={`flex h-12 items-end justify-center rounded-sm pb-1 text-[10px] font-bold lg:h-14 lg:text-xs ${i === 0 ? "bg-emerald-500 text-white" : "bg-gray-100 text-tertiary"}`}>{m}</div>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-primary lg:text-sm">Se interviene en sitio en una ventana programada: días, no meses.</p>
      </div>
    </div>
  );
}

function Tambor({ lleno, tachado }: { lleno: boolean; tachado?: boolean }) {
  return (
    <div className="relative w-10 lg:w-14">
      <svg viewBox="0 0 40 52" className="w-full" aria-hidden="true">
        <rect x="4" y="4" width="32" height="44" rx="4" fill={lleno ? "#e8a126" : "#e5e7eb"} stroke={NAVY} strokeWidth="2" />
        {[16, 32].map((y) => <line key={y} x1="4" x2="36" y1={y} y2={y} stroke={NAVY} strokeWidth="1.5" />)}
        <ellipse cx="20" cy="4" rx="16" ry="3" fill={MID} />
      </svg>
      {tachado && <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-red-600 lg:text-3xl">✕</span>}
    </div>
  );
}

/* Análisis de aceite: cambios por calendario contra por condición. */
function Tambores() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-sm bg-red-50 p-4 ring-1 ring-red-600/20 lg:p-5">
        <Marca color="#b91c1c">Por calendario</Marca>
        <div className="mt-3 flex gap-2">
          <Tambor lleno /><Tambor lleno tachado /><Tambor lleno /><Tambor lleno tachado />
        </div>
        <p className="mt-3 text-[11px] leading-snug text-primary lg:text-sm">Cambios cada tantas horas: se tira aceite que todavía servía, y el que ya no servía sigue trabajando hasta la fecha.</p>
      </div>
      <div className="rounded-sm bg-emerald-50 p-4 ring-1 ring-emerald-600/20 lg:p-5">
        <Marca color="#047857">Por condición</Marca>
        <div className="mt-3 flex gap-2">
          <Tambor lleno /><Tambor lleno />
        </div>
        <p className="mt-3 text-[11px] leading-snug text-primary lg:text-sm">Se cambia cuando la muestra lo pide: menos aceite comprado y desechado, y el desgaste se ve antes de volverse falla.</p>
      </div>
    </div>
  );
}

const VISUAL: Record<ServiceTraduccion["tipo"], () => React.ReactElement> = {
  margen: Margen,
  reloj: Reloj,
  escalera: Escalera,
  calendario: Calendario,
  tambores: Tambores,
};

export default function EnQueSeTraduce({ traduccion: t, paso }: Props) {
  const Visual = VISUAL[t.tipo];
  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        <div>
          <Antetitulo paso={paso}>{t.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{t.titulo}</h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{t.texto}</p>
          {t.cierre && <p className="mt-5 border-l-4 border-secondary pl-4 text-justify text-base font-bold leading-snug text-primary lg:text-lg">{t.cierre}</p>}
        </div>
        <div className="rounded-sm bg-white p-5 shadow-xl ring-1 ring-black/5 lg:p-8">
          {Visual && <Visual />}
          <p className="mt-5 text-[11px] text-tertiary/80 lg:text-xs">{t.nota ?? "Esquema: los tiempos cambian con cada equipo y cada falla."}</p>
        </div>
      </div>
    </section>
  );
}
