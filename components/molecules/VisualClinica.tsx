import Image from "next/image";

/**
 * VisualClinica
 * Una ilustración pequeña para cada uno de los cuatro datos de la clínica
 * (Emiliano, 2026-10-09: "agrega algo visual"): la videollamada en vivo, las
 * dos horas dentro del turno, el caso que manda el participante y el costo
 * frente a la capacitación completa. Hechas en código, sin cifras.
 */

export type ClaveVisual = "vivo" | "horas" | "caso" | "costo";

function Vivo() {
  return (
    <div className="overflow-hidden rounded-md bg-primary p-2 shadow-inner">
      <div className="flex items-center justify-between px-1 pb-1.5">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> En vivo
        </span>
        <span className="text-[10px] text-white/50">Clínica técnica</span>
      </div>
      <div className="grid grid-cols-[1.6fr_1fr] gap-1.5">
        <div className="relative aspect-[4/3] overflow-hidden rounded">
          <Image src="/images/cursos/clinicas/termografia-en-tableros-electricos.webp" alt="" fill sizes="160px" className="object-cover" />
          <span className="absolute left-[38%] top-[30%] h-7 w-9 rounded-full border-2 border-yellow-300" />
        </div>
        <div className="grid grid-rows-3 gap-1.5">
          {["AR", "LM", "Tú"].map((n) => (
            <span key={n} className={`grid place-items-center rounded text-[10px] font-extrabold text-white ${n === "Tú" ? "bg-secondary text-primary" : "bg-white/10"}`}>
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Horas() {
  // Un turno de ocho horas con las dos de la clínica marcadas
  return (
    <div className="rounded-md bg-white p-3 ring-1 ring-black/5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-tertiary">Tu turno</p>
      <div className="mt-2 grid grid-cols-8 gap-1">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className={`h-7 rounded-sm ${i === 2 || i === 3 ? "bg-secondary" : "bg-gray-200"}`} />
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-8 text-[9px] font-semibold text-tertiary">
        <span className="col-span-2" />
        <span className="col-span-2 text-center font-extrabold text-primary">Clínica</span>
        <span className="col-span-4 text-right">el resto, a planta</span>
      </div>
    </div>
  );
}

function Caso() {
  return (
    <div className="flex items-center gap-3 rounded-md bg-white p-3 ring-1 ring-black/5">
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded">
        <Image src="/images/cursos/clinicas/termografia-en-tableros-electricos.webp" alt="" fill sizes="80px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-primary">termograma-tablero.jpg</p>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-200">
          <div className="h-1.5 w-full rounded-full bg-green-600" />
        </div>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-green-700">✓ Enviado, sin datos de tu empresa</p>
      </div>
    </div>
  );
}

function Costo() {
  // Proporción, no cifras: la clínica frente a la capacitación completa
  return (
    <div className="space-y-2.5 rounded-md bg-white p-3 ring-1 ring-black/5">
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-primary">Clínica</span>
          <span className="text-tertiary">un tema</span>
        </div>
        <div className="mt-1 h-3 w-full rounded-full bg-gray-100">
          <div className="h-3 w-[12%] rounded-full bg-secondary" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-primary">Capacitación completa</span>
          <span className="text-tertiary">la técnica</span>
        </div>
        <div className="mt-1 h-3 w-full rounded-full bg-gray-100">
          <div className="h-3 w-full rounded-full bg-primary/70" />
        </div>
      </div>
    </div>
  );
}

const VISUALES: Record<ClaveVisual, () => React.JSX.Element> = { vivo: Vivo, horas: Horas, caso: Caso, costo: Costo };

export default function VisualClinica({ clave }: { clave: ClaveVisual }) {
  const V = VISUALES[clave];
  return <V />;
}
