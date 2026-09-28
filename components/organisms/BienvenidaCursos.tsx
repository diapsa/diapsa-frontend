"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import { AZUL_CLARO_DIPLOMADO, FONDO_DIPLOMADO } from "@/lib/diplomado-estilo";
import type { ContactFormData } from "@/types/contact";

/**
 * BienvenidaCursos
 * La ventana que aparece al entrar a /cursos (idea tomada de NeoPetrol,
 * 2026-09-27): a la izquierda el anuncio del curso más próximo y a la
 * derecha un formulario corto para recibir fechas y precios.
 *
 * Si hay un grupo con fecha en data/cursos-extra.json, se anuncia ese; si
 * no, el diplomado, que es el programa insignia. Aparece a los cuatro
 * segundos, una vez cada siete días por navegador, y se cierra con la
 * equis, con Escape o tocando fuera. El envío es el mismo del resto de los
 * formularios (tipo main, asunto cursos) con la etiqueta
 * "[Bienvenida cursos]" para distinguirlo en el CRM.
 */

export type Anuncio = {
  etiqueta: string;
  titulo: string;
  detalle: string;
  fecha?: { dia: string; mes: string } | null;
  href: string;
  foto?: { src: string; alt: string };
  diplomado?: boolean;
};

type Props = { anuncio: Anuncio; cursos: string[] };

const CLAVE = "diapsa-bienvenida-cursos";
const DIAS = 7;
const RETRASO_MS = 4000;

