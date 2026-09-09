import type { Metadata } from "next";
import PageHeader from "@/components/organisms/PageHeader";
import MethodologyProcess from "@/components/organisms/MethodologyProcess";
import disciplinasData from "@/data/disciplinas.json";
import Image from "next/image";
import Link from "next/link";
import { Clients } from "@/components/organisms/Clients";
import { getFeaturedSuccessCases } from "@/lib/api/posts";
import CasosExitoTeaser from "@/components/organisms/CasosExitoTeaser";

export const metadata: Metadata = {
  title: "Nuestra Metodología",
  description:
    "Metodología DIAPSA 360°: Un enfoque sistemático para maximizar la confiabilidad de tus equipos. Diagnóstico integral, análisis predictivo y estrategias de mantenimiento personalizadas.",
  keywords: [
    "metodología mantenimiento predictivo",
    "DIAPSA 360",
    "confiabilidad de equipos",
    "diagnóstico integral maquinaria",
    "estrategia mantenimiento industrial",
    "análisis predictivo México",
  ],
  alternates: {
    canonical: "/metodologia",
  },
  openGraph: {
    title: "Metodología DIAPSA 360° | Mantenimiento Predictivo",
    description:
      "22 años de experiencia en un enfoque sistemático para maximizar la confiabilidad de tus equipos industriales.",
    url: "/metodologia",
    type: "website",
  },
};

export default async function MetodologiaPage() {

  // Si el CMS no responde, la página carga igual y solo omite los casos.
  const cases = await getFeaturedSuccessCases().catch((error) => {
    console.error("[metodologia] No se pudieron cargar los casos de éxito:", error);
    return [];
  });

  return (
    <main>
      <PageHeader
        title="Nuestra Metodología"
        subtitle="Un enfoque sistemático para maximizar la confiabilidad de tus equipos"
      />

      <MethodologyProcess />

      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-1 items-center">
            {/* Left side - Image */}
            <div className="relative flex items-center justify-center h-100 lg:h-112.5">
              <Image
                src="/images/metodologia/22-años.jpg"
                alt="22 años de experiencia DIAPSA"
                fill
                className="object-fill"
              />
            </div>

            {/* Right side - Content */}
            <div className="relative bg-black flex flex-col justify-center space-y-6 px-6 lg:px-20 h-100 lg:h-112.5">
              {/* Title */}
              <h3 className="relative z-10 text-white text-xl font-bold leading-tight">
                Este proceso reúne 22 años de experiencia, conocimientos y metodologías de confiabilidad, apoyados en diagnósticos integrales de monitoreos de condición para maximizar el valor
              </h3>

              {/* Border */}
              <div className="relative z-10 w-full h-0.5 bg-secondary"></div>

              {/* Description */}
              <div className="relative z-10 text-gray-300  font-light text leading-relaxed">
                Además, exploramos las implicaciones económicas de cada escenario y diseñamos estrategias que equilibran confiabilidad, eficiencia y costos, generando resultados sostenibles en el tiempo.
              </div>

              {/* CTA Link */}
              <div className="relative z-10">
                <Link href="/contacto" className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3 rounded-xs hover:bg-white hover:text-primary transition-all duration-300 shadow-md [&>span]:hidden">
                  Contáctanos
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Title */}
            <h2 className="text-black text-4xl font-extrabold leading-tight mb-8">
              ¿QUÉ NOS HACE LÍDERES EN CONFIABILIDAD OPERATIVA Y MONITOREO PREDICTIVO?
            </h2>

            {/* Border */}
            <div className="w-24 h-1 bg-secondary mx-auto mb-8"></div>

            {/* Subtitle */}
            <p className="text-gray-700 text-lg md:text-3xl leading-relaxed">
              Dominamos múltiples disciplinas para ofrecer soluciones integrales que elevan la disponibilidad y eficiencia de tus activos.
            </p>
          </div>

          <div className="max-w-7xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disciplinasData.disciplines.map((discipline) => (
                <div key={discipline.title} className="relative h-87.5 rounded-sm overflow-hidden group cursor-pointer">
                  <Image
                    src={discipline.image}
                    alt={discipline.imageAlt}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:bg-black/80">
                    {/* Title */}
                    <h3 className="text-white text-xl md:text-2xl font-bold text-center transform">
                      {discipline.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-200 text-center text-sm md:text-base mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ">
                      {discipline.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xs hover:bg-secondary hover:text-primary transition-all duration-300 shadow-md"
            >
              Solicitar información
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

      </section>

      {/* Resultados de negocio */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase mb-4">
              ¿Y los resultados?
            </h2>
            <div className="w-24 h-1.5 bg-linear-to-r from-secondary to-amber-400 mx-auto rounded-full" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {[{
                label: "de efectividad en detección temprana de fallas críticas.",
                value: "95%",
                kicker: "",
              }, {
                label: "en el año 1",
                value: "150%",
                kicker: "Retorno de la inversión",
              }, {
                label: "en paros no planificados",
                value: "90%",
                kicker: "Reducción de",
              }].map((card, index) => (
                <div key={card.value} className={`relative group ${index === 1 ? "md:-mt-6 lg:-mt-10" : ""}`}>
                  <div
                    className="flex flex-col justify-center px-6 h-70 items-center shadow-xl transform transition-transform duration-300 hover:-translate-y-2"
                    style={{
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)",
                      backgroundImage: "linear-gradient(180deg, #fcd34d 0%, #fc9f01 60%, #d97706 100%)",
                    }}
                  >
                    <div className="text-center text-gray-900">
                      {card.kicker && (
                        <p className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-wider">
                          {card.kicker}
                        </p>
                      )}
                      <span className="block text-6xl md:text-7xl font-thin tracking-tight">
                        {card.value}
                      </span>
                      <p className="mt-3 text-sm md:text-base font-bold uppercase tracking-wide leading-tight">
                        {card.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full mt-8 lg:mt-0 flex flex-col justify-center text-center lg:text-left">
              <div className="p-6">
                <p className="text-xl md:text-4xl font-light text-gray-800">
                  El resultado de nuestro trabajo se mide en <span className="font-black">miles o millones en ahorros.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CasosExitoTeaser cases={cases} />
      <Clients />

      <section className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
            Aplica esta metodología en tus <span className="text-secondary">activos críticos</span>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Comparte tus datos en el formulario y cuéntanos que equipos, procesos o fallas necesitas evaluar.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3 rounded-xs hover:bg-white hover:text-primary transition-all duration-300 shadow-md"
          >
            Cuéntanos de ti
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>


    </main>
  );
}
