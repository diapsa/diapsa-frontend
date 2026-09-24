import Antetitulo from "../atoms/Antetitulo";
import type { ServiceValor } from "@/types/servicio";

/**
 * ValorParo
 * "En qué se traduce": la misma falla, contada dos veces. Una cuando te
 * encuentra sin aviso y otra cuando el sensor la ve venir, renglón por
 * renglón: cuándo paras, qué pagas por la refacción, qué se daña y cómo
 * trabaja tu gente.
 *
 * Por qué no es una calculadora. La primera versión pedía al visitante el
 * costo de su hora parada y devolvía un total en pesos; se sentía como un
 * formulario y el número dependía de supuestos que nadie iba a creer. Esta
 * versión no promete cifras: pone lado a lado las dos cuentas que todo jefe
 * de mantenimiento ya conoce, y deja que él ponga el precio. Componente de
 * servidor, todo viene del JSON.
 */

type Props = {
  valor: ServiceValor;
  paso?: string;
};

function Marca({ bien }: { bien: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white ${
        bien ? "bg-emerald-500" : "bg-red-500"
      }`}
      aria-hidden="true"
    >
      {bien ? "✓" : "✕"}
    </span>
  );
}

export default function ValorParo({ valor: v, paso }: Props) {
  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{v.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{v.titulo}</h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{v.texto}</p>
        </div>

        <div className="overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5">
          {/* Encabezados de las dos columnas */}
          <div className="grid grid-cols-2 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="hidden bg-gray-50 lg:block" />
            <div className="bg-red-600 px-4 py-4 text-white lg:px-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">Sin aviso</p>
              <p className="mt-0.5 text-base font-extrabold leading-snug lg:text-xl">{v.sin}</p>
            </div>
            <div className="bg-emerald-600 px-4 py-4 text-white lg:px-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">Con el sensor</p>
              <p className="mt-0.5 text-base font-extrabold leading-snug lg:text-xl">{v.con}</p>
            </div>
          </div>

          {/* Una fila por concepto */}
          <ul className="divide-y divide-gray-100">
            {v.filas.map((f) => (
              <li key={f.concepto} className="grid grid-cols-2 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <p className="col-span-2 bg-gray-50 px-4 pt-4 text-[11px] font-bold uppercase tracking-widest text-tertiary lg:col-span-1 lg:flex lg:items-center lg:px-6 lg:py-5">
                  {f.concepto}
                </p>
                <p className="flex gap-2.5 bg-red-50/60 px-4 py-3 text-sm leading-snug text-primary lg:px-6 lg:py-5 lg:text-base">
                  <Marca bien={false} />
                  {f.sin}
                </p>
                <p className="flex gap-2.5 bg-emerald-50/60 px-4 py-3 text-sm leading-snug text-primary lg:px-6 lg:py-5 lg:text-base">
                  <Marca bien />
                  {f.con}
                </p>
              </li>
            ))}
          </ul>

          <p className="bg-primary px-6 py-5 text-center text-base font-extrabold text-white lg:text-lg">{v.cierre}</p>
        </div>
      </div>
    </section>
  );
}
