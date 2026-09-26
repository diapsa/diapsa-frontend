import Image from "next/image";
import Antetitulo from "../atoms/Antetitulo";
import { nivel } from "@/lib/semaforo";
import type { ServiceHojaIntegral } from "@/types/servicio";

/**
 * HojaIntegral
 * La ficha de una máquina en el informe integral, en una sola tarjeta: la
 * máquina con su estado, qué vio cada técnica, el diagnóstico que sale de
 * cruzarlas y qué hacer.
 *
 * Por qué así. La primera versión reproducía la hoja del PDF de IDAP con
 * sus tablas de lecturas; era fiel y era demasiado. La segunda la recortó
 * pero seguía pareciendo un documento: recuadros grises, una tabla, texto
 * chico. Quien entra a contratar no quiere leer un informe, quiere entender
 * en un vistazo qué le va a decir la ficha de una máquina. Así que la
 * información es la misma y la forma cambia: la foto grande con el estado
 * encima, tres cifras de condición, las cuatro técnicas como tarjetas con
 * su ícono y una línea de lo que vio cada una, los hallazgos como tarjetas
 * y la acción como cierre destacado.
 *
 * La tercera versión quita los pasos numerados, las tres cifras de
 * condición y las tarjetas de hallazgos: repetían lo mismo con otras
 * palabras. Queda un diagnóstico de dos líneas y la acción con su prioridad.
 *
 * Datos reales de una hoja de agosto de 2026, con la planta y la clave del
 * equipo omitidas. `bloques` (las lecturas por disciplina) queda en el
 * tipo por si algún día se quiere la versión larga; aquí no se pinta.
 */

type Props = {
  hoja: ServiceHojaIntegral;
  paso?: string;
};

/** Íconos por disciplina, los mismos trazos de la escena 360. */
const ICONO: Record<string, string> = {
  termografia: "M6.5 9.4V3a1.5 1.5 0 0 1 3 0v6.4a2.6 2.6 0 1 1-3 0zM8 7v3.5",
  vibraciones: "M1.5 8h2l1.5-5 2 10 2-8 1.5 5 1-2h3",
  ultrasonido: "M7 5.2a4 4 0 0 1 0 5.6M9.8 3a7.3 7.3 0 0 1 0 10M4 8h.01",
  aceite: "M8 1.8c2.6 3.3 4.2 5.7 4.2 8A4.2 4.2 0 0 1 3.8 9.8c0-2.3 1.6-4.7 4.2-8z",
};

function clave(nombre: string) {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function Chip({ clave: k, texto, grande }: { clave: string; texto: string; grande?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full font-bold uppercase tracking-wider ${nivel(k).chip} ${
        grande ? "px-3.5 py-1 text-xs" : "px-2.5 py-0.5 text-[10px]"
      }`}
    >
      {texto}
    </span>
  );
}

export default function HojaIntegral({ hoja, paso }: Props) {
  const estadoActual = hoja.estado[0];
  const c = nivel(estadoActual?.clave ?? "bueno");
  const prioridad = hoja.estado.find((e) => /prioridad/i.test(e.k));

  return (
    <section className="w-full bg-gray-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{hoja.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{hoja.titulo}</h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{hoja.texto}</p>
        </div>

        <article className="overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {/* La máquina: foto con su estado y su nombre */}
            <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[24rem]">
              <Image src={hoja.equipo.foto} alt={hoja.equipo.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-primary/0 p-5 pt-16 lg:p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Ficha de la máquina</p>
                <p className="mt-1 text-xl font-extrabold leading-tight text-white lg:text-2xl">{hoja.equipo.nombre}</p>
                <p className="mt-1 text-xs text-white/70">{hoja.equipo.datos.map((d) => d.v).join(" · ")}</p>
              </div>
              {estadoActual && (
                <span className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg ${c.chip}`}>
                  {estadoActual.v}
                </span>
              )}
            </div>

            {/* Qué vio cada técnica y el diagnóstico que sale de cruzarlas */}
            <div className="flex flex-col gap-5 p-5 lg:p-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Qué vio cada técnica</p>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {hoja.disciplinas.map((d) => {
                  const n = nivel(d.clave);
                  const trazo = ICONO[clave(d.nombre)];
                  return (
                    <li key={d.nombre} className="flex gap-3 rounded-sm border border-gray-200 p-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.chip}`} aria-hidden="true">
                        {trazo && (
                          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                            <path d={trazo} />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="text-sm font-extrabold text-primary">{d.nombre}</p>
                          <Chip clave={d.clave} texto={d.estado} />
                        </div>
                        {d.nota && <p className="mt-1 text-xs leading-snug text-tertiary">{d.nota}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {hoja.diagnostico && (
                <div className={`rounded-sm border-l-4 bg-gray-50 p-4 ${c.lampara.fondo.replace("bg-", "border-")}`}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Diagnóstico</p>
                  <p className="mt-1.5 text-justify text-base font-bold leading-snug text-primary lg:text-lg">{hoja.diagnostico}</p>
                </div>
              )}
            </div>
          </div>

          {/* Qué hacer, como cierre */}
          <div className="flex flex-col gap-3 bg-primary px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8 lg:py-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Qué hacer</p>
              {hoja.recomendaciones.map((r) => (
                <p key={r} className="mt-1 text-justify text-base font-semibold leading-relaxed text-white lg:text-lg">{r}</p>
              ))}
            </div>
            {prioridad && (
              <span className="shrink-0 self-start rounded-full bg-secondary px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary sm:self-center">
                {prioridad.k.replace(/ de reparación/i, "")}: {prioridad.v}
              </span>
            )}
          </div>

          <p className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-justify text-xs leading-relaxed text-tertiary lg:px-8">{hoja.nota}</p>
        </article>
      </div>
    </section>
  );
}
