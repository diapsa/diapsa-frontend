import Image from "next/image";
import Link from "next/link";
import JsonLd, { createBreadcrumbSchema, createFaqSchema } from "@/components/atoms/JsonLd";
import VideoBucle from "@/components/atoms/VideoBucle";
import AcordeonFoto from "@/components/molecules/AcordeonFoto";
import GuiasRelacionadas from "@/components/organisms/GuiasRelacionadas";
import ContactForm from "@/components/organisms/ContactForm";
import { getArticulosPorServicio } from "@/lib/recursos";
import { SITE_CONFIG } from "@/lib/constants";
import clientes from "@/data/clients.json";
import type { Industria } from "@/types/industria";

/**
 * PaginaIndustria
 * Landing por industria (2026-10-01). Emiliano pidió seguir dos
 * referencias: el marco de las páginas por sector de Fracttal (foto grande
 * con una frase, logos de clientes, texto y video, bloques con acordeón y
 * una foto que cambia con cada punto, tarjetas de servicio) y, en medio, el
 * caso del giro contado como los casos de estudio de Tractian (resultados
 * primero, antes y después, retos, etapas y la gráfica). Poco texto a la
 * vista: lo largo vive en las guías del blog. Todo viene de
 * data/industrias/<slug>.json.
 */

const Flecha = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

