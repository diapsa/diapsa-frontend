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

// Resumen general y tres ideas clave de cada apartado (texto de la portada).
const INFO: Record<string, { descripcion: string; puntos: string[] }> = {
  condicion: {
    descripcion:
      "Rutas periódicas en las que nuestros analistas miden tus equipos con ellos en operación. Nueve técnicas para maquinaria rotativa y sistemas eléctricos, y cada hallazgo llega con su severidad y la recomendación de qué hacer.",
    puntos: ["Sin detener la producción", "Informe por ruta e historial en IDAP", "Analistas certificados Categoría 3"],
  },
  continuo: {
    descripcion:
      "Sensores y cámaras fijas que vigilan tus equipos críticos las 24 horas y avisan en cuanto la condición cambia. Para los activos que no pueden esperar a la siguiente ruta.",
    puntos: ["Aviso en cuanto algo cambia", "Los datos llegan a IDAP", "Instalación y puesta en marcha incluidas"],
  },
  mas: {
    descripcion:
      "Lo que completa el programa: arrancar el monitoreo desde cero con DIAPSA START, la plataforma IDAP, la detección de fugas de gas para la ASEA y el diagnóstico situacional de toda la planta.",
    puntos: ["Arranque paso a paso", "Cumplimiento del PPCIEM", "Una referencia del estado de tus activos"],
  },
  "Vibraciones mecánicas": {
    descripcion:
      "De la primera ruta a la certificación: formación técnica para aprender a medir y administrar espectros, taller para resolver casos reales y certificación ISO 18436-2 en Categorías I y II.",
    puntos: ["Práctica con equipos instalados", "Instructores que trabajan en campo", "Certificación ISO 18436-2"],
  },
  "Termografía infrarroja": {
    descripcion:
      "Inspección con cámara infrarroja en sistemas eléctricos y mecánicos, de la formación a la certificación ISO 18436-7, y un curso especial para inspeccionar plantas fotovoltaicas.",
    puntos: ["Práctica con imágenes reales", "Certificación ISO 18436-7", "Fotovoltaica conforme a IEC TS 62446-3"],
  },
  "Ultrasonido pasivo": {
    descripcion:
      "Detectar por sonido fugas de aire, gas y vapor, rodamientos dañados y descargas eléctricas: formación, taller y certificación para especialistas y analistas.",
    puntos: ["Fugas de aire, gas y vapor", "Subestaciones, tableros y transformadores", "Rodamientos antes de que fallen"],
  },
  "Confiabilidad y gestión": {
    descripcion:
      "Para quien dirige el programa: el diplomado en confiabilidad operativa, criticidad y frecuencia de inspección, mantenimiento proactivo, informes técnicos y mantenimiento explicado para directivos.",
    puntos: ["Diplomado de 60 horas en vivo", "Criticidad y frecuencia de inspección", "Informes que llevan a una decisión"],
  },
};

const ICONOS_CURSOS: Record<string, string> = {
  "Vibraciones mecánicas": "vibraciones",
  "Termografía infrarroja": "termografia",
  "Ultrasonido pasivo": "ultrasonido",
  "Confiabilidad y gestión": "certificado",
};

/** Los dos frentes de monitoreo de condición, para su propia página. */
export const APARTADOS_CONDICION: ApartadoBloque[] = [
  {
    id: "rotativa",
    nombre: "Maquinaria rotativa",
    icono: "vibraciones",
    tarjetas: ["vibraciones-mecanicas", "alineacion-balanceo", "analisis-de-ultrasonido", "analisis-de-aceite", "diagnostico-de-maquinaria"].map(
      (s) => tarjeta(porSlug(s)),
    ),
  },
  {
    id: "electricos",
    nombre: "Sistemas eléctricos",
    icono: "electricos",
    tarjetas: ["termografia-infrarroja", "calidad-de-energia", "tierras-fisicas", "arco-electrico"].map((s) => tarjeta(porSlug(s))),
  },
];

/** El bloque de servicios de la portada. */
export const APARTADOS_SERVICIOS: ApartadoBloque[] = [
  { id: "condicion", nombre: condicion.label, href: condicion.href, icono: "diagnostico", ...INFO.condicion, tarjetas: hijosCondicion.map(tarjeta) },
  { id: "continuo", nombre: continuo.label, href: continuo.href, icono: "camaras", ...INFO.continuo, tarjetas: (continuo.children ?? []).map(tarjeta) },
  { id: "mas", nombre: "Más servicios", href: "/servicios", icono: "start", ...INFO.mas, tarjetas: sueltos.map(tarjeta) },
];

/** El bloque de cursos de la portada, un apartado por técnica. */
export const APARTADOS_CURSOS: ApartadoBloque[] = (menuCursos as { titulo: string; href?: string; items: EntradaMenu[] }[]).map(
  (col) => ({
    id: slugDe(col.titulo.toLowerCase().replace(/\s+/g, "-")),
    nombre: col.titulo,
    href: "/cursos#catalogo",
    icono: ICONOS_CURSOS[col.titulo],
    ...INFO[col.titulo],
    tarjetas: col.items.map((c, i) => {
      // Si el curso no tiene galería propia (el diplomado), usa las fotos
      // de los demás cursos de su columna.
      const propias = galeriaDe(slugDe(c.href));
      const fotos = propias.length ? propias : col.items.flatMap((o) => galeriaDe(slugDe(o.href)));
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
    if (!grupos.has(id))
      grupos.set(id, { id, nombre: cat?.name ?? "Otros", href: `/productos/${id}`, icono: id.includes("acust") ? "acusticos" : "sensores-vibracion", tarjetas: [] });
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
