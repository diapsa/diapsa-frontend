import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import Link from "next/link";
import Image from "next/image";

const OG_IMAGE = "/images/og-images/og-image.jpg";

export const metadata: Metadata = {
  title: "Servicios de Mantenimiento Predictivo",
  description:
    "Servicios de mantenimiento predictivo, monitoreo de condicion, monitoreo continuo, diagnostico industrial e inteligencia operativa para Mexico y Sudamerica.",
  keywords: [
    "servicios mantenimiento predictivo",
    "servicios de mantenimiento",
    "mantenimiento predictivo",
    "monitoreo de condicion",
    "monitoreo de condición industrial",
    "mantenimiento industrial Sudamerica",
    "monitoreo continuo",
    "DIAPSA START",
    "IDAP plataforma activos industriales",
    "detección de gas LDAR",
    "termografía industrial México",
  ],
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Servicios | Grupo DIAPSA",
    description:
      "Servicios de mantenimiento predictivo y monitoreo de condicion para proteger activos industriales en Mexico y Sudamerica.",
    url: "/servicios",
    type: "website",
    locale: "es_MX",
    siteName: "Grupo DIAPSA",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Servicios Grupo DIAPSA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@grupodiapsa",
    title: "Servicios | Grupo DIAPSA",
    description:
      "Servicios de mantenimiento predictivo y monitoreo de condicion para proteger activos industriales.",
    images: [OG_IMAGE],
  },
};

// ── Datos de servicios ─────────────────────────────────────────────────────
const services = [
  {
    href: "/servicios/monitoreo-condicion",
    category: "Servicio Core",
    categoryColor: "bg-secondary/15 text-secondary border-secondary/30",
    title: "Monitoreo de Condición",
    tagline: "Detecta fallas antes de que ocurran.",
    description:
      "Durante más de 20 años hemos protegido activos industriales con inspecciones periódicas multidisciplinarias. Combinamos termografía infrarroja, análisis de vibraciones, ultrasonido y diagnóstico de maquinaria para darte una imagen clara del estado real de tu equipo, no lo que crees que está pasando.",
    features: [
      "Termografía infrarroja",
      "Análisis de vibraciones",
      "Ultrasonido industrial",
      "Diagnóstico de maquinaria",
    ],
    image: "/images/disciplinas/termografia.jpg",
    imageAlt: "Técnico realizando inspección de termografía en planta industrial",
    featured: true,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    href: "/servicios/diagnostico-situacional",
    category: "Diagnóstico inicial",
    categoryColor: "bg-teal-500/10 text-teal-600 border-teal-400/30",
    title: "Diagnóstico Situacional",
    tagline: "El historial médico de tus activos industriales.",
    description:
      "El punto de partida de todo programa predictivo eficiente. Documentamos el estado actual, el historial de cada equipo y los patrones de comportamiento para establecer la línea base de tu programa de mantenimiento — porque sin referencia no hay predicción.",
    features: [
      "Inventario y clasificación de activos",
      "Medición de condición base",
      "Análisis e interpretación de datos",
      "Reporte ejecutivo con hoja de ruta",
    ],
    image: "/images/diagnostico-situacional/engineer-checking-machinery.webp",
    imageAlt: "Especialista realizando diagnóstico situacional en planta industrial",
    featured: false,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: "/servicios/monitoreo-continuo",
    category: "Monitoreo 24/7",
    categoryColor: "bg-blue-500/10 text-blue-600 border-blue-400/30",
    title: "Monitoreo Continuo",
    tagline: "Transformamos señales en decisiones.",
    description:
      "Instalar sensores no es monitorear. Muchas plantas tienen un flujo constante de datos sin estructura para actuar. Nosotros diseñamos programas completos: diagnóstico situacional, configuración a la medida y análisis remoto permanente para que cada dato se convierta en una acción.",
    features: [
      "Sensores online 24/7",
      "Análisis remoto en tiempo real",
      "Configuración a la medida",
      "Dashboard de condición",
    ],
    image: "/images/monitoreo-continuo/tecnico-laptop.jpeg",
    imageAlt: "Técnico monitorizando condición de equipos en tiempo real con laptop",
    featured: false,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    href: "/servicios/diapsa-start",
    category: "Programa de inicio",
    categoryColor: "bg-green-500/10 text-green-600 border-green-400/30",
    title: "DIAPSA START",
    tagline: "Aprender haciendo. Construir capacidades.",
    description:
      "Para empresas que quieren arrancar con mantenimiento predictivo —o reestructurarlo— de forma ordenada. Un programa de 4 etapas que combina capacitación en planta, diagnóstico situacional, mediciones certificadas y gestión de la información. El punto de partida de una cultura de confiabilidad.",
    features: [
      "Capacitación técnica en planta",
      "Diagnóstico situacional",
      "Mediciones certificadas",
      "Gestión de datos e historial",
    ],
    image: "/images/servicios/placeholder.jpg",
    imageAlt: "Ingeniero de mantenimiento con programa DIAPSA START en planta",
    featured: false,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    href: "/servicios/idap",
    category: "Plataforma digital",
    categoryColor: "bg-purple-500/10 text-purple-600 border-purple-400/30",
    title: "IDAP",
    tagline: "Tu planta, bajo control. En un solo lugar.",
    description:
      "Plataforma propietaria de DIAPSA para la gestión integral de activos industriales. Centraliza toda la información técnica de tu planta: historial de inspecciones, indicadores de criticidad, resultados por disciplina y tendencias comparativas. Sin hojas de cálculo. Sin correos con adjuntos.",
    features: [
      "Indicadores de criticidad de activos",
      "Múltiples disciplinas integradas",
      "Seguimiento histórico y tendencias",
      "Reportes con estados claros",
    ],
    image: "/images/idap/idap-logo.png",
    imageAlt: "Dashboard IDAP — plataforma de gestión integral de activos industriales",
    featured: false,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    href: "/servicios/deteccion-gas",
    category: "Sector Hidrocarburos",
    categoryColor: "bg-orange-500/10 text-orange-600 border-orange-400/30",
    title: "Detección de Gas",
    tagline: "Protegemos su operación y el medio ambiente.",
    description:
      "Servicio especializado de detección de fugas de gas (LDAR) para el sector hidrocarburos. Cumplimiento regulatorio PPCIEM ante la ASEA, reducción de emisiones de metano y mitigación de riesgos operativos. Detectamos lo que el ojo no puede ver.",
    features: [
      "Cumplimiento PPCIEM / ASEA",
      "Reducción de emisiones de metano",
      "Tecnología LDAR especializada",
      "Reportes regulatorios",
    ],
    image: "/images/servicios/usando-camara-acustica-gas.jpg",
    imageAlt: "Técnico con cámara acústica realizando detección de fugas de gas LDAR",
    featured: false,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

// ── Componente de etiqueta de capítulo ────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em] shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-secondary/20" />
    </div>
  );
}

