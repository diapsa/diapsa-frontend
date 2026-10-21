import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { RUTA_CLINICAS } from "@/lib/clinicas";
import { enlaceContacto } from "@/lib/contacto-opciones";

/**
 * InicioContacto
 * La franja de contacto justo debajo del hero (Emiliano, 2026-10-19). En
 * Clarity solo el 16 % de la portada se ve: lo que vende tiene que estar en
 * la primera pantalla y media. Tres salidas de bajo compromiso: WhatsApp,
 * la medición sin costo de tres equipos y las clínicas técnicas.
 */

const WHATSAPP = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent("Hola, quiero información para mi planta.")}`;

const SALIDAS = [
  {
    etiqueta: "Lo más rápido",
    titulo: "Escríbenos por WhatsApp",
    texto: "Te contesta un especialista, no un bot.",
    accion: "Escribir por WhatsApp",
    href: WHATSAPP,
    externo: true,
    verde: true,
  },
  {
    etiqueta: "Sin costo",
    titulo: "Medimos tres equipos de tu planta",
    texto: "Vibraciones o termografía en tres equipos críticos, con el informe de cada uno.",
    accion: "Pedir la medición",
    href: enlaceContacto("servicios", "Análisis de Vibraciones Mecánicas"),
  },
  {
    etiqueta: "Nuevo",
    titulo: "Clínicas técnicas en vivo",
    texto: "Un tema puntual en dos horas, en línea, con tu propio caso.",
    accion: "Ver los temas",
    href: RUTA_CLINICAS,
  },
];

export default function InicioContacto() {
  return (
    <section className="w-full bg-white" aria-label="Cómo empezar">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SALIDAS.map((s) => {
            const clase = `mt-4 inline-flex w-full items-center justify-center rounded-xs px-4 py-3 text-sm font-bold transition-colors ${
              s.verde ? "bg-[#25D366] text-white hover:opacity-90" : "bg-primary text-white hover:bg-secondary hover:text-primary"
            }`;
            return (
              <li key={s.titulo} className="flex flex-col rounded-sm border-l-4 border-secondary bg-gray-50 p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-secondary-dark">{s.etiqueta}</p>
                <p className="mt-1 text-xl font-extrabold leading-snug text-primary">{s.titulo}</p>
                <p className="mt-1 flex-1 text-justify text-sm leading-relaxed text-tertiary">{s.texto}</p>
                {s.externo ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={clase}>
                    {s.accion}
                  </a>
                ) : (
                  <Link href={s.href} prefetch={false} className={clase}>
                    {s.accion}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
