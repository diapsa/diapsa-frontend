import type { Breadcrumb, FaqItem, ServiceCta } from "@/types/servicio";

/** Un servicio de DIAPSA enlazado desde una landing de industria. */
export interface TecnicaEnlace {
  nombre: string;
  href: string;
}

/** Un punto del acordeón: título, una o dos frases, su foto y los servicios que lo resuelven. */
export interface PuntoIndustria {
  titulo: string;
  texto: string;
  foto: { src: string; alt: string };
  enlaces?: TecnicaEnlace[];
}

/** Un bloque de beneficio al estilo Fracttal: una frase y un acordeón cuya foto cambia con cada punto. */
export interface BloqueIndustria {
  titulo: string;
  items: PuntoIndustria[];
}

/** Caso de estudio del giro contado al estilo Tractian, con datos ya publicados en /casos-exito. */
export interface CasoIndustria {
  href: string;
  etiqueta: string;
  titulo: string;
  resumen: string;
  cifras: { valor: string; etiqueta: string }[];
  antesDespues: { etiqueta: string; antes: number; despues: number; anioAntes: string; anioDespues: string }[];
  retos: { titulo: string; texto: string }[];
  etapas: { etiqueta: string; titulo: string; texto: string }[];
  grafica?: { src: string; alt: string; pie: string };
}

export interface Industria {
  slug: string;
  nombre: string;
  breadcrumbs: Breadcrumb[];
  /** Encabezado a todo lo ancho, con foto de planta del giro. */
  hero: { etiqueta: string; titulo: string; texto: string; foto: { src: string; alt: string } };
  seoTitle: string;
  seoDescription: string;
  /** Presentación corta junto al video de la industria (public/videos/industrias/<video>.mp4 y .jpg). */
  intro: { titulo: string; texto: string; video: string; descripcionVideo: string };
  bloques: BloqueIndustria[];
  caso?: CasoIndustria;
  servicios: { titulo: string; items: { titulo: string; texto: string; href: string; foto: string }[] };
  faq: FaqItem[];
  cta: ServiceCta;
}
