import Image from "next/image";
import Link from "next/link";

/**
 * QuienesSomos
 * La presentación de DIAPSA en la portada, en una sola franja: qué hacemos
 * y desde cuándo, con una foto real y el camino a "Acerca de".
 *
 * Solo lo que se sostiene (decisión de Emiliano, 2026-09-27): más de veinte
 * años, especialistas Categoría 3, base en Saltillo y trabajo en México y
 * Sudamérica. Sin misión ni cifras de fallas.
 */

const DATOS = [
  { valor: "+20", texto: "años midiendo equipos industriales" },
  { valor: "Cat. 3", texto: "especialistas certificados en cada técnica" },
  { valor: "Saltillo", texto: "base de operaciones, con servicio en todo México y Sudamérica" },
];

export default function QuienesSomos() {
  return (
    <section className="w-full bg-white py-14 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5">
          <Image
            src="/images/gallery/campo/acustica-casco-diapsa.webp"
            alt="Analista de DIAPSA con casco en planta durante una inspección"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Quiénes somos</span>
          <h2 className="mb-5 text-3xl font-extrabold text-primary lg:text-4xl">
            DIAGNÓSTICO Y ASESORÍA <span className="text-secondary">PREDICTIVA</span>
          </h2>
          <p className="text-justify text-lg leading-relaxed text-tertiary">
            Somos un despacho de ingeniería dedicado al monitoreo de condición. Medimos la maquinaria y los sistemas eléctricos de plantas industriales con sus equipos en operación, encontramos las fallas antes de que paren la producción y formamos a la gente que después lo hará por su cuenta.
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {DATOS.map((d) => (
              <div key={d.valor} className="border-l-2 border-secondary pl-4">
                <dt className="text-2xl font-extrabold text-primary">{d.valor}</dt>
                <dd className="mt-1 text-justify text-sm leading-snug text-tertiary">{d.texto}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/acerca-de"
            className="mt-8 inline-flex items-center gap-2 rounded-xs bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-secondary hover:text-primary"
          >
            Conocer a DIAPSA
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
