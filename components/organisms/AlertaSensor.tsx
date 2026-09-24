import { nivel } from "@/lib/semaforo";
import type { AlertaSensor as Alerta } from "@/types/servicio";

/**
 * AlertaSensor
 * La alerta tal como llega al teléfono: equipo, estado, qué es, qué hacer y
 * quién la revisó, con la tendencia que la disparó.
 *
 * Por qué sustituye a la hoja del reporte en sensores. La hoja real traía la
 * tabla de amplificación por punto y canal, que es correcta y es trabajo de
 * analista; a quien contrata le basta ver que la alerta llega ya
 * interpretada. El contenido es el del reporte real de la línea de succión,
 * reducido a lo que se lee en una pantalla de teléfono.
 *
 * Todo en HTML para que en teléfono los textos conserven su tamaño.
 */

type Props = { alerta: Alerta };

export default function AlertaSensor({ alerta: a }: Props) {
  const color = nivel(a.estado.clave);
  const tope = Math.max(...a.tendencia);
  const iAlerta = a.tendencia.length - 1;

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Resplandor de fondo */}
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-secondary/10 blur-2xl" aria-hidden="true" />

      <div className="rounded-[2.5rem] bg-primary p-3 shadow-2xl ring-1 ring-black/20">
        <div className="overflow-hidden rounded-[2rem] bg-gray-50">
          {/* Barra de estado */}
          <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-primary">
            <span>{a.hora}</span>
            <span className="h-5 w-20 rounded-full bg-primary" aria-hidden="true" />
            <span aria-hidden="true">●●●</span>
          </div>

          <div className="space-y-3 p-4 pt-5">
            {/* Notificación */}
            <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-tertiary">{a.origen}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase ${color.chip}`}>
                  {a.estado.etiqueta}
                </span>
              </div>
              <p className="mt-2 text-lg font-extrabold leading-snug text-primary">{a.equipo}</p>

              {/* Tendencia que disparó la alerta */}
              <div className="mt-3 flex h-14 items-end gap-[3px]" aria-hidden="true">
                {a.tendencia.map((v, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-t-sm ${i === iAlerta ? "bg-red-500" : i >= iAlerta - 2 ? "bg-amber-400" : "bg-primary/25"}`}
                    style={{ height: `${(v / tope) * 100}%` }}
                  />
                ))}
              </div>

              <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Qué es</p>
              <p className="mt-1 text-justify text-sm leading-relaxed text-primary">{a.que}</p>

              <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Qué hacer</p>
              <ol className="mt-1.5 space-y-1.5">
                {a.acciones.map((acc, i) => (
                  <li key={acc} className="flex gap-2 text-sm leading-snug text-primary">
                    <span className="font-extrabold text-secondary">{i + 1}.</span>
                    <span>{acc}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Quién la revisó */}
            <div className="flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-extrabold text-primary" aria-hidden="true">
                III
              </span>
              <p className="text-xs font-semibold leading-snug">{a.firma}</p>
            </div>
          </div>
        </div>
      </div>

      {a.nota && <p className="mt-5 text-justify text-xs leading-relaxed text-tertiary/80">{a.nota}</p>}
    </div>
  );
}
