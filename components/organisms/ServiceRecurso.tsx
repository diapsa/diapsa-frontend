"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api/contacts";
import type { ServiceRecurso as Recurso } from "@/types/servicio";

/**
 * ServiceRecurso
 * Descarga de material técnico a cambio de datos de contacto.
 *
 * Por qué existe: la mayoría de quien llega desde Google no está listo para
 * cotizar, pero sí para llevarse algo útil. Un reporte de ejemplo deja ver el
 * entregable real, que es lo primero que un ingeniero de mantenimiento quiere
 * juzgar, y convierte una visita anónima en un contacto con nombre.
 *
 * Sólo tres campos: cada campo de más cuesta descargas. La empresa se pide
 * porque es lo que permite calificar el prospecto.
 *
 * Si el envío falla, el archivo se entrega de todos modos. Perder el lead es
 * malo; dejar al visitante sin lo que se le prometió es peor.
 */

type Props = {
  recurso: Recurso;
  /** Servicio del que proviene la descarga, para identificar el origen del lead. */
  servicio: string;
};

type Estado = "formulario" | "enviando" | "listo";

export default function ServiceRecurso({ recurso, servicio }: Props) {
  const [estado, setEstado] = useState<Estado>("formulario");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [empresa, setEmpresa] = useState("");

  async function alEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEstado("enviando");
    try {
      await submitContact({
        name: nombre,
        email: correo,
        company: empresa,
        form_type: "general",
        custom_fields: {
          origen: "descarga de material",
          recurso: recurso.archivo,
          servicio,
        },
      });
    } catch (error) {
      console.error("[recurso] No se pudo registrar la descarga:", error);
    }
    setEstado("listo");
  }

  return (
    <section className="w-full bg-primary py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">
              Material descargable
            </p>
            <h2 className="mt-2 text-3xl lg:text-4xl font-extrabold leading-tight">
              {recurso.titulo}
            </h2>
            <p className="mt-4 text-white/80 text-lg leading-relaxed text-justify">
              {recurso.descripcion}
            </p>
            {recurso.incluye && recurso.incluye.length > 0 && (
              <ul className="mt-6 space-y-3">
                {recurso.incluye.map((punto) => (
                  <li key={punto} className="flex items-start gap-3 text-white/90">
                    <svg
                      className="mt-1 h-5 w-5 shrink-0 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="leading-relaxed">{punto}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-sm bg-white p-6 lg:p-8 shadow-xl">
            {estado === "listo" ? (
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-4 text-xl font-extrabold text-primary">Tu material está listo</p>
                <p className="mt-2 text-tertiary leading-relaxed">
                  Si la descarga no comienza sola, usa el botón.
                </p>
                <a
                  href={recurso.archivo}
                  download
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xs bg-primary px-6 py-3.5 font-bold text-white transition-all duration-300 hover:bg-secondary hover:text-primary"
                >
                  Descargar ahora
                </a>
              </div>
            ) : (
              <form onSubmit={alEnviar}>
                <p className="text-xl font-extrabold text-primary">Descárgalo gratis</p>
                <p className="mt-1 text-sm text-tertiary">
                  Tres datos y te lo entregamos al instante.
                </p>
                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="recurso-nombre" className="block text-sm font-semibold text-primary">
                      Nombre
                    </label>
                    <input
                      id="recurso-nombre"
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="mt-1 w-full rounded-xs border border-gray-300 px-4 py-2.5 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="recurso-correo" className="block text-sm font-semibold text-primary">
                      Correo
                    </label>
                    <input
                      id="recurso-correo"
                      type="email"
                      required
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      className="mt-1 w-full rounded-xs border border-gray-300 px-4 py-2.5 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="recurso-empresa" className="block text-sm font-semibold text-primary">
                      Empresa
                    </label>
                    <input
                      id="recurso-empresa"
                      type="text"
                      required
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      className="mt-1 w-full rounded-xs border border-gray-300 px-4 py-2.5 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="mt-6 w-full rounded-xs bg-secondary px-6 py-3.5 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-60"
                >
                  {estado === "enviando" ? "Preparando tu descarga" : "Quiero el material"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
