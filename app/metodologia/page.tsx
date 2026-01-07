import PageHeader from "@/components/organisms/PageHeader";
import MethodologyProcess from "@/components/organisms/MethodologyProcess";
import disciplinasData from "@/data/disciplinas.json";
import Image from "next/image";

export default function MetodologiaPage() {
  return (
    <div>
      <PageHeader
        title="NUESTRA METODOLOGÍA"
        subtitle="Un enfoque sistemático para maximizar la confiabilidad de tus equipos"
      />

      <MethodologyProcess />

      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-1 items-center">
            {/* Left side - Image */}
            <div className="relative flex items-center justify-center h-[400px] lg:h-[450px]">
              <Image
                src="/images/metodologia/22-años.jpg"
                alt="22 años de experiencia DIAPSA"
                fill
                className="object-fill"
              />
            </div>

            {/* Right side - Content */}
            <div className="relative bg-black flex flex-col justify-center space-y-6 px-20 h-[400px] lg:h-[450px]">
              {/* Title */}
              <h3 className="relative z-10 text-white text-xl font-bold leading-tight">
                Este proceso reúne 22 años de experiencia, conocimientos y metodologías de confiabilidad, apoyados en diagnósticos integrales, para maximizar el valor
              </h3>

              {/* Border */}
              <div className="relative z-10 w-full h-0.5 bg-secondary"></div>

              {/* Description */}
              <div className="relative z-10 text-gray-300  font-light text leading-relaxed">
                Además, exploramos las implicaciones económicas de cada escenario y diseñamos estrategias que equilibran confiabilidad, eficiencia y costos, generando resultados sostenibles en el tiempo.
              </div>

              {/* CTA Link */}
              <div className="relative z-10">
                <a href="#historia" className="text-secondary font-semibold text-lg hover:underline inline-flex items-center gap-2">
                  CONOCE MÁS ACERCA DE NUESTRA HISTORIA
                  <span>→</span>
                </a>
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
                <div key={discipline.title} className="relative h-[350px] rounded-sm overflow-hidden group cursor-pointer">
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
        </div>

      </section>

      {/* Resultados de negocio */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase mb-4">
              ¿Y los resultados?
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-amber-400 mx-auto rounded-full" />
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
                    className="flex flex-col justify-center items-center px-6 h-70 items-center shadow-xl transform transition-transform duration-300 hover:-translate-y-2"
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

    </div>
  );
}
