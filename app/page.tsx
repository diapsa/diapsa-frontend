import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/organisms/Hero";
import QuienesSomos from "@/components/organisms/QuienesSomos";
import NavegadorServicios from "@/components/organisms/NavegadorServicios";
import GasYEquiposSection from "@/components/organisms/GasYEquiposSection";
import Reveal from "@/components/atoms/Reveal";
import { Clients } from "@/components/organisms/Clients";
import GaleriaCampo from "@/components/organisms/GaleriaCampo";
import CasosExitoTeaser from "@/components/organisms/CasosExitoTeaser";
import LoQueRecibes from "@/components/organisms/LoQueRecibes";
import InicioDiplomado from "@/components/organisms/InicioDiplomado";
import BlogSection from "@/components/organisms/BlogSection";
import ContactForm from "@/components/organisms/ContactForm";
import galeriaMonitoreo from "@/data/monitoreo-condicion-galeria.json";
import { getFeaturedBlogs, getFeaturedSuccessCases } from "@/lib/api/posts";

const OG_IMAGE = "/images/og-images/og-image.jpg";

export const metadata: Metadata = {
  title: "Inicio | Mantenimiento Predictivo Industrial",
  description:
    "Monitoreo de condición, sensores en línea y cursos de mantenimiento predictivo. Medimos tus equipos en operación y te decimos qué intervenir, cuándo y por qué.",
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

// Portada rehecha con el plan de septiembre (docs/designs/plan-home-2026-09.md):
// una línea en lugar de trece secciones sueltas. Hero en carrusel (cuatro
// puertas, la primera con la escena de la planta), quiénes somos en corto,
// todos los servicios a la vista, gas y equipos, la prueba (clientes, fotos
// de campo, casos), lo que recibes, el diplomado, el blog y el contacto.
// Salen las pestañas, los anuncios, la galería suelta, la historia con
// cifras que no se podían sostener y la introducción de IDAP.
export default async function Home() {
  // El CMS no debe poder tumbar la home: si alguna llamada falla, la página
  // carga igual y solo se omite la sección que dependía de esos datos.
  const [cases, blogs] = await Promise.all([
    getFeaturedSuccessCases().catch((error) => {
      console.error("[home] No se pudieron cargar los casos de éxito:", error);
      return [];
    }),
    getFeaturedBlogs().catch((error) => {
      console.error("[home] No se pudieron cargar las entradas de blog:", error);
      return [];
    }),
  ]);

  return (
    <main>
      {/* El Hero queda fuera de Reveal a propósito: animar lo que ya está
          visible al cargar retrasa la primera impresión y penaliza el LCP. */}
      <Hero />

      {/* Quiénes somos y todos los servicios a la vista */}
      <Reveal><QuienesSomos /></Reveal>
      <Reveal><NavegadorServicios /></Reveal>

      {/* Segunda fila: detección de gas y equipos */}
      <Reveal><GasYEquiposSection /></Reveal>

      {/* La prueba: clientes, fotos de campo y casos */}
      <Reveal><Clients /></Reveal>
      <GaleriaCampo
        fotos={galeriaMonitoreo}
        texto="Nuestros analistas en planta con vibraciones, termografía, ultrasonido, aceite y calidad de energía. Mediciones reales, sin fotos de banco de imágenes."
      />
      {cases.length > 0 && <Reveal><CasosExitoTeaser cases={cases} /></Reveal>}

      {/* Lo que recibes: aviso, informe e historial en IDAP */}
      <Reveal><LoQueRecibes /></Reveal>

      {/* Cierre */}
      <Reveal><InicioDiplomado /></Reveal>
      {blogs.length > 0 && <Reveal><BlogSection blogs={blogs} /></Reveal>}

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
