import type { Breadcrumb, FaqItem, ServiceCta } from "@/types/servicio";

/** Un servicio de DIAPSA enlazado desde una landing de industria. */
export interface TecnicaEnlace {
  nombre: string;
  href: string;
}

/** Una señal temprana de falla y lo que revela. */
export interface SenalIndustria {
  titulo: string;
  texto: string;
}

/** Un área de activos de la industria: foto, frase, prioridades de monitoreo y servicios que la cubren. */
export interface AreaIndustria {
  id: string;
  nombre: string;
  titulo: string;
  texto: string;
  foto: { src: string; alt: string };
  prioridades: string[];
  servicios: TecnicaEnlace[];
  accion: string;
}

/** Un renglón del mapa activo, señal y servicio. */
export interface FilaMapa {
  activo: string;
  senal: string;
  servicio: string;
  detalle: string;
  href: string;
}

/** Caso del giro, en corto, con datos ya publicados en /casos-exito. */
export interface CasoIndustria {
  href: string;
  etiqueta: string;
  titulo: string;
  resumen: string;
  cifras: { valor: string; etiqueta: string }[];
}

/** Bloque con antetítulo, título y texto. */
interface Encabezado {
  etiqueta: string;
  titulo: string;
  texto: string;
}

export interface Industria {
  slug: string;
  nombre: string;
  breadcrumbs: Breadcrumb[];
  seoTitle: string;
  seoDescription: string;
  hero: Encabezado & { foto: { src: string; alt: string }; nota: string };
  senales: Encabezado & { items: SenalIndustria[] };
  areas: AreaIndustria[];
  mapa: Encabezado & { filas: FilaMapa[] };
  arquitectura: Encabezado & { items: (SenalIndustria & { href: string })[] };
  caso?: CasoIndustria;
  cierre: Encabezado;
  faq: FaqItem[];
  cta: ServiceCta;
}
