import type { Breadcrumb, FaqItem, GrupoVideos, ServiceCta, ServiceIntroBeneficios } from "@/types/servicio";

/** Un servicio de DIAPSA enlazado desde una landing de industria. */
export interface TecnicaEnlace {
  nombre: string;
  href: string;
}

/** Un equipo crítico del giro: qué le falla y con qué se vigila. */
export interface EquipoIndustria {
  nombre: string;
  texto: string;
  fallas: string[];
  tecnicas: TecnicaEnlace[];
}

/** Una norma o criterio que aplica en el giro, con el servicio que ayuda a cumplirlo. */
export interface NormaIndustria {
  clave: string;
  titulo: string;
  texto: string;
  enlace?: TecnicaEnlace;
}

/** Caso de éxito del giro, con cifras ya publicadas en /casos-exito. */
export interface CasoIndustria {
  href: string;
  titulo: string;
  texto: string;
  cifras: { valor: string; etiqueta: string }[];
}

/** Por dónde empezar: los pasos con los que DIAPSA arma el programa en ese giro. */
export interface PasoIndustria {
  titulo: string;
  texto: string;
  enlace?: TecnicaEnlace;
}

export interface Industria {
  slug: string;
  nombre: string;
  breadcrumbs: Breadcrumb[];
  header: { title: string; subtitle: string };
  seoTitle: string;
  seoDescription: string;
  certificacion: string;
  intro: { titulo: string; texto: string };
  introBeneficios: ServiceIntroBeneficios;
  equipos: { titulo: string; texto: string; items: EquipoIndustria[] };
  videos?: GrupoVideos[];
  pasos: { titulo: string; texto: string; items: PasoIndustria[] };
  caso?: CasoIndustria;
  normas: { titulo: string; texto: string; items: NormaIndustria[] };
  faq: FaqItem[];
  cta: ServiceCta;
}
