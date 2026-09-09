import Image from "next/image";
import Link from "next/link";
import BackgroundImage from "../atoms/BackgroundImage";
import CountUp from "../atoms/CountUp";

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

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 px-6 py-16 lg:py-32">
        {/* Columna izquierda */}
        <div className="text-white">
          <span className="inline-block text-secondary text-xs font-semibold tracking-widest uppercase mb-4">
            Nuestra historia
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 tracking-wide">
            ¿Por qué elegir a DIAPSA?
          </h2>
          <div className="space-y-5 text-lg lg:text-xl text-white/90">
            <p>
              Durante dos décadas, Grupo DIAPSA ha
              liderado con pasión y precisión el monitoreo
              predictivo en la industria.
            </p>
            <p>
              Con la termografía, el análisis de vibraciones,
              ultrasonido y lubricación, elevamos la
              confiabilidad de los equipos e impulsamos la
              eficiencia operativa.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <Link
              href="/acerca-de"
              className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3 rounded-xs hover:bg-white hover:text-primary transition-all duration-300"
            >
              Conócenos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="#contacto"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-xs hover:bg-white hover:text-primary transition-all duration-300"
            >
              Contáctanos
            </Link>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="text-white text-center">
          <h3 className="text-secondary text-xl lg:text-2xl font-semibold mb-6">
            Nuestra misión:
          </h3>
          <p className="text-lg lg:text-xl text-white/90 whitespace-pre-line">
            Ser líderes en las disciplinas que desarrollamos, aportando valor con precisión, rapidez y calidad, garantizando la productividad y seguridad de las plantas industriales.
          </p>
          {/* Las cifras cuentan hacia arriba al entrar en pantalla. Son el
              argumento de venta más fuerte de esta sección y como texto
              estático pasaban desapercibidas. El número final está en el DOM
              desde el primer render: Google y los lectores de pantalla leen la
              cifra real, no un cero. */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { valor: 50000, texto: "Fallas detectadas" },
              { valor: 1500, texto: "Servicios realizados" },
              { valor: 20, texto: "Años de trayectoria" },
            ].map(({ valor, texto }) => (
              <div key={texto} className="flex flex-col items-center">
                <Image src="/images/LOGRO-DIAPSA.svg" alt="" aria-hidden="true" width={100} height={100} />
                <p className="text-secondary font-bold">
                  <CountUp valor={valor} prefijo="+" /> {texto}
                </p>
              </div>
            ))
            }
          </div>
        </div>
      </div>
    </section>
  );
}
