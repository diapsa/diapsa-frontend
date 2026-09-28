import Image from "next/image";
import Link from "next/link";
import CarruselFotos from "@/components/molecules/CarruselFotos";
import CatalogoProductos from "@/components/organisms/CatalogoProductos";
import { getStorageUrl } from "@/lib/api/config";
import type { Brand } from "@/types/category";
import type { Product } from "@/types/product";

/**
 * PaginaProductos
 * El cuerpo de /productos, rehecho (2026-09-27).
 *
 * Antes: un encabezado genérico, tres promesas sin respaldo ("equipos
 * certificados", "entrega nacional") y dos tarjetas de categoría gigantes
 * que escondían los productos. Ahora: los equipos en uso en campo, las
 * marcas que manejamos, todo el catálogo a la vista con filtro, por qué
 * comprarlo con DIAPSA y contacto.
 *
 * HIKMICRO se vende pero todavía no está en el CMS: aparece entre las
 * marcas con enlace a cotizar, y cuando se den de alta sus productos
 * entrarán solos al catálogo.
 */

const FOTOS_CAMPO = [
  { src: "/images/servicios/sensores-acusticos/campo-00.webp", alt: "Especialista de DIAPSA con cámara acústica frente a una subestación" },
  { src: "/images/servicios/sensores-vibracion/instalacion-sensor.webp", alt: "Instalación de un sensor de vibración inalámbrico en un equipo de proceso" },
  { src: "/images/deteccion-gas/campo/pantalla-gas-natural.webp", alt: "Fuga de gas localizada en pantalla con la cámara de detección" },
  { src: "/images/servicios/sensores-vibracion/estacion-base.webp", alt: "Técnico de DIAPSA con la estación base inalámbrica en planta" },
  { src: "/images/servicios/sensores-acusticos/campo-12.webp", alt: "Inspección acústica de las líneas de una subestación" },
];

// Qué hace cada marca, en una línea. Las que no están aquí toman su nombre.
const LINEA_MARCA: Record<string, string> = {
  hertzinno: "Cámaras acústicas de mano y fijas para fugas de gas y aire y descargas eléctricas.",
  "kcf-technologies": "Sensores de vibración inalámbricos y estaciones base para monitoreo en línea.",
};