export default function BienvenidaCursos({ anuncio, cursos }: Props) {
  const { submitForm, loading, errors, validateField } = useContactForm();
  const [abierta, setAbierta] = useState(false);
  const [listo, setListo] = useState(false);
  const [datos, setDatos] = useState({ name: "", email: "", company: "", phone: "", curso: "", website: "" });
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const primerCampo = useRef<HTMLInputElement>(null);

  // Aparece una vez cada siete días; si no hay almacenamiento, aparece.
  useEffect(() => {
    let visto = false;
    try {
      const ultima = Number(localStorage.getItem(CLAVE) || 0);
      visto = Date.now() - ultima < DIAS * 86400000;
    } catch {
      /* sin almacenamiento */
    }
    if (visto) return;
    const t = window.setTimeout(() => setAbierta(true), RETRASO_MS);
    return () => window.clearTimeout(t);
  }, []);

  const cerrar = () => {
    setAbierta(false);
    try {
      localStorage.setItem(CLAVE, String(Date.now()));
    } catch {
      /* no pasa nada */
    }
  };

  useEffect(() => {
    if (!abierta) return;
    primerCampo.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [abierta]);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const fallo = validateField("name", datos.name) || validateField("email", datos.email) || (datos.phone ? validateField("phone", datos.phone) : null);
    if (fallo) return setError(fallo);
    if (!acepta) return setError("Acepta el aviso de privacidad para continuar");
    setError(null);
    const interes = datos.curso || anuncio.titulo;
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
        coursesOfInterest: interes,
        servicesOfInterest: "",
        message: `[Bienvenida cursos] Quiere fechas y precios de: ${interes}`,
        isProvider: "false",
        prefered_contact: "email",
      },
    };
    const ok = await submitForm(sanitizeContactFormData(envio));
    if (ok) {
      setListo(true);
      try {
        localStorage.setItem(CLAVE, String(Date.now() + 365 * 86400000));
      } catch {
        /* no pasa nada */
      }
    }
  };

  if (!abierta) return null;
  const general = error ?? (errors.general ? errors.general[0] : null) ?? (Object.values(errors)[0]?.[0] ?? null);
  const campo =
    "w-full rounded-sm border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-secondary";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm motion-safe:animate-[fadeIn_.3s_ease-out]"
      onClick={cerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bienvenida-titulo"
    >
      <div
        className="relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-sm bg-white shadow-2xl md:grid-cols-2 md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow transition-colors hover:bg-gray-100"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* El anuncio del curso más próximo */}
        <div
          className="relative flex min-h-[14rem] flex-col justify-end overflow-hidden p-7 text-white md:min-h-full md:p-9"
          style={{ background: anuncio.diplomado ? FONDO_DIPLOMADO : "#002e46" }}
        >
          {anuncio.foto && (
            <Image src={anuncio.foto.src} alt="" fill sizes="(min-width: 768px) 28rem, 100vw" className="object-cover opacity-25 mix-blend-luminosity" />
          )}
          <div className="relative">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
              style={{ background: anuncio.diplomado ? AZUL_CLARO_DIPLOMADO : "#fc9f01", color: anuncio.diplomado ? "#fff" : "#002e46" }}
            >
              {anuncio.etiqueta}
            </span>
            {anuncio.diplomado && <p className="mt-5 text-5xl font-black leading-none tracking-tight">DIPLOMADO</p>}
            <p className={`${anuncio.diplomado ? "mt-2 text-lg" : "mt-5 text-2xl"} font-extrabold leading-tight`}>{anuncio.titulo}</p>
            {anuncio.fecha && (
              <p className="mt-4 inline-flex items-baseline gap-2 rounded-sm bg-white/15 px-3 py-2">
                <span className="text-3xl font-black leading-none">{anuncio.fecha.dia}</span>
                <span className="text-sm font-bold uppercase">{anuncio.fecha.mes}</span>
              </p>
            )}
            <p className="mt-4 text-justify text-sm leading-relaxed text-white/85">{anuncio.detalle}</p>
            <Link href={anuncio.href} onClick={cerrar} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-2 underline-offset-4 hover:text-secondary">
              Ver el programa completo
            </Link>
          </div>
        </div>

        {/* El formulario */}
        <div className="p-7 md:p-9">
          {listo ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</span>
              <p className="mt-4 text-xl font-extrabold text-primary">¡Listo, {datos.name.split(" ")[0]}!</p>
              <p className="mt-2 text-sm leading-relaxed text-tertiary">Te enviamos fechas y precios a {datos.email} en cuanto el grupo abra inscripciones.</p>
              <button type="button" onClick={cerrar} className="mt-6 rounded-xs bg-primary px-6 py-3 font-bold text-white hover:bg-secondary hover:text-primary">
                Ver los cursos
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate>
              <p id="bienvenida-titulo" className="text-center text-2xl font-extrabold uppercase tracking-wide text-primary">
                Recibe fechas y precios
              </p>
              <p className="mt-2 text-center text-sm text-tertiary">Te avisamos cuando abra el próximo grupo, sin compromiso.</p>
              <div className="mt-6 flex flex-col gap-3">
                <input ref={primerCampo} className={campo} placeholder="Nombre completo" value={datos.name} onChange={(e) => setDatos({ ...datos, name: e.target.value })} autoComplete="name" />
                <input className={campo} type="email" placeholder="Correo electrónico" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} autoComplete="email" />
                <input className={campo} placeholder="Empresa" value={datos.company} onChange={(e) => setDatos({ ...datos, company: e.target.value })} autoComplete="organization" />
                <input className={campo} type="tel" placeholder="Teléfono (opcional)" value={datos.phone} onChange={(e) => setDatos({ ...datos, phone: e.target.value })} autoComplete="tel" />
                <select className={campo} value={datos.curso} onChange={(e) => setDatos({ ...datos, curso: e.target.value })} aria-label="Curso de interés">
                  <option value="">Curso de interés: {anuncio.titulo}</option>
                  {cursos.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {/* Trampa para robots: debe quedar vacía */}
                <input type="text" name="website" value={datos.website} onChange={(e) => setDatos({ ...datos, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              </div>
              <label className="mt-4 flex items-start gap-2 text-xs leading-snug text-tertiary">
                <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#fc9f01]" />
                <span>
                  Acepto el{" "}
                  <Link href="/aviso-privacidad" className="underline">
                    aviso de privacidad
                  </Link>{" "}
                  de Grupo DIAPSA.
                </span>
              </label>
              {general && <p className="mt-3 text-sm font-semibold text-red-600">{general}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-xs bg-secondary px-6 py-3.5 font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Enviando…" : "Quiero recibir fechas"}
              </button>
              <button type="button" onClick={cerrar} className="mt-3 w-full text-center text-sm font-semibold text-tertiary hover:text-primary">
                Ahora no, solo quiero ver los cursos
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