const LOGOS = (clientes.clients as { name: string; logo: string | null }[]).filter(
  (c): c is { name: string; logo: string } => Boolean(c.logo),
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
  const caso = industria.caso;

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      {/* Encabezado: foto de planta a todo lo ancho, una frase y dos botones. */}
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden bg-primary pt-32 text-white lg:min-h-[86vh] lg:items-center">
        <Image src={industria.hero.foto.src} alt={industria.hero.foto.alt} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/80 to-primary/10" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 lg:pb-0">
          <nav aria-label="Ruta" className="mb-6 text-sm text-white/60">
            {industria.breadcrumbs.map((b, i) => (
              <span key={b.link}>
                {i > 0 && <span className="mx-2">/</span>}
                {i < industria.breadcrumbs.length - 1 ? <Link href={b.link} className="hover:text-white">{b.label}</Link> : <span className="text-white/90">{b.label}</span>}
              </span>
            ))}
          </nav>
          <p className="text-sm font-bold uppercase tracking-widest text-secondary">{industria.hero.etiqueta}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">{industria.hero.titulo}</h1>
          <p className="mt-5 max-w-xl text-justify text-lg leading-relaxed text-white/85">{industria.hero.texto}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contacto" className="inline-flex items-center justify-center gap-2 rounded-xs bg-secondary px-7 py-3.5 font-bold text-primary transition-colors hover:bg-white">
              Quiero un diagnóstico <Flecha />
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xs border-2 border-white/70 px-7 py-3 font-bold text-white transition-colors hover:bg-white hover:text-primary">
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Logos de quien ya mide con nosotros, justo debajo, como Fracttal. */}
      <section aria-label="Clientes" className="w-full border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {LOGOS.slice(0, 8).map((c) => (
              <li key={c.name} className="relative h-9 w-28 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
                <Image src={c.logo} alt={c.name} fill sizes="112px" className="object-contain brightness-0" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Presentación: texto corto y el video del giro. */}
      <section className="w-full bg-primary/5 py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-4xl">{industria.intro.titulo}</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{industria.intro.texto}</p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_30px_70px_-35px_rgba(13,26,56,0.35)] ring-1 ring-primary/10 sm:p-3">
            <VideoBucle
              className="block aspect-[16/10] w-full rounded-xl object-cover"
              src={`/videos/industrias/${industria.intro.video}.mp4`}
              poster={`/videos/industrias/${industria.intro.video}.jpg`}
              descripcion={industria.intro.descripcionVideo}
            />
          </div>
        </div>
      </section>

      {/* Bloques con acordeón y foto que cambia. */}
      {industria.bloques.map((b, i) => (
        <section key={b.titulo} className="w-full bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-10 max-w-2xl text-3xl font-extrabold leading-tight text-primary lg:text-[2.6rem]">{b.titulo}</h2>
            <AcordeonFoto items={b.items} invertir={i % 2 === 1} />
          </div>
        </section>
      ))}

      {/* Caso del giro contado como Tractian. */}
      {caso && (
        <section className="w-full bg-[#0b1530] py-16 text-white lg:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">{caso.etiqueta}</p>
            <div className="mt-3 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight lg:text-[2.6rem]">{caso.titulo}</h2>
                <p className="mt-4 text-justify text-lg leading-relaxed text-white/75">{caso.resumen}</p>
              </div>
              <dl className="grid grid-cols-2 gap-4">
                {caso.cifras.map((c) => (
                  <div key={c.etiqueta} className="flex flex-col-reverse rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                    <dt className="mt-1 text-sm leading-snug text-white/70">{c.etiqueta}</dt>
                    <dd className="text-3xl font-extrabold text-secondary lg:text-4xl">{c.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Antes y después, en barras. */}
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
              {caso.antesDespues.map((a) => (
                <div key={a.etiqueta} className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                  <p className="text-sm font-bold uppercase tracking-widest text-white/60">{a.etiqueta}</p>
                  {[
                    { anio: a.anioAntes, v: a.antes, color: "bg-red-500" },
                    { anio: a.anioDespues, v: a.despues, color: "bg-emerald-400" },
                  ].map((f) => (
                    <div key={f.anio} className="mt-4 flex items-center gap-4">
                      <span className="w-12 shrink-0 text-sm font-bold text-white/70">{f.anio}</span>
                      <div className="h-8 flex-1 rounded-sm bg-white/5">
                        <div className={`h-full rounded-sm ${f.color}`} style={{ width: `${Math.max(2, (f.v / Math.max(a.antes, a.despues)) * 100)}%` }} />
                      </div>
                      <span className="w-12 shrink-0 text-right text-2xl font-extrabold">{f.v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Retos y cómo se resolvió. */}
            <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-extrabold">Retos</h3>
                <ul className="mt-6 space-y-6">
                  {caso.retos.map((r) => (
                    <li key={r.titulo} className="border-l-4 border-secondary pl-5">
                      <p className="text-lg font-extrabold">{r.titulo}</p>
                      <p className="mt-1 text-justify text-white/70">{r.texto}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">Cómo se resolvió</h3>
                <ol className="mt-6 space-y-6">
                  {caso.etapas.map((e) => (
                    <li key={e.titulo} className="flex gap-4">
                      <span className="mt-0.5 h-fit min-w-[6.5rem] shrink-0 whitespace-nowrap rounded-full bg-secondary px-3 py-1 text-center text-xs font-extrabold text-primary">{e.etiqueta}</span>
                      <div>
                        <p className="text-lg font-extrabold">{e.titulo}</p>
                        <p className="mt-1 text-justify text-white/70">{e.texto}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {caso.grafica && (
              <figure className="mt-16 overflow-hidden rounded-2xl bg-white p-4 lg:p-6">
                <Image src={caso.grafica.src} alt={caso.grafica.alt} width={1116} height={557} sizes="(min-width: 1280px) 1200px, 100vw" className="h-auto w-full" />
                <figcaption className="mt-3 text-justify text-sm text-tertiary">{caso.grafica.pie}</figcaption>
              </figure>
            )}

            <div className="mt-10">
              <Link href={caso.href} className="inline-flex items-center gap-2 rounded-xs bg-secondary px-6 py-3 font-bold text-primary transition-colors hover:bg-white">
                Leer el caso completo <Flecha />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tarjetas de servicio con foto, como las de producto de Fracttal. */}
      <section className="w-full bg-gray-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-[2.6rem]">{industria.servicios.titulo}</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industria.servicios.items.map((s) => (
              <Link key={s.href} href={s.href} className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl">
                <div className="relative h-40 overflow-hidden">
                  <Image src={s.foto} alt="" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-extrabold leading-snug text-primary">{s.titulo}</h3>
                  <p className="mt-1.5 flex-1 text-justify text-sm leading-relaxed text-tertiary">{s.texto}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-secondary">
                    Conocer más <Flecha />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {industria.faq.length > 0 && (
        <section className="w-full bg-white py-14 lg:py-20">
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
          <p className="mx-auto mb-8 max-w-2xl text-justify text-lg leading-relaxed text-primary/80 sm:text-center">{industria.cta.text}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#contacto" className="inline-flex items-center gap-2 rounded-xs bg-primary px-8 py-3.5 font-bold text-white shadow-md transition-all duration-300 hover:bg-white hover:text-primary">
              Quiero un diagnóstico
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xs border-2 border-primary px-8 py-3 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white">
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="contacto">
        <ContactForm />
      </section>
    </main>
  );
}
