import datos from "@/data/productos-hikmicro.json";
import type { Product, ProductDetail } from "@/types/product";

/**
 * Productos que viven en el sitio y no en el CMS.
 *
 * Por ahora son las cámaras termográficas HIKMICRO (series B, M, G y SP),
 * que DIAPSA vende pero nadie ha dado de alta en el CMS. Los datos están en
 * data/productos-hikmicro.json, sacados de las fichas oficiales; las fotos
 * en public/images/productos/hikmicro/ y las fichas en PDF en
 * public/fichas/hikmicro/.
 *
 * Aquí se convierten a la misma forma que devuelve el CMS (Product para
 * los listados, ProductDetail para la ficha), para que el catálogo, la
 * ficha, el formulario de cotización y el sitemap los traten igual. Si un
 * día se dan de alta en el CMS, basta con borrar el JSON y este archivo.
 */

export const CATEGORIA_TERMOGRAFIA = { id: 0, slug: "camaras-termograficas", name: "Cámaras termográficas" };
const MARCA = { id: 0, slug: "hikmicro", name: "HIKMICRO" };

type Local = (typeof datos.productos)[number];

/** Datos extra que usa el catálogo para filtrar y ordenar. */
export type Extra = { serie?: string; pixeles?: number; temp_max?: number };
export type ProductoCatalogo = Product & Extra;

function aResumen(p: Local): ProductoCatalogo {
  return {
    id: p.id as unknown as number,
    slug: p.slug,
    model: p.model,
    name: p.name,
    short_description: p.short_description,
    availability_status: "available",
    featured: false,
    is_new: false,
    main_image: p.image,
    category: CATEGORIA_TERMOGRAFIA,
    brand: MARCA,
    featured_specs: p.specifications
      .flatMap((g) => g.items)
      .filter((s) => s.featured)
      .map((s) => ({ label: s.label, value: s.value, unit: s.unit })),
    serie: p.serie,
    pixeles: p.pixeles,
    temp_max: p.temp_max,
  };
}

export function productosLocales(): ProductoCatalogo[] {
  return datos.productos.map(aResumen);
}

export function productoLocal(slug: string): ProductDetail | null {
  const p = datos.productos.find((x) => x.slug === slug);
  if (!p) return null;
  const hermanos = datos.productos.filter((x) => x.serie === p.serie && x.slug !== p.slug).slice(0, 4);
  return {
    id: p.id as unknown as number,
    slug: p.slug,
    model: p.model,
    name: `${p.name} HIKMICRO ${p.model}`,
    short_description: p.short_description,
    description: p.description,
    availability_status: "available",
    featured: false,
    is_new: false,
    category: CATEGORIA_TERMOGRAFIA,
    subcategory: null,
    brand: MARCA,
    series: { id: 0, slug: p.serie.toLowerCase().replace(/\s+/g, "-"), name: p.serie },
    images: [{ id: 0, url: p.image, alt: `Cámara termográfica HIKMICRO ${p.model}`, type: "main" }],
    specifications: p.specifications,
    documents: [{ id: 0, type: "datasheet", name: `Ficha técnica ${p.model} (inglés)`, url: p.datasheet, language: "en" }],
    related_products: hermanos.map((h) => ({
      id: h.id as unknown as number,
      slug: h.slug,
      model: h.model,
      name: h.name,
      short_description: h.short_description,
      main_image: h.image,
      category: CATEGORIA_TERMOGRAFIA,
      brand: MARCA,
    })),
    seo: {
      title: `Cámara termográfica HIKMICRO ${p.model}`,
      description: `${p.short_description} Cotízala con DIAPSA, con asesoría y capacitación de especialistas en termografía.`,
    },
  };
}
