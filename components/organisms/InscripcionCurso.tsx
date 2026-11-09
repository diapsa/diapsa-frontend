"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import { SITE_CONFIG } from "@/lib/constants";
import { fechaGrupo, type Grupo } from "@/lib/cursos";
import type { ContactFormData } from "@/types/contact";

/**
 * InscripcionCurso
 * La inscripción corta dentro de la ficha del curso (Emiliano, 2026-11-08:
 * facilitar el ingreso, el registro y la solicitud de información desde el
 * sitio). Antes el botón "Quiero inscribirme" solo bajaba al formulario
 * largo de contacto. Ahora, sin salir de la ficha: se elige el grupo si hay
 * más de uno, para cuántas personas es, nombre, correo y WhatsApp, y se
 * aparta el lugar. Al enviar, en vez de "te responderemos pronto", se
 * confirma lo que sigue y se ofrece seguir por WhatsApp con el mensaje ya
 * escrito, guardar la fecha en el calendario y abrir el temario. Si el curso
 * no tiene fecha, el mismo formulario anota en la lista de espera o pide
 * cotización para un grupo cerrado en planta. En el CRM entra con la
 * etiqueta "[Inscripción]", "[Lista de espera]" o "[Grupo cerrado]".
 */

type Props = { slug: string; nombre: string; grupos: Grupo[] };

const PERSONAS = [
  { v: "1", t: "Solo yo" },
  { v: "2-5", t: "De 2 a 5 personas" },
  { v: "6+", t: "6 o más (grupo en mi planta)" },
];

const campo =
  "w-full rounded-sm border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-secondary";

