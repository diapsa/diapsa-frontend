import Image from "next/image";

/**
 * ReporteLinea
 * Cómo se ve el informe de una inspección termográfica aérea de una línea de
 * transmisión de alta tensión, por kilómetro (Emiliano, 2026-10-09: el parque
 * solar ya va en "Qué recibes"; la línea, de alta tensión con torres de
 * celosía y más kilómetros). Muestra con datos ilustrativos: el trazo con
 * cada hallazgo en su kilómetro, el resumen por severidad y la tabla por
 * torre para la cuadrilla.
 */

type Severidad = "Alta" | "Media" | "Baja";
const COLOR: Record<Severidad, string> = { Alta: "#dc2626", Media: "#ea580c", Baja: "#ca8a04" };
const KM = 120;
const TORRES = 285;

const HALLAZGOS: { km: number; torre: number; falla: string; dt: string; s: Severidad; accion: string }[] = [
  { km: 18.4, torre: 43, falla: "Grapa de suspensión de la fase C", dt: "+22 °C", s: "Alta", accion: "Cambiar la grapa en la próxima libranza" },
  { km: 47.2, torre: 112, falla: "Empalme de compresión del conductor", dt: "+14 °C", s: "Media", accion: "Programar el cambio del empalme" },
  { km: 73.9, torre: 176, falla: "Cadena de aisladores con calentamiento", dt: "+6 °C", s: "Media", accion: "Revisar contaminación y lavar o cambiar la cadena" },
  { km: 101.5, torre: 241, falla: "Puente de la torre de remate", dt: "+4 °C", s: "Baja", accion: "Vigilar en el próximo vuelo" },
];

/** Torre de celosía en miniatura, con la base en (x, y). */
function Torre({ x, y, h = 30 }: { x: number; y: number; h?: number }) {
  const w = h * 0.45;
  return (
    <g stroke="#1e3a5f" strokeWidth="1.2" fill="none" opacity="0.8">
      <path d={`M${x - w / 2} ${y} L${x - 2} ${y - h} M${x + w / 2} ${y} L${x + 2} ${y - h}`} />
      <path d={`M${x - w / 2} ${y} L${x + w / 4} ${y - h / 2} M${x + w / 2} ${y} L${x - w / 4} ${y - h / 2} M${x - w / 4} ${y - h / 2} L${x + 2} ${y - h} M${x + w / 4} ${y - h / 2} L${x - 2} ${y - h}`} />
      <path d={`M${x - w * 0.7} ${y - h * 0.82} H${x + w * 0.7} M${x - w * 0.5} ${y - h * 0.98} H${x + w * 0.5}`} />
    </g>
  );
}

function Trazo() {
  const x = (km: number) => 20 + (km / KM) * 600;
  return (
    <svg viewBox="0 0 640 120" className="h-auto w-full" role="img" aria-label="Trazo de la línea por kilómetro con los hallazgos ubicados">
      <rect x="0" y="0" width="640" height="120" rx="8" fill="#f1f5f9" />
      {/* Las torres y el conductor entre ellas */}
      {Array.from({ length: 25 }, (_, i) => (
        <Torre key={i} x={x(i * 5)} y={70} />
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d={`M${x(i * 5)} 45 Q${x(i * 5 + 2.5)} 54 ${x(i * 5 + 5)} 45`} stroke="#1e3a5f" strokeWidth="1.5" fill="none" />
      ))}
      {/* Kilómetros */}
      {[0, 20, 40, 60, 80, 100, 120].map((k) => (
        <text key={k} x={x(k)} y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b6b86">
          km {k}
        </text>
      ))}
      {HALLAZGOS.map((h) => (
        <g key={h.torre}>
          <circle cx={x(h.km)} cy="47" r="11" fill={COLOR[h.s]} opacity="0.25" />
          <circle cx={x(h.km)} cy="47" r="5" fill={COLOR[h.s]} stroke="#fff" strokeWidth="1.5" />
          <text x={x(h.km)} y="24" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0d1a38">
            {h.km}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function ReporteLinea() {
  const resumen = (["Alta", "Media", "Baja"] as Severidad[]).map((s) => ({ s, n: HALLAZGOS.filter((h) => h.s === s).length }));
  const texto: Record<Severidad, string> = { Alta: "Próxima libranza", Media: "Programar en el mes", Baja: "Vigilar" };
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_30px_70px_-35px_rgba(13,26,56,0.45)] ring-1 ring-primary/10">
      {/* Encabezado del informe */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-primary px-5 py-3 text-white">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Informe de termografía aérea</p>
          <p className="text-sm font-extrabold">Línea de transmisión de alta tensión · {KM} km · {TORRES} torres</p>
        </div>
        <p className="text-[11px] text-white/70">Vuelo con la línea en carga</p>
      </div>

      <div className="p-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-tertiary">Dónde está cada hallazgo</p>
        <Trazo />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image src="/images/servicios/termografia-con-drones/termograma-torre.webp" alt="Termograma aéreo de una torre de alta tensión con la grapa de una fase caliente" fill sizes="(max-width: 640px) 100vw, 260px" className="object-cover" />
          <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">Km 18.4 · torre 43</span>
        </div>
        <ul className="grid grid-cols-3 content-start gap-2">
          {resumen.map((r) => (
            <li key={r.s} className="rounded-lg p-2 text-center ring-1 ring-black/5" style={{ background: `${COLOR[r.s]}14` }}>
              <p className="text-2xl font-extrabold leading-none" style={{ color: COLOR[r.s] }}>{r.n}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-primary">{r.s}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-tertiary">{texto[r.s]}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* La tabla por torre para la cuadrilla */}
      <div className="px-4 pb-4">
        <p className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-widest text-tertiary">Qué atender primero</p>
        <ul className="divide-y divide-gray-100 text-xs">
          {HALLAZGOS.map((h) => (
            <li key={h.torre} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: COLOR[h.s] }} />
              <span className="min-w-0">
                <span className="block font-bold text-primary">{h.falla}</span>
                <span className="block text-tertiary">Km {h.km} · torre {h.torre} · {h.accion}</span>
              </span>
              <span className="font-extrabold text-primary">{h.dt}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-tertiary">Ejemplo con datos ilustrativos.</p>
      </div>
    </div>
  );
}
