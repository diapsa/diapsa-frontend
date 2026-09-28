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

/**
 * Familias: modelos con el mismo cuerpo y la misma foto, que cambian en
 * resolución, enfoque o temperatura. Emiliano pidió (2026-09-28) que no
 * aparezcan tarjetas iguales, así que el catálogo muestra una tarjeta por
 * familia con sus versiones, y cada versión conserva su ficha.
 */
const FAMILIAS: { id: string; nombre: string; modelos: string[] }[] = [
  { id: "serie-b", nombre: "Serie B", modelos: ["B01S", "B10S", "B11S", "B20S", "B21LS"] },
  { id: "m11", nombre: "M11 y M11W", modelos: ["M11", "M11W"] },
  { id: "m20", nombre: "M20 y M20W", modelos: ["M20", "M20W"] },
  { id: "g41", nombre: "G41 y G41H", modelos: ["G41", "G41H"] },
  { id: "g61", nombre: "G61 y G61H", modelos: ["G61", "G61H"] },
  { id: "sp40", nombre: "SP40 y SP40H", modelos: ["SP40", "SP40H"] },
  { id: "sp60", nombre: "SP60 y SP60H", modelos: ["SP60", "SP60H"] },
];

function familiaDe(modelo: string) {
  const f = FAMILIAS.find((x) => x.modelos.includes(modelo));
  return f ? { id: f.id, nombre: f.nombre } : { id: modelo.toLowerCase(), nombre: modelo };
}

/**
 * Promoción (Emiliano, 2026-09-28): en la compra de una cámara HIKMICRO
 * M30 o superior se incluye un curso de termografía gratis. Entran M30,
 * M31, M60 y todas las series G y SP; no entran la Serie B, M10, M11 ni M20.
 * Para terminar la promoción, vaciar esta lista.
 */
const CON_CURSO = ["M30", "M31", "M60", "G31", "G41", "G41H", "G61", "G61H", "SP40", "SP40H", "SP60", "SP60H", "SP120H"];
export const incluyeCurso = (modelo: string) => CON_CURSO.includes(modelo);

/** Datos extra que usa el catálogo para filtrar, ordenar y agrupar. */
export type Extra = {
  serie?: string;
  pixeles?: number;
  temp_max?: number;
  familia?: string;
  familia_nombre?: string;
  curso_gratis?: boolean;
};
export type ProductoCatalogo = Product & Extra;

/** Las versiones de la familia de un modelo, en orden (para la ficha). */
export function versionesLocales(slug: string) {
  const p = datos.productos.find((x) => x.slug === slug);
  if (!p) return [];
  const fam = familiaDe(p.model).id;
  const familia = datos.productos.filter((x) => familiaDe(x.model).id === fam);
  // Solo se muestran los datos que cambian entre versiones (y la resolución siempre)
  const DATOS = ["Resolución infrarroja", "Rango de temperatura", "Enfoque", "Cámara visual", "Wi-Fi"];
  const valor = (x: Local, et: string) => x.specifications.flatMap((g) => g.items).find((s) => s.label === et)!;
  const cambian = DATOS.filter((et, i) => i === 0 || new Set(familia.map((x) => valor(x, et).value)).size > 1);
  return familia.map((x) => ({
    slug: x.slug,
    model: x.model,
    datos: cambian.map((et) => {
      const s = valor(x, et);
      if (et === "Resolución infrarroja") return `${s.value} px`;
      if (et === "Cámara visual") return s.value === "No" ? "Sin cámara visual" : `Cámara visual de ${s.value}`;
      if (et === "Wi-Fi") return s.value === "No" ? "Sin Wi-Fi" : "Con Wi-Fi";
      if (et === "Enfoque") return `Enfoque: ${s.value.toLowerCase()}`;
      return s.value;
    }),
  }));
}

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
    familia: familiaDe(p.model).id,
    familia_nombre: familiaDe(p.model).nombre,
    curso_gratis: incluyeCurso(p.model),
  };
}

export function productosLocales(): ProductoCatalogo[] {
  return datos.productos.map(aResumen);
}

export function productoLocal(slug: string): ProductDetail | null {
  const p = datos.productos.find((x) => x.slug === slug);
  if (!p) return null;
  // Relacionados: una versión de cada otra familia de la misma serie
  const fam = familiaDe(p.model).id;
  const vistas = new Set([fam]);
  const hermanos = datos.productos
    .filter((x) => {
      const f = familiaDe(x.model).id;
      if (x.serie !== p.serie || vistas.has(f)) return false;
      vistas.add(f);
      return true;
    })
    .slice(0, 4);
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
