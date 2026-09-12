import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import ContactFormWebinarCustom from "@/components/organisms/ContactFormWebinarCustom";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Webinar Herramientas Predictivas",
  description:
    "Webinar gratuito el 6 de octubre a las 11:00 a.m.: qué herramienta predictiva usar en cada equipo de tu planta y cómo interpretar lo que te dice.",
  alternates: {
    canonical: "/webinar",
  },
  openGraph: {
    title: "Webinar Herramientas Predictivas | Grupo DIAPSA",
    description:
      "Webinar gratuito el 6 de octubre a las 11:00 a.m. sobre herramientas de mantenimiento predictivo.",
    url: "/webinar",
    type: "website",
  },
};

export default function WebinarPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        title="WEBINAR GRATUITO"
        subtitle="Herramientas Predictivas · Martes 6 de octubre, 11:00 a.m."
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Webinar Details */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Foto real de una sesión de DIAPSA. La página no tenía ninguna
                  imagen: sólo texto sobre fondo gris. */}
              <div className="relative aspect-[21/9] w-full">
                <Image
                  src="/images/gallery/capacitacion-img-2.jpg"
                  alt="Sesión de capacitación de Grupo DIAPSA con participantes usando herramientas de diagnóstico"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
                <div className="absolute inset-0 bg-primary/45" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                    Webinar gratuito
                  </span>
                  <h2 className="mt-3 text-2xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow">
                    Herramientas Predictivas
                  </h2>
                </div>
              </div>

              {/* Cuándo es. Antes la fecha no aparecía por ningún lado de la
                  página: sólo un "Por confirmar" escondido en el formulario. */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-10 border-b border-gray-200 bg-gray-50 px-8 py-5">
                {/* La fecha agenda el evento. Antes era un div muerto, y la
                    analítica registró gente pulsándolo: en una página de evento,
                    con un icono de calendario al lado, se espera poder guardarlo.
                    Quien lo agenda, además, es quien acaba asistiendo. */}
                <a
                  href="/webinar-herramientas-predictivas.ics"
                  download
                  className="group flex items-center gap-3 rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
                  <svg className="h-6 w-6 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-tertiary">Fecha</p>
                    <p className="font-bold text-primary group-hover:underline">Martes 6 de octubre</p>
                    <p className="text-xs font-medium text-secondary">Agregar a mi calendario</p>
                  </div>
                </a>
                {/* La hora lleva al mismo sitio: quien quiere guardarlo tanto
                    puede pulsar el día como la hora, y las dos deben responder. */}
                <a
                  href="/webinar-herramientas-predictivas.ics"
                  download
                  className="group flex items-center gap-3 rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
                  <svg className="h-6 w-6 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-tertiary">Hora</p>
                    <p className="font-bold text-primary group-hover:underline">11:00 a.m. (centro de México)</p>
                    <p className="text-xs font-medium text-secondary">Dura 60 min + preguntas</p>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <svg className="h-6 w-6 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-tertiary">Modalidad</p>
                    <p className="font-bold text-primary">En línea</p>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10">

              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 mb-4">
                  Descubre cómo implementar estrategias efectivas de mantenimiento predictivo
                  utilizando las últimas tecnologías disponibles en el mercado.
                </p>

                <h3 className="text-lg font-semibold text-primary mt-6 mb-3">
                  En este webinar aprenderás:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-secondary mt-0.5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Fundamentos del mantenimiento predictivo industrial
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-secondary mt-0.5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Tecnologías clave: análisis de vibraciones, termografía, ultrasonido
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-secondary mt-0.5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Casos de éxito y ROI del mantenimiento predictivo
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-secondary mt-0.5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Herramientas y software recomendados
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-secondary shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Duración</p>
                      <p className="text-gray-600">60 minutos + Q&A</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-secondary shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Certificado</p>
                      <p className="text-gray-600">Digital de participación</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-secondary shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Material</p>
                      <p className="text-gray-600">Presentación descargable</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-secondary shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Cupos</p>
                      <p className="text-gray-600">Limitados</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-6 text-center">
              Regístrate Gratis
            </h3>
            <ContactFormWebinarCustom
              webinarTitle="Herramientas Predictivas"
              webinarDate="Martes 6 de octubre de 2026, 11:00 a.m."
            />
          </div>

          {/* Additional info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              ¿Tienes preguntas?{" "}

              <Link
                href="/#contacto"
                className="text-secondary hover:underline font-medium">
                Contáctanos
              </Link>

            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
