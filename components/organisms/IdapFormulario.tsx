"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import { ORO_IDAP } from "@/lib/idap-estilo";
import type { ContactFormData } from "@/types/contact";

/**
 * IdapFormulario
 * El cierre de /servicios/idap: pedir una demo o un informe de ejemplo
 * hecho en IDAP (Emiliano eligió los dos, 2026-09-28). La elección va en
 * la etiqueta del mensaje, [IDAP, demo] o [IDAP, informe de ejemplo],
 * para que el equipo comercial sepa qué mandar.
 */

type Tipo = "demo" | "informe";

export default function IdapFormulario() {
  const { submitForm, loading, errors, validateField } = useContactForm();
  const [tipo, setTipo] = useState<Tipo>("demo");
  const [datos, setDatos] = useState({ name: "", email: "", company: "", phone: "", website: "" });
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  // Los botones del inicio llevan a #demo-idap o #informe-idap y dejan elegida la opción
  useEffect(() => {
    const elegir = () => {
      if (window.location.hash === "#informe-idap") setTipo("informe");
      if (window.location.hash === "#demo-idap") setTipo("demo");
    };
    window.addEventListener("hashchange", elegir);
    return () => window.removeEventListener("hashchange", elegir);
  }, []);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const fallo = validateField("name", datos.name) || validateField("email", datos.email);
    if (fallo) return setError(fallo);
    if (!datos.company.trim()) return setError("Escribe el nombre de tu empresa");
    if (!acepta) return setError("Acepta el aviso de privacidad para continuar");
    setError(null);
    const envio: ContactFormData = {
      name: datos.name,
      email: datos.email,
      company: datos.company,
      phone: datos.phone,
      form_type: "main",
      website: datos.website,
      custom_fields: {
        subject: "servicios",
        coursesOfInterest: "",
        servicesOfInterest: "IDAP",
        message:
          tipo === "demo"
            ? "[IDAP, demo] Quiere agendar una demostración de IDAP"
            : "[IDAP, informe de ejemplo] Quiere recibir un informe de ejemplo generado en IDAP",
        isProvider: "false",
        prefered_contact: "email",
      },
    };
    if (await submitForm(sanitizeContactFormData(envio))) setListo(true);
  };

  const general = error ?? (errors.general ? errors.general[0] : null) ?? (Object.values(errors)[0]?.[0] ?? null);
  const campo =
    "w-full rounded-sm border border-white/15 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#ffc34d]";

  if (listo) {
    return (
      <p className="rounded-sm bg-emerald-500/15 p-5 text-justify font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
        Listo, {datos.name.split(" ")[0]}.{" "}
        {tipo === "demo"
          ? `Un especialista de DIAPSA te escribe a ${datos.email} para agendar la demostración de IDAP.`
          : `Un especialista de DIAPSA te enviará a ${datos.email} un informe de ejemplo generado en IDAP.`}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="rounded-sm bg-white/5 p-6 ring-1 ring-white/10 lg:p-8">
      <p className="text-sm font-bold text-white">¿Qué te gustaría?</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
        {(
          [
            ["demo", "Agendar una demo", "Te mostramos IDAP en vivo con datos de ejemplo."],
            ["informe", "Recibir un informe de ejemplo", "Te lo enviamos por correo para que lo revises con calma."],
          ] as const
        ).map(([id, titulo, texto]) => {
          const sel = tipo === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => setTipo(id)}
              className={`rounded-sm p-4 text-left ring-1 transition-colors ${sel ? "bg-white/10" : "ring-white/15 hover:ring-white/40"}`}
              style={sel ? { boxShadow: `inset 0 0 0 2px ${ORO_IDAP}` } : undefined}
            >
              <span className="block font-bold text-white">{titulo}</span>
              <span className="mt-1 block text-xs leading-relaxed text-white/65">{texto}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input className={campo} placeholder="Nombre*" value={datos.name} onChange={(e) => setDatos({ ...datos, name: e.target.value })} autoComplete="name" />
        <input className={campo} type="email" placeholder="Correo de trabajo*" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} autoComplete="email" />
        <input className={campo} placeholder="Empresa*" value={datos.company} onChange={(e) => setDatos({ ...datos, company: e.target.value })} autoComplete="organization" />
        <input className={campo} type="tel" placeholder="Teléfono" value={datos.phone} onChange={(e) => setDatos({ ...datos, phone: e.target.value })} autoComplete="tel" />
        <input type="text" name="website" value={datos.website} onChange={(e) => setDatos({ ...datos, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      </div>

      <label className="mt-4 flex items-start gap-2 text-xs text-white/70">
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#ffc34d]" />
        <span>
          He leído y acepto el{" "}
          <Link href="/aviso-privacidad" className="underline" style={{ color: ORO_IDAP }}>
            aviso de privacidad
          </Link>
          .
        </span>
      </label>
      {general && <p className="mt-2 text-sm font-semibold text-red-300">{general}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-full px-8 py-3 font-bold text-[#0a142e] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
        style={{ background: ORO_IDAP }}
      >
        {loading ? "Enviando…" : tipo === "demo" ? "Agendar demo" : "Quiero el informe de ejemplo"}
      </button>
    </form>
  );
}
