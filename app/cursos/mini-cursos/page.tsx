import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/organisms/PageHeader";
import ContactForm from "@/components/organisms/ContactForm";
import TarjetaMiniCurso from "@/components/organisms/TarjetaMiniCurso";
import Antetitulo from "@/components/atoms/Antetitulo";
import JsonLd, { createBreadcrumbSchema } from "@/components/atoms/JsonLd";
import { TECNICAS } from "@/lib/cursos";
import { FORMATO_MINI, MINI_CURSOS, RUTA_MINI, whatsappMini } from "@/lib/mini-cursos";

export const metadata: Metadata = {
  title: "Mini cursos en vivo de vibraciones y termografía",
  description: "Sesiones en línea de dos horas sobre un tema puntual: vibraciones, configuración de la cámara termográfica, transformadores secos, bombas y más.",
  alternates: { canonical: RUTA_MINI },
  openGraph: {
    title: "Mini cursos en vivo | DIAPSA",
    description: "Temas puntuales de mantenimiento predictivo, en línea y en vivo, a un costo accesible.",
    url: RUTA_MINI,
    type: "website",
  },
};

const COMO = [
  { v: FORMATO_MINI.modalidad, t: "Te conectas desde donde estés y preguntas en el momento." },
  { v: FORMATO_MINI.duracion, t: "Una sola sesión, sin descuidar el turno." },
  { v: "Un tema puntual", t: "Lo que necesitas resolver, sin el temario completo." },
  { v: "Costo accesible", t: "Para probar una técnica o reforzar un tema." },
];

// La diferencia con la otra línea, para que nadie compre lo que no busca
const COMPARA = [
  { k: "Duración", mini: "Una sesión", cap: "Más horas, con práctica" },
  { k: "Modalidad", mini: "En línea, en vivo", cap: "Presencial, en tu planta o en Saltillo" },
  { k: "Alcance", mini: "Un tema puntual", cap: "La técnica completa" },
  { k: "Certificado", mini: "No", cap: "Certificación por categoría ISO 18436" },
];

export default function MiniCursosPage() {
  const tecnicas = TECNICAS.map((t) => ({ ...t, cursos: MINI_CURSOS.filter((c) => c.tecnica === t.clave) })).filter((t) => t.cursos.length);
  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Cursos", url: "/cursos" },
    { name: "Mini cursos en vivo", url: RUTA_MINI },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <JsonLd data={createBreadcrumbSchema(breadcrumbs)} />
      <PageHeader
        title="Mini cursos en vivo"
        subtitle="Temas puntuales, en línea y a un costo accesible"
        breadcrumbs={breadcrumbs.map((b) => ({ label: b.name, link: b.url }))}
      />

      {/* Qué son */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <Antetitulo>Aprende un tema en una tarde</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Lo puntual, explicado por quien lo hace en planta</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
              Cada mini curso resuelve una sola cosa: entender las vibraciones desde cero, configurar bien tu cámara termográfica o saber qué revisar en un transformador seco.
              Los imparten los mismos analistas que diagnostican maquinaria todos los días, con casos reales y tiempo para tus preguntas.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#temas" className="inline-flex items-center justify-center rounded-xs bg-primary px-7 py-3.5 font-bold text-white transition-colors hover:bg-secondary hover:text-primary">
                Ver los temas
              </a>
              <a href={whatsappMini()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xs border-2 border-primary px-7 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                Preguntar por WhatsApp
              </a>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {COMO.map((x) => (
              <li key={x.v} className="rounded-sm border-l-4 border-secondary bg-gray-50 p-5">
                <p className="text-xl font-extrabold text-primary">{x.v}</p>
                <p className="mt-1 text-justify text-sm leading-relaxed text-tertiary">{x.t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Los temas, por técnica */}
      <section id="temas" className="w-full scroll-mt-28 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Antetitulo>Los temas</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Elige el tema que necesitas</h2>
          {tecnicas.map((t) => (
            <div key={t.clave} className="mt-10">
              <h3 className="text-xl font-extrabold text-primary">{t.nombre}</h3>
              <ul className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {t.cursos.map((c) => (
                  <li key={c.slug}>
                    <TarjetaMiniCurso curso={c} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* La diferencia con las capacitaciones */}
      <section className="w-full bg-primary py-12 text-white lg:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Antetitulo>Cuál te conviene</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight lg:text-4xl">Mini curso o capacitación con certificado</h2>
          <p className="mt-4 text-justify text-lg leading-relaxed text-white/75">
            El mini curso sirve para resolver un tema o para probar una técnica antes de invertir en ella. Si lo que buscas es dominarla y certificarte, lo tuyo es la capacitación completa.
          </p>
          <div className="mt-8 overflow-hidden rounded-sm ring-1 ring-white/15">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] bg-white/10 text-[11px] font-bold uppercase tracking-wide sm:text-sm sm:tracking-widest">
              <span className="p-3 sm:p-4" />
              <span className="p-3 text-secondary sm:p-4">Mini curso</span>
              <span className="p-3 text-secondary sm:p-4">Capacitación</span>
            </div>
            {COMPARA.map((f) => (
              <div key={f.k} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] border-t border-white/10 text-sm sm:text-base">
                <span className="p-3 font-bold text-white/60 sm:p-4">{f.k}</span>
                <span className="p-3 sm:p-4">{f.mini}</span>
                <span className="p-3 sm:p-4">{f.cap}</span>
              </div>
            ))}
          </div>
          <Link href="/cursos#catalogo" prefetch={false} className="mt-8 inline-flex items-center justify-center rounded-xs bg-secondary px-7 py-3.5 font-bold text-primary transition-colors hover:bg-white">
            Ver capacitaciones y talleres
          </Link>
        </div>
      </section>

      {/* Apartar lugar o proponer un tema */}
      <section id="contacto" className="w-full">
        <div className="w-full bg-secondary px-6 py-10 text-center lg:py-12">
          <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Aparta tu lugar o propón un tema</h2>
          <p className="mx-auto mt-3 max-w-2xl text-justify text-lg leading-relaxed text-primary/80">
            Marca los temas que te interesan y te avisamos de la próxima fecha y el costo. Si el tema que necesitas no está, escríbelo en el mensaje.
          </p>
        </div>
        <ContactForm curso="" />
      </section>
    </main>
  );
}
