import Image from "next/image";
import Link from "next/link";
import diplomado from "@/data/diplomado.json";

/**
 * InicioDiplomado
 * El cierre de la portada del lado de cursos: el diplomado en confiabilidad
 * como gancho (plan-home-2026-09.md, fase 5). Es el programa insignia y el
 * que tiene brochure descargable, así que una franja con foto real y dos
 * botones hace más que la rejilla de tarjetas del CMS que había antes.
 */

export default function InicioDiplomado() {
  return (
    <section className="w-full bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 overflow-hidden rounded-sm bg-primary shadow-xl lg:grid-cols-2">
          <div className="relative min-h-[16rem] lg:min-h-[22rem]">
            <Image
              src="/images/cursos/confiabilidad/confiabilidad-03.webp"
              alt="Sesión del diplomado en confiabilidad operativa de DIAPSA"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-secondary">Programa insignia</span>
            <h2 className="text-2xl font-extrabold text-white lg:text-3xl">
              DIPLOMADO EN <span className="text-secondary">CONFIABILIDAD OPERATIVA</span>
            </h2>
            <p className="mt-4 text-justify leading-relaxed text-white/80">{diplomado.resumen}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/cursos/diplomado-confiabilidad-operativa"
                className="inline-flex items-center gap-2 rounded-xs bg-secondary px-6 py-3 font-bold text-primary transition-colors hover:bg-white"
              >
                Conocer el diplomado
              </Link>
              <Link
                href="/cursos/diplomado-confiabilidad-operativa#brochure"
                className="inline-flex items-center gap-2 rounded-xs border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:border-secondary hover:text-secondary"
              >
                Descargar el brochure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
