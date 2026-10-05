import Image from "next/image";
import Link from "next/link";
import JsonLd, { createBreadcrumbSchema, createFaqSchema } from "@/components/atoms/JsonLd";
import GuiasRelacionadas from "@/components/organisms/GuiasRelacionadas";
import ContactForm from "@/components/organisms/ContactForm";
import IconoMenu from "@/components/atoms/IconoMenu";
import EscenaGemelo from "@/components/organisms/EscenaGemelo";
import clientes from "@/data/clients.json";
import presencia from "@/data/presencia-mexico.json";
import { getArticulosPorServicio } from "@/lib/recursos";
import { SITE_CONFIG } from "@/lib/constants";
import type { Industria } from "@/types/industria";

/**
 * PaginaIndustria
 * Landing por industria. Después de probar el marco de Fracttal y Tractian,
 * Emiliano eligió como referencia la página por sector de Hertzinno
 * (es.hertzinno.com/pages/power-utilities, 2026-10-02): encabezado claro con
 * la foto desvanecida y cuatro pestañas de áreas, las señales tempranas, un
 * bloque por área de activos (prioridades de monitoreo y servicios), el mapa
 * de activo y señal, la arquitectura del programa y el cierre. Todo viene de
 * data/industrias/<slug>.json.
 */

const Flecha = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

const n = (i: number) => String(i + 1).padStart(2, "0");

/* Logotipos de clientes (los mismos de la portada) y cifras ya publicadas. */
const LOGOS = (clientes.clients as { name: string; logo: string | null }[]).filter(
  (c): c is { name: string; logo: string } => Boolean(c.logo),
);
const ESTADOS = presencia.estados.filter((e) => e.trabajamos).length;
const PAISES = presencia.internacional.length + 1;
const CIFRAS = [
  { valor: "+20", etiqueta: "años midiendo equipos en operación" },
  { valor: String(ESTADOS), etiqueta: "estados de México" },
  { valor: String(PAISES), etiqueta: "países" },
];

/* Ícono de línea según la técnica que nombra el texto. */
function iconoDe(texto: string): string {
  const t = texto.toLowerCase();
  if (t.includes("vibra") || t.includes("balanceo") || t.includes("alinea")) return "vibraciones";
  if (t.includes("termo") || t.includes("temperatura") || t.includes("cámara")) return "termografia";
  if (t.includes("ultrasonido") || t.includes("acústic") || t.includes("fuga")) return "ultrasonido";
  if (t.includes("aceite") || t.includes("dga") || t.includes("gases")) return "aceite";
  if (t.includes("gas") || t.includes("metano")) return "gas";
  if (t.includes("ducto")) return "ductos";
  if (t.includes("tierra")) return "tierras";
  if (t.includes("arco")) return "arco";
  if (t.includes("calidad") || t.includes("eléctric") || t.includes("armónic")) return "electricos";
  if (t.includes("diagnóstico") || t.includes("start") || t.includes("criticidad")) return "situacional";
  if (t.includes("idap")) return "idap";
  return "diagnostico";
}

