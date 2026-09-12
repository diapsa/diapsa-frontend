import type { Guia } from "@/types/guia";
import analisisVibraciones from "@/data/guias/analisis-vibraciones.json";

/**
 * Complementos técnicos por guía del blog.
 *
 * El texto del artículo vive en el CMS. Los diagramas, los modos de falla y
 * el semáforo se dibujan en código y se asocian aquí por slug, para que
 * agregar uno no exija tocar el CMS. Ver components/organisms/ComplementosGuia.tsx.
 */
const GUIAS: Guia[] = [analisisVibraciones as Guia];

export function getGuiaPorArticulo(slug: string): Guia | null {
  return GUIAS.find((g) => g.articulo === slug) ?? null;
}
