"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import NavLink from "@/components/atoms/NavLink";

export default function WipState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <svg
              className="w-16 h-16 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Sección en Desarrollo
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          Estamos trabajando en esta sección para ofrecerte la mejor experiencia.
          Pronto estará disponible con contenido actualizado y nuevas funcionalidades.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contacto">
            <Button variant="primary" className="w-full sm:w-auto">
              Contáctanos
            </Button>
          </Link>
          <Link href="/">
            <Button variant="primary" ghost className="w-full sm:w-auto">
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ¿Tienes alguna pregunta o sugerencia?{" "}
            <NavLink href="/contacto" variant="inline">
              Nos encantaría escucharte
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
