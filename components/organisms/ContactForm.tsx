/**
 * ContactForm Component
 * Formulario de contacto principal con selección de cursos y servicios
 */

"use client";

import { useState, useRef, FormEvent } from "react";
import Button from "@/components/atoms/Button";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { useCourses } from "@/lib/hooks/useCourses";
import { sanitizeContactFormData } from "@/lib/utils/sanitizeFormData";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import SuccessMessage from "@/components/atoms/SuccessMessage";
import RateLimitNotice, { RateLimitBanner } from "@/components/molecules/RateLimitNotice";
import { FormErrors } from "@/components/atoms/FormFieldError";
import type { ContactFormData, ContactFormMain } from "@/types/contact";
import serviciosData from "@/data/servicios.json";

// Extraer solo servicios principales
const SERVICES = serviciosData.map(servicio => servicio.label);

// País por defecto. Se dejó de preguntar en el formulario (2026-08-24) porque
// prácticamente todo el tráfico es de México y cada campo extra cuesta leads.
const PAIS_POR_DEFECTO = "México";

export default function ContactForm() {
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


  const { courses, loading: loadingCourses } = useCourses();

  const [formData, setFormData] = useState<ContactFormMain>({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: PAIS_POR_DEFECTO,
    form_type: "main",
    custom_fields: {
      subject: "",
      coursesOfInterest: [],
      servicesOfInterest: [],
      message: "",
      isProvider: "false",
      prefered_contact: "email",
    },
  });

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

  // Handle checkbox arrays (cursos/servicios)
  const handleCheckboxArrayChange = (field: "coursesOfInterest" | "servicesOfInterest", value: string) => {
    setFormData((prev) => {
      const currentArray = prev.custom_fields?.[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [field]: newArray,
        } as ContactFormMain['custom_fields'],
      };
    });
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

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    // Preparar datos para envío - convertir arrays a strings
    const dataToSubmit: ContactFormData = {
      ...formData,
      custom_fields: {
        ...formData.custom_fields,
        coursesOfInterest: formData.custom_fields?.coursesOfInterest.join(", ") ?? " ",
        servicesOfInterest: formData.custom_fields?.servicesOfInterest.join(", ") ?? " ",
      }
    };

    // Sanitizar y enviar
    const sanitizedData = sanitizeContactFormData(dataToSubmit);

    const result = await submitForm(sanitizedData);

    if (result) {
      // Success - reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        country: PAIS_POR_DEFECTO,
        form_type: "main",
        custom_fields: {
          subject: "",
          coursesOfInterest: [],
          servicesOfInterest: [],
          message: "",
          isProvider: "false",
          prefered_contact: "email",
        },
      });
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

  const mostrarCursos = formData.custom_fields?.subject === "cursos" || formData.custom_fields?.subject === 'cursos/servicios';
  const mostrarServicios = formData.custom_fields?.subject === "servicios" || formData.custom_fields?.subject === 'cursos/servicios';

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
            ASESORÍA Ó <br />
            INFORMACIÓN <br />
            SIN COSTO
          </h2>

          <div className="w-24 h-1 bg-secondary mx-auto lg:ml-auto lg:mr-0 my-6" />

          <p className="text-lg md:text-xl font-light text-center lg:text-end">
            Descubre el camino hacia la
            <br />
            Industria 4.0
          </p>
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

            {/* Datos personales */}
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
                  placeholder="Ingresa tu nombre completo"
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
                  placeholder="Nombre de tu empresa"
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
                  placeholder="(000) 000-0000"
                />
                {getFieldError("phone") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("phone")}</p>
                )}
              </div>
            </div>

            {/* Asunto. El selector de país se retiró del formulario (2026-08-24):
                cada campo extra cuesta conversión y el país se deduce del
                teléfono o se pregunta en el primer contacto. Se sigue enviando
                "México" por defecto para no cambiar el contrato del backend. */}
            <div>
              <select
                id="subject"
                name="subject"
                value={formData.custom_fields?.subject}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white text-gray-900"
              >
                <option value="">¿Qué necesitas?</option>
                <option value="servicios">Un servicio para mi planta</option>
                <option value="cursos">Información de cursos</option>
                <option value="cursos/servicios">Servicios y cursos</option>
              </select>
            </div>

            {/* Sección de cursos */}
            {mostrarCursos && (loadingCourses || courses.length > 0) && (
              <div className="p-4 bg-gray-50 border border-gray-700 rounded-lg">
                <label className="block text-sm font-semibold mb-3 text-gray-900">
                  Selecciona los cursos de tu interés:
                </label>
                {loadingCourses ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="medium" color="primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {courses.map((curso) => (
                      <label
                        key={curso.id}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={formData.custom_fields?.coursesOfInterest.includes(curso.name)}
                          onChange={() => handleCheckboxArrayChange("coursesOfInterest", curso.name)}
                          disabled={loading}
                          className="mt-1 w-4 h-4 text-secondary bg-white border-gray-300 rounded focus:ring-2 focus:ring-secondary"
                        />
                        <span className="text-sm text-gray-900 group-hover:font-bold transition-colors">
                          {curso.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sección de servicios */}
            {mostrarServicios && (
              <div className="p-4 bg-gray-50 border border-gray-700 rounded-lg">
                <label className="block text-sm font-semibold mb-3 text-gray-900">
                  Selecciona los servicios de tu interés:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((servicio) => (
                    <label
                      key={servicio}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.custom_fields?.servicesOfInterest.includes(servicio)}
                        onChange={() => handleCheckboxArrayChange("servicesOfInterest", servicio)}
                        disabled={loading}
                        className="mt-1 w-4 h-4 text-secondary bg-white border-gray-300 rounded focus:ring-2 focus:ring-secondary"
                      />
                      <span className="text-sm text-gray-900 group-hover:font-bold transition-colors">
                        {servicio}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* "Medio de contacto preferido" y la casilla de proveedor se
                retiraron del formulario (2026-08-24). El primero no cambiaba
                nada operativamente (se responde por donde el prospecto dejó
                dato) y el segundo pedía al cliente que se autoclasificara antes
                de conocerlo. Ambos se siguen enviando con su valor por defecto. */}

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
                placeholder="Cuéntanos más sobre tu consulta..."
              />
            </div>

            {/* Checkbox de privacidad */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
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
                className="mt-1 w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary focus:ring-2"
              />
              <label htmlFor="aceptaPrivacidad" className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">Tratamiento de datos personales.</span> He leído y
                acepto el{" "}
                <a
                  href="/aviso-privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary font-semibold hover:underline"
                >
                  Aviso de Privacidad
                </a>{" "}
                de Grupo DIAPSA. <span className="text-red-500">*</span>
              </label>
            </div>
            {fieldErrors.aceptaPrivacidad && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.aceptaPrivacidad}</p>
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

            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
              className="w-full py-4 text-lg"
            >
              {loading ? "ENVIANDO..." : "ENVIAR"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
