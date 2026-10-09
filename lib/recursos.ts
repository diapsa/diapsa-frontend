import recursos from "@/data/recursos-relacionados.json";

/**
 * Correspondencias entre artículos del blog y páginas de servicio.
 *
 * Por qué existe: el blog y los servicios competían por la misma búsqueda sin
 * enlazarse entre sí. El artículo de vibraciones y la página del servicio de
 * vibraciones vivían separados, así que ni se apoyaban en buscadores ni movían
 * al lector de un lado al otro. Este mapa los conecta en ambas direcciones.
 *
 * El contenido del blog viene del CMS, por eso la correspondencia se mantiene
 * aquí y no dentro del artículo: agregar un enlace no exige tocar el CMS.
 */

export type ArticuloRelacionado = {
  slug: string;
  titulo: string;
  resumen: string;
  /** Portada, para mostrarlo como tarjeta cuando un servicio tiene varias guías. */
  portada?: string;
};

export type ServicioRelacionado = {
  href: string;
  titulo: string;
  resumen: string;
};

type Correspondencia = {
  articulo: ArticuloRelacionado;
  servicio: ServicioRelacionado;
};

const CORRESPONDENCIAS = recursos as Correspondencia[];

/** Servicio que corresponde a un artículo del blog, si lo hay. */
export function getServicioPorArticulo(slug: string): ServicioRelacionado | null {
  return CORRESPONDENCIAS.find((c) => c.articulo.slug === slug)?.servicio ?? null;
}

/** Artículo del blog que corresponde a una ruta de servicio, si lo hay. */
export function getArticuloPorServicio(href: string): ArticuloRelacionado | null {
  return CORRESPONDENCIAS.find((c) => c.servicio.href === href)?.articulo ?? null;
}

/** Todos los artículos del blog que corresponden a una ruta de servicio. */
export function getArticulosPorServicio(href: string): ArticuloRelacionado[] {
  return CORRESPONDENCIAS.filter((c) => c.servicio.href === href).map((c) => c.articulo);
}

/**
 * Slugs de otros artículos del blog que tratan lo mismo: primero los que
 * comparten página de servicio con este, después los de servicios hermanos
 * (la misma sección, como monitoreo de condición). Sirve para cerrar cada
 * artículo con lecturas relacionadas (Emiliano, 2026-10-09).
 */
export function slugsRelacionados(slug: string): string[] {
  const propios = CORRESPONDENCIAS.filter((c) => c.articulo.slug === slug).map((c) => c.servicio.href);
  const padre = (href: string) => href.split("/").slice(0, -1).join("/");
  const padres = new Set(propios.map(padre));
  const mismos = CORRESPONDENCIAS.filter((c) => propios.includes(c.servicio.href)).map((c) => c.articulo.slug);
  const hermanos = CORRESPONDENCIAS.filter((c) => padres.has(padre(c.servicio.href))).map((c) => c.articulo.slug);
  return [...new Set([...mismos, ...hermanos])].filter((s) => s !== slug);
}
