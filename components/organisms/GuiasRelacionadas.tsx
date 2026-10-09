import Image from "next/image";
import Link from "next/link";
import type { ArticuloRelacionado } from "@/lib/recursos";

/**
 * GuiasRelacionadas
 * Los artículos del blog sobre la técnica de la página. Ahí vive lo
 * educativo que la página de servicio ya no carga. Con una sola guía se
 * muestra como tarjeta; con varias, reunidas en una sección con su portada
 * (Emiliano, 2026-09-29: "todos los artículos de ultrasonido compilados").
 */

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function GuiasRelacionadas({ articulos: todas }: { articulos: ArticuloRelacionado[] }) {
  if (todas.length === 0) return null;
  // Tres guías en un renglón (Emiliano, 2026-10-09: con cinco o más la
  // sección se alargaba); las demás se encuentran en el blog y desde cada guía.
  const articulos = todas.slice(0, 3);

  if (articulos.length === 1) {
    const a = articulos[0];
    return (
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-sm border-l-4 border-secondary bg-white p-6 shadow-sm lg:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Para entender la técnica a fondo</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">{a.titulo}</h2>
            <p className="mt-3 text-justify text-base leading-relaxed text-tertiary lg:text-lg">{a.resumen}</p>
            <Link
              href={`/blog/${a.slug}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xs border-2 border-primary px-6 py-2.5 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            >
              Leer la guía <Flecha />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">Para entender la técnica a fondo</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight text-primary lg:text-3xl">Guías para tu equipo</h2>
        </div>
        <ul className={`grid grid-cols-1 gap-6 ${articulos.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : articulos.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {articulos.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-primary/10 transition-shadow hover:shadow-lg"
              >
                {a.portada && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    <Image
                      src={a.portada}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-extrabold leading-snug text-primary">{a.titulo}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-tertiary">{a.resumen}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-secondary">
                    Leer la guía <Flecha />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
