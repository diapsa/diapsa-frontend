import servicios from "@/data/servicios.json";
import menuCursos from "@/data/menu-cursos.json";
import clinicas from "@/data/clinicas-tecnicas.json";

/**
 * Opciones del formulario de contacto por motivo (Emiliano, 2026-10-06).
 * Al elegir qué necesita, el formulario muestra solo las opciones de ese
 * motivo, como fichas que se marcan con un toque, en lugar de pedir que lo
 * escriba en el mensaje. Las listas salen de los mismos archivos que el
 * menú, así que un servicio o curso nuevo aparece solo. Las páginas del
 * sitio enlazan a /contacto con el motivo y el interés ya elegidos por
 * medio de enlaceContacto().
 */

export type Motivo = "servicios" | "equipos" | "cursos" | "proveedor" | "otro";

export type GrupoOpciones = { titulo: string; opciones: string[] };

type Entrada = { label: string; href: string; children?: { label: string; href: string }[] };

const [condicion, continuo, ...sueltos] = servicios as Entrada[];

export const OPCIONES_SERVICIOS: GrupoOpciones[] = [
  { titulo: "Monitoreo en ruta", opciones: (condicion.children ?? []).map((c) => c.label) },
  { titulo: "Monitoreo en línea", opciones: (continuo.children ?? []).map((c) => c.label) },
  { titulo: "Programas", opciones: sueltos.map((s) => s.label.replace("Conoce ", "")) },
];

export const OPCIONES_EQUIPOS: GrupoOpciones[] = [
  {
    titulo: "Equipos",
    opciones: [
      "Cámaras acústicas HERTZINNO",
      "Sensores de vibración KCF",
      "Cámaras termográficas HIKMICRO",
      "Cámaras térmicas fijas",
      "Sensores acústicos para transformadores",
      "Monitor DGA en línea",
      "Centinelas para ductos",
    ],
  },
];

const tecnicaCorta = (titulo: string) => titulo.split(" ")[0];
export const OPCIONES_CURSOS: GrupoOpciones[] = (menuCursos as { titulo: string; items: { label: string }[] }[]).map((c) => ({
  titulo: c.titulo,
  opciones: c.items.map((i) => (c.titulo.startsWith("Confiabilidad") ? i.label : `${tecnicaCorta(c.titulo)} · ${i.label}`)),
})).concat({
  // La otra línea de cursos: clínicas técnicas en línea (data/clinicas-tecnicas.json)
  titulo: "Clínicas técnicas",
  opciones: clinicas.clinicas.map((m) => `Clínica · ${m.titulo}`),
});

export const OPCIONES_POR_MOTIVO: Record<Motivo, GrupoOpciones[]> = {
  servicios: OPCIONES_SERVICIOS,
  equipos: OPCIONES_EQUIPOS,
  cursos: OPCIONES_CURSOS,
  proveedor: [],
  otro: [],
};

/** Nombre del campo del CRM en que viaja la selección de cada motivo. */
export const CAMPO_POR_MOTIVO: Record<Motivo, string> = {
  servicios: "servicesOfInterest",
  equipos: "productsOfInterest",
  cursos: "coursesOfInterest",
  proveedor: "",
  otro: "",
};

export const MENSAJE_POR_MOTIVO: Record<Motivo | "", string> = {
  "": "Cuéntanos cómo podemos ayudarte",
  servicios: "Qué equipos tienes, qué te preocupa y dónde está la planta",
  equipos: "Cuántos equipos necesitas y para qué aplicación",
  cursos: "Cuántas personas y qué tema o caso te interesa",
  proveedor: "Qué ofreces y a quién atiendes",
  otro: "Cuéntanos cómo podemos ayudarte",
};

export const MOTIVOS: { valor: Motivo; texto: string; corto: string }[] = [
  { valor: "servicios", texto: "Cotizar un servicio para mi planta", corto: "Un servicio" },
  { valor: "equipos", texto: "Cotizar un equipo (cámaras, sensores)", corto: "Un equipo" },
  { valor: "cursos", texto: "Información de cursos o del diplomado", corto: "Un curso o clínica" },
  { valor: "proveedor", texto: "Soy proveedor", corto: "Soy proveedor" },
  { valor: "otro", texto: "Otro", corto: "Otra cosa" },
];

export function esMotivo(v: string | null | undefined): v is Motivo {
  return MOTIVOS.some((m) => m.valor === v);
}

/** Enlace a la página de contacto con el motivo y, si se sabe, el interés ya marcado. */
export function enlaceContacto(motivo: Motivo, interes?: string) {
  const p = new URLSearchParams({ motivo });
  if (interes) p.set("interes", interes);
  return `/contacto?${p.toString()}`;
}

/** Etiqueta del menú de cada servicio por su ruta, para marcarlo solo. */
const SERVICIO_POR_RUTA: Record<string, string> = Object.fromEntries(
  (servicios as Entrada[]).flatMap((e) => (e.children ? e.children.map((c) => [c.href, c.label]) : [[e.href, e.label.replace("Conoce ", "")]])),
);

/**
 * Motivo e interés que se deducen de la página en que está el formulario:
 * en la página de un servicio, ese servicio; en productos, equipos. En las
 * demás, nada, y el visitante elige.
 */
export function interesDeRuta(pathname: string): { motivo: Motivo; interes?: string } | null {
  const ruta = pathname.replace(/\/$/, "");
  if (SERVICIO_POR_RUTA[ruta]) return { motivo: "servicios", interes: SERVICIO_POR_RUTA[ruta] };
  if (ruta.startsWith("/servicios/")) return { motivo: "servicios" };
  if (ruta.startsWith("/productos")) return { motivo: "equipos" };
  if (ruta.startsWith("/industrias/")) return { motivo: "servicios" };
  return null;
}
