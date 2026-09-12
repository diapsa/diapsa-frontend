import type { ServiceTabla, ZonaSemaforo } from "./servicio";

/**
 * Bloques técnicos que se agregan desde código a una guía del blog.
 * Ver components/organisms/ComplementosGuia.tsx.
 */
export interface Guia {
  /** Slug del artículo del blog al que acompaña. */
  articulo: string;
  titulo: string;
  subtitulo?: string;
  /** Diagramas a dibujar, por clave: "curva-pf". */
  diagramas?: string[];
  /** Modos de falla con su patrón espectral. */
  tabla?: ServiceTabla;
  /** Los tres colores con los que sale cada equipo en el informe. */
  semaforo?: {
    titulo: string;
    subtitulo?: string;
    zonas: ZonaSemaforo[];
  };
}
