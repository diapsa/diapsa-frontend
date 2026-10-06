import Image from "next/image";
import Link from "next/link";
import { getStorageUrl } from "@/lib/api/config";
import type { Blog } from "@/types/post";

/**
 * InicioBlog
 * Blog y noticias en la portada.
 *
 * Por qué así (2026-09-27): antes salía solo la entrada destacada del CMS
 * (una) en una rejilla de tres, con mucho hueco. Ahora: la entrada más
 * reciente en grande, las siguientes en una lista compacta con foto, y como
 * noticia el próximo webinar, que es lo único que DIAPSA anuncia hoy (el
 * CMS no tiene anuncios publicados). Si el CMS no responde, la sección no
 * aparece.
 */

const fecha = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : null;

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function InicioBlog({ entradas }: { entradas: Blog[] }) {
  // Las publicadas primero y de la más reciente a la más antigua.
  const lista = [...entradas]
    .filter((e) => e.slug && e.title)
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
    .slice(0, 4);
  if (lista.length === 0) return null;
  const [principal, ...resto] = lista;
  const portada = (e: Blog) => getStorageUrl(e.cover_image) || "/images/fondo-mantenimiento.webp";

  return (
    <section className="w-full bg-gray-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Blog y noticias</span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              GUÍAS TÉCNICAS <span className="text-secondary">DE CAMPO</span>
            </h2>
            <p className="mt-3 text-justify text-tertiary">
              Lo que aprendemos midiendo equipos, escrito para quien toma las decisiones de mantenimiento.
            </p>
          </div>
          <Link prefetch={false}
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xs bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-secondary hover:text-primary lg:self-auto"
          >
            Ver todo el blog <Flecha />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
          {/* La más reciente, en grande */}
          <Link prefetch={false}
            href={`/blog/${principal.slug}`}
            className="group relative flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-sm shadow-lg"
          >
            <Image
              src={portada(principal)}
              alt={principal.title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
            <div className="relative p-6 sm:p-8">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">Lo más reciente</span>
              {fecha(principal.published_at) && <p className="mt-4 text-sm text-white/70">{fecha(principal.published_at)}</p>}
              <h3 className="mt-1 text-2xl font-extrabold leading-tight text-white transition-colors group-hover:text-secondary lg:text-3xl">
                {principal.title}
              </h3>
              {principal.excerpt && <p className="mt-3 line-clamp-2 text-justify text-white/80">{principal.excerpt}</p>}
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-secondary">
                Leer la guía <Flecha />
              </span>
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {/* Las siguientes, en lista */}
            {resto.map((e) => (
              <Link prefetch={false}
                key={e.slug}
                href={`/blog/${e.slug}`}
                className="group flex gap-4 rounded-sm bg-white p-3 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
              >
                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-sm sm:w-32">
                  <Image src={portada(e)} alt="" fill sizes="128px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  {fecha(e.published_at) && <p className="text-xs text-tertiary">{fecha(e.published_at)}</p>}
                  <h3 className="mt-0.5 line-clamp-2 font-bold leading-snug text-primary transition-colors group-hover:text-secondary">
                    {e.title}
                  </h3>
                </div>
              </Link>
            ))}

            {/* La noticia: el próximo webinar */}
            <Link prefetch={false}
              href="/webinar"
              className="group mt-auto flex items-center gap-4 rounded-sm bg-primary p-5 text-white shadow-lg transition-colors hover:bg-primary/90"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-widest text-secondary">Noticias</span>
                <span className="block font-extrabold leading-snug">Próximo webinar en línea, sin costo</span>
                <span className="block text-sm text-white/70">Regístrate y recibe el enlace de acceso.</span>
              </span>
              <span className="text-secondary transition-transform group-hover:translate-x-1">
                <Flecha />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
