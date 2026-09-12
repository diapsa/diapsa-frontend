import Antetitulo from "../atoms/Antetitulo";
import type { ServiceFichaCompras } from "@/types/servicio";

/**
 * FichaCompras
 * Lo que pregunta el área de compras antes de mandar a cotizar.
 *
 * Por qué existe: en planta grande los papeles son eliminatorios. Si un
 * comprador no encuentra REPSE, IMSS, seguro de responsabilidad civil y la
 * capacitación del personal que va a entrar, no llega ni a pedir precio. La
 * página no mencionaba ninguno, así que se estaban perdiendo oportunidades sin
 * enterarse. Lo mismo con los tiempos comprometidos, la unidad de cobro y la
 * cobertura: son las cuatro preguntas que decide un comprador, no un ingeniero.
 *
 * Todo vive en el JSON del servicio. Los datos aquí son de la empresa, no del
 * servicio, así que conviene mantenerlos idénticos entre disciplinas.
 */

type Props = {
  ficha: ServiceFichaCompras;
  paso?: string;
};

const ICONOS: Record<string, string> = {
  documentacion:
    "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
  tiempos: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  cotizacion:
    "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  cobertura:
    "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
};

export default function FichaCompras({ ficha, paso }: Props) {
  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>Cómo contratar</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {ficha.titulo}
          </h2>
          {ficha.subtitulo && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">
              {ficha.subtitulo}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ficha.bloques.map((bloque) => (
            <div
              key={bloque.titulo}
              className="rounded-sm border border-gray-200 bg-white p-6 transition-transform duration-300 motion-safe:hover:-translate-y-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary">
                <svg
                  className="h-5 w-5 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={ICONOS[bloque.icono] ?? ICONOS.documentacion}
                  />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-bold leading-snug text-primary">{bloque.titulo}</h3>
              <ul className="mt-3 space-y-2">
                {bloque.puntos.map((punto) => (
                  <li key={punto} className="flex items-start gap-2.5 text-sm leading-relaxed text-tertiary">
                    <svg
                      className="mt-1 h-4 w-4 shrink-0 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{punto}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {ficha.nota && (
          <p className="mt-8 max-w-3xl text-justify text-sm leading-relaxed text-tertiary">
            {ficha.nota}
          </p>
        )}
      </div>
    </section>
  );
}
