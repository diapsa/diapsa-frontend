import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/organisms/PageHeader";
import ContactForm from "@/components/organisms/ContactForm";
import TarjetaMiniCurso from "@/components/organisms/TarjetaMiniCurso";
import Antetitulo from "@/components/atoms/Antetitulo";
import JsonLd, { createBreadcrumbSchema, createCourseSchema } from "@/components/atoms/JsonLd";
import { FORMATO_MINI, MINI_CURSOS, RUTA_MINI, duracionDe, miniCurso, nombreTecnica, proximasFechas, whatsappMini } from "@/lib/mini-cursos";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MINI_CURSOS.map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = miniCurso(slug);
  if (!c) return { title: "Mini curso no encontrado" };
  // "Mini curso" en el título es lo que distingue esta página de la capacitación completa
  const titulo = `Mini curso: ${c.titulo}`;
  return {
    title: titulo.length <= 54 ? titulo : c.titulo,
    description: c.resumen,
    alternates: { canonical: `${RUTA_MINI}/${c.slug}` },
    openGraph: { title: `${c.titulo} | DIAPSA`, description: c.resumen, url: `${RUTA_MINI}/${c.slug}`, type: "website" },
  };
}

function Palomita() {
  return (
    <svg className="mt-1 h-4 w-4 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default async function MiniCursoPage({ params }: Props) {
  const { slug } = await params;
  const c = miniCurso(slug);
  if (!c) notFound();

  const fechas = proximasFechas(c);
  const otros = [...MINI_CURSOS.filter((o) => o.slug !== c.slug && o.tecnica === c.tecnica), ...MINI_CURSOS.filter((o) => o.tecnica !== c.tecnica)].slice(0, 3);
  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Cursos", url: "/cursos" },
    { name: "Mini cursos en vivo", url: RUTA_MINI },
    { name: c.titulo, url: `${RUTA_MINI}/${c.slug}` },
  ];
  const horas = parseInt(duracionDe(c), 10);
  const datos = [
    { k: "Modalidad", v: FORMATO_MINI.modalidad },
    { k: "Duración", v: duracionDe(c) },
    { k: "Nivel", v: c.nivel },
    { k: "Costo", v: c.precio ?? "Accesible, pregúntanos" },
  ];

  return (
    <main className="bg-gray-50">
      <JsonLd
        data={createCourseSchema({
          name: c.titulo,
          description: c.resumen,
          url: `${RUTA_MINI}/${c.slug}`,
          provider: "Grupo DIAPSA",
          courseModes: ["Online"],
          duration: Number.isFinite(horas) ? horas : undefined,
        })}
      />
      <JsonLd data={createBreadcrumbSchema(breadcrumbs)} />
      <PageHeader
        title={c.titulo}
        subtitle={`Mini curso en vivo · ${nombreTecnica(c.tecnica)}`}
        breadcrumbs={breadcrumbs.map((b) => ({ label: b.name, link: b.url }))}
      />

      {/* Los datos que se comparan, en una franja */}
      <section className="w-full bg-primary text-white">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-6 py-7 lg:grid-cols-4 lg:py-9">
          {datos.map((d) => (
            <li key={d.k} className="pr-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/60">{d.k}</p>
              <p className="mt-1 text-lg font-extrabold leading-snug text-secondary lg:text-xl">{d.v}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="w-full py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-sm border-l-4 border-secondary bg-white p-6 shadow-sm ring-1 ring-black/5 lg:p-8">
              <Antetitulo>De qué se trata</Antetitulo>
              <h2 className="mt-2 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">{c.titulo}</h2>
              <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{c.resumen}</p>
              <p className="mt-4 text-justify leading-relaxed text-tertiary">
                <span className="font-bold text-primary">Para quién es. </span>
                {c.para}
              </p>
            </section>

            <section className="rounded-sm border-l-4 border-secondary bg-white p-6 shadow-sm ring-1 ring-black/5 lg:p-8">
              <Antetitulo>Al terminar sabrás</Antetitulo>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {c.aprenderas.map((a) => (
                  <li key={a} className="flex gap-3 text-justify leading-relaxed text-tertiary">
                    <Palomita />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-sm border-l-4 border-secondary bg-white p-6 shadow-sm ring-1 ring-black/5 lg:p-8">
              <Antetitulo>Temario</Antetitulo>
              <ol className="mt-4 space-y-3">
                {c.temario.map((t, i) => (
                  <li key={t} className="flex gap-4 leading-relaxed text-tertiary">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-secondary">{i + 1}</span>
                    <span className="pt-0.5">{t}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-justify text-sm leading-relaxed text-tertiary">
                <span className="font-bold text-primary">Requisitos. </span>
                {c.requisitos}
              </p>
            </section>
          </div>

          {/* La inscripción, siempre a la vista */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5">
              <div className="relative aspect-[16/10] w-full bg-primary">
                <Image src={c.foto} alt="" fill sizes="(max-width: 1024px) 100vw, 360px" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Próximas fechas</p>
                {fechas.length ? (
                  <ul className="mt-3 space-y-2">
                    {fechas.map((f) => (
                      <li key={f.texto} className="font-bold text-primary">{f.texto}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-justify leading-relaxed text-tertiary">
                    Estamos armando el próximo grupo. Aparta tu lugar y te avisamos la fecha y el costo.
                  </p>
                )}
                <a href={whatsappMini(c)} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-2 rounded-xs bg-[#25D366] px-5 py-3.5 font-bold text-white transition-opacity hover:opacity-90">
                  Apartar por WhatsApp
                </a>
                <a href="#contacto" className="mt-3 flex items-center justify-center rounded-xs border-2 border-primary px-5 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                  Dejar mis datos
                </a>
                <p className="mt-4 text-justify text-xs leading-relaxed text-tertiary">{FORMATO_MINI.grupo}. Te enviamos el enlace de la sesión al inscribirte.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Más temas */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Antetitulo>Más mini cursos</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary">Otros temas en vivo</h2>
          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {otros.map((o) => (
              <li key={o.slug}>
                <TarjetaMiniCurso curso={o} />
              </li>
            ))}
          </ul>
          <p className="mt-8 text-justify text-tertiary">
            ¿Quieres dominar la técnica completa y certificarte?{" "}
            <Link href="/cursos#catalogo" prefetch={false} className="font-bold text-primary underline underline-offset-4 hover:text-secondary">
              Conoce las capacitaciones con certificado y los talleres prácticos
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="contacto" className="w-full">
        <div className="w-full bg-secondary px-6 py-10 text-center lg:py-12">
          <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Aparta tu lugar</h2>
          <p className="mx-auto mt-3 max-w-2xl text-justify text-lg leading-relaxed text-primary/80">
            Déjanos tus datos y te respondemos con la próxima fecha, el costo y el enlace de {c.titulo.charAt(0).toLowerCase() + c.titulo.slice(1)}.
          </p>
        </div>
        <ContactForm curso={c.titulo} />
      </section>
    </main>
  );
}
