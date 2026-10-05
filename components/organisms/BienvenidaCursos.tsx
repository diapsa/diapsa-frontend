"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import { AZUL_CLARO_DIPLOMADO, FONDO_DIPLOMADO } from "@/lib/diplomado-estilo";
import type { ContactFormData } from "@/types/contact";

/**
 * BienvenidaCursos
 * El aviso de /cursos. Nació como ventana emergente a pantalla completa
 * (idea de NeoPetrol, 2026-09-27) con un formulario de cinco campos y una
 * lista de 17 cursos. Emiliano pidió el 2026-10-04 mejorarla porque tapaba
 * el catálogo y la lista era demasiado larga, igual que pasó con el webinar
 * en la portada. Ahora es una tarjeta en la esquina inferior izquierda, como
 * AvisoWebinar: anuncia el grupo más próximo (o el diplomado) y pide solo
 * nombre, correo y la técnica de interés, cinco opciones en vez de 17.
 * Aparece a los seis segundos, una vez cada siete días por navegador, y no
 * impide leer ni usar el catálogo. El envío es el mismo del resto de los
 * formularios (tipo main, asunto cursos) con la etiqueta "[Bienvenida
 * cursos]" para distinguirlo en el CRM.
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

type Props = { anuncio: Anuncio; cursos?: string[] };

const CLAVE = "diapsa-bienvenida-cursos";
const DIAS = 7;
const RETRASO_MS = 6000;

// Cinco opciones, una por técnica, en lugar de la lista completa de cursos
const INTERESES = [
  "Diplomado en Confiabilidad Operativa",
  "Vibraciones mecánicas",
  "Termografía infrarroja",
  "Ultrasonido pasivo",
  "Confiabilidad y gestión del mantenimiento",
];

export default function BienvenidaCursos({ anuncio }: Props) {
  const { submitForm, loading, errors, validateField } = useContactForm();
  const [abierta, setAbierta] = useState(false);
  const [formulario, setFormulario] = useState(false);
  const [listo, setListo] = useState(false);
  const [datos, setDatos] = useState({ name: "", email: "", curso: "", website: "" });
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const fallo = validateField("name", datos.name) || validateField("email", datos.email);
    if (fallo) return setError(fallo);
    if (!acepta) return setError("Acepta el aviso de privacidad para continuar");
    setError(null);
    const interes = datos.curso || anuncio.titulo;
    const envio: ContactFormData = {
      name: datos.name,
      email: datos.email,
      phone: "",
      company: "",
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
    "w-full rounded-sm border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-secondary";

  return (
    <aside
      aria-label="Próximo curso y aviso de fechas"
      className="fixed bottom-4 left-4 z-40 w-[min(22rem,calc(100%-6.5rem))] overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10 motion-safe:animate-[aparecer_.4s_ease-out]"
    >
      <button
        type="button"
        onClick={cerrar}
        aria-label="Cerrar aviso de cursos"
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-primary shadow hover:bg-secondary"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* El anuncio: el grupo más próximo o el diplomado */}
      <div className="relative min-h-[6.5rem] w-full overflow-hidden text-white" style={{ background: anuncio.diplomado ? FONDO_DIPLOMADO : "#002e46" }}>
        {anuncio.foto && <Image src={anuncio.foto.src} alt="" fill sizes="352px" className="object-cover opacity-25 mix-blend-luminosity" />}
        <div className="relative p-4 pr-10">
          <span
            className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: anuncio.diplomado ? AZUL_CLARO_DIPLOMADO : "#fc9f01", color: anuncio.diplomado ? "#fff" : "#002e46" }}
          >
            {anuncio.etiqueta}
          </span>
          <p className="mt-1.5 text-lg font-extrabold leading-tight">{anuncio.diplomado ? "Diplomado en Confiabilidad Operativa" : anuncio.titulo}</p>
          {anuncio.fecha && (
            <p className="mt-1 text-sm font-bold text-secondary">
              {anuncio.fecha.dia} de {anuncio.fecha.mes}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 text-primary">
        {listo ? (
          <div className="text-center">
            <p className="text-base font-extrabold">¡Listo, {datos.name.split(" ")[0]}!</p>
            <p className="mt-1 text-sm leading-relaxed text-tertiary">Te enviamos fechas y precios a {datos.email} en cuanto abra el grupo.</p>
            <button type="button" onClick={cerrar} className="mt-3 w-full rounded-xs bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-secondary hover:text-primary">
              Seguir viendo los cursos
            </button>
          </div>
        ) : formulario ? (
          <form onSubmit={enviar} noValidate>
            <p className="text-sm font-bold">Te avisamos fechas y precios</p>
            <div className="mt-2 flex flex-col gap-2">
              <input className={campo} placeholder="Nombre" value={datos.name} onChange={(e) => setDatos({ ...datos, name: e.target.value })} autoComplete="name" autoFocus />
              <input className={campo} type="email" placeholder="Correo electrónico" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} autoComplete="email" />
              <select className={campo} value={datos.curso} onChange={(e) => setDatos({ ...datos, curso: e.target.value })} aria-label="Técnica de interés">
                <option value="">Me interesa: {anuncio.diplomado ? "el diplomado" : anuncio.titulo}</option>
                {INTERESES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {/* Trampa para robots: debe quedar vacía */}
              <input type="text" name="website" value={datos.website} onChange={(e) => setDatos({ ...datos, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            </div>
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
            {general && <p className="mt-2 text-xs font-semibold text-red-600">{general}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-xs bg-secondary px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Enviando…" : "Quiero recibir fechas"}
            </button>
          </form>
        ) : (
          <>
            <p className="text-justify text-sm leading-relaxed text-tertiary">{anuncio.detalle}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setFormulario(true)}
                className="inline-flex flex-1 items-center justify-center rounded-xs bg-secondary px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Recibir fechas
              </button>
              <Link
                href={anuncio.href}
                onClick={cerrar}
                className="inline-flex flex-1 items-center justify-center rounded-xs border-2 border-primary px-3 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Ver programa
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
