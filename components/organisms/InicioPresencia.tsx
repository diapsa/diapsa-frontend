"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import presencia from "@/data/presencia.json";
import type { ContactFormData } from "@/types/contact";

/**
 * InicioPresencia
 * Los resultados y la presencia de DIAPSA en la portada, con la estructura
 * que Emiliano tomó de Fracttal (2026-09-27): titular, texto y un
 * formulario corto a la izquierda, un mapa de puntos con los países donde
 * operamos a la derecha, y abajo cuatro tarjetas con cifras.
 *
 * Las cifras salen de los casos de éxito publicados en el CMS (se leen del
 * caso, no se escriben aquí) y cada tarjeta dice de qué industria sale y
 * lleva al caso; si el CMS no responde, las tarjetas no aparecen. Los
 * países y el mapa están en data/presencia.json y public/images/mapa-puntos.svg.
 */

export type Kpi = { valor: string; etiqueta: string; industria: string; href: string };

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function InicioPresencia({ kpis }: { kpis: Kpi[] }) {
  const { submitForm, loading, errors, validateField } = useContactForm();
  const [datos, setDatos] = useState({ name: "", email: "", country: "", website: "" });
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const paises = presencia.paises.map((p) => p.pais);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const fallo = validateField("name", datos.name) || validateField("email", datos.email);
    if (fallo) return setError(fallo);
    if (!datos.country) return setError("Selecciona tu país");
    if (!acepta) return setError("Acepta el aviso de privacidad para continuar");
    setError(null);
    const envio: ContactFormData = {
      name: datos.name,
      email: datos.email,
      country: datos.country,
      form_type: "main",
      website: datos.website,
      custom_fields: {
        subject: "servicios",
        coursesOfInterest: "",
        servicesOfInterest: "",
        message: "[Portada, resultados] Quiere saber más sobre el monitoreo de condición",
        isProvider: "false",
        prefered_contact: "email",
      },
    };
    if (await submitForm(sanitizeContactFormData(envio))) setListo(true);
  };

  const general = error ?? (errors.general ? errors.general[0] : null) ?? (Object.values(errors)[0]?.[0] ?? null);
  const campo =
    "w-full rounded-sm border border-white/20 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-secondary";

  return (
    <section
      className="relative w-full overflow-hidden py-14 text-white lg:py-20"
      style={{ background: "linear-gradient(135deg, #001526 0%, #002e46 45%, #0a4a78 80%, #1a6fb0 100%)" }}
    >
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Titular y formulario */}
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Presencia</span>
            <h2 className="text-3xl font-extrabold leading-tight lg:text-4xl">
              Más de 20 años midiendo equipos en <span className="text-secondary">{presencia.paises.length} países</span>
            </h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-white/80">
              Plantas de energía, alimentos, manufactura, hidrocarburos y tratamiento de agua confían en DIAPSA para saber cómo están sus equipos antes de que fallen.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {paises.map((p) => (
                <li key={p} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/20">
                  {p}
                </li>
              ))}
            </ul>

            {listo ? (
              <p className="mt-7 rounded-sm bg-emerald-500/15 p-4 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                Listo, {datos.name.split(" ")[0]}. Un especialista de DIAPSA te escribe a {datos.email} para platicar de tu planta.
              </p>
            ) : (
              <form onSubmit={enviar} noValidate className="mt-7">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input className={campo} placeholder="Nombre*" value={datos.name} onChange={(e) => setDatos({ ...datos, name: e.target.value })} autoComplete="name" />
                  <input className={campo} type="email" placeholder="Correo de trabajo*" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} autoComplete="email" />
                  <select className={campo} value={datos.country} onChange={(e) => setDatos({ ...datos, country: e.target.value })} aria-label="País">
                    <option value="">Tu país*</option>
                    {paises.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                    <option>Otro</option>
                  </select>
                  <input type="text" name="website" value={datos.website} onChange={(e) => setDatos({ ...datos, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                </div>
                <label className="mt-3 flex items-start gap-2 text-xs text-white/75">
                  <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#fc9f01]" />
                  <span>
                    He leído y acepto el{" "}
                    <Link href="/aviso-privacidad" className="text-secondary underline">
                      aviso de privacidad
                    </Link>
                    . Un especialista de DIAPSA te contactará para compartir información de nuestros servicios.
                  </span>
                </label>
                {general && <p className="mt-2 text-sm font-semibold text-red-300">{general}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3 font-bold text-primary transition-colors hover:bg-white disabled:opacity-60"
                >
                  {loading ? "Enviando…" : "Quiero saber más"} <Flecha />
                </button>
              </form>
            )}
          </div>

          {/* El mapa de puntos con los países */}
          <div className="relative w-full" aria-label={`Países donde opera DIAPSA: ${paises.join(", ")}`} role="img">
            <div className="relative w-full" style={{ aspectRatio: `${presencia.ancho} / ${presencia.alto}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/mapa-puntos.svg" alt="" className="absolute inset-0 h-full w-full opacity-50" />
              <svg viewBox={`0 0 ${presencia.ancho} ${presencia.alto}`} className="absolute inset-0 h-full w-full overflow-visible">
                <style>{`
                  @keyframes pulso-pais { 0% { r: 8; opacity: .7 } 100% { r: 30; opacity: 0 } }
                  .pulso-pais { animation: pulso-pais 2.4s ease-out infinite; }
                  @media (prefers-reduced-motion: reduce) { .pulso-pais { animation: none; opacity: 0; } }
                `}</style>
                {presencia.paises.map((p, i) => (
                  <g key={p.pais}>
                    <circle cx={p.x} cy={p.y} r="8" fill="#00e5ff" className="pulso-pais" style={{ animationDelay: `${i * 0.35}s` }} />
                    <line x1={p.x} y1={p.y} x2={p.x} y2={p.y - 34} stroke="#00e5ff" strokeWidth="2.5" />
                    <circle cx={p.x} cy={p.y - 38} r="7" fill="#00e5ff" />
                    <circle cx={p.x} cy={p.y} r="5" fill="#fc9f01" />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Cifras de casos documentados */}
        {kpis.length > 0 && (
          <div className="mt-12">
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((k) => (
                <li key={k.valor + k.etiqueta}>
                  <Link
                    href={k.href}
                    className="group flex h-full flex-col items-center justify-center rounded-2xl bg-white px-5 py-8 text-center shadow-xl transition-transform hover:-translate-y-1"
                  >
                    <span className={`whitespace-nowrap font-black leading-none text-[#1a6fb0] ${k.valor.length > 6 ? "text-3xl lg:text-4xl" : "text-4xl lg:text-5xl"}`}>{k.valor}</span>
                    <span className="mt-3 font-semibold leading-snug text-primary">{k.etiqueta}</span>
                    <span className="mt-2 text-xs uppercase tracking-wider text-tertiary group-hover:text-secondary">{k.industria}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center text-xs text-white/60">Resultados medidos en casos documentados con nuestros clientes. Toca una cifra para ver el caso.</p>
          </div>
        )}
      </div>
    </section>
  );
}
