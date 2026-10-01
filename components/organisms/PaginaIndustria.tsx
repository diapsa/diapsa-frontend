import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/organisms/PageHeader";
import JsonLd, { createBreadcrumbSchema, createFaqSchema } from "@/components/atoms/JsonLd";
import VideoBucle from "@/components/atoms/VideoBucle";
import ClientesLogos from "@/components/organisms/ClientesLogos";
import GuiasRelacionadas from "@/components/organisms/GuiasRelacionadas";
import ContactForm from "@/components/organisms/ContactForm";
import { getArticulosPorServicio } from "@/lib/recursos";
import { SITE_CONFIG } from "@/lib/constants";
import type { Industria } from "@/types/industria";

/**
 * PaginaIndustria
 * Landing por industria (2026-10-01, piloto: generación de energía). Sigue
 * el molde de Fracttal que pidió Emiliano: poco texto a la vista. Una frase
 * y un video para presentar el giro; tres bloques de beneficio, cada uno con
 * un acordeón de tres puntos cortos (solo uno abierto a la vez) y una foto;
 * clientes y las cifras del caso de éxito; tarjetas de servicio; preguntas,
 * guías y cierre. Todo viene de data/industrias/<slug>.json.
 */

const Flecha = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
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

      {/* Presentación: una frase y el video del giro. */}
      <section className="w-full bg-primary/5 py-12 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
          <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_30px_70px_-35px_rgba(13,26,56,0.35)] ring-1 ring-primary/10 sm:p-3">
            <VideoBucle
              className="block aspect-[16/10] w-full rounded-xl object-cover"
              src={`/videos/industrias/${industria.intro.video}.mp4`}
              poster={`/videos/industrias/${industria.intro.video}.jpg`}
              descripcion={industria.intro.descripcionVideo}
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-4xl">{industria.intro.titulo}</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{industria.intro.texto}</p>
          </div>
        </div>
      </section>

      {/* Tres bloques de beneficio: frase, acordeón y una foto. */}
      {industria.bloques.map((b, i) => {
        const invertir = i % 2 === 1;
        return (
          <section key={b.titulo} className="w-full bg-white py-12 lg:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-primary lg:text-[2.6rem]">{b.titulo}</h2>
              <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={`divide-y divide-gray-200 border-y border-gray-200 ${invertir ? "lg:order-2" : ""}`}>
                  {b.items.map((it, k) => (
                    <details key={it.titulo} name={`bloque-${i}`} open={k === 0} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-extrabold text-primary [&::-webkit-details-marker]:hidden">
                        {it.titulo}
                        <span aria-hidden="true" className="shrink-0 text-2xl font-extrabold text-secondary transition-transform duration-200 group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-justify text-base leading-relaxed text-tertiary">{it.texto}</p>
                      {it.enlaces && it.enlaces.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                          {it.enlaces.map((e) => (
                            <Link key={e.href + e.nombre} href={e.href} className="inline-flex items-center gap-1 text-sm font-bold text-primary underline decoration-secondary decoration-2 underline-offset-4 hover:text-secondary">
                              {e.nombre}
                            </Link>
                          ))}
                        </div>
                      )}
                    </details>
                  ))}
                </div>
                <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 ${invertir ? "lg:order-1" : ""}`}>
                  <Image src={b.foto.src} alt={b.foto.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Quién ya confía y las cifras del caso del giro. */}
      <ClientesLogos />
      {industria.caso && (
        <section className="w-full bg-primary py-12 text-white lg:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-2xl font-extrabold leading-tight lg:text-3xl">{industria.caso.titulo}</h2>
            <dl className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {industria.caso.cifras.map((c) => (
                <div key={c.etiqueta} className="flex flex-col-reverse text-center">
                  <dt className="mt-1 text-sm leading-snug text-white/75">{c.etiqueta}</dt>
                  <dd className="text-4xl font-extrabold text-secondary lg:text-5xl">{c.valor}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 text-center">
              <Link href={industria.caso.href} className="inline-flex items-center gap-2 rounded-xs bg-secondary px-6 py-2.5 font-bold text-primary transition-colors hover:bg-white">
                Ver caso de éxito
                <Flecha />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tarjetas de servicio, como las de producto de Fracttal. */}
      <section className="w-full bg-gray-50 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-[2.6rem]">{industria.servicios.titulo}</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industria.servicios.items.map((s) => (
              <Link key={s.href} href={s.href} className="group flex flex-col rounded-sm bg-white p-6 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg">
                <h3 className="text-xl font-extrabold leading-snug text-primary">{s.titulo}</h3>
                <p className="mt-2 flex-1 text-justify text-sm leading-relaxed text-tertiary">{s.texto}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-secondary">
                  Conocer más
                  <Flecha />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {industria.faq.length > 0 && (
        <section className="w-full bg-white py-12 lg:py-20">
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

      <section id="contacto">
        <ContactForm />
      </section>
    </main>
  );
}
