import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import cursosData from "@/data/cursos.json";

const CoursesPromo: React.FC = () => {
  // Mostrar solo los primeros 3 cursos en el preview
  const courses = cursosData.cursos.slice(0, 3);

  return (
    <section className="relative py-12 lg:py-24 bg-black pb-32 lg:pb-40">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
          {/* Left Column: Content */}
          <div className="space-y-4 lg:space-y-2">
            {/* Title with highlight */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight max-w-2xl">
              ¿QUIERES CONVERTIRTE{" "}
              EN <span className="text-secondary">EXPERTO</span>?
            </h2>

            {/* Decorative Line */}
            <div className="w-full max-w-2xl h-1 bg-secondary rounded-full" />

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-4xl leading-relaxed lg:leading-10 text-left tracking-normal text-white/90 max-w-3xl lg:pb-4 lg:pt-10">
              En DIAPSA creemos que la tecnología solo alcanza su máximo valor cuando va acompañada de conocimiento.
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base font-light lg:font-extralight tracking-normal lg:tracking-widest text-white/80 leading-relaxed max-w-2xl">
              Por eso, además de ofrecer soluciones de confiabilidad, impartimos cursos especializados y certificaciones que forman expertos en áreas como termografía infrarroja, análisis de vibraciones y mantenimiento predictivo.
            </p>

            {/* CTA Button */}
            <div className="pt-6 lg:pt-8">
              <Link href="/cursos">
                <Button variant="secondary" style={{ color: '#000' }}>
                  CONOCE TODO EL CATÁLOGO DE CURSOS
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative w-full h-80 sm:h-100 lg:h-150 rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/images/cursos/placeholder.png"
              alt="Diplomado Monitoreo de Condición - DIAPSA"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>

        {/* Related Courses Section */}
        <div className="space-y-8">
          {/* Section Title */}
          <h3 className="text-2xl lg:text-3xl font-bold text-white text-center mb-8 lg:mb-12">
            OTROS CURSOS RELACIONADOS
          </h3>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={course.link}
                className="group relative block rounded-lg overflow-hidden bg-gray-900 aspect-video"
              >
                {/* Course Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={course.imagen}
                    alt={course.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-opacity duration-300 group-hover:opacity-30"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <h4 className="text-lg lg:text-xl font-bold text-white mb-2">
                    {course.nombre}
                  </h4>
                  <p className="text-sm text-white/80 mb-6">
                    {course.descripcion}
                  </p>
                  <Button variant="secondary" style={{ color: '#000' }}>
                    SOLICITA INFORMES
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button - Positioned between sections */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-10">
        <Link href="#">
          <Button variant="secondary" style={{ color: '#000', fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
            RECIBE AVISOS DE PRÓXIMOS CURSOS
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CoursesPromo;
