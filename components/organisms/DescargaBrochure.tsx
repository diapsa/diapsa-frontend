"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import type { ContactFormData } from "@/types/contact";

/**
 * DescargaBrochure
 * El brochure a cambio de los datos: nombre, correo, empresa y teléfono.
 * El registro entra al CMS como un contacto de cursos, con el asunto
 * "Descarga del brochure" al inicio del mensaje, y en ese momento aparece
 * el botón de descarga. Si la persona ya lo descargó en este navegador, el
 * botón aparece directo.
 */

type Props = { curso: string; archivo: string; oscuro?: boolean };

const CLAVE = "diapsa-brochure-diplomado";

export default function DescargaBrochure({ curso, archivo, oscuro = false }: Props) {
  const { submitForm, loading, errors, validateField } = useContactForm();
  const [datos, setDatos] = useState({ name: "", email: "", company: "", phone: "", website: "" });
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  // Después de hidratar: si ya lo descargó en este navegador, directo al botón
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        if (localStorage.getItem(CLAVE) === "1") setListo(true);
      } catch {
        /* sin almacenamiento: se pide el formulario */
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const fallo = validateField("name", datos.name) || validateField("email", datos.email) || (datos.phone ? validateField("phone", datos.phone) : null);
    if (fallo) return setError(fallo);
    if (!acepta) return setError("Acepta el aviso de privacidad para continuar");
    setError(null);
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
        coursesOfInterest: curso,
        servicesOfInterest: "",
        message: `[Descarga del brochure] ${curso}`,
        isProvider: "false",
        prefered_contact: "email",
      },
    };
    const ok = await submitForm(sanitizeContactFormData(envio));
    if (ok) {
      setListo(true);
      try {
        localStorage.setItem(CLAVE, "1");
      } catch {
        /* no pasa nada si no se guarda */
      }
    }
  };

  const campo = `w-full rounded-sm border px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-secondary ${oscuro ? "border-white/20 bg-white" : "border-gray-300 bg-white"}`;
  const general = error ?? (errors.general ? errors.general[0] : null) ?? (Object.values(errors)[0]?.[0] ?? null);

  if (listo) {
    return (
      <div className={`rounded-sm p-6 text-center ${oscuro ? "bg-white/10" : "bg-emerald-50 ring-1 ring-emerald-600/20"}`}>
        <p className={`text-lg font-extrabold ${oscuro ? "text-white" : "text-primary"}`}>Tu brochure está listo</p>
        <p className={`mt-1 text-sm ${oscuro ? "text-white/70" : "text-tertiary"}`}>Te contactaremos con la fecha de la próxima generación.</p>
        <a
          href={archivo}
          download
          target="_blank"
          rel="noopener"
          className="mt-5 inline-flex items-center gap-2 rounded-xs bg-secondary px-7 py-3.5 font-bold text-primary transition-colors hover:bg-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Descargar brochure (PDF)
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input className={campo} placeholder="Nombre completo" autoComplete="name" value={datos.name} onChange={(e) => setDatos({ ...datos, name: e.target.value })} required disabled={loading} aria-label="Nombre completo" />
        <input className={campo} type="email" placeholder="correo@empresa.com" autoComplete="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} required disabled={loading} aria-label="Correo" />
        <input className={campo} placeholder="Empresa" autoComplete="organization" value={datos.company} onChange={(e) => setDatos({ ...datos, company: e.target.value })} disabled={loading} aria-label="Empresa" />
        <input className={campo} type="tel" placeholder="Teléfono (opcional)" autoComplete="tel" value={datos.phone} onChange={(e) => setDatos({ ...datos, phone: e.target.value })} disabled={loading} aria-label="Teléfono" />
      </div>
      {/* Trampa para robots: invisible para las personas */}
      <input type="text" name="website" value={datos.website} onChange={(e) => setDatos({ ...datos, website: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <label className={`flex items-start gap-2 text-xs leading-snug ${oscuro ? "text-white/75" : "text-tertiary"}`}>
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-secondary" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} disabled={loading} />
        <span>
          He leído y acepto el{" "}
          <Link href="/aviso-privacidad" className="underline">aviso de privacidad</Link> de Grupo DIAPSA.
        </span>
      </label>
      {general && <p className="text-sm font-semibold text-red-500" role="alert">{general}</p>}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xs bg-secondary px-7 py-3.5 font-bold text-primary transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {loading ? "Enviando…" : "Quiero el brochure"}
      </button>
    </form>
  );
}
