import BackgroundImage from "../atoms/BackgroundImage";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  link: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="relative w-full h-[50vh] sm:h-[55vh] lg:h-[60vh] overflow-hidden border-b-2 lg:border-b-4 border-secondary">
      {/* Fondo hero */}
      <BackgroundImage
        src="/images/fondo-hero.webp"
        alt="Fondo header"
        overlayOpacity={0.4}
        priority
      />

      {/* Contenido centrado */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 pt-16 sm:pt-20 lg:pt-24 max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white mb-3 sm:mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-2">
              {subtitle}
            </p>
          )}

          {/* Breadcrumb (below title/subtitle) */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mt-4 sm:mt-6 flex justify-center">
              <ol className="inline-flex flex-wrap items-center justify-center rounded-md bg-black/30 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs lg:text-sm backdrop-blur-sm gap-x-1">
                {breadcrumbs.map((item, index) => (
                  <li key={`${item.link}-${index}`} className="flex items-center">
                    {index > 0 && <span className="mx-1 sm:mx-2 text-white/60">/</span>}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-white/80 font-medium">{item.label}</span>
                    ) : (
                      <Link
                        href={item.link}
                        className="text-white/90 hover:text-secondary transition-colors duration-200 font-medium"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
