/**
 * ContactForm Component
 * Formulario de contacto principal con selección de cursos y servicios
 */

"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { CAMPO_POR_MOTIVO, MENSAJE_POR_MOTIVO, MOTIVOS, OPCIONES_POR_MOTIVO, interesDeRuta, type Motivo } from "@/lib/contacto-opciones";
import { SITE_CONFIG } from "@/lib/constants";
import Button from "@/components/atoms/Button";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import SuccessMessage from "@/components/atoms/SuccessMessage";
import RateLimitNotice, { RateLimitBanner } from "@/components/molecules/RateLimitNotice";
import { FormErrors } from "@/components/atoms/FormFieldError";
import type { ContactFormData, ContactFormMain } from "@/types/contact";

// País por defecto. Se dejó de preguntar en el formulario (2026-08-24) porque
// prácticamente todo el tráfico es de México y cada campo extra cuesta leads.
const PAIS_POR_DEFECTO = "México";

// Página de detección de gas: el asunto ya se sabe y se pregunta, en su
// lugar, el área de quien escribe y si ya tiene un PPCIEM. Así cada contacto
// llega clasificado (compras, HSE, compliance) sin un paso extra.
const AREAS = ["Compras", "HSE / Seguridad y medio ambiente", "Compliance / Cumplimiento regulatorio", "Operación o mantenimiento", "Otra"];
const PPCIEM = ["Sí, ya tenemos PPCIEM", "Lo estamos armando", "No tenemos", "No aplica: no somos del sector hidrocarburos"];
const SERVICIO_GAS = "Detección de Gas";
const WHATSAPP = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent("Hola, vengo del sitio de DIAPSA y quiero información.")}`;

type Paso = "motivo" | "grupo" | "opcion" | "datos";

/** Una línea bajo cada área del recorrido, para que se entienda qué hay dentro. */
const TEXTO_GRUPO: Record<string, string> = {
  "Monitoreo en ruta": "Un especialista mide tus equipos en visitas periódicas.",
  "Monitoreo en línea": "Sensores y cámaras que vigilan tus equipos las 24 horas.",
  Programas: "Diagnóstico, arranque de un programa, plataforma, gas y ductos.",
  "Vibraciones mecánicas": "Formación, taller práctico y certificación.",
  "Termografía infrarroja": "Formación, taller práctico, certificación y fotovoltaica.",
  "Ultrasonido pasivo": "Formación, taller práctico y certificación.",
  "Confiabilidad y gestión": "Diplomado, programas de monitoreo y cursos ejecutivos.",
  "Clínicas técnicas": "Un tema puntual en línea, en vivo y a bajo costo.",
};
/** La opción sin el prefijo de su área ("Vibraciones · Taller práctico" → "Taller práctico"). */
const sinPrefijo = (o: string) => o.replace(/^[^·]+·\s*/, "");

type Props = {
  /** Variante de la página de detección de gas. */
  gas?: boolean;
  /** En la página de un curso: el asunto y el curso ya van marcados. */
  curso?: string;
};

function estadoInicial(gas: boolean, curso?: string): ContactFormMain {
  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    country: PAIS_POR_DEFECTO,
    form_type: "main",
    custom_fields: {
      subject: gas ? "servicios" : curso !== undefined ? "cursos" : "",
      coursesOfInterest: curso ? [curso] : [],
      servicesOfInterest: gas ? [SERVICIO_GAS] : [],
      message: "",
      isProvider: "false",
      prefered_contact: "email",
    },
  };
}

export default function ContactForm({ gas = false, curso }: Props) {
  const {
    submitForm,
    loading,
    success,
    errors: apiErrors,
    rateLimitExceeded,
    retryAfter,
    resetForm,
    validateField,
  } = useContactForm();


  const [formData, setFormData] = useState<ContactFormMain>(() => estadoInicial(gas, curso));
  const [perfil, setPerfil] = useState({ area: "", ppciem: "" });

  // Fichas del motivo elegido (Emiliano, 2026-10-06): en lugar de listas de
  // casillas, opciones del motivo que se marcan con un toque. Las listas
  // salen de lib/contacto-opciones.ts; en la página de un curso, ese curso va
  // marcado aunque no esté en el menú.
  // El curso de la página se marca con su ficha del menú si la hay ("Diplomado
  // en Confiabilidad" para el nombre largo del diplomado); si no, con su nombre.
  const fichaDelCurso = curso
    ? OPCIONES_POR_MOTIVO.cursos.flatMap((g) => g.opciones).find((o) => curso.toLowerCase().startsWith(o.toLowerCase()) || o.toLowerCase().endsWith(curso.toLowerCase())) ?? curso
    : undefined;
  const [intereses, setIntereses] = useState<string[]>(fichaDelCurso ? [fichaDelCurso] : gas ? [SERVICIO_GAS] : []);
  const motivo = (formData.custom_fields?.subject || "") as Motivo | "";

  // Recorrido guiado (Emiliano, 2026-10-09: "que sea guiado, si selecciono un
  // servicio que me vaya encaminando"): qué necesita, el área, la opción
  // concreta y al final sus datos. Si la página ya sabe el tema, empieza en
  // los datos con el tema marcado; si sabe el motivo, empieza en el área.
  const pasoInicial = (): Paso => (gas || fichaDelCurso ? "datos" : curso !== undefined ? "grupo" : "motivo");
  const [paso, setPaso] = useState<Paso>(pasoInicial);
  const [grupoSel, setGrupoSel] = useState<string | null>(null);
  const grupos = motivo ? OPCIONES_POR_MOTIVO[motivo] : [];
  const grupoActual = grupos.find((g) => g.titulo === grupoSel) ?? (grupos.length === 1 ? grupos[0] : undefined);
  const quitarInteres = (o: string) => setIntereses((prev) => prev.filter((x) => x !== o));
  const elegirMotivo = (valor: Motivo) => {
    setIntereses([]);
    setGrupoSel(null);
    setFormData((prev) => ({
      ...prev,
      custom_fields: { ...prev.custom_fields, subject: valor, coursesOfInterest: [], servicesOfInterest: [] } as ContactFormMain["custom_fields"],
    }));
    const n = OPCIONES_POR_MOTIVO[valor].length;
    setPaso(n === 0 ? "datos" : n === 1 ? "opcion" : "grupo");
  };
  const elegirGrupo = (titulo: string) => {
    setGrupoSel(titulo);
    setPaso("opcion");
  };
  const elegirOpcion = (o: string) => {
    setIntereses([o]);
    setPaso("datos");
  };
  const sinSaber = () => {
    setIntereses([]);
    setPaso("datos");
  };
  const atras = () => {
    if (paso === "datos") setPaso(grupos.length === 0 ? "motivo" : intereses.length ? "opcion" : grupos.length === 1 ? "motivo" : "grupo");
    else if (paso === "opcion") setPaso(grupos.length > 1 ? "grupo" : "motivo");
    else setPaso("motivo");
  };

  // En la página de un servicio o de productos, el motivo y el interés ya
  // van puestos; si la página no dice nada, el visitante elige.
  useEffect(() => {
    if (gas || curso !== undefined) return;
    const deducido = interesDeRuta(window.location.pathname);
    if (!deducido) return;
    setFormData((prev) => ({ ...prev, custom_fields: { ...prev.custom_fields, subject: deducido.motivo } as ContactFormMain["custom_fields"] }));
    setIntereses(deducido.interes ? [deducido.interes] : []);
    setPaso(deducido.interes ? "datos" : "grupo");
  }, [gas, curso]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Campos principales
    if (["name", "email", "phone", "company", "country"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Campos custom
    else {
      setFormData((prev) => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [name]: value,
        } as ContactFormMain['custom_fields'],
      }));

      // Limpiar cursos/servicios cuando cambia asunto
      if (name === "subject") {
        setIntereses([]);
        setFormData((prev) => ({
          ...prev,
          custom_fields: {
            ...prev.custom_fields,
            coursesOfInterest: [],
            servicesOfInterest: [],
          } as ContactFormMain['custom_fields'],
        }));
      }
    }

    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle blur - validate field
  const handleBlur = (field: string, value: string) => {

    const error = validateField(field, value);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};

    const nameError = validateField("name", formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    if (formData.phone) {
      const phoneError = validateField("phone", formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (!aceptaPrivacidad) {
      newErrors.aceptaPrivacidad = "Debes aceptar el aviso de privacidad";
    }
    if (gas && !perfil.area) newErrors.area = "Elige tu área";
    if (gas && !perfil.ppciem) newErrors.ppciem = "Dinos si ya tienen un PPCIEM";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    // Preparar datos para envío: las fichas marcadas van al campo del motivo
    const campo = motivo ? CAMPO_POR_MOTIVO[motivo] : "";
    const dataToSubmit: ContactFormData = {
      ...formData,
      custom_fields: {
        ...formData.custom_fields,
        coursesOfInterest: campo === "coursesOfInterest" ? intereses.join(", ") : " ",
        servicesOfInterest: campo === "servicesOfInterest" ? intereses.join(", ") : " ",
        ...(campo === "productsOfInterest" ? { productsOfInterest: intereses.join(", ") } : {}),
        isProvider: motivo === "proveedor" ? "true" : "false",
        // Gas: el perfil va en su propio campo y al inicio del mensaje, para
        // que se vea aunque el panel solo muestre el mensaje.
        ...(gas
          ? {
              area: perfil.area,
              ppciem: perfil.ppciem,
              message: `[Área: ${perfil.area} · PPCIEM: ${perfil.ppciem}] ${formData.custom_fields?.message ?? ""}`.trim(),
            }
          : {}),
      }
    };

    // Sanitizar y enviar
    const sanitizedData = sanitizeContactFormData(dataToSubmit);

    const result = await submitForm(sanitizedData);

    if (result) {
      // Success - reset form
      setFormData(estadoInicial(gas, curso));
      setIntereses(fichaDelCurso ? [fichaDelCurso] : gas ? [SERVICIO_GAS] : []);
      setPerfil({ area: "", ppciem: "" });
      setGrupoSel(null);
      setPaso(pasoInicial());
      setAceptaPrivacidad(false);
      setFieldErrors({});
      formRef.current?.reset();
    }
  };

  // Get error message for field
  const getFieldError = (field: string): string | undefined => {
    if (fieldErrors[field]) return fieldErrors[field];
    if (apiErrors[field]) return apiErrors[field][0];
    return undefined;
  };


  // General errors from API
  const generalErrors = apiErrors.general || [];

  return (
    <section className="w-full bg-black text-white py-16 lg:py-24 relative">
      {/* Overlay para mensajes de éxito o rate limit */}
      {(success || (rateLimitExceeded && retryAfter)) && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-3xl">
            {success && (
              <SuccessMessage
                message="¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos pronto."
                icon
                onDismiss={resetForm}
                className="p-8! text-xl! md:text-xl! [&>div]:gap-5 [&_svg]:w-10! [&_svg]:h-10! [&_p]:text-xl! md:[&_p]:text-xl! "
              />
            )}
            {rateLimitExceeded && retryAfter && (
              <RateLimitNotice retryAfter={retryAfter} onRetryReady={resetForm} />
            )}
          </div>
        </div>
      )}

      <div className="lg:max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 items-center">
        {/* COLUMNA IZQUIERDA */}
        <div className="w-full lg:w-auto">
          <h2 className="text-3xl text-center lg:text-end md:text-4xl lg:text-5xl font-extrabold leading-tight">
            SOLICITA <br />
            ASESORÍA O <br />
            INFORMACIÓN <br />
            SIN COSTO
          </h2>

          <div className="w-24 h-1 bg-secondary mx-auto lg:ml-auto lg:mr-0 my-6" />

          <p className="text-lg md:text-xl font-light text-center lg:text-end">
            Un especialista te responde
            <br />
            en un día hábil.
          </p>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xs border-2 border-[#25D366] px-5 py-2.5 font-bold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-black lg:float-right">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            O escríbenos por WhatsApp
          </a>
        </div>

        {/* COLUMNA DERECHA - FORM */}
        <div className="w-full lg:flex-1 max-w-2xl">
          <form ref={formRef} onSubmit={handleSubmit} className="w-full space-y-4" noValidate>
            {/* General errors */}
            {generalErrors.length > 0 && <FormErrors errors={generalErrors} />}

            {/* Rate limit banner */}
            {retryAfter && retryAfter > 0 && (
              <RateLimitBanner attemptsRemaining={0} maxAttempts={5} />
            )}

            {/* Recorrido guiado: en qué vamos y cómo regresar */}
            {!gas && (
              <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest text-white/50">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {[
                    ["motivo", "Qué necesitas"],
                    ...(grupos.length > 1 ? [["grupo", "Área"]] : []),
                    ...(grupos.length > 0 ? [["opcion", "Opción"]] : []),
                    ["datos", "Tus datos"],
                  ].map(([clave, nombre], n, todos) => {
                    const actual = todos.findIndex(([c]) => c === paso);
                    return (
                      <li key={clave} className={`flex items-center gap-2 ${n === actual ? "text-secondary" : n < actual ? "text-white/80" : ""}`}>
                        <span>{n + 1}. {nombre}</span>
                        {n < todos.length - 1 && <span aria-hidden="true">›</span>}
                      </li>
                    );
                  })}
                </ol>
                {paso !== "motivo" && (
                  <button type="button" onClick={atras} className="shrink-0 normal-case tracking-normal text-sm font-semibold text-white/80 hover:text-secondary">
                    ← Atrás
                  </button>
                )}
              </div>
            )}

            {/* 1. Qué necesita */}
            {!gas && paso === "motivo" && (
              <div>
                <p className="text-xl font-extrabold text-white">¿Qué necesitas?</p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {MOTIVOS.map((m) => (
                    <button
                      key={m.valor}
                      type="button"
                      onClick={() => elegirMotivo(m.valor)}
                      className="rounded-lg border border-white/20 bg-white/[0.04] px-4 py-3.5 text-left font-semibold text-white transition-colors hover:border-secondary hover:bg-white/[0.08]"
                    >
                      {m.texto} <span className="text-secondary" aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. El área */}
            {!gas && paso === "grupo" && (
              <div>
                <p className="text-xl font-extrabold text-white">{motivo === "cursos" ? "¿Qué quieres aprender?" : "¿Qué tipo de servicio buscas?"}</p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {grupos.map((g) => (
                    <button
                      key={g.titulo}
                      type="button"
                      onClick={() => elegirGrupo(g.titulo)}
                      className="rounded-lg border border-white/20 bg-white/[0.04] px-4 py-3.5 text-left transition-colors hover:border-secondary hover:bg-white/[0.08]"
                    >
                      <span className="block font-bold text-white">{g.titulo} <span className="text-secondary" aria-hidden="true">→</span></span>
                      {TEXTO_GRUPO[g.titulo] && <span className="mt-0.5 block text-sm text-white/60">{TEXTO_GRUPO[g.titulo]}</span>}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={sinSaber} className="mt-4 text-sm font-semibold text-white/70 underline underline-offset-4 hover:text-secondary">
                  No estoy seguro, quiero que me orienten
                </button>
              </div>
            )}

            {/* 3. La opción concreta */}
            {!gas && paso === "opcion" && grupoActual && (
              <div>
                <p className="text-xl font-extrabold text-white">{grupoActual.titulo}</p>
                <p className="mt-1 text-sm text-white/60">Elige la opción que más se acerca a lo que buscas.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {grupoActual.opciones.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => elegirOpcion(o)}
                      className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-secondary hover:bg-secondary hover:text-black"
                    >
                      {sinPrefijo(o)}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={sinSaber} className="mt-4 text-sm font-semibold text-white/70 underline underline-offset-4 hover:text-secondary">
                  No estoy seguro, quiero que me orienten
                </button>
              </div>
            )}

            {/* 4. Sus datos */}
            {(gas || paso === "datos") && (
              <>
                {!gas && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-white/70">{intereses.length ? "Sobre:" : "Motivo:"}</span>
                    {intereses.length
                      ? intereses.map((o) => (
                          <span key={o} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-semibold text-black">
                            {o}
                            <button type="button" onClick={() => quitarInteres(o)} aria-label={`Quitar ${o}`} className="leading-none opacity-60 hover:opacity-100">×</button>
                          </span>
                        ))
                      : <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white">{MOTIVOS.find((m) => m.valor === motivo)?.corto ?? "Por definir"}</span>}
                    <button type="button" onClick={() => setPaso("motivo")} className="font-semibold text-secondary hover:underline">Cambiar</button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur("name", e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Tu nombre"
                    />
                    {getFieldError("name") && (
                      <p className="text-sm text-red-500 mt-1">{getFieldError("name")}</p>
                    )}
                  </div>

                  {/* Empresa */}
                  <div>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Empresa (opcional)"
                    />
                  </div>

                  {/* Correo */}
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur("email", e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="correo@ejemplo.com"
                    />
                    {getFieldError("email") && (
                      <p className="text-sm text-red-500 mt-1">{getFieldError("email")}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur("phone", e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="WhatsApp o teléfono (opcional)"
                    />
                    {getFieldError("phone") && (
                      <p className="text-sm text-red-500 mt-1">{getFieldError("phone")}</p>
                    )}
                  </div>
                </div>

                {gas && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <select
                      id="area"
                      name="area"
                      value={perfil.area}
                      onChange={(e) => setPerfil((p) => ({ ...p, area: e.target.value }))}
                      required
                      disabled={loading}
                      aria-label="Tu área"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white text-gray-900"
                    >
                      <option value="">Tu área</option>
                      {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <select
                      id="ppciem"
                      name="ppciem"
                      value={perfil.ppciem}
                      onChange={(e) => setPerfil((p) => ({ ...p, ppciem: e.target.value }))}
                      required
                      disabled={loading}
                      aria-label="¿Ya tienen un PPCIEM?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white text-gray-900"
                    >
                      <option value="">¿Ya tienen un PPCIEM?</option>
                      {PPCIEM.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {(fieldErrors.area || fieldErrors.ppciem) && (
                      <p className="text-sm text-red-600 sm:col-span-2">{fieldErrors.area || fieldErrors.ppciem}</p>
                    )}
                  </div>
                )}

                {/* Comentarios */}
                <div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.custom_fields?.message}
                    onChange={handleChange}
                    rows={3}
                    disabled={loading}
                    className="w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                    placeholder={MENSAJE_POR_MOTIVO[motivo]}
                  />
                </div>

              </>
            )}

            {/* Honeypot field */}
            <input
              type="text"
              name="website"
              value=""
              onChange={() => { }}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {(gas || paso === "datos") && (
              <>
                {/* Privacidad en un renglón */}
                <label htmlFor="aceptaPrivacidad" className="flex items-center gap-2.5 text-sm text-white/80">
                  <input
                    type="checkbox"
                    id="aceptaPrivacidad"
                    name="aceptaPrivacidad"
                    checked={aceptaPrivacidad}
                    onChange={(e) => {
                      setAceptaPrivacidad(e.target.checked);
                      if (fieldErrors.aceptaPrivacidad) {
                        setFieldErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.aceptaPrivacidad;
                          return newErrors;
                        });
                      }
                    }}
                    required
                    disabled={loading}
                    className="h-4 w-4 shrink-0 rounded border-gray-300 text-secondary focus:ring-2 focus:ring-secondary"
                  />
                  <span>
                    Acepto el{" "}
                    <a href="/aviso-privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary hover:underline">
                      Aviso de Privacidad
                    </a>
                  </span>
                </label>
                {fieldErrors.aceptaPrivacidad && (
                  <p className="text-sm text-red-500 mt-1">{fieldErrors.aceptaPrivacidad}</p>
                )}

                <Button
                  type="submit"
                  variant="secondary"
                  disabled={loading}
                  className="w-full py-4 text-lg"
                >
                  {loading ? "ENVIANDO..." : "ENVIAR"}
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
