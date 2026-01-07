import BackgroundImage from "../atoms/BackgroundImage";

export default function AboutUs() {
  return (
    <section className="relative w-full overflow-hidden border-b-4 border-secondary">
      {/* Fondo sección */}
      <BackgroundImage
        src="/images/fondo-mantenimiento.webp"
        alt="Fondo sección acerca de nosotros"
        priority
        zIndex="-z-10"
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 px-6 py-16 lg:py-42">
        {/* Columna izquierda */}
        <div className="text-white p-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 tracking-wide">
            ACERCA DE DIAPSA
          </h2>
          <div className="space-y-5 text-lg lg:text-xl text-white/90">
            <p>
              Durante dos décadas, Grupo DIAPSA ha
              liderado con pasión y precisión el monitoreo
              predictivo en la industria.
            </p>
            <p>
              la termografía, el análisis de vibraciones,
              ultrasonido y lubricación, elevamos la
              confiabilidad de los equipos e impulsamos la
              eficiencia operativa.
            </p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="text-white text-center p-12">
          <h3 className="text-secondary text-2xl lg:text-3xl font-semibold mb-6">
            Nuestra misión:
          </h3>
          <p className="text-lg lg:text-xl text-white/90 whitespace-pre-line">
            Ser líderes en las disciplinas que desarrollamos, aportando valor con precisión, rapidez y calidad, garantizando la productividad y seguridad de las plantas industriales.
          </p>
        </div>
      </div>
    </section>
  );
}
