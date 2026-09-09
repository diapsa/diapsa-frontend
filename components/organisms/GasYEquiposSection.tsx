import Image from "next/image";
import Link from "next/link";

/**
 * GasYEquiposSection
 *
 * Por qué existe: el menú ofrece cuatro puertas principales (Monitoreo, Cursos,
 * Detección de Gas y Equipos), pero la home solo contaba la historia de las dos
 * primeras. Quien entra por la portada nunca se enteraba de LDAR ni de las
 * cámaras, aunque Search Console muestra /servicios/deteccion-gas creciendo.
 */

const BLOQUES = [
  {
    titulo: "Detección de Gas y LDAR",
    gancho: "Ve la fuga antes que la multa",
    texto:
      "Cámaras acústicas y ópticas que revelan fugas de gas, arcos eléctricos y anomalías invisibles al ojo. Inspección OGI y programas LDAR para cumplimiento normativo.",
    puntos: ["Cámaras acústicas y OGI", "Programas LDAR", "Evidencia para la autoridad"],
    href: "/servicios/deteccion-gas",
    cta: "Ver detección de gas",
    imagen: "/images/deteccion-gas/camaras-acusticas-deteccion-gas.png",
    alt: "Cámara acústica detectando una fuga de gas en instalación industrial",
  },
  {
    titulo: "Equipos y Cámaras",
    gancho: "La herramienta, no solo el servicio",
    texto:
      "Cámaras termográficas HIKMIKRO, sensores de vibración y acelerómetros. Te asesoramos en la selección para que compres el equipo que tu planta realmente necesita.",
    puntos: ["Cámaras termográficas HIKMIKRO", "Sensores y acelerómetros", "Asesoría de selección"],
    href: "/productos",
    cta: "Ver equipos",
    imagen: "/images/header-camaras.png",
    alt: "Cámara termográfica industrial HIKMIKRO",
  },
];

export default function GasYEquiposSection() {
  return (
    <section className="w-full bg-primary py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-secondary text-xs font-semibold tracking-widest uppercase mb-4">
            También hacemos
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
            Detección de gas y <span className="text-secondary">equipos especializados</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {BLOQUES.map((b) => (
            <article
              key={b.href}
              className="group flex flex-col overflow-hidden rounded-sm border border-white/15 bg-white/5 transition-all duration-300 hover:border-secondary/50 hover:shadow-2xl"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={b.imagen}
                  alt={b.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-primary/40 transition-colors duration-300 group-hover:bg-primary/20" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-secondary text-sm font-semibold mb-1">{b.gancho}</p>
                <h3 className="text-xl font-bold text-white mb-3">{b.titulo}</h3>
                <p className="text-gray-200 text-sm leading-relaxed mb-4">{b.texto}</p>

                <ul className="mb-6 space-y-2">
                  {b.puntos.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>

                <Link
                  href={b.href}
                  className="mt-auto inline-flex items-center gap-2 self-start rounded-xs bg-secondary px-6 py-3 font-bold text-primary transition-all duration-300 hover:bg-white"
                >
                  {b.cta}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
