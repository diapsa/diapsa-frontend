import type { Metadata } from "next";
import Link from "next/link";
import dip from "@/data/diplomado.json";
import Antetitulo from "@/components/atoms/Antetitulo";
import DescargaBrochure from "@/components/organisms/DescargaBrochure";
import ContactForm from "@/components/organisms/ContactForm";
import CarruselFotos from "@/components/molecules/CarruselFotos";
import ClientesLogos from "@/components/organisms/ClientesLogos";
import MapaDiplomado from "@/components/organisms/MapaDiplomado";
import Bandera from "@/components/atoms/Bandera";
import VideoBucle from "@/components/atoms/VideoBucle";
import JsonLd, { createBreadcrumbSchema, createCourseSchema, createFaqSchema } from "@/components/atoms/JsonLd";
import { muestraFotos } from "@/lib/cursos";
import { AZUL_CLARO_DIPLOMADO, FONDO_DIPLOMADO, PIE_DIPLOMADO } from "@/lib/diplomado-estilo";
import { DATOS_DIPLOMADO, ESPECIALIDADES_CLAUSTRO, NUM_ESPECIALISTAS, NUM_PAISES, PAISES_DIPLOMADO, RESUMEN_DIPLOMADO } from "@/lib/diplomado";
import { FAQ_DIPLOMADO } from "@/lib/diplomado-faq";

/*
 * Toda la página con la identidad del brochure (Emiliano, 2026-09-28): el
 * degradado azul rey en las bandas oscuras, azul claro en los acentos sobre
 * oscuro y azul rey en los acentos sobre blanco. Nada de naranja.
 */
const AZUL_REY = "#04358f";

/**
 * Diplomado en Confiabilidad Operativa y Monitoreo de Condición.
 * El programa insignia de DIAPSA, con su propia página (no viene del CMS):
 * apertura con el brochure a cambio de los datos, para quién es, qué se
 * aprende, las cinco fases con su temario, los especialistas, lo que
 * incluye y la inscripción. El contenido vive en data/diplomado.json.
 */

const URL = `/cursos/${dip.slug}`;

