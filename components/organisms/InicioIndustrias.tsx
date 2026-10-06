import Link from "next/link";
import datos from "@/data/industrias.json";
import { getIndustria } from "@/lib/industrias";

/**
 * InicioIndustrias
 * Las industrias que atiende DIAPSA, en la portada, en un apartado simple
 * (decisión de Emiliano, 2026-09-27, con Fracttal de referencia): título,
 * un párrafo y los nombres en pastillas. La lista vive en
 * data/industrias.json. Las que ya tienen landing (lib/industrias.ts) se
 * enlazan a /industrias/<slug>; las demás se muestran sin enlace.
 */

export default function InicioIndustrias() {
  return (
    <section id="industrias" className="w-full scroll-mt-24 bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Industrias</span>
        <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
          CONOCEMOS <span className="text-secondary">TU INDUSTRIA</span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-justify text-lg leading-relaxed text-tertiary sm:text-center">
          Cada giro tiene sus equipos críticos y sus modos de falla. Llevamos más de 20 años midiéndolos en plantas de estas industrias, con los equipos en operación.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {datos.industrias.map(({ nombre, slug }) =>
            getIndustria(slug) ? (
              <li key={slug}>
                <Link prefetch={false}
                  href={`/industrias/${slug}`}
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-base font-bold text-white ring-1 ring-primary transition-colors hover:bg-secondary hover:text-primary"
                >
                  {nombre}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ) : (
              <li key={slug} className="rounded-sm bg-primary/5 px-5 py-3 text-base font-bold text-primary ring-1 ring-primary/10">
                {nombre}
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  );
}
