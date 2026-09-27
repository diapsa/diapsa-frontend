import Link from "next/link";
import EscenaDolor from "@/components/organisms/EscenaDolor";

/**
 * Hero
 * La primera pantalla de la portada: una promesa, una frase de apoyo, dos
 * botones y la escena 3D de la planta.
 *
 * Por qué dejó de ser carrusel (plan-home-2026-09.md): las cuatro
 * diapositivas rotaban solas, el visitante casi nunca veía más de la
 * primera y las otras tres cargaban afirmaciones que no se sostenían. Una
 * sola pantalla fija dice a qué se dedica DIAPSA y qué hacer a continuación.
 *
 * La escena es la misma de "¿Te suena familiar?" en monitoreo de condición,
 * en su historia de capacidad y arrancando en el cierre: el analista de
 * DIAPSA recorre la planta, cada equipo toma su semáforo y los hallazgos
 * quedan en IDAP. Es exactamente lo que vendemos, sin escena nueva. Sin
 * imagen de fondo: menos peso en la primera pintura.
 */

// Segundo de la historia "con" en que entra el analista.
const INICIO_CIERRE = 12.5;

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-primary">
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-14 pt-28 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[5fr_6fr] lg:gap-12 lg:py-24">
        <div className="flex flex-col">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-secondary lg:text-sm">
            Más de 20 años · Especialistas Categoría 3
          </p>
          <h1 className="mb-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            SABEMOS CÓMO ESTÁ CADA EQUIPO DE TU PLANTA{" "}
            <span className="text-secondary">ANTES DE QUE FALLE</span>
          </h1>
          <p className="mb-8 max-w-xl text-justify text-base leading-relaxed text-white/80 lg:text-lg">
            Medimos vibraciones, temperatura, ultrasonido, aceite y energía con tus equipos en operación, y te decimos qué intervenir, cuándo y por qué. Tú decides con datos; nosotros ponemos la gente, los equipos y la plataforma.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-xs bg-secondary px-7 py-3 font-bold text-primary shadow-md transition-colors hover:bg-white"
            >
              Hablar con un especialista
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 rounded-xs border border-white/40 px-7 py-3 font-bold text-white transition-colors hover:border-secondary hover:text-secondary"
            >
              Ver servicios
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/55">
            Sin detener la producción para medir. Hallazgos e historial en IDAP, nuestra plataforma.
          </p>
        </div>

        <div className="w-full">
          <EscenaDolor modo="con" inicio={INICIO_CIERRE} />
        </div>
      </div>
    </section>
  );
}
