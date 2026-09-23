import Image from "next/image";
import Antetitulo from "../atoms/Antetitulo";
import { nivel } from "@/lib/semaforo";
import type { ServiceHojaIntegral } from "@/types/servicio";

/**
 * HojaIntegral
 * La ficha de una máquina en el informe integral, contada en cuatro pasos
 * que se leen de arriba abajo: cómo está, qué vio cada técnica, qué se
 * encontró y qué hacer.
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

function Paso({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-tertiary">
      <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-[11px] text-secondary" aria-hidden="true">
        {n}
      </span>
      {children}
    </p>
  );
}

export default function HojaIntegral({ hoja, paso }: Props) {
  const estadoActual = hoja.estado[0];
  const c = nivel(estadoActual?.clave ?? "bueno");

  return (
    <section className="w-full bg-gray-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{hoja.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{hoja.titulo}</h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{hoja.texto}</p>
        </div>

        <article className="overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10">
          {/* 1. Cómo está: la foto con el estado encima y tres cifras */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]">
              <Image src={hoja.equipo.foto} alt={hoja.equipo.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-primary/0 p-5 pt-16 lg:p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Informe integral · ficha de la máquina</p>
                <p className="mt-1 text-xl font-extrabold leading-tight text-white lg:text-2xl">{hoja.equipo.nombre}</p>
                <p className="mt-1 text-xs text-white/70">{hoja.equipo.datos.map((d) => d.v).join(" · ")}</p>
              </div>
              {estadoActual && (
                <span
                  className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg ${c.chip}`}
                >
                  {estadoActual.v}
                </span>
              )}
            </div>

            <div className="flex flex-col justify-center p-5 lg:p-8">
              <Paso n={1}>Cómo está</Paso>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {hoja.estado.map((e) => {
                  const n = nivel(e.clave);
                  return (
                    <div key={e.k} className={`rounded-sm border-t-4 bg-gray-50 p-3 lg:p-4 ${n.lampara.fondo.replace("bg-", "border-")}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-tertiary">{e.k}</p>
                      <p className={`mt-1.5 text-base font-extrabold leading-tight lg:text-lg ${n.lampara.texto}`}>{e.v}</p>
                    </div>
                  );
                })}
              </div>
              {hoja.riesgoGlobal && (
                <p className="mt-4 text-justify text-sm leading-relaxed text-tertiary">
                  La máquina sigue operando, pero ya tiene una falla identificada y con fecha para atenderla. El riesgo global de sus fallas es{" "}
                  <span className={`font-bold ${nivel(hoja.riesgoGlobal.clave).lampara.texto}`}>{hoja.riesgoGlobal.texto.toLowerCase()}</span>.
                </p>
              )}
            </div>
          </div>

          {/* 2. Qué vio cada técnica */}
          <div className="border-t border-gray-200 px-5 py-6 lg:px-8">
            <Paso n={2}>Qué vio cada técnica</Paso>
            <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {hoja.disciplinas.map((d) => {
                const n = nivel(d.clave);
                const trazo = ICONO[clave(d.nombre)];
                return (
                  <li key={d.nombre} className="rounded-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${n.chip}`} aria-hidden="true">
                        {trazo && (
                          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                            <path d={trazo} />
                          </svg>
                        )}
                      </span>
                      <Chip clave={d.clave} texto={d.estado} />
                    </div>
                    <p className="mt-3 text-sm font-extrabold text-primary">{d.nombre}</p>
                    {d.nota && <p className="mt-1 text-xs leading-relaxed text-tertiary">{d.nota}</p>}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. Qué se encontró */}
          <div className="border-t border-gray-200 px-5 py-6 lg:px-8">
            <Paso n={3}>Qué se encontró</Paso>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hoja.hallazgos.map((h) => (
                <li key={h.texto} className={`rounded-sm border-l-4 bg-gray-50 p-4 ${nivel(h.clave).lampara.fondo.replace("bg-", "border-")}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip clave={h.clave} texto={h.estado} />
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-tertiary ring-1 ring-black/10">
                      {h.evolucion}
                    </span>
                  </div>
                  <p className="mt-2.5 text-base font-extrabold leading-snug text-primary">{h.texto}</p>
                  {h.nota && <p className="mt-1 text-justify text-xs leading-relaxed text-tertiary">{h.nota}</p>}
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Qué hacer */}
          <div className="border-t border-gray-200 bg-primary px-5 py-6 lg:px-8">
            <Paso n={4}>
              <span className="text-white/70">Qué hacer</span>
            </Paso>
            <ol className="mt-3 space-y-2">
              {hoja.recomendaciones.map((r, i) => (
                <li key={r} className="flex gap-3 text-base leading-relaxed text-white lg:text-lg">
                  <span className="mt-0.5 w-5 shrink-0 font-extrabold text-secondary" aria-hidden="true">
                    {i + 1}.
                  </span>
                  <span className="text-justify font-semibold">{r}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-justify text-xs leading-relaxed text-tertiary lg:px-8">{hoja.nota}</p>
        </article>
      </div>
    </section>
  );
}
