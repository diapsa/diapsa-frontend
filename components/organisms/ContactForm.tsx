"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";

interface FormData {
  nombre: string;
  empresa: string;
  telefono: string;
  correo: string;
  asunto: string;
  curso: string;
  comentarios: string;
  aceptaPrivacidad: boolean;
}

const CURSOS = [
  "Termografía Cat 1",
  "Termografía Cat 2",
  "Vibraciones Mecánicas Cat 1",
  "Vibraciones Mecánicas Cat 2",
  "Ultrasonido Pasivo Cat 1",
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    empresa: "",
    telefono: "",
    correo: "",
    asunto: "",
    curso: "",
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
      
      // Reset curso si cambian de asunto
      if (name === "asunto" && value !== "Información de cursos") {
        setFormData((prev) => ({ ...prev, curso: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Aquí iría la lógica de envío (API call, etc.)
    console.log("Formulario enviado:", formData);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.");
    
    // Reset form
    setFormData({
      nombre: "",
      empresa: "",
      telefono: "",
      correo: "",
      asunto: "",
      curso: "",
      comentarios: "",
      aceptaPrivacidad: false,
    });
    
    setIsSubmitting(false);
  };

  const mostrarCursos = formData.asunto === "Información de cursos";

  return (
    <section id="contacto" className="w-full bg-linear-to-b from-gray-50 to-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            CONTÁCTANOS
          </h2>
          <p className="text-lg text-gray-600">
            ¿Tienes alguna pregunta? Completa el formulario y nos pondremos en
            contacto contigo
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl p-8 lg:p-12 border border-gray-100"
        >
          <div className="space-y-6">
            {/* Nombre */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            {/* Empresa */}
            <div>
              <label
                htmlFor="empresa"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Empresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="Nombre de tu empresa"
              />
            </div>

            {/* Teléfono y Correo en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono */}
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="(000) 000-0000"
                />
              </div>

              {/* Correo */}
              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white text-gray-900"
              >
                <option value="">Selecciona una opción</option>
                <option value="Información de cursos">
                  Información de cursos
                </option>
                <option value="Información de servicios">
                  Información de servicios
                </option>
              </select>
            </div>

            {/* Dropdown condicional de Cursos */}
            {mostrarCursos && (
              <div className="animate-fadeIn">
                <label
                  htmlFor="curso"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Curso de interés <span className="text-red-500">*</span>
                </label>
                <select
                  id="curso"
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  required={mostrarCursos}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white text-gray-900"
                >
                  <option value="">Selecciona un curso</option>
                  {CURSOS.map((curso) => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                placeholder="Cuéntanos más sobre tu consulta..."
              />
            </div>

            {/* Checkbox de privacidad */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="aceptaPrivacidad"
                name="aceptaPrivacidad"
                checked={formData.aceptaPrivacidad}
                onChange={handleChange}
                required
                className="mt-1 w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary focus:ring-2"
              />
              <label
                htmlFor="aceptaPrivacidad"
                className="text-sm text-gray-700 leading-relaxed"
              >
                <span className="font-semibold">
                  Tratamiento de datos personales.
                </span>{" "}
                He leído y acepto el{" "}
                <a
                  href="/aviso-privacidad"
                  target="_blank"
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
                disabled={isSubmitting}
                className="w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
