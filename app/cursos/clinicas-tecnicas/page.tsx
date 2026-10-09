import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/organisms/PageHeader";
import ContactForm from "@/components/organisms/ContactForm";
import TarjetaClinica from "@/components/organisms/TarjetaClinica";
import Antetitulo from "@/components/atoms/Antetitulo";
import VideoBucle from "@/components/atoms/VideoBucle";
import JsonLd, { createBreadcrumbSchema } from "@/components/atoms/JsonLd";
import { TECNICAS } from "@/lib/cursos";
import { CLINICAS, FORMATO_CLINICA, NIVELES, RUTA_CLINICAS, whatsappClinica } from "@/lib/clinicas";

export const metadata: Metadata = {
  title: "Clínicas técnicas en vivo: vibraciones y termografía",
  description: "Sesiones en línea de dos horas sobre un tema puntual, con tu caso: vibraciones, configuración de la cámara termográfica, transformadores secos y más.",
  alternates: { canonical: RUTA_CLINICAS },
  openGraph: {
    title: "Clínicas técnicas en vivo | DIAPSA",
    description: "Un problema concreto de mantenimiento predictivo, resuelto en vivo con un especialista y a un costo accesible.",
    url: RUTA_CLINICAS,
    type: "website",
  },
};

const DATOS = [
  { v: FORMATO_CLINICA.modalidad, t: "Te conectas desde donde estés y preguntas en el momento." },
  { v: FORMATO_CLINICA.duracion, t: "Una sola sesión, sin descuidar el turno." },
  { v: "Trae tu caso", t: "Tu termograma, tu espectro o tu duda se vuelve el ejemplo de la sesión." },
  { v: "Costo accesible", t: "Para resolver un tema o probar una técnica antes de invertir en ella." },
];

// Cómo funciona una clínica, de la inscripción a la sesión
const PASOS = [
  { t: "Eliges el tema", d: "El que necesitas resolver hoy, no el temario completo de la técnica." },
  { t: "Apartas tu lugar", d: "Por WhatsApp o con el formulario; te confirmamos fecha, costo y enlace." },
  { t: "Nos mandas tu caso", d: "Si quieres, una imagen, una lectura o una duda de tu planta, sin datos de tu empresa." },
  { t: "Clínica en vivo", d: "El especialista explica el tema, lo aplica a casos reales y resuelve el tuyo con el grupo." },
];

// La diferencia con la otra línea, para que nadie compre lo que no busca
const COMPARA = [
  { k: "Duración", cli: "Una sesión", cap: "Más horas, con práctica" },
  { k: "Modalidad", cli: "En línea, en vivo", cap: "Presencial, en tu planta o en Saltillo" },
  { k: "Alcance", cli: "Un tema puntual y tu caso", cap: "La técnica completa" },
  { k: "Certificado", cli: "No", cap: "Certificación por categoría ISO 18436" },
];

