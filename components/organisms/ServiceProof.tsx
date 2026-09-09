import CountUp from "../atoms/CountUp";

/**
 * ServiceProof
 * Banda de credibilidad para páginas de servicio: las cifras de DIAPSA
 * (las mismas que presume la home) y, si la página lo indica, la
 * certificación de los analistas.
 *
 * Por qué existe: el comprador industrial decide por prueba, no por
 * adjetivos. Estas cifras estaban solo en la home; quien aterrizaba desde
 * Google en una página de servicio nunca las veía.
 */

type Props = {
  /** Texto de certificación a resaltar, ej. "Analistas Categoría III · ISO 18436-2". */
  certificacion?: string;
};

const CIFRAS = [
  { valor: 50000, texto: "Fallas detectadas" },
  { valor: 1500, texto: "Servicios realizados" },
  { valor: 20, texto: "Años de trayectoria" },
];

export default function ServiceProof({ certificacion }: Props) {
  return (
    <section className="w-full bg-primary border-y-4 border-secondary py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 ${
            certificacion ? "lg:grid-cols-4" : ""
          } gap-8 items-center text-center`}
        >
          {CIFRAS.map(({ valor, texto }) => (
            <div key={texto}>
              <p className="text-secondary text-4xl lg:text-5xl font-extrabold">
                <CountUp valor={valor} prefijo="+" />
              </p>
              <p className="text-white/80 text-sm uppercase tracking-wider mt-1">{texto}</p>
            </div>
          ))}
          {certificacion && (
            <div className="flex flex-col items-center gap-2 border-t sm:border-t-0 lg:border-l border-white/15 pt-6 sm:pt-0 lg:pl-8 sm:col-span-3 lg:col-span-1">
              <svg
                className="w-8 h-8 text-secondary"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
              <p className="text-white font-bold leading-snug">{certificacion}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