/** Archivo .ics con el grupo, para guardar la fecha en el calendario. */
function archivoCalendario(nombre: string, slug: string, g: Grupo): string {
  const dia = (s: string) => s.replace(/-/g, "");
  const siguiente = (s: string) => {
    const d = new Date(`${s}T00:00:00`);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  };
  const url = `${SITE_CONFIG.baseUrl}/cursos/${slug}`;
  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Grupo DIAPSA//Cursos//ES",
    "BEGIN:VEVENT",
    `UID:${slug}-${g.inicio}@grupodiapsa.com.mx`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${dia(g.inicio)}`,
    `DTEND;VALUE=DATE:${siguiente(g.fin ?? g.inicio)}`,
    `SUMMARY:Curso DIAPSA: ${nombre}`,
    `DESCRIPTION:${[g.horario, g.modalidad, g.sede].filter(Boolean).join(". ")} ${url}`.trim(),
    g.sede ? `LOCATION:${g.sede}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lineas.join("\r\n"))}`;
}

export default function InscripcionCurso({ slug, nombre, grupos }: Props) {
  const { submitForm, loading, validateField } = useContactForm();
  const conFecha = grupos.length > 0;
  const [grupo, setGrupo] = useState(0);
  const [personas, setPersonas] = useState("1");
  const [datos, setDatos] = useState({ name: "", email: "", phone: "", company: "", website: "" });
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  const g = conFecha ? grupos[grupo] : null;
  const fecha = g ? fechaGrupo(g) : "";
  const cerrado = personas === "6+";
  const poner = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement>) => setDatos({ ...datos, [k]: e.target.value });

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const fallo = validateField("name", datos.name) ?? validateField("email", datos.email) ?? validateField("phone", datos.phone);
    if (fallo) return setError(fallo);
    if (!acepta) return setError("Acepta el aviso de privacidad para continuar");
    setError(null);
    const cuantos = PERSONAS.find((p) => p.v === personas)?.t ?? personas;
    const etiqueta = cerrado ? "[Grupo cerrado]" : conFecha ? "[Inscripción]" : "[Lista de espera]";
    const envio: ContactFormData = {
      name: datos.name,
      email: datos.email,
      phone: datos.phone,
      company: datos.company,
      country: "México",
      form_type: "main",
      website: datos.website,
      custom_fields: {
        subject: "cursos",
        coursesOfInterest: nombre,
        servicesOfInterest: "",
        message: `${etiqueta} ${nombre}${fecha ? ` · Grupo del ${fecha}` : " · Sin fecha publicada"} · ${cuantos}`,
        isProvider: "false",
        prefered_contact: datos.phone ? "phone" : "email",
      },
    };
    const ok = await submitForm(sanitizeContactFormData(envio)).catch(() => false);
    if (ok) setListo(true);
    else setError("No pudimos registrar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.");
  };

  const saludo = datos.name.trim() ? `Hola, soy ${datos.name.trim()}.` : "Hola.";
  const textoWhatsApp = encodeURIComponent(
    cerrado
      ? `${saludo} Quiero cotizar el curso ${nombre} para un grupo de mi planta.`
      : fecha
        ? `${saludo} Quiero inscribirme al curso ${nombre} del ${fecha}. ¿Me confirman costo y forma de pago?`
        : `${saludo} Quiero que me avisen cuando haya fecha para el curso ${nombre}.`,
  );
  const whatsapp = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${textoWhatsApp}`;

  if (listo) {
    const primerNombre = datos.name.trim().split(/\s+/)[0];
    return (
      <div className="mt-5 rounded-sm bg-primary p-4 text-white" role="status">
        <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">{cerrado ? "Cotización en camino" : conFecha ? "Lugar apartado" : "Anotado"}</p>
        <p className="mt-1 text-lg font-extrabold leading-snug">Listo, {primerNombre}.</p>
        <p className="mt-2 text-justify text-sm leading-relaxed text-white/85">
          {cerrado
            ? "Hoy mismo te contactamos para armar la propuesta del grupo: fechas, sede y costo por persona."
            : conFecha
              ? `Tu lugar en el grupo del ${fecha} queda reservado. Hoy mismo te escribimos para confirmarlo y pasarte el costo, la forma de pago y los datos de acceso.`
              : "En cuanto se abra el siguiente grupo te avisamos antes que a nadie, con fecha, costo y forma de inscripción."}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xs bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5a]">
            Confirmar por WhatsApp
          </a>
          {g && (
            <a href={archivoCalendario(nombre, slug, g)} download={`curso-diapsa-${slug}.ics`} className="inline-flex items-center justify-center rounded-xs border border-white/30 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-primary">
              Guardar la fecha en mi calendario
            </a>
          )}
          <Link href={`/cursos/${slug}/temario`} target="_blank" className="inline-flex items-center justify-center rounded-xs border border-white/30 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-primary">
            Ver el temario completo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-4">
      {grupos.length > 1 && (
        <fieldset className="mb-3">
          <legend className="text-xs font-bold text-primary">¿A qué grupo?</legend>
          <div className="mt-1.5 flex flex-col gap-1.5">
            {grupos.map((x, i) => (
              <label key={x.inicio} className={`flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm ring-1 ${i === grupo ? "bg-secondary/15 ring-secondary" : "bg-gray-50 ring-black/5"}`}>
                <input type="radio" name="grupo" checked={i === grupo} onChange={() => setGrupo(i)} className="accent-[#fc9f01]" />
                <span className="font-semibold text-primary">{fechaGrupo(x)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label className="block text-xs font-bold text-primary">
        ¿Para cuántas personas?
        <select value={personas} onChange={(e) => setPersonas(e.target.value)} className={`${campo} mt-1.5 font-normal`}>
          {PERSONAS.map((p) => (
            <option key={p.v} value={p.v}>
              {p.t}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-3 flex flex-col gap-2">
        <input className={campo} type="text" name="name" placeholder="Tu nombre" value={datos.name} onChange={poner("name")} autoComplete="name" required />
        <input className={campo} type="email" name="email" placeholder="Correo electrónico" value={datos.email} onChange={poner("email")} autoComplete="email" required />
        <input className={campo} type="tel" name="phone" placeholder="WhatsApp (para confirmarte rápido)" value={datos.phone} onChange={poner("phone")} autoComplete="tel" />
        {cerrado && <input className={campo} type="text" name="company" placeholder="Empresa o planta" value={datos.company} onChange={poner("company")} autoComplete="organization" />}
        {/* Trampa para robots: debe quedar vacía */}
        <input type="text" name="website" value={datos.website} onChange={poner("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      </div>
      <label className="mt-2.5 flex items-start gap-2 text-[11px] leading-snug text-tertiary">
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#fc9f01]" />
        <span>
          Acepto el{" "}
          <Link href="/aviso-privacidad" className="underline" target="_blank">
            aviso de privacidad
          </Link>
          .
        </span>
      </label>
      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="mt-3 inline-flex w-full items-center justify-center rounded-xs bg-secondary px-5 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Un momento…" : cerrado ? "Pedir cotización para mi equipo" : conFecha ? "Apartar mi lugar" : "Avisarme cuando haya fecha"}
      </button>
      <p className="mt-2 text-center text-[11px] text-tertiary">Sin compromiso. Te confirmamos costo y forma de pago antes de cualquier cargo.</p>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex w-full items-center justify-center rounded-xs border-2 border-primary px-5 py-2.5 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
        Mejor pregunto por WhatsApp
      </a>
    </form>
  );
}
