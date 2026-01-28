"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";


interface FormData {
  nombre: string;
  empresa: string;
  telefono: string;
  correo: string;
  asunto: string;
  cursos: string[];
  servicios: string[];
  region: string;
  esProveedor: boolean;
  comentarios: string;
  aceptaPrivacidad: boolean;
}

const SERVICES = [
  "Termografia Infrarroja",
  "Vibraciones Mecanicas",
  "Diagnostico de Maquinaria",
  "Analisis de Ultrasonido",
  "Estudios Electricos"
]

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
    cursos: [],
    servicios: [],
    region: "",
    esProveedor: false,
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
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "asunto" && value !== "Información de cursos") {
        setFormData((prev) => ({ ...prev, cursos: [] }));
      }
    }
  };

  const handleCursoChange = (curso: string) => {
    setFormData((prev) => {
      const cursos = prev.cursos.includes(curso)
        ? prev.cursos.filter((c) => c !== curso)
        : [...prev.cursos, curso];
      return { ...prev, cursos };
    });
  };
  const handleServicioChange = (servicio: string) => {
    setFormData((prev) => {
      const servicios = prev.servicios.includes(servicio)
        ? prev.servicios.filter((c) => c !== servicio)
        : [...prev.servicios, servicio];
      return { ...prev, servicios };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Formulario enviado:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("¡Gracias por contactarnos!");

    setFormData({
      nombre: "",
      empresa: "",
      telefono: "",
      correo: "",
      asunto: "",
      cursos: [],
      servicios: [],
      region: "",
      esProveedor: false,
      comentarios: "",
      aceptaPrivacidad: false,
    });

    setIsSubmitting(false);
  };

  const mostrarCursos = formData.asunto === "Información de cursos";
  const mostrarServicios = formData.asunto === "Información de servicios";

  return (
    <section className="w-full bg-black text-white py-12 md:py-20">
      <div className="lg:max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 items-center">

        {/* COLUMNA IZQUIERDA */}
        <div className="w-full lg:w-auto">
          <h2 className="text-3xl text-center lg:text-end md:text-4xl lg:text-5xl font-extrabold leading-tight">
            SOLICITA YA
            <br />
            UNA ASESORÍA
            <br />
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
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>

              {/* Empresa */}
              <div>

                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  required
                  className="w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Nombre de tu empresa"
                />
              </div>

              {/* Correo */}
              <div>

                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              {/* Teléfono */}
              <div>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="(000) 000-0000"
                />
              </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asunto */}
              <div>
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
              <div>
                <input
                  id="region"
                  type="text"
                  name="region"
                  placeholder="PAÍS / REGIÓN"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Sección de cursos (solo visible si asunto es "Información de cursos") */}
            {mostrarCursos && (
              <div className="p-4 bg-gray-50 border border-gray-700 rounded-lg">
                <label className="block text-sm font-semibold mb-3 text-gray-900">
                  Selecciona los cursos de tu interés:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CURSOS.map((curso) => (
                    <label
                      key={curso}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.cursos.includes(curso)}
                        onChange={() => handleCursoChange(curso)}
                        className="mt-1 w-4 h-4 text-secondary bg-white border-gray-300 rounded focus:ring-2 focus:ring-secondary"
                      />
                      <span className="text-sm text-gray-900 group-hover:font-bold transition-colors">
                        {curso}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {mostrarServicios && (
              <div className="p-4 bg-gray-50 border border-gray-700 rounded-lg">
                <label className="block text-sm font-semibold mb-3 text-gray-900">
                  Selecciona los cursos de tu interés:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((servicio) => (
                    <label
                      key={servicio}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.servicios.includes(servicio)}
                        onChange={() => handleServicioChange(servicio)}
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

            <div className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                id="esProveedor"
                name="esProveedor"
                checked={formData.esProveedor}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-secondary bg-white border-gray-300 rounded focus:ring-2 focus:ring-secondary"
              />
              <label htmlFor="esProveedor" className="text-gray-300">
                Brindo servicios especializados a la industria como proveedor,
                asesor o coach
              </label>
            </div>

            {/* Comentarios */}
            <div>

              <textarea
                id="comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                rows={3}
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

            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              className="w-full py-4 text-lg"
            >
              {isSubmitting ? "ENVIANDO..." : "ENVIAR"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
