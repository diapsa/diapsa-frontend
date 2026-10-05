import diplomado from "@/data/diplomado.json";

/**
 * Cifras del diplomado calculadas de la lista de ponentes (Emiliano,
 * 2026-10-04). Antes el número de especialistas y el de países estaban
 * escritos a mano en varios lugares y no coincidían con la lista: así, la
 * portada, la página y el texto para Google dicen siempre lo mismo que la
 * lista. Si DIAPSA corrige un ponente, todo cambia solo.
 */

type Ponente = { nombre: string; pais?: string; tema: string };

export const PONENTES = diplomado.ponentes as Ponente[];

/** Países del claustro, sin repetir ("Italia / Cuba" cuenta los dos). */
export const PAISES_DIPLOMADO = [
  ...new Set(
    PONENTES.flatMap((p) => (p.pais ?? "").split("/"))
      .map((p) => p.trim())
      .filter(Boolean),
  ),
];

export const NUM_ESPECIALISTAS = PONENTES.length;

/** Lo que cubre el claustro, resumido de los temas de los ponentes. */
export const ESPECIALIDADES_CLAUSTRO = [
  "Confiabilidad y gestión de activos",
  "Integridad, riesgo y protección de activos",
  "Vibraciones mecánicas",
  "Lubricación y análisis de aceite",
  "Diagnóstico y mantenimiento eléctrico",
  "Monitoreo de condición y tecnologías predictivas",
];
export const NUM_PAISES = PAISES_DIPLOMADO.length;

/** Las cuatro cifras del hero, con las de los especialistas calculadas. */
export const DATOS_DIPLOMADO: { v: string; t: string }[] = [
  { v: "60 h", t: "en vivo" },
  { v: `${diplomado.fases.length} fases`, t: `${diplomado.fases.reduce((s, f) => s + parseInt(f.sesiones, 10), 0)} sesiones` },
  { v: String(NUM_ESPECIALISTAS), t: "especialistas" },
  { v: "Virtual", t: `desde ${NUM_PAISES} países` },
];

export const RESUMEN_DIPLOMADO = `Nuestro programa insignia: 60 horas en vivo con ${NUM_ESPECIALISTAS} especialistas de ${NUM_PAISES} países para gestionar los activos durante todo su ciclo de vida, del diseño a su retiro.`;
