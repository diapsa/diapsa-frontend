import Image from "next/image";
import Link from "next/link";
import diplomado from "@/data/diplomado.json";

/**
 * InicioDiplomado
 * El diplomado en la portada, con la identidad de su brochure.
 *
 * Por qué así (2026-09-27): la franja anterior usaba el azul marino de
 * DIAPSA y se confundía con el resto de la página; el brochure del
 * diplomado tiene su propio azul rey eléctrico y letra gruesa, y así debe
 * reconocerse. Además el argumento fuerte es el claustro: once
 * especialistas de varios países, así que los países van a la vista.
 * Los datos salen de data/diplomado.json, el mismo que usa su página.
 */

// Azules del brochure: del marino profundo al azul rey eléctrico.
const FONDO = "linear-gradient(120deg, #001f5f 0%, #032a6d 38%, #04358f 70%, #1a4fd8 100%)";
const AZUL_CLARO = "#5b8cff";

type Ponente = { nombre: string; pais?: string };

// Países del claustro, sin repetir ("Italia / Cuba" cuenta los dos).
const PAISES = [
  ...new Set(
    (diplomado.ponentes as Ponente[])
      .flatMap((p) => (p.pais ?? "").split("/"))
      .map((p) => p.trim())
      .filter(Boolean),
  ),
];

const DATOS = diplomado.datos as { v: string; t: string }[];
const ESPECIALISTAS = DATOS.find((d) => d.t.startsWith("especialista"))?.v ?? String(diplomado.ponentes.length);

export default function InicioDiplomado() {
  return (
    <section className="w-full bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-sm shadow-2xl" style={{ background: FONDO }}>
          {/* La foto del grupo, velada con el azul del brochure */}
          <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
            <Image
              src="/images/cursos/confiabilidad/confiabilidad-03.webp"
              alt="Sesión del diplomado en confiabilidad operativa"
              fill
              sizes="50vw"
              className="object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#032a6d] via-[#032a6d]/60 to-transparent" />
          </div>
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#1a4fd8]/40 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-10 p-7 sm:p-10 lg:grid-cols-[3fr_2fr] lg:p-14">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest ring-1 ring-white/20">
                <span className="h-2 w-2 rounded-full" style={{ background: AZUL_CLARO }} aria-hidden="true" />
                Programa insignia
              </span>
              <p className="mt-5 text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">DIPLOMADO</p>
              <h2 className="mt-3 text-xl font-extrabold uppercase leading-tight tracking-wide sm:text-2xl">
                {diplomado.corto}
              </h2>

              {/* El claustro internacional */}
              <div className="mt-7 rounded-sm bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-5xl font-black leading-none" style={{ color: AZUL_CLARO }}>
                    {ESPECIALISTAS}
                  </span>
                  <span className="text-lg font-extrabold leading-tight">
                    especialistas internacionales de {PAISES.length} países
                  </span>
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {PAISES.map((p) => (
                    <li key={p} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#001f5f]">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/cursos/diplomado-confiabilidad-operativa"
                  className="inline-flex items-center gap-2 rounded-xs bg-white px-6 py-3 font-bold text-[#001f5f] transition-colors hover:bg-[#dbe6ff]"
                >
                  Conocer el diplomado
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/cursos/diplomado-confiabilidad-operativa#brochure"
                  className="inline-flex items-center gap-2 rounded-xs border border-white/50 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
                >
                  Descargar el brochure
                </Link>
              </div>
            </div>

            {/* Los datos del programa */}
            <div className="flex flex-col justify-center gap-3 text-white">
              <dl className="grid grid-cols-2 gap-3">
                {DATOS.map((d) => (
                  <div key={d.v + d.t} className="flex flex-col-reverse rounded-sm bg-[#001f5f]/70 p-4 ring-1 ring-white/10">
                    <dt className="mt-1 text-xs uppercase tracking-wider text-white/70">{d.t}</dt>
                    <dd className="text-2xl font-black leading-tight lg:text-3xl">{d.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="rounded-sm bg-[#001f5f]/70 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-wider text-white/70">Acredita DIAPSA, con el respaldo de</p>
                <p className="mt-1 text-justify text-sm font-bold leading-snug">{(diplomado.respaldo as string[]).join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
