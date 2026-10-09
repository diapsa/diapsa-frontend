import Image from "next/image";

/**
 * ReporteSolar
 * Cómo se ve el informe de una inspección termográfica aérea de un parque
 * solar (Emiliano, 2026-10-09: en la página de drones, en lugar del bloque
 * de IDAP). Es una muestra con datos ilustrativos: el plano del parque con
 * cada hallazgo ubicado, el resumen por severidad y la tabla que usa la
 * cuadrilla para ir directo al módulo.
 */

type Severidad = "Alta" | "Media" | "Baja";
const COLOR: Record<Severidad, string> = { Alta: "#dc2626", Media: "#ea580c", Baja: "#ca8a04" };

// Hallazgos ubicados en el plano: bloque (0 a 3), fila (0 a 9), posición en la fila (0 a 1)
const PUNTOS: { b: number; f: number; x: number; s: Severidad }[] = [
  { b: 1, f: 6, x: 0.55, s: "Alta" },
  { b: 3, f: 2, x: 0.3, s: "Alta" },
  { b: 0, f: 3, x: 0.7, s: "Media" },
  { b: 2, f: 8, x: 0.2, s: "Media" },
  { b: 1, f: 1, x: 0.85, s: "Media" },
  { b: 0, f: 8, x: 0.4, s: "Baja" },
  { b: 2, f: 4, x: 0.6, s: "Baja" },
  { b: 3, f: 7, x: 0.75, s: "Baja" },
  { b: 3, f: 5, x: 0.15, s: "Baja" },
];

const RESUMEN: { s: Severidad; n: number; t: string }[] = [
  { s: "Alta", n: 2, t: "Atender esta semana" },
  { s: "Media", n: 3, t: "Programar en el mes" },
  { s: "Baja", n: 4, t: "Vigilar en el próximo vuelo" },
];

const TABLA: { ubic: string; falla: string; dt: string; s: Severidad; accion: string }[] = [
  { ubic: "Bloque B · fila 7 · cadena 3", falla: "Cadena completa sin generar", dt: "+6.8 °C", s: "Alta", accion: "Revisar fusible y conector de la cadena" },
  { ubic: "Bloque D · fila 3 · módulo 12", falla: "Diodo de derivación activado", dt: "+9.4 °C", s: "Alta", accion: "Cambiar la caja de conexiones o el módulo" },
  { ubic: "Bloque A · fila 4 · módulo 21", falla: "Celda caliente", dt: "+14.1 °C", s: "Media", accion: "Inspeccionar el módulo y planear cambio" },
  { ubic: "Bloque C · fila 9 · módulo 5", falla: "Suciedad localizada", dt: "+4.2 °C", s: "Baja", accion: "Incluir en la próxima limpieza" },
];

function Plano() {
  const bloques = ["A", "B", "C", "D"];
  return (
    <svg viewBox="0 0 320 210" className="h-auto w-full" role="img" aria-label="Plano del parque solar con los hallazgos ubicados por bloque y fila">
      <rect x="0" y="0" width="320" height="210" rx="8" fill="#f1f5f9" />
      {bloques.map((nombre, b) => {
        const x0 = 12 + b * 76;
        return (
          <g key={nombre}>
            <text x={x0 + 33} y="18" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0d1a38">
              Bloque {nombre}
            </text>
            {Array.from({ length: 10 }, (_, f) => (
              <rect key={f} x={x0} y={26 + f * 18} width="66" height="10" rx="1.5" fill="#1e3a5f" opacity="0.85" />
            ))}
          </g>
        );
      })}
      {PUNTOS.map((p, i) => (
        <g key={i}>
          <circle cx={12 + p.b * 76 + p.x * 66} cy={31 + p.f * 18} r="6" fill={COLOR[p.s]} opacity="0.3" />
          <circle cx={12 + p.b * 76 + p.x * 66} cy={31 + p.f * 18} r="3" fill={COLOR[p.s]} stroke="#fff" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

export default function ReporteSolar() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_30px_70px_-35px_rgba(13,26,56,0.45)] ring-1 ring-primary/10">
      {/* Encabezado del informe */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-primary px-5 py-3 text-white">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Informe de termografía aérea</p>
          <p className="text-sm font-extrabold">Parque solar · 4 bloques · 40 filas</p>
        </div>
        <p className="text-[11px] text-white/70">Vuelo con irradiancia estable · planta generando</p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Plano con hallazgos */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-tertiary">Dónde está cada hallazgo</p>
          <Plano />
        </div>
        {/* Resumen y termograma */}
        <div className="flex flex-col gap-3">
          <ul className="grid grid-cols-3 gap-2">
            {RESUMEN.map((r) => (
              <li key={r.s} className="rounded-lg p-2 text-center ring-1 ring-black/5" style={{ background: `${COLOR[r.s]}14` }}>
                <p className="text-2xl font-extrabold leading-none" style={{ color: COLOR[r.s] }}>{r.n}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-primary">{r.s}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-tertiary">{r.t}</p>
              </li>
            ))}
          </ul>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image src="/images/servicios/termografia-con-drones/termograma-paneles.webp" alt="Termograma aéreo de una fila de paneles con una cadena sin generar y celdas calientes" fill sizes="(max-width: 1024px) 50vw, 260px" className="object-cover" />
            <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">Bloque B · fila 7</span>
          </div>
        </div>
      </div>

      {/* La tabla para la cuadrilla */}
      <div className="border-t border-gray-100 px-4 pb-4">
        <p className="mb-2 mt-3 text-[11px] font-bold uppercase tracking-widest text-tertiary">Qué atender primero</p>
        <ul className="divide-y divide-gray-100 text-xs">
          {TABLA.map((t) => (
            <li key={t.ubic} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: COLOR[t.s] }} />
              <span className="min-w-0">
                <span className="block font-bold text-primary">{t.falla}</span>
                <span className="block text-tertiary">{t.ubic} · {t.accion}</span>
              </span>
              <span className="font-extrabold text-primary">{t.dt}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-tertiary">Ejemplo con datos ilustrativos.</p>
      </div>
    </div>
  );
}
