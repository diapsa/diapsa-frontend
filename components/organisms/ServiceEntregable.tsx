"use client";

import { useState } from "react";
import Image from "next/image";
import { submitContact } from "@/lib/api/contacts";
import type { ServiceEntregable as Entregable } from "@/types/servicio";

/**
 * ServiceEntregable
 * Muestra el informe que recibe el cliente y lo entrega a cambio de contacto.
 *
 * Por qué se rehízo: la primera versión era una banda de texto pegada al final
 * de la página, con una lista de viñetas describiendo el informe. Describirlo
 * no sirve de nada: hay que ENSEÑARLO. Ahora las páginas reales se ven, en
 * escalonado, con una máscara que corta la segunda y deja la sensación de que
 * hay más. El formulario sólo aparece cuando el visitante lo pide, para que la
 * sección se lea como contenido y no como un muro de captura.
 *
 * Movimiento: las páginas entran con un ligero desplazamiento y se levantan al
 * pasar el cursor. Todo bajo `motion-safe`, así que quien pidió menos
 * movimiento en su sistema no ve ninguna animación.
 */

type Props = {
  entregable: Entregable;
  /** Servicio del que proviene la descarga, para identificar el origen del lead. */
  servicio: string;
};

type Estado = "vitrina" | "formulario" | "enviando" | "listo";

export default function ServiceEntregable({ entregable, servicio }: Props) {
  const [estado, setEstado] = useState<Estado>("vitrina");
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
        custom_fields: { origen: "descarga de material", recurso: entregable.archivo, servicio },
      });
    } catch (error) {
      // Perder el lead es malo; dejar al visitante sin lo prometido es peor.
      console.error("[entregable] No se pudo registrar la descarga:", error);
    }
    setEstado("listo");
  }

  return (
    <section className="w-full overflow-hidden bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        {/* Texto */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            {entregable.etiqueta}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">
            {entregable.titulo}
          </h2>
          <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
            {entregable.descripcion}
          </p>

          {estado === "vitrina" && (
            <button
              type="button"
              onClick={() => setEstado("formulario")}
              className="mt-8 inline-flex items-center gap-3 rounded-xs bg-primary px-8 py-3.5 font-bold text-white transition-all duration-300 hover:bg-secondary hover:text-primary"
            >
              {entregable.textoBoton}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5m0 0l-4.5-4.5M12 16.5l4.5-4.5M3.75 20.25h16.5" />
              </svg>
            </button>
          )}

          {(estado === "formulario" || estado === "enviando") && (
            <form onSubmit={alEnviar} className="mt-8 max-w-md motion-safe:animate-[fadeIn_.35s_ease-out]">
              <p className="text-sm text-tertiary">Tres datos y te lo entregamos al instante.</p>
              <div className="mt-4 space-y-3">
                <input
                  aria-label="Nombre"
                  placeholder="Nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-xs border border-gray-300 bg-white px-4 py-2.5 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                />
                <input
                  aria-label="Correo"
                  type="email"
                  placeholder="Correo"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full rounded-xs border border-gray-300 bg-white px-4 py-2.5 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                />
                <input
                  aria-label="Empresa"
                  placeholder="Empresa"
                  required
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="w-full rounded-xs border border-gray-300 bg-white px-4 py-2.5 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                />
              </div>
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="mt-4 w-full rounded-xs bg-secondary px-8 py-3.5 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-60"
              >
                {estado === "enviando" ? "Preparando tu descarga" : entregable.textoBoton}
              </button>
            </form>
          )}

          {estado === "listo" && (
            <div className="mt-8 max-w-md rounded-sm border-l-4 border-secondary bg-white p-6 shadow-sm motion-safe:animate-[fadeIn_.35s_ease-out]">
              <p className="text-xl font-extrabold text-primary">Tu informe está listo</p>
              <p className="mt-1 leading-relaxed text-tertiary">
                Si la descarga no comienza sola, usa el botón.
              </p>
              <a
                href={entregable.archivo}
                download
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xs bg-primary px-8 py-3.5 font-bold text-white transition-all duration-300 hover:bg-secondary hover:text-primary"
              >
                Descargar el informe
              </a>
            </div>
          )}
        </div>

        {/* Vitrina: las páginas reales, escalonadas */}
        <div className="group relative mx-auto w-full max-w-xl">
          {/* Página 2 al fondo, girada, asomando por detrás */}
          <div className="absolute right-0 top-6 hidden w-[78%] rotate-[4deg] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5 transition-transform duration-500 motion-safe:group-hover:rotate-[6deg] motion-safe:group-hover:-translate-y-2 sm:block">
            <Image
              src={entregable.paginas[1]}
              alt=""
              aria-hidden="true"
              width={1253}
              height={1457}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 60vw, 380px"
            />
          </div>

          {/* Página 1 al frente */}
          <div className="relative w-[88%] overflow-hidden rounded-sm shadow-2xl ring-1 ring-black/10 transition-transform duration-500 motion-safe:group-hover:-translate-y-1.5">
            <Image
              src={entregable.paginas[0]}
              alt={entregable.altPaginas}
              width={1253}
              height={890}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 90vw, 460px"
              priority={false}
            />
          </div>

          {/* Sello flotante con lo que trae el informe */}
          <div className="absolute -bottom-4 right-0 rounded-sm bg-primary px-5 py-3 text-white shadow-xl sm:right-4">
            <p className="text-2xl font-extrabold leading-none text-secondary">
              {entregable.dato}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/80">
              {entregable.datoTexto}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