export default function ClinicasPage() {
  // Por técnica, en orden de ruta (para empezar, aplícalo, diagnostica), y
  // aparte las que combinan técnicas sobre un tipo de equipo.
  const tecnicas = TECNICAS.map((t) => ({
    ...t,
    clinicas: CLINICAS.filter((c) => c.eje === "tecnica" && c.tecnica === t.clave).sort((x, y) => x.nivel - y.nivel),
  })).filter((t) => t.clinicas.length);
  const porEquipo = CLINICAS.filter((c) => c.eje === "equipo").sort((x, y) => x.nivel - y.nivel);
  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Cursos", url: "/cursos" },
    { name: "Clínicas técnicas", url: RUTA_CLINICAS },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <JsonLd data={createBreadcrumbSchema(breadcrumbs)} />
      <PageHeader
        title="Clínicas técnicas"
        subtitle="Un tema puntual, en vivo, con un especialista y tu propio caso"
        breadcrumbs={breadcrumbs.map((b) => ({ label: b.name, link: b.url }))}
      />

      {/* Qué es una clínica */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <Antetitulo>Qué es una clínica</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Un problema concreto, resuelto en vivo con quien lo hace en planta</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
              Cada clínica resuelve una sola cosa: entender las vibraciones desde cero, configurar bien tu cámara termográfica o saber qué revisar en un transformador seco.
              La imparten los mismos analistas que diagnostican maquinaria todos los días, y buena parte de la sesión es para casos reales, incluido el tuyo si lo traes.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#temas" className="inline-flex items-center justify-center rounded-xs bg-primary px-7 py-3.5 font-bold text-white transition-colors hover:bg-secondary hover:text-primary">
                Ver los temas
              </a>
              <a href={whatsappClinica()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xs border-2 border-primary px-7 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                Preguntar por WhatsApp
              </a>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DATOS.map((x) => (
              <li key={x.v} className="rounded-sm border-l-4 border-secondary bg-gray-50 p-5">
                <p className="text-xl font-extrabold text-primary">{x.v}</p>
                <p className="mt-1 text-justify text-sm leading-relaxed text-tertiary">{x.t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="w-full bg-primary py-12 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Antetitulo>Cómo funciona</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight lg:text-4xl">De la inscripción a la sesión</h2>
          {/* El recorrido en video, en grande (Emiliano, 2026-10-09) */}
          <div className="mt-8 overflow-hidden rounded-xl bg-white/5 p-2 ring-1 ring-white/10 lg:p-3">
            <VideoBucle
              className="block aspect-[16/10] w-full rounded-lg object-cover"
              src="/videos/clinicas/clinica-proceso.mp4"
              poster="/videos/clinicas/clinica-proceso.jpg"
              descripcion="Los cuatro pasos de una clínica técnica: eliges el tema, apartas tu lugar por WhatsApp, mandas tu caso y el especialista lo resuelve en vivo con el grupo"
            />
          </div>
          <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p, i) => (
              <li key={p.t} className="rounded-sm bg-white/[0.06] p-5 ring-1 ring-white/10">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-lg font-extrabold text-primary">{i + 1}</span>
                <p className="mt-4 text-lg font-extrabold">{p.t}</p>
                <p className="mt-1 text-justify text-sm leading-relaxed text-white/70">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Los temas: una ruta de tres niveles por técnica y, aparte, por tipo de equipo */}
      <section id="temas" className="w-full scroll-mt-28 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Antetitulo>Los temas</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Elige la clínica que necesitas</h2>
          <p className="mt-4 max-w-3xl text-justify text-lg leading-relaxed text-tertiary">
            Cada técnica tiene una ruta de tres niveles. Empieza en el que te corresponde, o toma solo la clínica que resuelve tu duda.
          </p>

          {/* La ruta */}
          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {NIVELES.map((n) => (
              <li key={n.n} className="flex gap-4 rounded-sm bg-white p-5 shadow-sm ring-1 ring-black/5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-secondary">{n.n}</span>
                <span>
                  <span className="block text-lg font-extrabold text-primary">{n.nombre}</span>
                  <span className="mt-0.5 block text-justify text-sm leading-relaxed text-tertiary">{n.texto}</span>
                </span>
              </li>
            ))}
          </ol>

          {/* Por técnica */}
          {tecnicas.map((t) => (
            <div key={t.clave} className="mt-12">
              <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
                <h3 className="text-2xl font-extrabold text-primary">{t.nombre}</h3>
                <span className="text-sm font-semibold text-tertiary">{t.clinicas.length} clínicas</span>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {t.clinicas.map((c) => (
                  <li key={c.slug}>
                    <TarjetaClinica curso={c} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Por tipo de equipo */}
          {porEquipo.length > 0 && (
            <div className="mt-14 rounded-sm bg-primary p-6 text-white lg:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">Por tipo de equipo</p>
              <h3 className="mt-2 text-2xl font-extrabold lg:text-3xl">Un equipo, todas las técnicas</h3>
              <p className="mt-3 max-w-3xl text-justify leading-relaxed text-white/75">
                Para quien tiene a su cargo un tipo de equipo y quiere saber qué revisarle con vibraciones, termografía y ultrasonido en una sola sesión.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {porEquipo.map((c) => (
                  <li key={c.slug}>
                    <TarjetaClinica curso={c} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Para un equipo completo */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div>
            <Antetitulo>Para tu equipo</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Una clínica solo para tu planta</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
              Si varias personas de tu equipo necesitan el mismo tema, armamos la clínica para ustedes, con sus equipos y sus casos, en la fecha que les acomode.
            </p>
          </div>
          <a href="#contacto" className="inline-flex items-center justify-center rounded-xs bg-primary px-7 py-3.5 font-bold text-white transition-colors hover:bg-secondary hover:text-primary lg:justify-self-end">
            Pedir una clínica para mi equipo
          </a>
        </div>
      </section>

      {/* La diferencia con las capacitaciones */}
      <section className="w-full bg-gray-100 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Antetitulo>Cuál te conviene</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Clínica técnica o capacitación con certificado</h2>
          <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
            La clínica sirve para resolver un tema o para probar una técnica antes de invertir en ella. Si lo que buscas es dominarla y certificarte, lo tuyo es la capacitación completa.
          </p>
          <div className="mt-8 overflow-hidden rounded-sm bg-white ring-1 ring-black/5">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] bg-primary text-[11px] font-bold uppercase tracking-wide text-secondary sm:text-sm sm:tracking-widest">
              <span className="p-3 sm:p-4" />
              <span className="p-3 sm:p-4">Clínica</span>
              <span className="p-3 sm:p-4">Capacitación</span>
            </div>
            {COMPARA.map((f) => (
              <div key={f.k} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] border-t border-gray-100 text-sm text-primary sm:text-base">
                <span className="p-3 font-bold text-tertiary sm:p-4">{f.k}</span>
                <span className="p-3 sm:p-4">{f.cli}</span>
                <span className="p-3 sm:p-4">{f.cap}</span>
              </div>
            ))}
          </div>
          <Link href="/cursos#catalogo" prefetch={false} className="mt-8 inline-flex items-center justify-center rounded-xs border-2 border-primary px-7 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
            Ver capacitaciones y talleres
          </Link>
        </div>
      </section>

      {/* Apartar lugar, proponer un tema o pedir una clínica cerrada */}
      <section id="contacto" className="w-full">
        <div className="w-full bg-secondary px-6 py-10 text-center lg:py-12">
          <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Aparta tu lugar o propón un tema</h2>
          <p className="mx-auto mt-3 max-w-2xl text-justify text-lg leading-relaxed text-primary/80">
            Marca las clínicas que te interesan y te avisamos de la próxima fecha y el costo. Si el tema no está o la quieres solo para tu equipo, escríbelo en el mensaje.
          </p>
        </div>
        <ContactForm curso="" />
      </section>
    </main>
  );
}
