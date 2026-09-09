/**
 * PatronEspectral
 * Miniatura del espectro característico de una falla.
 *
 * Por qué existe: la tabla de fallas explicaba en palabras dónde aparece cada
 * una, pero un analista reconoce las fallas por su FORMA. Dibujar el patrón
 * convierte una tabla de texto en algo que se entiende de un vistazo, y es
 * justo lo que ningún competidor del mercado hispanohablante ofrece.
 *
 * Son esquemas ilustrativos, no mediciones. Cada uno representa la relación de
 * amplitudes que delata la falla, no valores de un equipo concreto.
 */

/** Cada barra es [posición 0 a 1 en el eje de frecuencia, altura 0 a 1]. */
type Barra = [number, number];

const PATRONES: Record<string, { barras: Barra[]; piso?: number; joroba?: number }> = {
  // Una sola armónica dominante.
  "1x": { barras: [[0.16, 1]] },
  // La segunda armónica domina sobre la primera.
  "2x": { barras: [[0.16, 0.45], [0.32, 1], [0.48, 0.2]] },
  // Serie larga de armónicas decreciente.
  armonicas: {
    barras: [[0.12, 1], [0.24, 0.72], [0.36, 0.58], [0.48, 0.44], [0.6, 0.34], [0.72, 0.26], [0.84, 0.18]],
    piso: 0.12,
  },
  // Frecuencias que no son múltiplo de la velocidad, sobre piso de ruido alto.
  "no-sincrona": {
    barras: [[0.42, 0.5], [0.55, 0.68], [0.68, 0.55], [0.81, 0.4]],
    piso: 0.22,
  },
  // Frecuencia de engrane con bandas laterales.
  engrane: {
    barras: [[0.44, 0.32], [0.52, 0.55], [0.6, 1], [0.68, 0.55], [0.76, 0.32]],
  },
  // Múltiplo alto por número de álabes.
  alabes: { barras: [[0.16, 0.3], [0.7, 1]] },
  // Amplificación ancha alrededor de la frecuencia natural.
  resonancia: { barras: [[0.16, 0.28]], joroba: 0.58 },
  // Componente aislada en el doble de la frecuencia de línea.
  electrica: { barras: [[0.16, 0.34], [0.78, 1]] },
};

type Props = {
  patron: string;
  /** Nombre de la falla, para lectores de pantalla. */
  etiqueta?: string;
  className?: string;
};

const ANCHO = 120;
const ALTO = 48;
const BASE = ALTO - 6;

export default function PatronEspectral({ patron, etiqueta, className = "" }: Props) {
  const definicion = PATRONES[patron];
  if (!definicion) return null;

  const { barras, piso = 0.06, joroba } = definicion;
  const alturaUtil = BASE - 4;

  // Piso de ruido: una línea quebrada tenue que da contexto de espectro.
  const puntosPiso = Array.from({ length: 25 }, (_, i) => {
    const x = (i / 24) * ANCHO;
    const variacion = piso * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7)));
    return `${x.toFixed(1)},${(BASE - variacion * alturaUtil).toFixed(1)}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className={`w-[120px] h-12 ${className}`}
      role="img"
      aria-label={etiqueta ? `Esquema del patrón espectral de ${etiqueta}` : "Esquema de patrón espectral"}
    >
      {joroba !== undefined && (
        <path
          d={`M ${joroba * ANCHO - 26} ${BASE} Q ${joroba * ANCHO} ${BASE - alturaUtil} ${joroba * ANCHO + 26} ${BASE} Z`}
          className="fill-secondary/25"
        />
      )}
      <polyline points={puntosPiso} className="fill-none stroke-primary/25" strokeWidth={1} />
      {barras.map(([x, altura], indice) => (
        <line
          key={indice}
          x1={x * ANCHO}
          y1={BASE}
          x2={x * ANCHO}
          y2={BASE - altura * alturaUtil}
          className="stroke-secondary"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      ))}
      <line x1={0} y1={BASE} x2={ANCHO} y2={BASE} className="stroke-primary/40" strokeWidth={1.5} />
    </svg>
  );
}
