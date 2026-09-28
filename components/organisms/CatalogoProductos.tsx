"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStorageUrl } from "@/lib/api/config";
import type { Product } from "@/types/product";

/**
 * CatalogoProductos
 * Todos los productos del CMS a la vista, con un filtro por categoría.
 *
 * Por qué así: la página anterior escondía los diez equipos detrás de dos
 * tarjetas de categoría gigantes; había que entrar a cada una para ver qué
 * vendemos. Con tan pocos productos cabe todo en una rejilla, y el filtro
 * solo acota. Cada tarjeta lleva la foto completa sobre blanco, la marca,
 * el modelo, dos especificaciones y dos caminos: la ficha y cotizar (que
 * lleva al formulario de la ficha).
 */

type Props = { productos: Product[] };

export default function CatalogoProductos({ productos }: Props) {
  const categorias = [...new Map(productos.map((p) => [p.category?.slug, p.category])).values()].filter(Boolean);
  const [filtro, setFiltro] = useState<string>("todos");
  const visibles = filtro === "todos" ? productos : productos.filter((p) => p.category?.slug === filtro);

  const pestanas = [
    { id: "todos", nombre: "Todos", n: productos.length },
    ...categorias.map((c) => ({ id: c.slug, nombre: c.name, n: productos.filter((p) => p.category?.slug === c.slug).length })),
  ];

  return (
    <div>
      <div role="tablist" className="mb-8 flex flex-wrap justify-center gap-2">
        {pestanas.map((pe) => {
          const sel = filtro === pe.id;
          return (
            <button
              key={pe.id}
              type="button"
              role="tab"
              aria-selected={sel}
              onClick={() => setFiltro(pe.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                sel ? "bg-primary text-white" : "bg-white text-primary ring-1 ring-primary/15 hover:ring-secondary"
              }`}
            >
              {pe.nombre}
              <span className={`ml-2 text-xs ${sel ? "text-secondary" : "text-tertiary"}`}>{pe.n}</span>
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((p) => {
          const ruta = `/productos/${p.category?.slug}/${p.slug}`;
          const foto = getStorageUrl(p.main_image);
          return (
            <li key={p.slug} className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl">
              <Link href={ruta} className="relative block h-56 bg-white">
                {foto && (
                  <Image
                    src={foto}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {p.is_new && (
                  <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">Nuevo</span>
                )}
              </Link>
              <div className="flex flex-1 flex-col border-t border-gray-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-secondary">{p.brand?.name}</p>
                <Link href={ruta} className="mt-1 font-extrabold leading-snug text-primary hover:text-secondary">
                  {p.model}
                </Link>
                <p className="mt-0.5 text-sm leading-snug text-tertiary">{p.name}</p>
                {p.featured_specs?.length > 0 && (
                  <dl className="mt-4 flex flex-col gap-1.5">
                    {p.featured_specs.slice(0, 2).map((s) => (
                      <div key={s.label} className="flex items-baseline justify-between gap-3 border-b border-dashed border-gray-200 pb-1.5 text-sm">
                        <dt className="text-tertiary">{s.label}</dt>
                        <dd className="shrink-0 font-semibold text-primary">
                          {s.value}
                          {s.unit ? ` ${s.unit}` : ""}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                <div className="mt-auto flex gap-2 pt-5">
                  <Link
                    href={ruta}
                    className="flex-1 rounded-xs bg-primary px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-secondary hover:text-primary"
                  >
                    Ver ficha
                  </Link>
                  <Link
                    href={`${ruta}#contacto`}
                    className="flex-1 rounded-xs border border-primary/20 px-4 py-2.5 text-center text-sm font-bold text-primary transition-colors hover:border-secondary hover:text-secondary"
                  >
                    Cotizar
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
