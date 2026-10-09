import datos from "@/data/clinicas-tecnicas.json";
import { TECNICAS } from "@/lib/cursos";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Clínicas técnicas en vivo (Emiliano, 2026-10-08; el nombre, 2026-10-09:
 * "no quiero que se llamen minicursos"). El apartado de cursos se divide en
 * dos líneas: las capacitaciones con certificado y los talleres prácticos,
 * que son el catálogo del CMS, y las clínicas: sesiones cortas en línea sobre
 * un tema puntual, a bajo costo, con espacio para el caso de cada
 * participante. Viven en data/clinicas-tecnicas.json; el precio y las fechas
 * se capturan ahí cuando DIAPSA los defina.
 */

export type Clinica = {
  slug: string;
  titulo: string;
  tecnica: string;
  /** 1 para empezar, 2 aplícalo, 3 diagnostica. */
  nivel: 1 | 2 | 3;
  /** Por técnica, o por tipo de equipo cuando combina técnicas. */
  eje: "tecnica" | "equipo";
  resumen: string;
  para: string;
  aprenderas: string[];
  temario: string[];
  requisitos: string;
  foto: string;
  /** Qué puede traer el participante para verlo en la sesión. */
  caso: string;
  duracion?: string;
  /** Texto libre, por ejemplo "$990 MXN más IVA". Sin precio, se pide por WhatsApp. */
  precio?: string;
  /** Fechas AAAA-MM-DD con hora, por ejemplo { fecha: "2026-11-12", hora: "10:00 a 12:00" }. */
  fechas?: { fecha: string; hora?: string }[];
};

const DATOS = datos as unknown as {
  formato: { modalidad: string; duracion: string; grupo: string };
  niveles: Record<string, { nombre: string; texto: string }>;
  clinicas: Clinica[];
};

export const FORMATO_CLINICA = DATOS.formato;
export const CLINICAS = DATOS.clinicas;
export const RUTA_CLINICAS = "/cursos/clinicas-tecnicas";

export const clinica = (slug: string) => CLINICAS.find((c) => c.slug === slug) ?? null;
export const duracionDe = (c: Clinica) => c.duracion ?? FORMATO_CLINICA.duracion;
export const nombreTecnica = (clave: string) => (clave === "equipos" ? "Por tipo de equipo" : TECNICAS.find((t) => t.clave === clave)?.nombre ?? "");

/** Los tres niveles de la ruta de cada técnica. */
export const NIVELES = ([1, 2, 3] as const).map((n) => ({ n, ...DATOS.niveles[String(n)] }));
export const nivelDe = (c: Clinica) => NIVELES[c.nivel - 1];

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** Las fechas que no han pasado, de la más cercana a la más lejana. */
export function proximasFechas(c: Clinica): { texto: string; dia: string; mes: string }[] {
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

/** WhatsApp con el mensaje ya escrito para apartar lugar en una clínica. */
export function whatsappClinica(c?: Clinica): string {
  const texto = c
    ? `Hola, me interesa la clínica técnica "${c.titulo}". ¿Me comparten la próxima fecha y el costo?`
    : "Hola, me interesan las clínicas técnicas en vivo de DIAPSA. ¿Me comparten las próximas fechas y costos?";
  return `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(texto)}`;
}
