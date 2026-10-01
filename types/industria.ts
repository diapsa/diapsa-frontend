import type { Breadcrumb, FaqItem, ServiceCta } from "@/types/servicio";

/** Un servicio de DIAPSA enlazado desde una landing de industria. */
export interface TecnicaEnlace {
  nombre: string;
  href: string;
}

/** Un punto del acordeón: título, una o dos frases y, si aplica, los servicios que lo resuelven. */
export interface PuntoIndustria {
  titulo: string;
  texto: string;
  enlaces?: TecnicaEnlace[];
}

/** Un bloque de beneficio al estilo Fracttal: una frase, un acordeón de tres puntos y una foto. */
export interface BloqueIndustria {
  titulo: string;
  foto: { src: string; alt: string };
  items: PuntoIndustria[];
}

/** Caso de éxito del giro, con cifras ya publicadas en /casos-exito. */
export interface CasoIndustria {
  href: string;
  titulo: string;
  cifras: { valor: string; etiqueta: string }[];
}

export interface Industria {
  slug: string;
  nombre: string;
  breadcrumbs: Breadcrumb[];
  header: { title: string; subtitle: string };
  seoTitle: string;
  seoDescription: string;
  certificacion: string;
  /** Presentación corta junto al video de la industria (public/videos/industrias/<video>.mp4 y .jpg). */
  intro: { titulo: string; texto: string; video: string; descripcionVideo: string };
  bloques: BloqueIndustria[];
  caso?: CasoIndustria;
  servicios: { titulo: string; items: { titulo: string; texto: string; href: string }[] };
  faq: FaqItem[];
  cta: ServiceCta;
}
