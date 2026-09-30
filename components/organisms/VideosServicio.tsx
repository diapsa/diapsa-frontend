import Antetitulo from "../atoms/Antetitulo";
import VideoBucle from "../atoms/VideoBucle";
import type { GrupoVideos } from "@/types/servicio";

/**
 * VideosServicio
 * Bloques en zigzag con un video en bucle y un texto corto, como en
 * /servicios/idap y en las páginas de producto de Fracttal: el video manda
 * y el texto acompaña. Los videos se hacen en Remotion (proyecto
 * diapsa-videos) y viven en public/videos/<servicio>/.
 *
 * Sustituye en la página al flujo del servicio o a la cobertura según
 * `lugar` (lo decide la plantilla). Debajo pueden ir listas cortas en
 * fichas, para no perder los nombres de equipos y fallas.
 */

type Props = {
  grupo: GrupoVideos;
  paso?: string;
};

export default function VideosServicio({ grupo, paso }: Props) {
  return (
    <section className={`w-full overflow-hidden py-12 lg:py-20 ${grupo.fondo === "gris" ? "bg-gray-50" : "bg-white"}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
          <Antetitulo paso={paso}>{grupo.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight text-primary lg:text-3xl">{grupo.titulo}</h2>
          {grupo.texto && <p className="mt-3 text-justify text-base leading-relaxed text-tertiary sm:text-center">{grupo.texto}</p>}
        </div>

        <div className="space-y-16 lg:space-y-24">
          {grupo.bloques.map((b, i) => {
            const invertir = i % 2 === 1;
            return (
              <div
                key={b.video}
                className={`grid grid-cols-1 items-center gap-8 lg:gap-14 ${
                  invertir ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)]" : "lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
                }`}
              >
                <div className={invertir ? "lg:order-2" : ""}>
                  <div className="overflow-hidden rounded-2xl bg-[#0b0f19] p-2 shadow-[0_30px_70px_-30px_rgba(10,20,46,0.6)] sm:p-3">
                    <VideoBucle
                      className="block aspect-[16/10] w-full rounded-xl object-cover"
                      src={`${b.video}.mp4`}
                      poster={`${b.video}.jpg`}
                      descripcion={b.descripcion}
                    />
                  </div>
                </div>
                <div className={invertir ? "lg:order-1" : ""}>
                  <h3 className="text-xl font-extrabold leading-tight text-primary lg:text-2xl">{b.titulo}</h3>
                  <p className="mt-3 text-justify text-base leading-relaxed text-tertiary">{b.texto}</p>
                  {b.pasos && (
                    <ol className="mt-5 space-y-2">
                      {b.pasos.map((p, k) => (
                        <li key={p} className="flex items-center gap-3 text-sm font-semibold text-primary">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-extrabold text-primary">
                            {k + 1}
                          </span>
                          {p}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {grupo.listas && (
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-2">
            {grupo.listas.map((l) => (
              <div key={l.titulo}>
                <p className="text-center text-xs font-bold uppercase tracking-widest text-secondary">{l.titulo}</p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {l.items.map((it) => (
                    <li key={it} className="rounded-full bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/10">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
