"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import presencia from "@/data/presencia-mexico.json";
import type { ContactFormData } from "@/types/contact";

/**
 * InicioPresencia
 * Los resultados y la presencia de DIAPSA en la portada, con la estructura
 * que Emiliano tomó de Fracttal (2026-09-27): titular, texto y un
 * formulario corto a la izquierda, un mapa de puntos con los países donde
 * operamos a la derecha, y abajo tres tarjetas con lo que obtiene el
 * cliente.
 *
 * 2026-09-28: el foco pasa a México (decisión de Emiliano). El mapa es de
 * los estados donde trabajamos (data/presencia-mexico.json, mapa de puntos
 * ilustrativo), con la base en Saltillo; lo internacional queda en una
 * línea. El formulario pide el estado en lugar del país.
 *
 * Las cifras las definió Emiliano (2026-09-28) y van solas: el porcentaje y
 * el texto, los dos en grande, sin fuente ni enlace.
 */

const ESTADOS_MX = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México",
  "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán",
  "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa",
  "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];
const FUERA = "Fuera de México";

const KPIS = [
  { valor: "300%", texto: "de retorno de inversión en el primer año" },
  { valor: "95%", texto: "de confiabilidad operativa" },
  { valor: "30%", texto: "de ahorro en la planificación de refacciones" },
];

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function InicioPresencia() {
  const { submitForm, loading, errors, validateField } = useContactForm();
  const [datos, setDatos] = useState({ name: "", email: "", estado: "", website: "" });
  const [encima, setEncima] = useState<string | null>(null);
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const trabajamos = presencia.estados.filter((e) => e.trabajamos);
  const estadoEncima = presencia.estados.find((e) => e.nombre === encima);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const fallo = validateField("name", datos.name) || validateField("email", datos.email);
    if (fallo) return setError(fallo);
    if (!datos.estado) return setError("Selecciona tu estado");
    if (!acepta) return setError("Acepta el aviso de privacidad para continuar");
    setError(null);
    const envio: ContactFormData = {
      name: datos.name,
      email: datos.email,
      country: datos.estado === FUERA ? "Otro país" : "México",
      form_type: "main",
      website: datos.website,
      custom_fields: {
        subject: "servicios",
        coursesOfInterest: "",
        servicesOfInterest: "",
        message: `[Portada, resultados] Quiere saber más sobre el monitoreo de condición. Estado: ${datos.estado}`,
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
              Más de 20 años midiendo equipos en <span className="text-secondary">{trabajamos.length} estados de México</span>
            </h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-white/80">
              Plantas de energía, alimentos, manufactura, hidrocarburos y tratamiento de agua confían en DIAPSA para saber cómo están sus equipos antes de que fallen. Llegamos a tu planta desde nuestra base en Saltillo.
            </p>

            {listo ? (
              <p className="mt-7 rounded-sm bg-emerald-500/15 p-4 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                Listo, {datos.name.split(" ")[0]}. Un especialista de DIAPSA te escribe a {datos.email} para platicar de tu planta.
              </p>
            ) : (
              <form onSubmit={enviar} noValidate className="mt-7">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input className={campo} placeholder="Nombre*" value={datos.name} onChange={(e) => setDatos({ ...datos, name: e.target.value })} autoComplete="name" />
                  <input className={campo} type="email" placeholder="Correo*" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} autoComplete="email" />
                  <select className={campo} value={datos.estado} onChange={(e) => setDatos({ ...datos, estado: e.target.value })} aria-label="Estado">
                    <option value="">Tu estado*</option>
                    {ESTADOS_MX.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                    <option>{FUERA}</option>
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

          {/* El mapa de México con los estados donde trabajamos */}
          <div className="relative w-full">
            <div
              className="relative w-full"
              style={{ aspectRatio: `${presencia.ancho} / ${presencia.alto}` }}
              role="img"
              aria-label={`Estados de México donde trabaja DIAPSA: ${trabajamos.map((e) => e.nombre).join(", ")}`}
            >
              <svg viewBox={`0 0 ${presencia.ancho} ${presencia.alto}`} className="absolute inset-0 h-full w-full overflow-visible" onMouseLeave={() => setEncima(null)}>
                <style>{`
                  @keyframes pulso-base { 0% { r: 9; opacity: .8 } 100% { r: 34; opacity: 0 } }
                  .pulso-base { animation: pulso-base 2.2s ease-out infinite; }
                  @media (prefers-reduced-motion: reduce) { .pulso-base { animation: none; opacity: 0; } }
                `}</style>
                {presencia.estados.map((e) => {
                  const activo = encima === e.nombre;
                  const color = e.trabajamos ? (activo ? "#ffffff" : "#fc9f01") : activo ? "#6f8fc4" : "#2d4a73";
                  return (
                    <g key={e.nombre} fill={color} onMouseEnter={() => setEncima(e.nombre)} style={{ cursor: "default", transition: "fill .2s" }}>
                      <title>{e.trabajamos ? `${e.nombre}: trabajamos aquí` : e.nombre}</title>
                      {e.puntos.map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r={presencia.radio} />
                      ))}
                    </g>
                  );
                })}
                {/* La base */}
                <circle cx={presencia.base.x} cy={presencia.base.y} r="9" fill="#00e5ff" className="pulso-base" />
                <circle cx={presencia.base.x} cy={presencia.base.y} r="9" fill="#001526" stroke="#00e5ff" strokeWidth="3" />
                <circle cx={presencia.base.x} cy={presencia.base.y} r="3.5" fill="#00e5ff" />
              </svg>
              {/* El estado bajo el cursor */}
              <div className="pointer-events-none absolute right-0 top-0 min-h-[2.5rem] text-right">
                {estadoEncima && (
                  <p className="rounded-sm bg-[#001526]/85 px-3 py-2 text-sm font-bold ring-1 ring-white/15">
                    {estadoEncima.nombre}
                    <span className={`ml-2 text-xs ${estadoEncima.trabajamos ? "text-secondary" : "text-white/50"}`}>
                      {estadoEncima.trabajamos ? "Trabajamos aquí" : "Pregúntanos"}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Estados donde trabajamos
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full ring-2 ring-[#00e5ff]" /> Base en Saltillo, Coahuila
              </span>
            </div>
            <p className="mt-3 text-justify text-xs leading-relaxed text-white/55">
              También atendemos proyectos en {presencia.internacional.slice(0, -1).join(", ")} y {presencia.internacional.at(-1)}.
            </p>
          </div>
        </div>

        {/* Lo que obtiene el cliente */}
        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {KPIS.map((k) => (
            <li key={k.valor} className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-10 text-center shadow-xl">
              <span className="text-6xl font-black leading-none text-[#1a6fb0] lg:text-7xl">{k.valor}</span>
              <span className="mt-4 text-xl font-bold leading-snug text-primary lg:text-2xl">{k.texto}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
