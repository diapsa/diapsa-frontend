import Image from "next/image";
import Button from "../atoms/Button";

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Fondo hero */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fondo-hero.webp"
          alt="Fondo hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Línea amarilla horizontal fija al centro */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-secondary z-10" />

      {/* Contenido del Hero - Grid de 2 columnas */}
      <div className="relative z-20 h-full grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
        {/* Columna izquierda - Imagen del ingeniero */}
        <div className="relative flex items-end justify-center">
          <div className="relative w-full h-[70vh] lg:h-[80vh]">
            <Image
              src="/images/ingeniero-predictivo-trascendente.png"
              alt="Ingeniero predictivo"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {/* Columna derecha - Contenido de texto */}
        <div className="flex flex-col justify-center px-6 py-12 pt-32">
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-6 ">
            MONITOREO PREDICTIVO
            <br />
            INTEGRAL{" "}
            <span className="text-secondary">PARA LA INDUSTRIA</span>
          </h1>

          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-xl">
            Sensores, inteligencia artificial y 22 años de experiencia humana
            para anticipar fallas y maximizar confiabilidad operativa.
          </p>

          <div>
            <Button variant="secondary" className="text-lg px-8 py-3">
              Conoce más
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
