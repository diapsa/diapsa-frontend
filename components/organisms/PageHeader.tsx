import BackgroundImage from "../atoms/BackgroundImage";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative w-full h-[40vh] lg:h-[50vh] overflow-hidden border-b-4 border-secondary">
      {/* Fondo hero */}
      <BackgroundImage
        src="/images/fondo-hero.webp"
        alt="Fondo header"
        overlayOpacity={0.4}
        priority
      />

      {/* Contenido centrado */}
      <div className="relative z-10 h-full flex items-center justify-center border-b-2 border-secondary">
        <div className="text-center px-6">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
