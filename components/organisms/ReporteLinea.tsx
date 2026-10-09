import Image from "next/image";

/**
 * ReporteLinea
 * Cómo se ve el informe de una inspección termográfica aérea de una línea de
 * distribución, por kilómetro (Emiliano, 2026-10-09: el parque solar ya va en
 * "Qué recibes", así que arriba va la línea). Muestra con datos ilustrativos:
 * el trazo de la línea con cada hallazgo en su kilómetro, el resumen por
 * severidad y la tabla por poste para la cuadrilla.
 */

type Severidad = "Alta" | "Media" | "Baja";
const COLOR: Record<Severidad, string> = { Alta: "#dc2626", Media: "#ea580c", Baja: "#ca8a04" };
const KM = 18;

const HALLAZGOS: { km: number; poste: number; falla: string; dt: string; s: Severidad; accion: string }[] = [
  { km: 4.3, poste: 52, falla: "Conector de la fase B en el cortacircuito", dt: "+18 °C", s: "Alta", accion: "Cambiar el conector en la próxima libranza" },
  { km: 9.8, poste: 117, falla: "Empalme del conductor caliente", dt: "+11 °C", s: "Media", accion: "Programar el cambio del empalme" },
  { km: 12.1, poste: 146, falla: "Boquilla del transformador de poste", dt: "+7 °C", s: "Media", accion: "Revisar la conexión y la carga del transformador" },
  { km: 15.6, poste: 188, falla: "Aislador con calentamiento", dt: "+3 °C", s: "Baja", accion: "Vigilar en el próximo vuelo" },
];

function Trazo() {
  const x = (km: number) => 20 + (km / KM) * 600;
  return (
    <svg viewBox="0 0 640 120" className="h-auto w-full" role="img" aria-label="Trazo de la línea por kilómetro con los hallazgos ubicados">
      <rect x="0" y="0" width="640" height="120" rx="8" fill="#f1f5f9" />
      {/* El conductor y los postes */}
      <line x1={x(0)} y1="52" x2={x(KM)} y2="52" stroke="#1e3a5f" strokeWidth="3" />
      {Array.from({ length: 37 }, (_, i) => (
        <line key={i} x1={x(i * 0.5)} y1="44" x2={x(i * 0.5)} y2="60" stroke="#1e3a5f" strokeWidth="1.5" opacity="0.6" />
      ))}
      {/* Kilómetros */}
      {[0, 3, 6, 9, 12, 15, 18].map((k) => (
        <text key={k} x={x(k)} y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b6b86">
          km {k}
        </text>
      ))}
      {HALLAZGOS.map((h) => (
        <g key={h.poste}>
          <circle cx={x(h.km)} cy="52" r="11" fill={COLOR[h.s]} opacity="0.25" />
          <circle cx={x(h.km)} cy="52" r="5" fill={COLOR[h.s]} stroke="#fff" strokeWidth="1.5" />
          <text x={x(h.km)} y="30" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0d1a38">
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
          <p className="text-sm font-extrabold">Línea de distribución · {KM} km · 216 postes</p>
        </div>
        <p className="text-[11px] text-white/70">Vuelo con la línea en carga</p>
      </div>

      <div className="p-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-tertiary">Dónde está cada hallazgo</p>
        <Trazo />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image src="/images/servicios/termografia-con-drones/termograma-linea.webp" alt="Termograma aéreo de un poste de media tensión con el conector de la fase central caliente" fill sizes="(max-width: 640px) 100vw, 260px" className="object-cover" />
          <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">Km 4.3 · poste 52</span>
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

      {/* La tabla por poste para la cuadrilla */}
      <div className="px-4 pb-4">
        <p className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-widest text-tertiary">Qué atender primero</p>
        <ul className="divide-y divide-gray-100 text-xs">
          {HALLAZGOS.map((h) => (
            <li key={h.poste} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: COLOR[h.s] }} />
              <span className="min-w-0">
                <span className="block font-bold text-primary">{h.falla}</span>
                <span className="block text-tertiary">Km {h.km} · poste {h.poste} · {h.accion}</span>
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