export default function ServiciosProductosPage() {
  const featured = services[0];
  const secondary = services[1];
  const rest = services.slice(2);

  return (
    <main className="bg-white">
      <PageHeader
        title="SERVICIOS"
        subtitle="Soluciones integrales de mantenimiento predictivo para industrias en Mexico y Sudamerica"
      />

      {/* ── Filosofía: el ecosistema ──────────────────────────────────── */}
      <section className="bg-primary py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-12 h-1.5 bg-secondary rounded-full" />
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                De la primera inspección
                <br />
                <span className="text-secondary italic">a la inteligencia operativa.</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Cada servicio de DIAPSA está diseñado para un momento
                específico en la madurez de tu programa de mantenimiento.
                Puedes empezar desde cero o integrar lo que ya tienes —
                siempre con un objetivo claro: cero paros no programados en plantas
                industriales de Mexico y Sudamérica.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "+20", label: "Años protegiendo activos" },
                { num: "5", label: "Soluciones complementarias" },
                { num: "360°", label: "Visión de tus activos" },
                { num: "0", label: "Paros no programados como meta" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-sm p-5 text-center"
                >
                  <p className="text-secondary text-3xl font-extrabold mb-1">
                    {stat.num}
                  </p>
                  <p className="text-white/60 text-xs leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Catálogo de servicios ─────────────────────────────────────── */}
      <section className="py-16 lg:py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionLabel label="Nuestros servicios" />

          {/* Servicio destacado */}
          <div className="mb-8">
            <Link href={featured.href} className="group block">
              <article className="relative bg-primary rounded-sm overflow-hidden border border-white/5 hover:border-secondary/40 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Imagen */}
                  <div className="relative h-64 lg:h-auto min-h-72 overflow-hidden">
                    <Image
                      src={featured.image}
                      alt={featured.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Overlay con gradiente hacia el contenido */}
                    <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-primary/60 hidden lg:block" />
                    {/* Badge sobre imagen */}
                    <div className="absolute top-5 left-5">
                      <span className={`inline-flex items-center border text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm ${featured.categoryColor}`}>
                        {featured.category}
                      </span>
                    </div>
                  </div>
                  {/* Contenido */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center space-y-6">
                    <div className="text-secondary">{featured.icon}</div>
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 group-hover:text-secondary transition-colors duration-300">
                        {featured.title}
                      </h2>
                      <p className="text-secondary font-semibold text-lg italic mb-4">
                        {featured.tagline}
                      </p>
                      <p className="text-white/65 leading-relaxed text-sm lg:text-base">
                        {featured.description}
                      </p>
                    </div>
                    <ul className="space-y-2.5">
                      {featured.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div>
                      <span className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-6 py-2.5 rounded-xs hover:bg-white transition-all duration-300 text-sm group-hover:gap-4">
                        Conocer más
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                {/* Borde inferior animado */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </article>
            </Link>
          </div>

          {/* Servicio secundario destacado — Diagnóstico Situacional */}
          <div className="mb-8">
            <Link href={secondary.href} className="group block">
              <article className="relative bg-white rounded-sm overflow-hidden border border-gray-100 hover:border-secondary/40 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Contenido — izquierda */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center space-y-5 order-2 lg:order-1">
                    <span className={`inline-flex items-center self-start border text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${secondary.categoryColor}`}>
                      {secondary.category}
                    </span>
                    <div className="text-secondary">{secondary.icon}</div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-extrabold text-primary mb-2 group-hover:text-secondary transition-colors duration-300">
                        {secondary.title}
                      </h2>
                      <p className="text-secondary font-semibold text-base italic mb-4">
                        {secondary.tagline}
                      </p>
                      <p className="text-tertiary leading-relaxed text-sm lg:text-base">
                        {secondary.description}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {secondary.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-tertiary text-sm">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div>
                      <span className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-2.5 rounded-xs hover:bg-secondary hover:text-primary transition-all duration-300 text-sm group-hover:gap-4">
                        Conocer más
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  {/* Imagen — derecha */}
                  <div className="relative h-64 lg:h-auto min-h-72 overflow-hidden order-1 lg:order-2">
                    <Image
                      src={secondary.image}
                      alt={secondary.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-300" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </article>
            </Link>
          </div>

          {/* Grid de servicios restantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((service) => (
              <Link key={service.href} href={service.href} className="group block h-full">
                <article className="h-full flex flex-col bg-white rounded-sm border border-gray-100 hover:border-secondary/30 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300">
                  {/* Imagen */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/10 transition-colors duration-300" />
                    {/* Badge sobre la imagen */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center border text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm bg-white/80 ${service.categoryColor}`}>
                        {service.category}
                      </span>
                    </div>
                    {/* Ícono sobre imagen */}
                    <div className="absolute bottom-4 right-4 w-9 h-9 bg-primary/80 backdrop-blur-sm rounded-sm flex items-center justify-center text-secondary">
                      {service.icon}
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    <div>
                      <h3 className="font-bold text-primary text-xl mb-1 leading-snug group-hover:text-secondary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-secondary font-semibold text-sm italic mb-3">
                        {service.tagline}
                      </p>
                      <p className="text-tertiary text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <ul className="space-y-2 mt-auto pt-2">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-tertiary">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Footer CTA */}
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                      Conocer más
                    </span>
                    <svg
                      className="w-4 h-4 text-secondary group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  {/* Borde inferior animado */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────────────── */}
      <section className="bg-primary py-16 lg:py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-secondary font-bold uppercase tracking-widest text-xs mb-4">
            ¿No sabes por dónde empezar?
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight">
            Te ayudamos a encontrar el servicio que necesita tu operación
          </h2>
          <p className="text-white/65 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Cada planta tiene necesidades distintas. Cuéntanos dónde estás hoy y
            nuestro equipo técnico te recomendará el punto de entrada ideal en nuestro ecosistema.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-10 py-4 rounded-xs hover:bg-white hover:text-primary transition-all duration-300 shadow-md text-lg"
          >
            Cuéntanos sobre ti →
          </Link>
        </div>
      </section>
    </main>
  );
}