const RAZONES = [
  {
    titulo: "Te ayudamos a elegir",
    texto: "Te asesoran especialistas que usan estos equipos a diario en planta, para que compres lo que tu operación necesita y no más.",
    href: "/contacto",
    enlace: "Pedir asesoría",
  },
  {
    titulo: "Te enseñamos a usarlo",
    texto: "Cursos de formación, talleres y certificación en la técnica del equipo, con instructores que trabajan en campo.",
    href: "/cursos",
    enlace: "Ver cursos",
  },
  {
    titulo: "Lo instalamos y lo ponemos en marcha",
    texto: "Los sensores y cámaras fijas se entregan instalados, configurados y enviando datos.",
    href: "/servicios/monitoreo-continuo",
    enlace: "Ver monitoreo continuo",
  },
  {
    titulo: "O lo operamos por ti",
    texto: "Si prefieres no comprar, nuestros analistas hacen las rutas con su equipo y te entregan el informe.",
    href: "/servicios/monitoreo-condicion",
    enlace: "Ver servicios",
  },
];

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function PaginaProductos({ productos, marcas }: { productos: Product[]; marcas: Brand[] }) {
  return (
    <main>
      {/* 1. Los equipos, en campo */}
      <section className="relative w-full overflow-hidden bg-primary">
        <Image src="/images/screen.png" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-32 lg:grid-cols-2 lg:gap-14 lg:pb-20 lg:pt-40">
          <div className="text-white">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Productos</span>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              LOS EQUIPOS QUE <span className="text-secondary">USAMOS EN CAMPO</span>
            </h1>
            <p className="mt-5 max-w-xl text-justify leading-relaxed text-white/80 lg:text-lg">
              Cámaras acústicas, sensores de vibración inalámbricos y cámaras termográficas. Los mismos que usan nuestros analistas todos los días, con la asesoría de quien los conoce en planta.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 rounded-xs bg-secondary px-7 py-3 font-bold text-primary transition-colors hover:bg-white"
              >
                Ver catálogo <Flecha />
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-xs border border-white/40 px-7 py-3 font-bold text-white transition-colors hover:border-secondary hover:text-secondary"
              >
                Pedir asesoría
              </Link>
            </div>
          </div>
          <CarruselFotos fotos={FOTOS_CAMPO} intervalo={3500} prioridad />
        </div>
      </section>

      {/* 2. Marcas */}
      <section className="w-full bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Marcas</span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              LAS MARCAS QUE <span className="text-secondary">MANEJAMOS</span>
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {marcas.map((m) => {
              const logo = getStorageUrl(m.logo);
              return (
                <li key={m.slug} className="flex flex-col rounded-sm border border-gray-100 bg-gray-50 p-6">
                  <div className="relative mb-5 flex h-16 items-center">
                    {logo ? (
                      <Image src={logo} alt={m.name} fill sizes="240px" className="object-contain object-left" />
                    ) : (
                      <span className="text-2xl font-extrabold text-primary">{m.name}</span>
                    )}
                  </div>
                  <p className="font-bold text-primary">{m.name}</p>
                  <p className="mt-1 flex-1 text-justify text-sm leading-relaxed text-tertiary">{LINEA_MARCA[m.slug] ?? ""}</p>
                  <a href="#catalogo" className="mt-4 text-sm font-bold text-secondary hover:text-primary">
                    {m.products_count} {m.products_count === 1 ? "equipo" : "equipos"} en el catálogo
                  </a>
                </li>
              );
            })}
            <li className="flex flex-col rounded-sm border border-gray-100 bg-gray-50 p-6">
              <div className="mb-5 flex h-16 items-center">
                <span className="text-2xl font-extrabold tracking-wide text-primary">HIKMICRO</span>
              </div>
              <p className="font-bold text-primary">HIKMICRO</p>
              <p className="mt-1 flex-1 text-justify text-sm leading-relaxed text-tertiary">
                Cámaras termográficas para inspección eléctrica, mecánica y de proceso.
              </p>
              <Link href="/contacto" className="mt-4 text-sm font-bold text-secondary hover:text-primary">
                Cotizar cámaras termográficas
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. Catálogo */}
      <section id="catalogo" className="w-full scroll-mt-24 bg-gray-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Catálogo</span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              TODOS LOS <span className="text-secondary">EQUIPOS</span>
            </h2>
          </div>
          {productos.length > 0 ? (
            <CatalogoProductos productos={productos} />
          ) : (
            <p className="text-center text-tertiary">
              El catálogo no está disponible en este momento. Escríbenos y te enviamos las opciones y precios.
            </p>
          )}
        </div>
      </section>

      {/* 4. Por qué con DIAPSA */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Por qué con nosotros</span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              NO SOLO TE VENDEMOS <span className="text-secondary">EL EQUIPO</span>
            </h2>
          </div>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RAZONES.map((r, i) => (
              <li key={r.titulo} className="flex flex-col rounded-sm border-t-4 border-secondary bg-gray-50 p-6">
                <span className="font-mono text-sm font-bold text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-extrabold leading-snug text-primary">{r.titulo}</h3>
                <p className="mt-2 flex-1 text-justify text-sm leading-relaxed text-tertiary">{r.texto}</p>
                <Link href={r.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-primary">
                  {r.enlace} <Flecha />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Contacto */}
      <section className="w-full bg-primary py-14 text-white lg:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 text-center">
          <h2 className="text-3xl font-extrabold lg:text-4xl">
            ¿NO ENCUENTRAS <span className="text-secondary">EL EQUIPO QUE BUSCAS?</span>
          </h2>
          <p className="max-w-2xl text-justify text-white/75 sm:text-center">
            Cuéntanos qué necesitas medir y en qué equipos. Te recomendamos la opción adecuada, aunque no esté en el catálogo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contacto" className="inline-flex items-center gap-2 rounded-xs bg-secondary px-7 py-3 font-bold text-primary transition-colors hover:bg-white">
              Solicitar cotización <Flecha />
            </Link>
            <a href="tel:+528145903792" className="inline-flex items-center gap-2 rounded-xs border border-white/40 px-7 py-3 font-bold text-white transition-colors hover:border-secondary hover:text-secondary">
              +52 (81) 4590-3792
            </a>
          </div>
          <a href="mailto:info@grupodiapsa.com" className="text-sm text-white/70 hover:text-secondary">
            info@grupodiapsa.com
          </a>
        </div>
      </section>
    </main>
  );
}
