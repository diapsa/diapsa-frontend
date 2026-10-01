import Link from "next/link";
import PageHeader from "@/components/organisms/PageHeader";
import Antetitulo from "@/components/atoms/Antetitulo";
import JsonLd, { createBreadcrumbSchema, createFaqSchema } from "@/components/atoms/JsonLd";
import IntroBeneficios from "@/components/organisms/IntroBeneficios";
import VideosServicio from "@/components/organisms/VideosServicio";
import ClientesLogos from "@/components/organisms/ClientesLogos";
import GuiasRelacionadas from "@/components/organisms/GuiasRelacionadas";
import CursosTeaser from "@/components/organisms/CursosTeaser";
import ContactForm from "@/components/organisms/ContactForm";
import { getArticulosPorServicio } from "@/lib/recursos";
import { SITE_CONFIG } from "@/lib/constants";
import type { Industria, TecnicaEnlace } from "@/types/industria";

/**
 * PaginaIndustria
 * Landing por industria (2026-10-01, piloto: generación de energía). Habla
 * en el idioma del giro: sus equipos críticos, lo que les falla y con qué
 * servicio se vigila cada uno, por dónde empezar, el caso de éxito del
 * sector y las normas que aplican. Reutiliza las piezas de las páginas de
 * servicio (beneficios, videos, clientes, preguntas, guías y cierre) para
 * que se vean iguales. Todo viene de data/industrias/<slug>.json.
 */

const Flecha = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

const Pastilla = ({ t }: { t: TecnicaEnlace }) => (
  <Link
    href={t.href}
    className="inline-flex items-center gap-1 rounded-sm bg-primary/5 px-3 py-1.5 text-sm font-bold text-primary ring-1 ring-primary/10 transition-colors hover:bg-primary hover:text-white"
  >
    {t.nombre}
  </Link>
);

