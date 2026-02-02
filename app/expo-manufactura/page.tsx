import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import ContactFormExpo from "@/components/organisms/ContactFormExpo";

export const metadata: Metadata = {
  title: "¡Gracias por Visitarnos en Expo Manufactura! | DIAPSA",
  description:
    "Déjanos tus datos para enviarte más información sobre nuestros servicios de mantenimiento predictivo, cursos de capacitación y soluciones industriales.",
  keywords: [
    "expo manufactura",
    "expo DIAPSA",
    "mantenimiento predictivo",
    "cursos industriales",
    "termografía",
    "vibraciones mecánicas",
    "ultrasonido",
    "contacto DIAPSA",
  ],
  alternates: {
    canonical: "/expo-manufactura",
  },
  openGraph: {
    title: "¡Gracias por Visitarnos en Expo Manufactura! | DIAPSA",
    description:
      "Déjanos tus datos para enviarte más información sobre nuestros servicios y soluciones industriales.",
    url: "/expo-manufactura",
    type: "website",
  },
};

export default function ExpoManufacturaPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        title="¡GRACIAS POR VISITARNOS!"
        subtitle="Completa el formulario y te enviaremos toda la información que necesites"
      />

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Welcome Message */}
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
              Nos da gusto que hayas visitado nuestro stand
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Déjanos tus datos y nos pondremos en contacto contigo para brindarte más información sobre 
              nuestros servicios, cursos, cotizaciones o cualquier duda que tengas.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Te responderemos en menos de 24 horas hábiles</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-2 text-center">
              Déjanos tus Datos
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Así podremos darte seguimiento personalizado
            </p>
            <ContactFormExpo
              eventName="Expo Manufactura DIAPSA"
              eventDate=""
            />
          </div>

          {/* Next Steps */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-primary text-center mb-8">
              ¿Qué sigue después de dejar tus datos?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">
                  Contacto Personalizado
                </h4>
                <p className="text-sm text-gray-600">
                  Uno de nuestros especialistas te contactará para resolver tus dudas y ofrecerte la mejor solución
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">
                  Información Detallada
                </h4>
                <p className="text-sm text-gray-600">
                  Recibirás documentación técnica, cotizaciones o información de cursos según tu interés
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">
                  Solución a tu Medida
                </h4>
                <p className="text-sm text-gray-600">
                  Diseñaremos una propuesta ajustada a las necesidades específicas de tu empresa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
