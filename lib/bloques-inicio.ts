import type { ApartadoBloque, TarjetaBloque } from "@/components/organisms/CarruselBloque";
import servicios from "@/data/servicios.json";
import menuCursos from "@/data/menu-cursos.json";
import { galeriaDe } from "@/lib/cursos";
import type { Product } from "@/types/product";

/**
 * Los datos de los bloques con carrusel de la portada y de monitoreo de
 * condición: servicios, cursos y productos, cada uno con sus apartados.
 *
 * Nombres y descripciones salen del menú (data/servicios.json y
 * data/menu-cursos.json), para que el desplegable y las tarjetas digan lo
 * mismo. Las fotos de servicio salen de la imagen principal de cada página;
 * las de cursos, de las galerías reales de cada técnica.
 */

type EntradaMenu = { label: string; href: string; descripcion?: string; icono?: string };

// La imagen principal de cada servicio, por el final de su ruta.
const FOTOS: Record<string, string> = {
  "vibraciones-mecanicas": "/images/gallery/campo/vibracion-analista-motor.webp",
  "alineacion-balanceo": "/images/servicios/alineacion-balanceo/campo-analista-tablet.webp",
  "termografia-infrarroja": "/images/servicios/termografia-infrarroja/termograma-subestacion.jpg",
  "calidad-de-energia": "/images/servicios/estudios-electricos/campo-analista-tablero.webp",
  "diagnostico-de-maquinaria": "/images/servicios/medicion-bomba-planta.webp",
  "analisis-de-ultrasonido": "/images/servicios/analisis-de-ultrasonido/acustica-en-planta.webp",
  "analisis-de-aceite": "/images/servicios/analisis-de-aceite/muestreo-motor-azul.webp",
  "tierras-fisicas": "/images/servicios/tierras-fisicas/registro-abierto.webp",
  "arco-electrico": "/images/servicios/analisis-de-aceite/dga-gabinete.webp",
  "camaras-termicas": "/images/servicios/termografia-infrarroja/campo-02.webp",
  "sensores-vibracion": "/images/servicios/sensores-vibracion/sensor-motor.webp",
  "sensores-acusticos": "/images/servicios/sensores-acusticos/campo-08.webp",
  "dga-en-linea": "/images/servicios/analisis-de-aceite/dga-transformador.webp",
  "diapsa-start": "/images/diapsa-start/mediciones-diapsa-start.jpg",
  idap: "/images/idap/capturas/inspeccion-vibraciones.jpg",
  "deteccion-gas": "/images/deteccion-gas/campo/inspeccion-planta.webp",
  "diagnostico-situacional": "/images/diagnostico-situacional/engineer-checking-machinery.webp",
};

const slugDe = (href: string) => href.split("/").filter(Boolean).pop() ?? href;

function tarjeta(e: EntradaMenu): TarjetaBloque {
  const foto = FOTOS[slugDe(e.href)];
  return {
    titulo: e.label,
    texto: e.descripcion,
    href: e.href,
    imagen: foto ? { src: foto, alt: `${e.label}: trabajo de DIAPSA en campo` } : undefined,
  };
}

const [condicion, continuo, ...sueltos] = servicios as (EntradaMenu & { children?: EntradaMenu[] })[];
const hijosCondicion = condicion.children ?? [];
const porSlug = (slug: string) => hijosCondicion.find((s) => slugDe(s.href) === slug) as EntradaMenu;

/** Los dos frentes de monitoreo de condición, para su propia página. */
export const APARTADOS_CONDICION: ApartadoBloque[] = [
  {
    id: "rotativa",
    nombre: "Maquinaria rotativa",
    tarjetas: ["vibraciones-mecanicas", "alineacion-balanceo", "analisis-de-ultrasonido", "analisis-de-aceite", "diagnostico-de-maquinaria"].map(
      (s) => tarjeta(porSlug(s)),
    ),
  },
  {
    id: "electricos",
    nombre: "Sistemas eléctricos",
    tarjetas: ["termografia-infrarroja", "calidad-de-energia", "tierras-fisicas", "arco-electrico"].map((s) => tarjeta(porSlug(s))),
  },
];

/** El bloque de servicios de la portada. */
export const APARTADOS_SERVICIOS: ApartadoBloque[] = [
  { id: "condicion", nombre: condicion.label, href: condicion.href, tarjetas: hijosCondicion.map(tarjeta) },
  { id: "continuo", nombre: continuo.label, href: continuo.href, tarjetas: (continuo.children ?? []).map(tarjeta) },
  { id: "mas", nombre: "Más servicios", href: "/servicios", tarjetas: sueltos.map(tarjeta) },
];

/** El bloque de cursos de la portada, un apartado por técnica. */
export const APARTADOS_CURSOS: ApartadoBloque[] = (menuCursos as { titulo: string; href?: string; items: EntradaMenu[] }[]).map(
  (col) => ({
    id: slugDe(col.titulo.toLowerCase().replace(/\s+/g, "-")),
    nombre: col.titulo,
    href: "/cursos#catalogo",
    tarjetas: col.items.map((c, i) => {
      const fotos = galeriaDe(slugDe(c.href));
      const foto = fotos.length ? fotos[i % fotos.length] : undefined;
      return {
        titulo: c.label === "Formación técnica" || c.label === "Taller práctico" || c.label.startsWith("Certificación")
          ? `${c.label} en ${col.titulo.toLowerCase()}`
          : c.label,
        texto: c.descripcion,
        href: c.href,
        imagen: foto,
      };
    }),
  }),
);

/** El bloque de productos, un apartado por categoría del CMS. */
export function apartadosProductos(productos: Product[], urlImagen: (ruta: string) => string): ApartadoBloque[] {
  const grupos = new Map<string, ApartadoBloque>();
  for (const p of productos) {
    const cat = p.category;
    const id = cat?.slug ?? "otros";
    if (!grupos.has(id)) grupos.set(id, { id, nombre: cat?.name ?? "Otros", href: `/productos/${id}`, tarjetas: [] });
    grupos.get(id)!.tarjetas.push({
      titulo: [p.model, p.name].filter(Boolean).join(" · "),
      texto: p.brand?.name,
      href: `/productos/${id}/${p.slug}`,
      imagen: p.main_image ? { src: urlImagen(p.main_image), alt: p.name } : undefined,
      contener: true,
    });
  }
  return [...grupos.values()];
}
