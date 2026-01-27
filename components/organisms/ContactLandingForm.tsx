"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import cursosData from "@/data/cursos.json";

interface FormData {
  nombre: string;
  empresa: string;
  asunto: string;
  cursosSeleccionados: string[];
  pais: string;
  comentarios: string;
  aceptaPrivacidad: boolean;
}

const ASUNTOS = [
  "Información de cursos",
  "Información de servicios",
  "Cotización",
  "Otro",
];

const PAISES = [
  "México",
  "Argentina",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "Nicaragua",
  "Panamá",
  "Perú",
  "Uruguay",
  "Venezuela",
  "Estados Unidos",
  "Otro",
];

export default function ContactLandingForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    empresa: "",
    asunto: "",
    cursosSeleccionados: [],
    pais: "",
    comentarios: "",
    aceptaPrivacidad: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Reset cursos si cambian de asunto
      if (name === "asunto" && value !== "Información de cursos") {
        setFormData((prev) => ({ ...prev, cursosSeleccionados: [] }));
      }
    }
  };

  const handleCursoToggle = (cursoId: string) => {
    setFormData((prev) => ({
      ...prev,
      cursosSeleccionados: prev.cursosSeleccionados.includes(cursoId)
        ? prev.cursosSeleccionados.filter((id) => id !== cursoId)
        : [...prev.cursosSeleccionados, cursoId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Aquí iría la lógica de envío (API call, etc.)
    console.log("Formulario enviado:", formData);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(
      "¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto."
    );

    // Reset form
    setFormData({
      nombre: "",
      empresa: "",
      asunto: "",
      cursosSeleccionados: [],
      pais: "",
      comentarios: "",
      aceptaPrivacidad: false,
    });

    setIsSubmitting(false);
  };

  const mostrarCursos = formData.asunto === "Información de cursos";

  return (
    <div className="w-full bg-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-gray-200"
        >
          <div className="space-y-6">
            {/* Nombre completo */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="Ej: Juan Pérez García"
              />
            </div>

            {/* Empresa */}
            <div>
              <label
                htmlFor="empresa"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Nombre de la empresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="Ej: Industrias ABC S.A. de C.V."
              />
            </div>

            {/* Asunto y País en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asunto */}
              <div>
                <label
                  htmlFor="asunto"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Asunto <span className="text-red-500">*</span>
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-white text-gray-900"
                >
                  <option value="">Selecciona una opción</option>
                  {ASUNTOS.map((asunto) => (
                    <option key={asunto} value={asunto}>
                      {asunto}
                    </option>
                  ))}
                </select>
              </div>

              {/* País/Región */}
              <div>
                <label
                  htmlFor="pais"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  País / Región <span className="text-red-500">*</span>
                </label>
                <select
                  id="pais"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-white text-gray-900"
                >
                  <option value="">Selecciona tu país</option>
                  {PAISES.map((pais) => (
                    <option key={pais} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selección múltiple de cursos (condicional) */}
            {mostrarCursos && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Cursos de interés <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {cursosData.cursos.map((curso) => (
                    <label
                      key={curso.id}
                      className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.cursosSeleccionados.includes(
                          curso.id
                        )}
                        onChange={() => handleCursoToggle(curso.id)}
                        className="mt-1 w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary focus:ring-2 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-tight">
                        {curso.nombre}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.cursosSeleccionados.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    * Selecciona al menos un curso
                  </p>
                )}
              </div>
            )}

            {/* Comentarios */}
            <div>
              <label
                htmlFor="comentarios"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Comentarios
              </label>
              <textarea
                id="comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                placeholder="Cuéntanos más sobre tu consulta, necesidades específicas o cualquier información adicional que consideres relevante..."
              />
            </div>

            {/* Checkbox de privacidad */}
            <div className="flex items-start gap-3 p-5 bg-amber-50 rounded-lg border border-amber-200">
              <input
                type="checkbox"
                id="aceptaPrivacidad"
                name="aceptaPrivacidad"
                checked={formData.aceptaPrivacidad}
                onChange={handleChange}
                required
                className="mt-1 w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor="aceptaPrivacidad"
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
              >
                <span className="font-semibold text-gray-900">
                  Tratamiento de datos personales.
                </span>{" "}
                He leído y acepto el{" "}
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

            {/* Botón de envío */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={
                  isSubmitting ||
                  (mostrarCursos && formData.cursosSeleccionados.length === 0)
                }
                className="w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar mensaje"
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            También puedes contactarnos directamente al{" "}
            <a
              href="tel:+525512345678"
              className="text-secondary font-semibold hover:underline"
            >
              +52 (55) 1234-5678
            </a>{" "}
            o vía email a{" "}
            <a
              href="mailto:contacto@diapsa.com.mx"
              className="text-secondary font-semibold hover:underline"
            >
              contacto@diapsa.com.mx
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