export default function PaginaIndustria({ industria }: { industria: Industria }) {
  const href = `/industrias/${industria.slug}`;
  const breadcrumbJsonLd = createBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "" },
    { name: industria.nombre, url: href },
  ]);
  const faqJsonLd = industria.faq.length ? createFaqSchema(industria.faq) : null;
  const articulos = getArticulosPorServicio(href);
  const wa = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(industria.cta.whatsappMessage)}`;

  let numero = 0;
  const paso = () => String(++numero).padStart(2, "0");

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <PageHeader title={industria.header.title} subtitle={industria.header.subtitle} breadcrumbs={industria.breadcrumbs} />

      {/* Barra de cotización pegada al hero, como en los servicios. */}
      <div className="w-full border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-6 py-4 sm:flex-row sm:gap-5">
          <span className="text-sm font-semibold text-tertiary">{industria.certificacion}</span>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xs bg-primary px-6 py-2.5 font-bold text-white transition-all duration-300 hover:bg-secondary hover:text-primary">
            Cotizar por WhatsApp
          </a>
          <a href="#contacto" className="inline-flex items-center gap-2 rounded-xs border-2 border-primary px-6 py-2 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white">
            Solicitar propuesta
          </a>
        </div>
      </div>

      {/* Qué está en juego en este giro. */}
      <section className="w-full bg-white py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <Antetitulo paso={paso()}>Qué está en juego</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{industria.intro.titulo}</h2>
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{industria.intro.texto}</p>
          </div>
          <IntroBeneficios intro={industria.introBeneficios} />
        </div>
      </section>

      {/* Equipos críticos: qué le falla a cada uno y con qué se vigila. */}
      <section className="w-full bg-gray-50 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <Antetitulo paso={paso()}>Equipos críticos</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{industria.equipos.titulo}</h2>
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{industria.equipos.texto}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industria.equipos.items.map((e) => (
              <article key={e.nombre} className="flex flex-col rounded-sm bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h3 className="text-xl font-extrabold leading-snug text-primary">{e.nombre}</h3>
                <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">{e.texto}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-secondary">Qué le falla</p>
                <ul className="mt-2 space-y-1.5">
                  {e.fallas.map((f) => (
                    <li key={f} className="flex gap-2 text-sm leading-snug text-primary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-secondary">Con qué se vigila</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {e.tecnicas.map((t) => (
                    <Pastilla key={t.href + t.nombre} t={t} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {industria.videos?.map((g) => (
        <VideosServicio key={g.titulo} grupo={g} paso={paso()} />
      ))}

      {/* Por dónde empezar. */}
      <section className="w-full bg-white py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <Antetitulo paso={paso()}>Por dónde empezar</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{industria.pasos.titulo}</h2>
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{industria.pasos.texto}</p>
          </div>
          <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {industria.pasos.items.map((p, i) => (
              <li key={p.titulo} className="flex flex-col border-t-4 border-primary pt-5">
                <span className="text-sm font-extrabold text-secondary" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 text-xl font-extrabold leading-snug text-primary">{p.titulo}</h3>
                <p className="mt-2 flex-1 text-justify text-sm leading-relaxed text-tertiary">{p.texto}</p>
                {p.enlace && (
                  <Link href={p.enlace.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-secondary">
                    {p.enlace.nombre}
                    <Flecha />
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Caso de éxito del giro, con cifras ya publicadas. */}
      {industria.caso && (
        <section className="w-full bg-primary py-12 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Antetitulo paso={paso()}>Caso de éxito</Antetitulo>
            <div className="mt-2 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight lg:text-[2.5rem]">{industria.caso.titulo}</h2>
                <p className="mt-4 text-justify text-lg leading-relaxed text-white/80">{industria.caso.texto}</p>
                <Link href={industria.caso.href} className="mt-6 inline-flex items-center gap-2 rounded-xs bg-secondary px-6 py-2.5 font-bold text-primary transition-colors hover:bg-white">
                  Leer el caso completo
                  <Flecha />
                </Link>
              </div>
              <dl className="grid grid-cols-2 gap-4">
                {industria.caso.cifras.map((c) => (
                  <div key={c.etiqueta} className="flex flex-col-reverse rounded-sm bg-white/10 p-5 ring-1 ring-white/15">
                    <dt className="mt-1 text-sm leading-snug text-white/75">{c.etiqueta}</dt>
                    <dd className="text-3xl font-extrabold text-secondary lg:text-4xl">{c.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Normas y criterios que aplican en el giro. */}
      <section className="w-full bg-white py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <Antetitulo paso={paso()}>Normas que aplican</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{industria.normas.titulo}</h2>
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{industria.normas.texto}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industria.normas.items.map((n) => (
              <article key={n.clave} className="flex flex-col rounded-sm border-l-4 border-secondary bg-gray-50 p-5">
                <p className="text-sm font-extrabold tracking-wide text-secondary">{n.clave}</p>
                <h3 className="mt-1 text-lg font-extrabold leading-snug text-primary">{n.titulo}</h3>
                <p className="mt-2 flex-1 text-justify text-sm leading-relaxed text-tertiary">{n.texto}</p>
                {n.enlace && (
                  <Link href={n.enlace.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-secondary">
                    {n.enlace.nombre}
                    <Flecha />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClientesLogos paso={paso()} />

      {industria.faq.length > 0 && (
        <section className="w-full bg-gray-50 py-12 lg:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-10 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
              Preguntas <span className="text-secondary">frecuentes</span>
            </h2>
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {industria.faq.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-primary [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span aria-hidden="true" className="shrink-0 text-2xl font-extrabold text-secondary transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-justify text-base leading-relaxed text-tertiary lg:text-lg">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <GuiasRelacionadas articulos={articulos} />

      <section className="w-full bg-secondary py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">{industria.cta.title}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-justify text-lg leading-relaxed text-primary/80">{industria.cta.text}</p>
          {industria.cta.datos && industria.cta.datos.length > 0 && (
            <ul className="mb-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {industria.cta.datos.map((dato) => (
                <li key={dato} className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {dato}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xs bg-primary px-8 py-3.5 font-bold text-white shadow-md transition-all duration-300 hover:bg-white hover:text-primary">
              Cotizar por WhatsApp
            </a>
            <a href="#contacto" className="inline-flex items-center gap-2 rounded-xs border-2 border-primary px-8 py-3 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white">
              Prefiero el formulario
            </a>
          </div>
        </div>
      </section>

      <CursosTeaser />

      <section id="contacto">
        <ContactForm />
      </section>
    </main>
  );
}
