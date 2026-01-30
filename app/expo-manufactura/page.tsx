import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import ContactFormExpo from "@/components/organisms/ContactFormExpo";

export const metadata: Metadata = {
  title: "Expo Manufactura DIAPSA | Soluciones en Mantenimiento Predictivo Industrial",
  description:
    "Únete a nosotros en Expo Manufactura DIAPSA para descubrir las últimas soluciones en mantenimiento predictivo industrial. Regístrate ahora para asegurar tu lugar.",
  keywords: [
    "expo manufactura",
    "expo DIAPSA",
    "mantenimiento predictivo",
    "cursos industriales",
    "termografía",
    "vibraciones mecánicas",
    "ultrasonido",
  ],
  alternates: {
    canonical: "/expo-manufactura",
  },
  openGraph: {
    title: "Expo Manufactura DIAPSA | Soluciones en Mantenimiento Predictivo Industrial",
    description:
      "Únete a nosotros en Expo Manufactura DIAPSA para descubrir las últimas soluciones en mantenimiento predictivo industrial.",
    url: "/expo-manufactura",
    type: "website",
  },
};

export default function ExpoManufacturaPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        title="EXPO MANUFACTURA DIAPSA"
        subtitle="Descubre las últimas tecnologías en mantenimiento predictivo industrial"
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Event Details */}
          <div className="mb-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
              Evento de Soluciones Industriales
            </h2>
            <div className="flex flex-col lg:flex-row justify-center gap-6 text-gray-700">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Fecha por confirmar</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Ubicación por confirmar</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-6 text-center">
              Regístrate Ahora
            </h3>
            <ContactFormExpo
              eventName="Expo Manufactura DIAPSA"
              eventDate=""
            />
          </div>

          {/* Benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-secondary"
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
              </div>
              <h4 className="font-semibold text-primary mb-2">
                Demostraciones en Vivo
              </h4>
              <p className="text-sm text-gray-600">
                Conoce de primera mano cómo funcionan nuestras soluciones
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-secondary"
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
              </div>
              <h4 className="font-semibold text-primary mb-2">Networking</h4>
              <p className="text-sm text-gray-600">
                Conecta con otros profesionales de la industria
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-secondary"
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
              </div>
              <h4 className="font-semibold text-primary mb-2">
                Material Exclusivo
              </h4>
              <p className="text-sm text-gray-600">
                Recibe material técnico y promociones especiales
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
