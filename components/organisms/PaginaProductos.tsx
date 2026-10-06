import Image from "next/image";
import Link from "next/link";
import TiendaProductos from "@/components/organisms/TiendaProductos";
import type { ProductoCatalogo } from "@/lib/productos-locales";
import type { Brand } from "@/types/category";

/**
 * PaginaProductos
 * El cuerpo de /productos.
 *
 * 2026-09-28: el catálogo pasa a estructura de tienda (TiendaProductos),
 * como la referencia que pasó Emiliano: filtros, banner por marca,
 * categorías destacadas y rejilla o lista. Entran las 23 cámaras
 * termográficas HIKMICRO, que viven en el sitio y no en el CMS. La
 * cabecera se hace delgada para que los productos se vean desde el
 * principio; el carrusel de fotos en campo y las tarjetas de marca se
 * quitaron porque el banner de la tienda ya presenta cada marca.
 */

const RAZONES = [
  {
    titulo: "Te ayudamos a elegir",
    texto:
      "Te asesoran especialistas que usan estos equipos a diario en planta, para que compres lo que tu operación necesita y no más.",
    href: "/contacto",
    enlace: "Pedir asesoría",
    foto: "/images/cursos/termografia/termografia-01.webp",
    alt: "Especialista de DIAPSA explicando el uso de una cámara termográfica junto a una tubería",
  },
  {
    titulo: "Te enseñamos a usarlo",
    texto:
      "Cursos de formación, talleres y certificación en la técnica del equipo, con instructores que trabajan en campo.",
    href: "/cursos",
    enlace: "Ver cursos",
    foto: "/images/cursos/vibraciones/vibraciones-01.webp",
    alt: "Grupo de técnicos en un curso de DIAPSA frente a la presentación",
  },
  {
    titulo: "Lo instalamos y lo ponemos en marcha",
    texto:
      "Los sensores y cámaras fijas se entregan instalados, configurados y enviando datos.",
    href: "/servicios/monitoreo-continuo",
    enlace: "Ver monitoreo continuo",
    foto: "/images/servicios/sensores-vibracion/instalacion-sensor.webp",
    alt: "Técnico de DIAPSA instalando un sensor de vibración inalámbrico en un equipo de proceso",
  },
  {
    titulo: "O lo operamos por ti",
    texto:
      "Si prefieres no comprar, nuestros analistas hacen las rutas con su equipo y te entregan el informe.",
    href: "/servicios/monitoreo-condicion",
    enlace: "Ver servicios",
    foto: "/images/gallery/campo/vibracion-generador.webp",
    alt: "Analista de DIAPSA midiendo vibraciones en un generador durante la ruta",
  },
];

function Flecha() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function PaginaProductos({
  productos,
  marcas,
}: {
  productos: ProductoCatalogo[];
  marcas: Brand[];
}) {
  return (
    <main>
      {/* 1. Cabecera delgada */}
      <section className="w-full bg-primary pb-10 pt-28 text-white lg:pb-12 lg:pt-36">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="text-xs text-white/60" aria-label="Ruta">
            <Link href="/" className="hover:text-secondary">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Productos</span>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            EQUIPOS PARA{" "}
            <span className="text-secondary">MONITOREO DE CONDICIÓN</span>
          </h1>
          <p className="mt-3 max-w-3xl text-justify leading-relaxed text-white/80">
            Cámaras termográficas, cámaras acústicas y sensores de vibración
            inalámbricos. Los mismos que usan nuestros analistas en campo, con
            la asesoría de quien los conoce en planta.
          </p>
        </div>
      </section>

      {/* 2. Tienda */}
      <section
        id="catalogo"
        className="w-full scroll-mt-24 bg-gray-50 py-10 lg:py-14"
      >
        <div className="mx-auto max-w-7xl px-6">
          {productos.length > 0 ? (
            <TiendaProductos productos={productos} marcas={marcas} />
          ) : (
            <p className="text-center text-tertiary">
              El catálogo no está disponible en este momento. Escríbenos y te
              enviamos las opciones y precios.
            </p>
          )}
        </div>
      </section>

      {/* 3. Por qué con DIAPSA */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              Por qué con nosotros
            </span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              NO SOLO TE VENDEMOS{" "}
              <span className="text-secondary">EL EQUIPO</span>
            </h2>
          </div>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RAZONES.map((r, i) => (
              <li
                key={r.titulo}
                className="group relative flex flex-col overflow-hidden rounded-sm bg-gray-50 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={r.foto}
                    alt={r.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
                  <span className="absolute bottom-3 left-4 font-mono text-3xl font-black text-secondary drop-shadow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col border-t-4 border-secondary p-6">
                  <h3 className="text-lg font-extrabold leading-snug text-primary">
                    {r.titulo}
                  </h3>
                  <p className="mt-2 flex-1 text-justify text-sm leading-relaxed text-tertiary">
                    {r.texto}
                  </p>
                  <Link
                    href={r.href}
                    // La tarjeta entera se ve "clicable" (sombra y foto que crece): el
                    // enlace la cubre completa para que el clic en la foto no se pierda.
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-secondary after:absolute after:inset-0 hover:text-primary"
                  >
                    {r.enlace} <Flecha />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Contacto */}
      <section className="w-full bg-primary py-14 text-white lg:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 text-center">
          <h2 className="text-3xl font-extrabold lg:text-4xl">
            ¿NO ENCUENTRAS{" "}
            <span className="text-secondary">EL EQUIPO QUE BUSCAS?</span>
          </h2>
          <p className="max-w-2xl text-justify text-white/75 sm:text-center">
            Cuéntanos qué necesitas medir y en qué equipos. Te recomendamos la
            opción adecuada, aunque no esté en el catálogo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contacto?motivo=equipos"
              className="inline-flex items-center gap-2 rounded-xs bg-secondary px-7 py-3 font-bold text-primary transition-colors hover:bg-white"
            >
              Solicitar cotización <Flecha />
            </Link>
            <a
              href="tel:+528145903792"
              className="inline-flex items-center gap-2 rounded-xs border border-white/40 px-7 py-3 font-bold text-white transition-colors hover:border-secondary hover:text-secondary"
            >
              +52 (81) 4590-3792
            </a>
          </div>
          <a
            href="mailto:info@grupodiapsa.com"
            className="text-sm text-white/70 hover:text-secondary"
          >
            info@grupodiapsa.com
          </a>
        </div>
      </section>
    </main>
  );
}
