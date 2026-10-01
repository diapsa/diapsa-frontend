import type { Blog } from "@/types/post";
import efectoCorona from "@/data/blog/efecto-corona.json";
import fugasAire from "@/data/blog/fugas-aire-comprimido.json";
import lubricacion from "@/data/blog/lubricacion-por-ultrasonido.json";
import futuroUltrasonido from "@/data/blog/futuro-ultrasonido-pasivo.json";
import termografiaTableros from "@/data/blog/termografia-tableros.json";
import tablaNeta from "@/data/blog/tabla-neta-termografia.json";
import termografiaMotores from "@/data/blog/termografia-motores.json";
import tablaIso from "@/data/blog/tabla-iso-10816-3.json";
import desbalanceDesalineacion from "@/data/blog/desbalance-desalineacion.json";
import vibracionesMotoresBombas from "@/data/blog/vibraciones-motores-bombas.json";
import tablaTolerancias from "@/data/blog/tabla-tolerancias-alineacion.json";
import balanceoGrado from "@/data/blog/balanceo-dinamico-grado-g.json";
import alineacionMotorBomba from "@/data/blog/alineacion-motor-bomba.json";
import matrizCriticidad from "@/data/blog/matriz-criticidad.json";
import programaPredictivo from "@/data/blog/programa-predictivo.json";
import costoParo from "@/data/blog/costo-paro-no-programado.json";
import mtbfMttr from "@/data/blog/mtbf-mttr-disponibilidad.json";
import kpiPredictivo from "@/data/blog/kpi-mantenimiento-predictivo.json";
import certificacionIso from "@/data/blog/certificacion-iso-18436.json";
import codigoIso4406 from "@/data/blog/codigo-iso-4406.json";
import dgaDuval from "@/data/blog/dga-duval.json";
import aceitePruebas from "@/data/blog/aceite-pruebas-muestreo.json";
import nom022Tierras from "@/data/blog/nom-022-tierras.json";
import valorResistencia from "@/data/blog/valor-resistencia-tierra.json";
import caidaPotencial from "@/data/blog/caida-de-potencial.json";
import nom029Arco from "@/data/blog/nom-029-arco.json";
import energiaIncidente from "@/data/blog/energia-incidente-epp.json";
import fronterasEtiqueta from "@/data/blog/fronteras-etiqueta-arco.json";
import curvaPF from "@/data/blog/curva-p-f.json";
import tecnicasComplementan from "@/data/blog/tecnicas-complementan.json";
import fallaRodamientos from "@/data/blog/falla-rodamientos.json";
import codigoDeRed from "@/data/blog/codigo-de-red.json";
import factorPotencia from "@/data/blog/factor-potencia-cfe.json";
import armonicosThd from "@/data/blog/armonicos-thd.json";
import enLineaRutas from "@/data/blog/en-linea-vs-rutas.json";
import sensoresInalambricos from "@/data/blog/sensores-inalambricos.json";
import falsasAlarmas from "@/data/blog/falsas-alarmas-iot.json";
import cavitacionBombas from "@/data/blog/cavitacion-bombas.json";
import holguraMecanica from "@/data/blog/holgura-mecanica.json";
import frecuenciasRodamientos from "@/data/blog/frecuencias-rodamientos.json";
import camaraFijaMano from "@/data/blog/camara-fija-vs-mano.json";
import incendiosCamaras from "@/data/blog/incendios-camaras.json";
import centrosDeDatos from "@/data/blog/centros-de-datos.json";
import descargasParciales from "@/data/blog/descargas-parciales-transformadores.json";
import ruidoTransformador from "@/data/blog/ruido-transformador.json";
import monitoreoTransformadores from "@/data/blog/monitoreo-transformadores.json";
import acetilenoTransformador from "@/data/blog/acetileno-transformador.json";
import hidrogenoTransformador from "@/data/blog/hidrogeno-transformador.json";
import cromatografiaTransformador from "@/data/blog/cromatografia-transformador.json";

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

export const BLOGS_LOCALES: Blog[] = ([efectoCorona, fugasAire, lubricacion, futuroUltrasonido, termografiaTableros, tablaNeta, termografiaMotores, tablaIso, desbalanceDesalineacion, vibracionesMotoresBombas, tablaTolerancias, balanceoGrado, alineacionMotorBomba, matrizCriticidad, programaPredictivo, costoParo, mtbfMttr, kpiPredictivo, certificacionIso, codigoIso4406, dgaDuval, aceitePruebas, nom022Tierras, valorResistencia, caidaPotencial, nom029Arco, energiaIncidente, fronterasEtiqueta, curvaPF, tecnicasComplementan, fallaRodamientos, codigoDeRed, factorPotencia, armonicosThd, enLineaRutas, sensoresInalambricos, falsasAlarmas, cavitacionBombas, holguraMecanica, frecuenciasRodamientos, camaraFijaMano, incendiosCamaras, centrosDeDatos, descargasParciales, ruidoTransformador, monitoreoTransformadores, acetilenoTransformador, hidrogenoTransformador, cromatografiaTransformador] as ArticuloLocal[]).map(aBlog);

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
