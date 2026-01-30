import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import ContactFormWebinarCustom from "@/components/organisms/ContactFormWebinarCustom";

export const metadata: Metadata = {
  title: "Webinar DIAPSA | Capacitación en Mantenimiento Predictivo",
  description:
    "Únete a nuestro webinar gratuito sobre mantenimiento predictivo industrial. Aprende de expertos y mejora las estrategias de mantenimiento de tu planta.",
  alternates: {
    canonical: "/webinar",
  },
  openGraph: {
    title: "Webinar DIAPSA | Capacitación en Mantenimiento Predictivo",
    description:
      "Únete a nuestro webinar gratuito sobre mantenimiento predictivo industrial.",
    url: "/webinar",
    type: "website",
  },
};

export default function WebinarPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        title="WEBINAR GRATUITO"
        subtitle="Aprende las mejores prácticas en mantenimiento predictivo industrial"
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Webinar Details */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
                Introducción al Mantenimiento Predictivo 4.0
              </h2>
              
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

          {/* Registration Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-6 text-center">
              Regístrate Gratis
            </h3>
            <ContactFormWebinarCustom
              webinarTitle="Introducción al Mantenimiento Predictivo 4.0"
              webinarDate="Por confirmar"
            />
          </div>

          {/* Additional info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              ¿Tienes preguntas?{" "}
              <a
                href="/#contacto"
                className="text-secondary hover:underline font-medium"
              >
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
