import datos from "@/data/mini-cursos.json";
import { TECNICAS } from "@/lib/cursos";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Mini cursos en vivo (Emiliano, 2026-10-08). El apartado de cursos se
 * divide en dos líneas: las capacitaciones con certificado y los talleres
 * prácticos, que son el catálogo del CMS, y los mini cursos: sesiones cortas
 * en línea sobre un tema puntual y a bajo costo. Estos viven en
 * data/mini-cursos.json; el precio y las fechas se capturan ahí cuando
 * DIAPSA los defina.
 */

export type MiniCurso = {
  slug: string;
  titulo: string;
  tecnica: string;
  nivel: string;
  resumen: string;
  para: string;
  aprenderas: string[];
  temario: string[];
  requisitos: string;
  foto: string;
  duracion?: string;
  /** Texto libre, por ejemplo "$990 MXN más IVA". Sin precio, se pide por WhatsApp. */
  precio?: string;
  /** Fechas AAAA-MM-DD con hora, por ejemplo { fecha: "2026-11-12", hora: "10:00 a 12:00" }. */
  fechas?: { fecha: string; hora?: string }[];
};

const DATOS = datos as unknown as {
  formato: { modalidad: string; duracion: string; grupo: string };
  cursos: MiniCurso[];
};

export const FORMATO_MINI = DATOS.formato;
export const MINI_CURSOS = DATOS.cursos;
export const RUTA_MINI = "/cursos/mini-cursos";

export const miniCurso = (slug: string) => MINI_CURSOS.find((c) => c.slug === slug) ?? null;
export const duracionDe = (c: MiniCurso) => c.duracion ?? FORMATO_MINI.duracion;
export const nombreTecnica = (clave: string) => TECNICAS.find((t) => t.clave === clave)?.nombre ?? "";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** Las fechas que no han pasado, de la más cercana a la más lejana. */
export function proximasFechas(c: MiniCurso): { texto: string; dia: string; mes: string }[] {
  const d = new Date();
  const hoy = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return (c.fechas ?? [])
    .filter((f) => new Date(`${f.fecha}T00:00:00`).getTime() >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((f) => {
      const [a, m, dia] = f.fecha.split("-").map(Number);
      return {
        texto: `${dia} de ${MESES[m - 1]} de ${a}${f.hora ? `, ${f.hora}` : ""}`,
        dia: String(dia),
        mes: MESES[m - 1].slice(0, 3),
      };
    });
}

/** WhatsApp con el mensaje ya escrito para apartar lugar en un mini curso. */
export function whatsappMini(c?: MiniCurso): string {
  const texto = c
    ? `Hola, me interesa el mini curso en vivo "${c.titulo}". ¿Me comparten la próxima fecha y el costo?`
    : "Hola, me interesan los mini cursos en vivo de DIAPSA. ¿Me comparten las próximas fechas y costos?";
  return `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(texto)}`;
}