export const metadata: Metadata = {
  title: "Diplomado en Confiabilidad Operativa y Monitoreo de Condición",
  description: `Diplomado virtual de 60 horas en vivo con ${NUM_ESPECIALISTAS} especialistas de ${NUM_PAISES} países: confiabilidad desde el diseño, RCM, FMEA, KPIs, vibraciones, termografía, ultrasonido, aceite y análisis eléctricos. Descarga el brochure.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "Diplomado en Confiabilidad Operativa y Monitoreo de Condición | Grupo DIAPSA",
    description: RESUMEN_DIPLOMADO,
    url: URL,
    type: "website",
    locale: "es_MX",
    siteName: "Grupo DIAPSA",
  },
};

const RETICULA = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

export default function DiplomadoPage() {
  return (
    <main>
      <JsonLd data={createCourseSchema({ name: dip.nombre, description: RESUMEN_DIPLOMADO, url: URL, courseModes: ["Online"], duration: 60 })} />
      <JsonLd data={createFaqSchema(FAQ_DIPLOMADO)} />
      <JsonLd data={createBreadcrumbSchema([{ name: "Inicio", url: "/" }, { name: "Cursos", url: "/cursos" }, { name: dip.nombre, url: URL }])} />

      {/* Apertura: el diplomado y el brochure a cambio de los datos */}
      <section id="brochure" className="relative w-full overflow-hidden pb-14 pt-36 text-white lg:pb-20 lg:pt-44" style={{ ...RETICULA, backgroundColor: PIE_DIPLOMADO, backgroundImage: `${RETICULA.backgroundImage}, ${FONDO_DIPLOMADO}`, backgroundSize: "40px 40px, 40px 40px, 100% 100%" }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <nav aria-label="Migas" className="mb-6 text-[11px] text-white/45">
              <Link href="/" className="hover:text-white">Inicio</Link> / <Link href="/cursos" className="hover:text-white">Cursos</Link> / <span className="text-white/70">Diplomado</span>
            </nav>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-white ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full" style={{ background: AZUL_CLARO_DIPLOMADO }} />
              Programa insignia
            </p>
            <p className="mt-5 text-6xl font-black uppercase leading-none tracking-tight text-white lg:text-8xl">Diplomado</p>
            <h1 className="mt-4 text-2xl font-extrabold uppercase leading-tight text-white lg:text-3xl">{dip.corto}</h1>
            <p className="mt-5 text-justify text-lg leading-relaxed text-white/75">{RESUMEN_DIPLOMADO}</p>
            <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DATOS_DIPLOMADO.map((d) => (
                <li key={d.v} className="rounded-sm bg-white/10 px-4 py-3 ring-1 ring-white/15">
                  <p className="text-2xl font-extrabold leading-none text-white">{d.v}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/65">{d.t}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-sm lg:p-8">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: AZUL_CLARO_DIPLOMADO }}>Brochure</p>
            <p className="mt-2 text-2xl font-extrabold leading-snug">Descarga el programa completo</p>
            <p className="mt-2 text-justify text-sm leading-relaxed text-white/70">Temario por sesión, especialistas, requisitos y formas de inscripción. Déjanos tus datos y lo descargas en ese momento.</p>
            <div className="mt-5">
              <DescargaBrochure curso={dip.nombre} archivo={dip.brochure} oscuro diplomado />
            </div>
          </div>
        </div>
      </section>

      {/* Para quién y para qué */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <Antetitulo className="text-[#04358f]">Dirigido a</Antetitulo>
            <p className="mt-3 text-justify text-xl font-semibold leading-relaxed text-primary lg:text-2xl">{dip.dirigido}</p>
            <div className="mt-8 rounded-sm border-l-4 border-[#04358f] bg-[#eef3ff] p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#04358f]">Objetivo general</p>
              <p className="mt-2 text-justify text-base leading-relaxed text-primary">{dip.objetivo}</p>
            </div>
          </div>
          <CarruselFotos fotos={muestraFotos(10)} intervalo={3000} />
        </div>
      </section>

      {/* Qué vas a aprender */}
      <section className="w-full bg-gray-100 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Antetitulo className="text-[#04358f]">Qué vas a aprender</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">Cinco ejes para gestionar activos de principio a fin</h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dip.aprenderas.map((a, i) => (
              <li key={a.t} className="rounded-sm border-t-4 border-[#04358f] bg-white p-5 shadow-sm">
                <span className="text-sm font-extrabold text-[#04358f]">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-extrabold leading-snug text-primary">{a.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-tertiary">{a.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Las cinco fases, con su temario */}
      <section className="w-full py-14 text-white lg:py-20" style={{ background: FONDO_DIPLOMADO }}>
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: AZUL_CLARO_DIPLOMADO }}>Fases y temario</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight lg:text-5xl">5 fases, 17 sesiones, 60 horas</h2>
          <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
            {/* El hilo del programa: la vida del activo, con las cinco fases sobre ella */}
            <div className="overflow-hidden rounded-xl bg-white/10 p-2 ring-1 ring-white/15">
              <VideoBucle
                className="block aspect-[16/10] w-full rounded-lg object-cover"
                src="/videos/diplomado/dip-ciclo.mp4"
                poster="/videos/diplomado/dip-ciclo.jpg"
                descripcion="Animación de la vida de un activo, con su tasa de falla del arranque al retiro, y las cinco fases del diplomado sobre ella, con sus horas y sus temas."
              />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: AZUL_CLARO_DIPLOMADO }}>Por qué cinco fases</p>
              <p className="mt-2 text-2xl font-extrabold leading-snug lg:text-3xl">Las fases siguen la vida del activo</p>
              <p className="mt-3 text-justify text-base leading-relaxed text-white/75">
                Un activo nace en el diseño, pasa la mayor parte de su vida en operación, se gestiona con datos y llega a su retiro. El diplomado recorre ese camino en el mismo orden: primero la confiabilidad que se decide antes de arrancar, después las técnicas que extienden la vida útil, luego la calidad de la información con la que se decide y, al final, cuándo y cómo retirar el equipo.
              </p>
              <p className="mt-3 text-justify text-base leading-relaxed text-white/75">{dip.inscripcion} Cada fase incluye materiales y constancia de participación.</p>
            </div>
          </div>
          <ol className="mt-10 space-y-3">
            {dip.fases.map((f) => (
              <li key={f.n}>
                <details className="group rounded-sm bg-white text-primary open:shadow-xl" open={f.n === 1}>
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden lg:p-6">
                    <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-sm text-white" style={{ background: AZUL_REY }}>
                      <span className="text-[9px] font-extrabold uppercase">Fase</span>
                      <span className="text-2xl font-extrabold leading-none">{f.n}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-extrabold leading-snug lg:text-xl">{f.titulo}</span>
                      <span className="mt-0.5 block text-sm text-tertiary">{f.horas} · {f.sesiones}</span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-2xl font-extrabold text-[#04358f] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 lg:px-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-8">
                      {/* El video de la fase: qué se aprende y dónde se aplica */}
                      <div className="overflow-hidden rounded-xl bg-gray-50 p-2 ring-1 ring-black/5">
                        <VideoBucle
                          className="block aspect-[16/10] w-full rounded-lg object-cover"
                          src={`/videos/diplomado/dip-fase${f.n}.mp4`}
                          poster={`/videos/diplomado/dip-fase${f.n}.jpg`}
                          descripcion={`Animación de la fase ${f.n} del diplomado, ${f.titulo}: lo que se aprende y dónde se aplica.`}
                        />
                      </div>
                      <div>
                        <p className="text-justify text-sm leading-relaxed text-tertiary"><span className="font-bold text-primary">Objetivo:</span> {f.objetivo}</p>
                        <ol className="mt-4 grid grid-cols-1 gap-2">
                          {f.temas.map((t, i) => (
                            <li key={t} className="flex gap-3 rounded-sm bg-gray-50 px-3 py-2 text-sm leading-snug">
                              <span className="font-mono font-bold text-[#04358f]">{String(i + 1).padStart(2, "0")}</span>
                              {t}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Especialistas: países en el mapa, sin nombres (Emiliano, 2026-10-04) */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Antetitulo className="text-[#04358f]">Especialistas</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">Aprenderás de la realidad industrial de {NUM_PAISES} países</h2>
          <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
            <MapaDiplomado paises={PAISES_DIPLOMADO} />
            <div>
              <p className="text-justify text-lg leading-relaxed text-primary">
                Las sesiones son 100% en vivo con {NUM_ESPECIALISTAS} especialistas que trabajan en plantas de {PAISES_DIPLOMADO.join(", ").replace(/, ([^,]*)$/, " y $1")}. Cada tema lo imparte quien lo aplica, con casos de su propia industria: cómo se decide, qué falla y qué funcionó en contextos distintos al tuyo.
              </p>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-[#04358f]">Lo que cubre el claustro</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {ESPECIALIDADES_CLAUSTRO.map((e) => (
                  <li key={e} className="rounded-full bg-[#eef3ff] px-3 py-1.5 text-sm font-bold text-[#04358f]">{e}</li>
                ))}
              </ul>
              <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Países del claustro">
                {PAISES_DIPLOMADO.map((p) => (
                  <li key={p} className="flex items-center gap-2 rounded-sm bg-gray-50 px-3 py-2 text-sm font-bold text-primary ring-1 ring-black/5">
                    <Bandera pais={p} />
                    {p}
                  </li>
                ))}
              </ul>
              {dip.respaldo.length > 0 && (
                <p className="mt-6 text-justify text-sm leading-relaxed text-tertiary">
                  <span className="font-bold text-primary">Con el respaldo de </span>
                  {dip.respaldo.join(", ")}, las firmas de las que forman parte los especialistas del claustro.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quién ya se capacitó con nosotros */}
      <ClientesLogos antetitulo="Quién ya se capacitó" titulo="Empresas que ya formaron a su equipo con nosotros" enlace={null} />

      {/* Beneficios, requisitos e incluye */}
      <section className="w-full bg-gray-100 py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
          <div className="rounded-sm p-6 text-white shadow-lg lg:col-span-2 lg:p-8" style={{ background: FONDO_DIPLOMADO }}>
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: AZUL_CLARO_DIPLOMADO }}>Qué podrás hacer después</p>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {dip.beneficios.map((b) => (
                <li key={b.t} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-[#04358f]" aria-hidden="true">✓</span>
                  <span>
                    <span className="block font-extrabold">{b.t}</span>
                    <span className="block text-sm leading-relaxed text-white/75">{b.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="rounded-sm border-l-4 border-[#04358f] bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#04358f]">Incluye</p>
              <ul className="mt-3 space-y-2">{dip.incluye.map((x) => <li key={x} className="text-sm font-semibold text-primary">✓ {x}</li>)}</ul>
            </div>
            <div className="rounded-sm border-l-4 border-[#04358f] bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#04358f]">Para aprobar</p>
              <ul className="mt-3 space-y-2">{dip.requisitos.map((x) => <li key={x} className="text-sm font-semibold text-primary">✓ {x}</li>)}</ul>
              <p className="mt-4 text-xs leading-relaxed text-tertiary">Disponible para {dip.paises}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div>
            <Antetitulo className="text-[#04358f]">Preguntas frecuentes</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">Lo que nos preguntan antes de inscribirse</h2>
            <p className="mt-4 text-justify text-base leading-relaxed text-tertiary">
              Si tu duda no está aquí, escríbenos en el formulario de abajo o descarga el brochure con el programa completo.
            </p>
          </div>
          <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200 lg:mt-0">
            {FAQ_DIPLOMADO.map((f) => (
              <details key={f.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-primary [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span aria-hidden="true" className="shrink-0 text-2xl font-extrabold text-[#04358f] transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-justify text-base leading-relaxed text-tertiary">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Inscripción */}
      <section id="contacto" className="w-full">
        <div className="w-full px-6 py-10 text-center text-white lg:py-12" style={{ background: FONDO_DIPLOMADO }}>
          <h2 className="text-3xl font-extrabold leading-tight lg:text-4xl">Inscríbete a la próxima generación</h2>
          <p className="mx-auto mt-3 max-w-2xl text-justify text-lg leading-relaxed text-white/80">
            Déjanos tus datos y te respondemos con las fechas, la inversión por fase o del diplomado completo y la forma de inscripción.
          </p>
          <a href="#brochure" className="mt-5 inline-flex items-center justify-center rounded-xs border-2 border-white px-6 py-2.5 font-bold text-white transition-colors hover:bg-white hover:text-[#001f5f]">
            O descarga antes el brochure
          </a>
        </div>
        <ContactForm curso={dip.nombre} />
      </section>
    </main>
  );
}
