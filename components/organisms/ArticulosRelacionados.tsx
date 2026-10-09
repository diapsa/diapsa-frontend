import Image from "next/image";
import Link from "next/link";
import { getStorageUrl } from "@/lib/api/config";
import { slugsRelacionados } from "@/lib/recursos";
import type { Blog } from "@/types/post";

/**
 * ArticulosRelacionados
 * Al final de cada artículo, tres lecturas para seguir (Emiliano,
 * 2026-10-09: "que cuando entres a alguna puedas ir saltando a otras").
 * Primero las del mismo servicio, después las de servicios hermanos y, si
 * faltan, las más recientes del blog.
 */

const POR_DEFECTO = "/images/fondo-mantenimiento.webp";

export function elegirRelacionados(slug: string, todos: Blog[], cuantos = 3): Blog[] {
  const porSlug = new Map(todos.map((b) => [b.slug, b]));
  const elegidos: Blog[] = [];
  for (const s of slugsRelacionados(slug)) {
    const b = porSlug.get(s);
    if (b && !elegidos.includes(b)) elegidos.push(b);
    if (elegidos.length === cuantos) return elegidos;
  }
  for (const b of todos) {
    if (b.slug !== slug && !elegidos.includes(b)) elegidos.push(b);
    if (elegidos.length === cuantos) break;
  }
  return elegidos;
}

export default function ArticulosRelacionados({ articulos }: { articulos: Blog[] }) {
  if (articulos.length === 0) return null;
  return (
    <section className="w-full bg-gray-50 py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">Sigue leyendo</p>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight text-primary lg:text-3xl">Artículos relacionados</h2>
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {articulos.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/blog/${a.slug}`}
                prefetch={false}
                className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-primary/10 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={getStorageUrl(a.cover_image) || POR_DEFECTO}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-extrabold leading-snug text-primary">{a.title}</h3>
                  {a.excerpt && <p className="mt-2 line-clamp-3 flex-1 text-justify text-sm leading-relaxed text-tertiary">{a.excerpt}</p>}
                  <p className="mt-4 text-sm font-bold text-primary group-hover:text-secondary">
                    Leer el artículo <span aria-hidden="true">→</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
