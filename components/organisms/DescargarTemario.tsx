"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import type { ContactFormData } from "@/types/contact";

/**
 * DescargarTemario
 * En la ficha de un curso, el botón "Descargar el temario" (Emiliano,
 * 2026-10-04): pide solo el correo, lo registra como interesado con la
 * etiqueta "[Temario]" en el CRM y abre la hoja del temario
 * (/cursos/<slug>/temario), que se imprime o se guarda como PDF desde el
 * navegador. Así el temario siempre está al día con el CMS y no hay que
 * generar quince archivos.
 */
export default function DescargarTemario({ slug, nombre }: { slug: string; nombre: string }) {
  const { submitForm, loading, validateField } = useContactForm();
  const [abierto, setAbierto] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const destino = `/cursos/${slug}/temario`;

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const fallo = validateField("email", email);
    if (fallo) return setError(fallo);
    if (!acepta) return setError("Acepta el aviso de privacidad para continuar");
    setError(null);
    const envio: ContactFormData = {
      name: "Interesado en el temario",
      email,
      phone: "",
      company: "",
      country: "México",
      form_type: "main",
      website,
      custom_fields: {
        subject: "cursos",
        coursesOfInterest: nombre,
        servicesOfInterest: "",
        message: `[Temario] Descargó el temario de: ${nombre}`,
        isProvider: "false",
        prefered_contact: "email",
      },
    };
    // Aunque el registro falle, el temario se abre: el interesado no paga el error
    await submitForm(sanitizeContactFormData(envio)).catch(() => false);
    window.open(destino, "_blank", "noopener");
    setAbierto(false);
  };

  const campo =
    "w-full rounded-sm border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-secondary";

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xs border border-gray-300 px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:border-primary"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Descargar el temario
      </button>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="rounded-sm bg-gray-50 p-3 ring-1 ring-black/5">
      <p className="text-sm font-bold text-primary">Te mandamos el temario a tu correo</p>
      <input className={`${campo} mt-2`} type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
      {/* Trampa para robots: debe quedar vacía */}
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="mt-2 flex items-start gap-2 text-[11px] leading-snug text-tertiary">
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#fc9f01]" />
        <span>
          Acepto el{" "}
          <Link href="/aviso-privacidad" className="underline">
            aviso de privacidad
          </Link>
          .
        </span>
      </label>
      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full rounded-xs bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Un momento…" : "Ver y descargar el temario"}
      </button>
    </form>
  );
}
