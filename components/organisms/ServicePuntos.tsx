"use client";

import { useState } from "react";
import Image from "next/image";
import IconoTarjeta from "../atoms/IconoTarjeta";
import type { ContentItem } from "@/types/servicio";

/**
 * ServicePuntos
 * Los puntos clave del servicio, uno abierto a la vez.
 *
 * Por qué se rehízo: la versión anterior mostraba los seis puntos con su
 * descripción al mismo tiempo. Aunque los textos ya eran cortos, el visitante
 * veía 107 palabras de golpe y la sección seguía leyéndose como un muro. Una
 * comparación con ocho referencias de Brasil y Estados Unidos (Tractian,
 * Dynamox, ATS, I-care, UE Systems) mostró que ninguna muestra todo el texto a
 * la vez: usan pestañas o acordeón, y el texto visible en cualquier momento
 * ronda las 30 o 40 palabras.
 *
 * Aquí solo se ve la descripción del punto activo; los demás son un renglón.
 * A la derecha va una foto de campo, que además rompe el tramo de la página
 * que no tenía ninguna imagen.
 */

type Props = {
  puntos: ContentItem[];
  foto?: { src: string; alt: string };
};

export default function ServicePuntos({ puntos, foto }: Props) {
  const [activo, setActivo] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14 lg:items-center">
      {/* Riel de puntos */}
      <ul className="border-l-2 border-gray-200">
        {puntos.map((punto, indice) => {
          const abierto = indice === activo;
          return (
            <li
              key={punto.id}
              className={`-ml-0.5 border-l-2 transition-colors duration-200 ${
                abierto ? "border-secondary" : "border-transparent"
              }`}
            >
              <button
                type="button"
                onClick={() => setActivo(indice)}
                aria-expanded={abierto}
                className="flex w-full items-center gap-4 py-3.5 pl-5 pr-2 text-left"
              >
                <IconoTarjeta id={punto.id} />
                <span
                  className={`text-lg font-bold leading-snug transition-colors duration-200 ${
                    abierto ? "text-primary" : "text-tertiary hover:text-primary"
                  }`}
                >
                  {punto.title}
                </span>
              </button>
              {abierto && (
                <p className="pb-5 pl-5 pr-4 text-base leading-relaxed text-tertiary motion-safe:animate-[fadeIn_.3s_ease-out] sm:pl-[4.75rem]">
                  {punto.content}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Foto de campo */}
      {foto && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5">
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
      )}
    </div>
  );
}
