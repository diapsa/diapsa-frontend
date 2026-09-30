import type { Blog } from "@/types/post";
import efectoCorona from "@/data/blog/efecto-corona.json";
import fugasAire from "@/data/blog/fugas-aire-comprimido.json";
import lubricacion from "@/data/blog/lubricacion-por-ultrasonido.json";
import futuroUltrasonido from "@/data/blog/futuro-ultrasonido-pasivo.json";

/**
 * Artículos del blog que viven en el sitio y no en el CMS (2026-09-29).
 *
 * El blog normal se escribe en el CMS; estas guías se escribieron desde el
 * código (Emiliano pidió no tocar el CMS) y se mezclan con las del CMS en el
 * listado, el detalle, la portada y el mapa del sitio (lib/api/posts.ts). Se
 * redactan en un formato corto (bloques) y aquí se convierten al mismo JSON
 * de Tiptap que manda el CMS, así que se ven igual que cualquier artículo.
 *
 * Formato de cada bloque: ["p", texto] · ["h2", texto] · ["h3", texto] ·
 * ["lista", [textos]] · ["numerada", [textos]] · ["nota", texto] ·
 * ["img", src, alt]. En los textos, **negritas**, *cursivas* y [enlace](/ruta).
 */

type Bloque = [string, ...unknown[]];

interface ArticuloLocal {
  slug: string;
  titulo: string;
  extracto: string;
  portada: string;
  fecha: string;
  seo: { titulo: string; descripcion: string };
  bloques: Bloque[];
}

type Nodo = Record<string, unknown>;

/** Texto con **negritas** y [enlaces](/ruta) a nodos de texto de Tiptap. */
function textos(texto: string): Nodo[] {
  const nodos: Nodo[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto))) {
    if (m.index > ultimo) nodos.push({ type: "text", text: texto.slice(ultimo, m.index) });
    if (m[1]) nodos.push({ type: "text", text: m[1], marks: [{ type: "bold" }] });
    else if (m[2]) nodos.push({ type: "text", text: m[2], marks: [{ type: "italic" }] });
    else nodos.push({ type: "text", text: m[3], marks: [{ type: "link", attrs: { href: m[4] } }] });
    ultimo = m.index + m[0].length;
  }
  if (ultimo < texto.length) nodos.push({ type: "text", text: texto.slice(ultimo) });
  return nodos;
}

const parrafo = (t: string): Nodo => ({ type: "paragraph", content: textos(t) });
const lista = (tipo: string, items: string[]): Nodo => ({
  type: tipo,
  content: items.map((i) => ({ type: "listItem", content: [parrafo(i)] })),
});

function aTiptap(bloques: Bloque[]): Nodo {
  const content = bloques.map(([tipo, a, b]): Nodo => {
    switch (tipo) {
      case "h2":
        return { type: "heading", attrs: { level: 2 }, content: textos(a as string) };
      case "h3":
        return { type: "heading", attrs: { level: 3 }, content: textos(a as string) };
      case "lista":
        return lista("bulletList", a as string[]);
      case "numerada":
        return lista("orderedList", a as string[]);
      case "nota":
        return { type: "blockquote", content: [parrafo(a as string)] };
      case "img":
        return { type: "image", attrs: { src: a, alt: b } };
      default:
        return parrafo(a as string);
    }
  });
  return { type: "doc", content };
}

function aBlog(a: ArticuloLocal, i: number): Blog {
  return {
    id: `local-${i}`,
    slug: a.slug,
    title: a.titulo,
    excerpt: a.extracto,
    content: aTiptap(a.bloques),
    cover_image: a.portada,
    featured: false,
    published_at: a.fecha,
    seo: { title: a.seo.titulo, description: a.seo.descripcion },
  };
}

export const BLOGS_LOCALES: Blog[] = ([efectoCorona, fugasAire, lubricacion, futuroUltrasonido] as ArticuloLocal[]).map(aBlog);

export function getBlogLocal(slug: string): Blog | null {
  return BLOGS_LOCALES.find((b) => b.slug === slug) ?? null;
}

/** Une los del CMS con los locales, sin repetir, del más nuevo al más viejo. */
export function conBlogsLocales(delCms: Blog[]): Blog[] {
  const slugs = new Set(delCms.map((b) => b.slug));
  return [...delCms, ...BLOGS_LOCALES.filter((b) => !slugs.has(b.slug))].sort(
    (x, y) => new Date(y.published_at).getTime() - new Date(x.published_at).getTime(),
  );
}