function Etiqueta({ children, clara }: { children: React.ReactNode; clara?: boolean }) {
  return <p className={`text-xs font-bold uppercase tracking-[0.2em] ${clara ? "text-secondary" : "text-secondary-dark"}`}>{children}</p>;
}

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
  const { hero, senales, areas, mapa, arquitectura, caso, cierre } = industria;

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      {/* Encabezado claro: texto a la izquierda, foto desvanecida a la derecha y las cuatro áreas abajo. */}
      <section className="relative overflow-hidden bg-white pt-32 lg:pt-36">
        <div className="absolute inset-y-0 right-0 hidden w-[62%] lg:block">
          <Image src={hero.foto.src} alt={hero.foto.alt} fill priority sizes="62vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/55 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <nav aria-label="Ruta" className="mb-6 text-sm text-tertiary">
            {industria.breadcrumbs.map((b, i) => (
              <span key={b.link}>
                {i > 0 && <span className="mx-2">/</span>}
                {i < industria.breadcrumbs.length - 1 ? <Link href={b.link} className="hover:text-primary">{b.label}</Link> : <span className="text-primary">{b.label}</span>}
              </span>
            ))}
          </nav>
          <div className="max-w-2xl pb-12 lg:pb-14">
            <Etiqueta>{hero.etiqueta}</Etiqueta>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-primary sm:text-5xl lg:text-[3.5rem]">{hero.titulo}</h1>
            <p className="mt-6 text-justify text-lg leading-relaxed text-tertiary">{hero.texto}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#areas" className="inline-flex items-center justify-center gap-2 rounded-xs bg-secondary px-7 py-3.5 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                Explorar las áreas de la planta
              </a>
              <a href="#contacto" className="inline-flex items-center justify-center gap-2 rounded-xs border border-primary/25 bg-white px-7 py-3.5 font-bold text-primary transition-colors hover:border-primary">
                Solicitar diagnóstico
              </a>
            </div>
            <p className="mt-8 flex items-start gap-3 text-sm text-tertiary">
              <span className="mt-2.5 h-px w-8 shrink-0 bg-secondary" aria-hidden="true" />
              {hero.nota}
            </p>
          </div>
        </div>
        {/* En celular la foto va debajo del texto */}
        <div className="relative aspect-[16/9] lg:hidden">
          <Image src={hero.foto.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <nav aria-label="Áreas de la planta" className="relative border-t border-gray-200 bg-white/95">
          <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
            {areas.map((a, i) => (
              <a key={a.id} href={`#${a.id}`} className="group border-gray-200 px-6 py-5 transition-colors hover:bg-gray-50 [&:not(:first-child)]:border-l max-lg:[&:nth-child(3)]:border-l-0 max-lg:[&:nth-child(n+3)]:border-t">
                <span className="text-xs font-bold text-secondary-dark">{n(i)}</span>
                <span className="mt-1 block font-bold text-primary group-hover:underline">{a.nombre}</span>
              </a>
            ))}
          </div>
        </nav>
      </section>

      {/* Quién ya confía: cifras y logotipos, antes de entrar al detalle */}
      <section className="w-full border-b border-gray-200 bg-white py-10 lg:py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[auto_1fr] lg:gap-14">
          <dl className="flex gap-8 lg:gap-10">
            {CIFRAS.map((c) => (
              <div key={c.etiqueta}>
                <dd className="text-3xl font-extrabold text-primary lg:text-4xl">{c.valor}</dd>
                <dt className="mt-1 max-w-[9rem] text-xs leading-snug text-tertiary">{c.etiqueta}</dt>
              </div>
            ))}
          </dl>
          <ul className="grid grid-cols-3 items-center gap-x-6 gap-y-4 sm:grid-cols-6 lg:grid-cols-9">
            {LOGOS.map((c) => (
              <li key={c.name} className="flex items-center justify-center">
                <Image src={c.logo} alt={c.name} width={120} height={40} className="h-8 w-auto max-w-full object-contain opacity-50 brightness-0 transition-opacity hover:opacity-90" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Las señales tempranas */}
      <section className="w-full bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <Etiqueta>{senales.etiqueta}</Etiqueta>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{senales.titulo}</h2>
            </div>
            <p className="text-justify text-lg leading-relaxed text-tertiary lg:pt-10">{senales.texto}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            {senales.items.map((s, i) => (
              <div key={s.titulo} className="bg-white p-6 lg:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary-dark">{n(i)}</span>
                  <IconoMenu icono={iconoDe(s.titulo)} className="h-7 w-7 text-primary" />
                </div>
                <span className="mt-4 block h-px w-10 bg-secondary" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-extrabold text-primary">{s.titulo}</h3>
                <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Un bloque por área de activos, con la foto alternando de lado */}
      <div id="areas" className="scroll-mt-24">
        {areas.map((a, i) => (
          <section key={a.id} id={a.id} className={`w-full scroll-mt-24 py-16 lg:py-24 ${i % 2 ? "bg-gray-50" : "bg-white"}`}>
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-sm ${i % 2 ? "lg:order-2" : ""}`}>
                <Image src={a.foto.src} alt={a.foto.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-secondary-dark">{n(i)} / {a.nombre}</p>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">{a.titulo}</h2>
                <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{a.texto}</p>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-secondary-dark">Prioridades típicas de monitoreo</p>
                <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {a.prioridades.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-base font-semibold text-primary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-secondary" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-tertiary">Servicios relacionados</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {a.servicios.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="inline-flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-primary transition-colors hover:border-primary">
                        {s.nombre} <Flecha />
                      </Link>
                    </li>
                  ))}
                </ul>
                <a href="#contacto" className="mt-8 inline-flex items-center gap-2 font-bold text-primary underline decoration-secondary decoration-2 underline-offset-8 hover:decoration-primary">
                  {a.accion} <Flecha />
                </a>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Mapa de activo y señal */}
      <section className="w-full bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <Etiqueta>{mapa.etiqueta}</Etiqueta>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{mapa.titulo}</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{mapa.texto}</p>
          </div>
          <div className="mt-12 overflow-hidden rounded-sm border border-gray-200">
            <div className="hidden grid-cols-3 bg-primary text-xs font-bold uppercase tracking-[0.15em] text-white md:grid">
              <span className="px-6 py-4">Activo o riesgo</span>
              <span className="px-6 py-4">Señal temprana</span>
              <span className="px-6 py-4 text-secondary">Servicio DIAPSA</span>
            </div>
            {mapa.filas.map((f) => (
              <div key={f.activo} className="grid grid-cols-1 border-t border-gray-200 first:border-t-0 md:grid-cols-3 md:first:border-t">
                <span className="px-6 pt-5 font-bold text-primary md:py-5">{f.activo}</span>
                <span className="px-6 pt-1 text-tertiary md:py-5">{f.senal}</span>
                <span className="flex items-start gap-3 px-6 pb-5 pt-2 md:py-5">
                  <IconoMenu icono={iconoDe(f.servicio)} className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                  <span>
                  <Link href={f.href} className="font-bold text-primary hover:underline">{f.servicio}</Link>
                  <span className="mt-1 block text-sm text-tertiary">{f.detalle}</span>
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arquitectura del programa */}
      <section className="w-full bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <Etiqueta>{arquitectura.etiqueta}</Etiqueta>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{arquitectura.titulo}</h2>
            </div>
            <p className="text-justify text-lg leading-relaxed text-tertiary lg:pt-10">{arquitectura.texto}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
          {/* Gemelo digital de la planta del giro (Emiliano, 2026-10-04: uno por industria) */}
          <div className="overflow-hidden rounded-sm">
            <EscenaGemelo planta={industria.slug} nombre={industria.nombre} />
          </div>
          <div className="overflow-hidden rounded-sm border border-gray-200 bg-white">
            {arquitectura.items.map((a, i) => (
              <Link key={a.titulo} href={a.href} className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 gap-y-1 border-t border-gray-200 px-6 py-5 transition-colors first:border-t-0 hover:bg-gray-50">
                <span className="text-sm font-bold text-secondary-dark">{n(i)}</span>
                <h3 className="text-lg font-extrabold text-primary">{a.titulo}</h3>
                <p className="col-start-2 row-start-2 text-justify text-base leading-relaxed text-tertiary">{a.texto}</p>
                <span className="col-start-3 row-start-1 inline-flex text-primary transition-transform group-hover:translate-x-1"><Flecha /></span>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* El caso del giro, en corto */}
      {caso && (
        <section className="w-full bg-primary py-16 text-white lg:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <Etiqueta clara>{caso.etiqueta}</Etiqueta>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight lg:text-4xl">{caso.titulo}</h2>
              <p className="mt-4 text-justify text-lg leading-relaxed text-white/75">{caso.resumen}</p>
              <Link href={caso.href} className="mt-6 inline-flex items-center gap-2 font-bold text-secondary hover:text-white">
                Leer el caso completo <Flecha />
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-white/10">
              {caso.cifras.map((c) => (
                <div key={c.etiqueta} className="bg-primary p-6 lg:p-8">
                  <dt className="sr-only">{c.etiqueta}</dt>
                  <dd className="text-3xl font-extrabold text-secondary lg:text-5xl">{c.valor}</dd>
                  <dd className="mt-2 text-sm text-white/70">{c.etiqueta}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

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

      {/* Cierre */}
      <section className="w-full border-t border-gray-200 bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Etiqueta>{cierre.etiqueta}</Etiqueta>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{cierre.titulo}</h2>
            <p className="mt-4 max-w-2xl text-justify text-lg leading-relaxed text-tertiary">{cierre.texto}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a href="#contacto" className="inline-flex items-center justify-center gap-2 rounded-xs bg-secondary px-7 py-3.5 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
              Solicitar propuesta
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xs border border-primary/25 px-7 py-3.5 font-bold text-primary transition-colors hover:border-primary">
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
