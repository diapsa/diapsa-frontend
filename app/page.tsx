import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/organisms/Hero";
import InicioIndustrias from "@/components/organisms/InicioIndustrias";
import InicioBloques from "@/components/organisms/InicioBloques";
import { Clients } from "@/components/organisms/Clients";
import GaleriaCampo from "@/components/organisms/GaleriaCampo";
import CasosDestacados from "@/components/organisms/CasosDestacados";
import InicioBlog from "@/components/organisms/InicioBlog";
import ContactForm from "@/components/organisms/ContactForm";
import AvisoCurso from "@/components/organisms/AvisoCurso";
import InicioContacto from "@/components/organisms/InicioContacto";
import galeriaMonitoreo from "@/data/monitoreo-condicion-galeria.json";
import { getBlogs, getFeaturedSuccessCases } from "@/lib/api/posts";
import { getProducts } from "@/lib/api/products";

// Se regenera cada hora: productos, casos y blog vienen del CMS.
export const revalidate = 3600;

const OG_IMAGE = "/images/og-images/og-image.jpg";

export const metadata: Metadata = {
  title: { absolute: "Mantenimiento predictivo industrial en México | DIAPSA" },
  description:
    "Medimos tus equipos en operación con vibraciones, termografía, ultrasonido y aceite, y te decimos qué intervenir, cuándo y por qué. Diagnóstico sin costo.",
  keywords: [
    "mantenimiento predictivo México",
    "mantenimiento predictivo Sudamérica",
    "mantenimiento predictivo",
    "monitoreo de condición",
    "servicios de mantenimiento",
    "termografía infrarroja industrial",
    "análisis de vibraciones",
    "ultrasonido industrial",
    "diagnóstico de maquinaria",
    "confiabilidad de equipos",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Grupo DIAPSA | Mantenimiento Predictivo Industrial",
    description:
      "Mantenimiento predictivo, monitoreo de condición y servicios de mantenimiento industrial para México y Sudamérica.",
    url: "/",
    type: "website",
    locale: "es_MX",
    siteName: "Grupo DIAPSA",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Grupo DIAPSA - Mantenimiento Predictivo Industrial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@grupodiapsa",
    creator: "@grupodiapsa",
    title: "Grupo DIAPSA | Mantenimiento Predictivo Industrial",
    description:
      "Mantenimiento predictivo, monitoreo de condición y servicios de mantenimiento industrial para Mexico y Sudamérica.",
    images: [OG_IMAGE],
  },
};

// Portada rehecha con el plan de septiembre (docs/designs/plan-home-2026-09.md)
// y recortada el 2026-11-15. Clarity de noviembre: la gente baja en promedio
// al 24 % de la página y solo el 8 % de su tiempo ahí es activo ("la abren y
// no la leen"). Eran quince franjas; quedan diez, con lo que vende primero:
// hero, cómo empezar (WhatsApp es el botón más usado del sitio), clientes,
// servicios, cursos y equipos, industrias, casos, fotos de campo, guías, el
// formulario y la línea de cobertura.
// Salen de la portada (los componentes siguen en el repo) las que repetían
// otra franja: InicioGas (ya es la diapositiva 3 del hero y una tarjeta de
// "Más servicios"), LoQueRecibes (vive en monitoreo de condición; cargaba
// una segunda escena 3D y cambiaba de alto cada 8 s), QuienesSomos (sus
// tres datos ya están en el hero, en el bloque de servicios y en el texto
// de las fotos de campo, y su carrusel repetía las fotos de campo),
// InicioPresencia (un segundo formulario antes del formulario final; sus
// tres cifras no llevan caso ni fuente a la vista, y los casos ya dan cifras
// medidas) e InicioDiplomado (el diplomado ya está
// en el hero y en el bloque de cursos).
// Tampoco va Reveal: escondía cada franja hasta que su borde entraba en
// pantalla y la mostraba con 0.7 s de fundido; en un desplazamiento rápido
// se veían huecos en blanco justo donde se esperaba leer.
export default async function Home() {
  // El CMS no debe poder tumbar la home: si alguna llamada falla, la página
  // carga igual y solo se omite la sección que dependía de esos datos.
  const [cases, blogs, productos] = await Promise.all([
    getFeaturedSuccessCases().catch((error) => {
      console.error("[home] No se pudieron cargar los casos de éxito:", error);
      return [];
    }),
    getBlogs({ limit: 6 }).catch((error) => {
      console.error("[home] No se pudieron cargar las entradas de blog:", error);
      return [];
    }),
    getProducts({ per_page: 50 })
      .then((r) => r.data ?? [])
      .catch((error) => {
        console.error("[home] No se pudieron cargar los productos:", error);
        return [];
      }),
  ]);

  return (
    <main>
      {/* El Hero queda fuera de Reveal a propósito: animar lo que ya está
          visible al cargar retrasa la primera impresión y penaliza el LCP. */}
      <Hero />
      {/* Ficha de esquina con el curso de termografía del 8 al 11 de diciembre. */}
      <AvisoCurso />

      {/* Cómo empezar, en la primera pantalla y media. Subirlo el 3 y el 21
          de octubre llevó "hasta dónde bajan" de 24.2 % a 37.5 %. */}
      <InicioContacto />

      {/* La prueba social justo después: para quién trabajamos, en una línea
          y con los logotipos, sin el titular largo de su versión completa. */}
      <Clients compacto />

      {/* Servicios, cursos y equipos */}
      <InicioBloques productos={productos} />

      {/* Las industrias, con enlace a la página de cada una */}
      <InicioIndustrias />

      {/* Resultados documentados y fotos reales de campo */}
      {cases.length > 0 && <CasosDestacados casos={cases} />}
      <GaleriaCampo
        sinPie
        prioridad={false}
        fotos={galeriaMonitoreo}
        texto="Somos un despacho de ingeniería dedicado al monitoreo de condición, con base en Saltillo y servicio en todo México y Sudamérica. Estas son mediciones reales de nuestros analistas, sin fotos de banco de imágenes."
      />

      {blogs.length > 0 && <InicioBlog entradas={blogs} />}

      <section id="contacto">
        <ContactForm />
      </section>

      {/* Cobertura regional, en corto. El enlace a análisis de vibraciones
          no es decorativo: es la consulta sin marca que más nos busca en
          Google y la home es la página con más autoridad del sitio. */}
      <section className="bg-gray-50 px-6 py-10">
        <p className="mx-auto max-w-4xl text-justify text-sm leading-relaxed text-tertiary sm:text-center">
          Grupo DIAPSA brinda servicios de mantenimiento industrial, monitoreo de condición,{" "}
          <Link
            href="/servicios/monitoreo-condicion/vibraciones-mecanicas"
            className="font-semibold text-primary underline decoration-secondary decoration-2 underline-offset-4 transition-colors hover:text-secondary"
          >
            análisis de vibraciones
          </Link>
          , diagnóstico de maquinaria y confiabilidad de activos a plantas en México y toda Sudamérica.
        </p>
      </section>
    </main>
  );
}
