import Antetitulo from "../atoms/Antetitulo";
import { nivel } from "@/lib/semaforo";
import type { ServiceTecnicas } from "@/types/servicio";

/**
 * TecnicasElectricas
 * Las técnicas que componen el programa eléctrico, una tarjeta por técnica,
 * cada una con lo que mide, en qué equipos, con qué frecuencia y un
 * hallazgo de ejemplo tal como saldría en el reporte.
 *
 * Por qué existe. Pruebas eléctricas especializadas no es una técnica sino
 * un catálogo de pruebas al equipo desenergizado, agrupadas por el equipo
 * que se prueba: transformadores, interruptores y tableros, cables y
 * máquinas rotativas. Un jefe de mantenimiento eléctrico las reconoce por
 * nombre (índice de polarización, TTR, microóhmetro, hipot, surge), así que
 * la tarjeta las lista tal cual, y debajo enseña cómo se ve el hallazgo.
 * La misma tarjeta sirve para un programa de técnicas en operación; cada
 * una enlaza a la página de su disciplina cuando la hay.
 *
 * El hallazgo de ejemplo es simulado y así se declara en el pie: enseña la
 * forma del renglón que recibe el cliente (equipo, lectura, severidad y
 * acción), no un caso real. Cuando haya reportes reales se sustituye desde
 * el JSON sin tocar el componente.
 */

type Props = {
  tecnicas: ServiceTecnicas;
  paso?: string;
};

export default function TecnicasElectricas({ tecnicas, paso }: Props) {
  return (
    <section className="w-full bg-gray-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{tecnicas.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {tecnicas.titulo}
          </h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{tecnicas.texto}</p>
        </div>

        <ol
          className={`grid grid-cols-1 gap-6 lg:gap-8 ${
            tecnicas.items.length === 4 ? "sm:grid-cols-2" : "lg:grid-cols-3"
          }`}
        >
          {tecnicas.items.map((t, i) => {
            const c = nivel(t.ejemplo.clave);
            return (
              <li key={t.nombre} className="flex flex-col rounded-sm bg-white ring-1 ring-black/5">
                <div className="border-b border-gray-100 p-5 lg:p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary text-sm font-extrabold text-secondary"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-extrabold leading-snug text-primary">{t.nombre}</h3>
                  </div>
                  <p className="mt-3 text-justify text-sm leading-relaxed text-tertiary">{t.texto}</p>
                </div>

                <div className="flex-1 space-y-4 p-5 lg:p-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">En qué equipos</p>
                    <p className="mt-1 text-sm leading-relaxed text-primary">{t.equipos}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Qué mide</p>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {t.mide.map((m) => (
                        <li
                          key={m}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-primary"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Un renglón del reporte, tal como llega */}
                  <div className="rounded-sm border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{t.ejemplo.etiqueta}</p>
                        <p className="mt-0.5 text-sm font-bold leading-snug text-primary">{t.ejemplo.equipo}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${c.chip}`}
                      >
                        {t.ejemplo.estado}
                      </span>
                    </div>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                      {t.ejemplo.lineas.map((l) => (
                        <div key={l.k} className="contents">
                          <dt className="text-tertiary">{l.k}</dt>
                          <dd className="font-semibold tabular-nums text-primary">{l.v}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 text-justify text-xs leading-relaxed text-primary">
                      <span className="mr-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary">Acción</span>
                      {t.ejemplo.accion}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 p-5 text-xs lg:p-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Frecuencia</p>
                    <p className="mt-0.5 font-semibold text-primary">{t.frecuencia}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Entregable</p>
                    <p className="mt-0.5 font-semibold text-primary">{t.entregable}</p>
                  </div>
                  {t.enlace && (
                    <a
                      href={t.enlace.href}
                      className="col-span-2 mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline"
                    >
                      {t.enlace.texto}
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 max-w-3xl text-justify text-xs leading-relaxed text-tertiary/70">{tecnicas.nota}</p>
      </div>
    </section>
  );
}
