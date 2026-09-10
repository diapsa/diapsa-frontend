import type { ServiceEscala } from "@/types/servicio";

/**
 * EscalaSeveridad
 * Los rangos con los que se decide si un equipo está bien, en precaución o en
 * alarma, dibujados como barra de color.
 *
 * Por qué existe: la pregunta que un jefe de mantenimiento se hace al ver una
 * lectura es "¿y eso es mucho?". La página explicaba qué se mide y qué falla se
 * detecta, pero nunca a partir de qué número hay que preocuparse. Publicar el
 * criterio es de las cosas que más confianza dan, porque enseña que hay una
 * norma detrás y no un juicio a ojo.
 *
 * Los valores salen de los informes reales de DIAPSA, no de una tabla genérica.
 * Viven en el JSON del servicio para que un especialista pueda corregirlos sin
 * tocar código.
 */

type Props = {
  escalas: ServiceEscala[];
  titulo: string;
  subtitulo?: string;
  nota?: string;
};

const COLORES: Record<string, { barra: string; punto: string; texto: string }> = {
  bueno: { barra: "bg-emerald-500", punto: "bg-emerald-500", texto: "text-emerald-700" },
  observacion: { barra: "bg-lime-500", punto: "bg-lime-500", texto: "text-lime-700" },
  precaucion: { barra: "bg-amber-400", punto: "bg-amber-400", texto: "text-amber-700" },
  alarma: { barra: "bg-red-600", punto: "bg-red-600", texto: "text-red-700" },
};

export default function EscalaSeveridad({ escalas, titulo, subtitulo, nota }: Props) {
  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            Criterio de severidad
          </p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {titulo}
          </h2>
          {subtitulo && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{subtitulo}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {escalas.map((escala) => {
            const total = escala.zonas.reduce((suma, z) => suma + z.peso, 0);
            return (
              <div key={escala.parametro}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-bold text-primary">{escala.parametro}</h3>
                  <span className="text-sm font-semibold text-tertiary">{escala.unidad}</span>
                </div>
                {escala.norma && (
                  <p className="mt-1 text-sm text-tertiary">{escala.norma}</p>
                )}

                {/* Barra de zonas */}
                <div className="mt-4 flex h-4 overflow-hidden rounded-full" role="presentation">
                  {escala.zonas.map((zona) => (
                    <div
                      key={zona.etiqueta}
                      className={COLORES[zona.clave]?.barra ?? "bg-gray-300"}
                      style={{ width: `${(zona.peso / total) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Leyenda */}
                <dl className="mt-5 space-y-3">
                  {escala.zonas.map((zona) => (
                    <div key={zona.etiqueta} className="flex items-center gap-3">
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${COLORES[zona.clave]?.punto ?? "bg-gray-300"}`}
                        aria-hidden="true"
                      />
                      <dt className={`w-32 shrink-0 text-sm font-bold ${COLORES[zona.clave]?.texto ?? "text-tertiary"}`}>
                        {zona.etiqueta}
                      </dt>
                      <dd className="font-semibold tabular-nums text-primary">{zona.rango}</dd>
                      {zona.accion && (
                        <dd className="ml-auto hidden text-right text-sm text-tertiary sm:block">
                          {zona.accion}
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>

        {nota && (
          <p className="mt-8 max-w-3xl text-justify text-sm leading-relaxed text-tertiary">{nota}</p>
        )}
      </div>
    </section>
  );
}
