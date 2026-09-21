/**
 * Los cuatro niveles con los que se califica un equipo en el informe de
 * condición, y los colores con los que se dibuja cada uno.
 *
 * Por qué vive aquí y no dentro de un componente: los niveles se pintan en
 * dos lugares distintos de la misma página. Primero en la ficha del informe,
 * como etiqueta al lado de cada equipo, y enseguida en el semáforo, como
 * lámpara con su instrucción. Si cada componente llevara su propia tabla de
 * colores acabarían despintándose entre sí y el lector perdería la relación,
 * que es justo lo que hace que las dos secciones se lean como una sola idea.
 *
 * La escala es la del sector: los laboratorios reportan normal, monitor,
 * abnormal y critical. Aquí se nombra en español y se le agrega lo que a un
 * jefe de mantenimiento le falta en esos reportes, que es la acción.
 */

export type ClaveNivel = "bueno" | "observacion" | "precaucion" | "alarma";

type Nivel = {
  /** Lámpara del semáforo: círculo, halo y título. */
  lampara: { fondo: string; halo: string; texto: string };
  /** Etiqueta al lado de un equipo, sobre fondo claro. */
  chip: string;
  /** Punto de color en el resumen, sobre el encabezado oscuro. */
  punto: string;
  /** Cifra del resumen, sobre el encabezado oscuro. */
  cifra: string;
};

export const NIVELES: Record<ClaveNivel, Nivel> = {
  bueno: {
    lampara: { fondo: "bg-emerald-500", halo: "shadow-emerald-500/40", texto: "text-emerald-700" },
    chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
    punto: "bg-emerald-400",
    cifra: "text-emerald-300",
  },
  observacion: {
    lampara: { fondo: "bg-sky-500", halo: "shadow-sky-500/40", texto: "text-sky-700" },
    chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20",
    punto: "bg-sky-400",
    cifra: "text-sky-300",
  },
  precaucion: {
    lampara: { fondo: "bg-amber-400", halo: "shadow-amber-400/40", texto: "text-amber-700" },
    chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
    punto: "bg-amber-400",
    cifra: "text-amber-300",
  },
  alarma: {
    lampara: { fondo: "bg-red-600", halo: "shadow-red-600/40", texto: "text-red-700" },
    chip: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
    punto: "bg-red-500",
    cifra: "text-red-300",
  },
};

/** El nivel de una clave, con "bueno" de respaldo si el JSON trae algo raro. */
export function nivel(clave: string): Nivel {
  return NIVELES[clave as ClaveNivel] ?? NIVELES.bueno;
}
