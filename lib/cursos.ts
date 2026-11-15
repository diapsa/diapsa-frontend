import extra from "@/data/cursos-extra.json";

/**
 * Complemento del CMS para los cursos: técnica, formato y grupos
 * programados. El CMS trae el contenido (objetivo, temario, requisitos) pero
 * no fechas ni duración; eso vive en data/cursos-extra.json.
 */

export type FormatoCurso = "formacion" | "practica" | "certificacion" | "gestion" | "especialidad";

export type Grupo = {
  curso: string;
  /** Fecha de inicio, AAAA-MM-DD. */
  inicio: string;
  fin?: string;
  horario?: string;
  sede?: string;
  modalidad?: string;
  duracion?: string;
  cupo?: string;
  precio?: string;
};

type Extra = {
  tecnica: string;
  formato: FormatoCurso;
  nivel?: string;
  duracion?: string;
  modalidad?: string;
  galeria?: string;
  /** Qué se aprende y qué se podrá hacer; y un temario que corrige al del CMS. */
  aprenderas?: string[];
  podras?: string[];
  temario?: string[];
  /** La imagen del CMS no carga (403): se usa una foto de la galería. */
  ocultarImagenCms?: boolean;
  /** Título y descripción para Google que sustituyen a los del CMS. */
  seo?: { titulo?: string; descripcion?: string };
};
export type FotoCurso = { src: string; alt: string };

const DATOS = extra as unknown as {
  tecnicas: { clave: string; nombre: string; norma: string }[];
  formatos: Record<FormatoCurso, { nombre: string; texto: string }>;
  cursos: Record<string, Extra>;
  grupos: Grupo[];
  galerias: Record<string, FotoCurso[]>;
  bloques: Bloque[];
};

export type Bloque = { id: string; formatos: FormatoCurso[]; etiqueta: string; titulo: string; texto: string; puntos: { k: string; v: string }[] };

export const TECNICAS = DATOS.tecnicas;
export const FORMATOS = DATOS.formatos;
export const BLOQUES = DATOS.bloques ?? [];

export function extraDe(slug: string): Extra | null {
  return DATOS.cursos[slug] ?? null;
}

/** Fotos reales de cursos de la técnica (o de la galería propia del curso). */
export function galeriaDe(slug: string): FotoCurso[] {
  const x = extraDe(slug);
  if (!x) return [];
  return DATOS.galerias?.[x.galeria ?? x.tecnica] ?? [];
}

/** Una muestra de todas las galerías, alternando técnicas, para la apertura. */
export function muestraFotos(max = 14): FotoCurso[] {
  const listas = Object.values(DATOS.galerias ?? {});
  const salida: FotoCurso[] = [];
  for (let i = 0; salida.length < max && listas.some((l) => i < l.length); i++) {
    for (const l of listas) if (i < l.length && salida.length < max) salida.push(l[i]);
  }
  return salida;
}

/** La imagen del curso: la del CMS, o una foto real de su técnica si no hay o no carga. */
export function imagenDe(slug: string, urlCms?: string | null, alt?: string): FotoCurso | null {
  if (urlCms && !extraDe(slug)?.ocultarImagenCms) return { src: urlCms, alt: alt || "" };
  return galeriaDe(slug)[0] ?? null;
}

function hoy() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Grupos por venir, del más cercano al más lejano; opcionalmente de un curso. */
export function proximosGrupos(slug?: string): Grupo[] {
  const h = hoy();
  return DATOS.grupos
    .filter((g) => g.inicio && (!slug || g.curso === slug))
    .filter((g) => new Date(`${g.fin ?? g.inicio}T00:00:00`).getTime() >= h)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** "20 de octubre de 2026", o "20 al 24 de octubre de 2026" si trae fin. */
export function fechaGrupo(g: Grupo): string {
  const [a, m, d] = g.inicio.split("-").map(Number);
  if (!g.fin) return `${d} de ${MESES[m - 1]} de ${a}`;
  const [a2, m2, d2] = g.fin.split("-").map(Number);
  if (m === m2 && a === a2) return `${d} al ${d2} de ${MESES[m - 1]} de ${a}`;
  return `${d} de ${MESES[m - 1]} al ${d2} de ${MESES[m2 - 1]} de ${a2}`;
}

/**
 * Título y descripción para Google que pone el sitio sobre los del CMS.
 * Search Console, 16 oct a 12 nov de 2026 (2026-11-15): el curso de
 * certificación de termografía salía en el puesto 35 con el nombre del CMS
 * ("Termografía Infrarroja - Curso de Certificación") y una descripción que no
 * decía "curso de termografía" ni la categoría. Se sobreescribe desde
 * data/cursos-extra.json sin tocar el CMS. Si hay un grupo por venir, su fecha
 * se agrega a la descripción y se cae sola cuando el grupo pasa; nunca el costo.
 */
export function seoDe(slug: string): { titulo?: string; descripcion?: string } | null {
  const seo = extraDe(slug)?.seo;
  if (!seo) return null;
  const grupo = proximosGrupos(slug)[0];
  const descripcion =
    seo.descripcion && grupo ? `${seo.descripcion} Próximo grupo: ${fechaGrupo(grupo)}.` : seo.descripcion;
  return { titulo: seo.titulo, descripcion };
}

/** Día y mes cortos para la tarjeta de fecha. */
export function diaMes(g: Grupo): { dia: string; mes: string } {
  const [, m, d] = g.inicio.split("-").map(Number);
  return { dia: String(d), mes: MESES[m - 1].slice(0, 3) };
}
