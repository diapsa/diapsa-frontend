import Antetitulo from "../atoms/Antetitulo";
import type { ServiceTecnicas } from "@/types/servicio";

/**
 * TecnicasElectricas
 * Qué se mide en el servicio eléctrico: lo que se registra con la planta
 * operando, en una tarjeta grande, y las pruebas por equipo que se hacen en
 * el paro, en tarjetas chicas.
 *
 * Por qué es así de corta. La primera versión llevaba en cada tarjeta los
 * equipos, las pruebas, un hallazgo de ejemplo, la frecuencia y el
 * entregable: cinco tarjetas de ese tamaño eran una pared de texto. Quien
 * llega quiere saber si lo que necesita está aquí, y para eso basta el
 * nombre, una línea y la lista de lo que se mide. El hallazgo de ejemplo ya
 * vive en "Qué recibes".
 *
 * Las técnicas con `enOperacion` van arriba, a lo ancho y sobre fondo azul
 * marino; el resto va en una fila de tarjetas.
 */

type Props = {
  tecnicas: ServiceTecnicas;
  paso?: string;
};

function Chips({ items, oscuro }: { items: string[]; oscuro?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((m) => (
        <li
          key={m}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            oscuro ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-gray-100 text-primary"
          }`}
        >
          {m}
        </li>
      ))}
    </ul>
  );
}

export default function TecnicasElectricas({ tecnicas, paso }: Props) {
  const enOperacion = tecnicas.items.filter((t) => t.enOperacion);
  const enParo = tecnicas.items.filter((t) => !t.enOperacion);

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

        {/* Con la planta operando */}
        {enOperacion.map((t) => (
          <div
            key={t.nombre}
            className="mb-6 grid grid-cols-1 gap-6 rounded-sm bg-primary p-6 text-white lg:mb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12 lg:p-10"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Con la planta operando</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-snug lg:text-3xl">{t.nombre}</h3>
              <p className="mt-2 text-justify text-base leading-relaxed text-white/75">{t.texto}</p>
            </div>
            <Chips items={t.mide} oscuro />
          </div>
        ))}

        {/* En el paro */}
        {enParo.length > 0 && (
          <>
            {enOperacion.length > 0 && (
              <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-tertiary">En el paro programado</p>
            )}
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {enParo.map((t) => (
                <li key={t.nombre} className="flex flex-col rounded-sm bg-white p-5 ring-1 ring-black/5 lg:p-6">
                  <h3 className="text-lg font-extrabold leading-snug text-primary">{t.nombre}</h3>
                  <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">{t.resumen ?? t.texto}</p>
                  <div className="mt-4">
                    <Chips items={t.mide.slice(0, 4)} />
                  </div>
                  {t.enlace && (
                    <a href={t.enlace.href} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-secondary hover:underline">
                      {t.enlace.texto}
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
