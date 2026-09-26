import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { createArticleSchema, createBreadcrumbSchema, createFaqSchema } from "@/components/atoms/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Guía del PPCIEM.
 * La puerta de entrada para quien busca cómo cumplir (HSE) o qué exige la
 * norma (compliance), no un proveedor. Contesta esas preguntas y termina en
 * la página del servicio. Vive en el sitio y no en el blog porque el blog se
 * alimenta del CMS; así se publica y se enlaza sin tocarlo.
 *
 * Texto informativo: no cita artículos ni plazos de las disposiciones, que
 * pueden cambiar, y lo dice al final.
 */

const URL = "/servicios/deteccion-gas/guia-ppciem";
const TITULO = "Qué exige el PPCIEM y cómo cumplirlo, trimestre por trimestre";
const DESCRIPCION =
  "Guía práctica del Programa para la Prevención y el Control Integral de las Emisiones de Metano (PPCIEM): quién debe tenerlo, qué incluye, cómo funciona un programa LDAR trimestral y qué evidencia pide la ASEA.";
const OG_IMAGE = "/images/og-images/og-images-gas.jpg";

export const metadata: Metadata = {
  title: "Guía del PPCIEM: qué exige y cómo cumplirlo",
  description: DESCRIPCION,
  keywords: ["PPCIEM", "qué es el PPCIEM", "cómo cumplir el PPCIEM", "programa LDAR", "inspección trimestral de fugas", "ASEA metano", "reporte anual PPCIEM"],
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITULO} | Grupo DIAPSA`,
    description: DESCRIPCION,
    url: URL,
    type: "article",
    locale: "es_MX",
    siteName: "Grupo DIAPSA",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, type: "image/jpeg", alt: "Guía del PPCIEM Grupo DIAPSA" }],
  },
  twitter: { card: "summary_large_image", site: "@grupodiapsa", title: TITULO, description: DESCRIPCION, images: [OG_IMAGE] },
};

const SECCIONES = [
  {
    titulo: "Qué es el PPCIEM",
    parrafos: [
      "El PPCIEM es el Programa para la Prevención y el Control Integral de las Emisiones de Metano. La Agencia de Seguridad, Energía y Ambiente (ASEA) lo pide a las instalaciones del sector hidrocarburos para que cada una identifique de dónde puede escaparse metano, lo controle y lo demuestre.",
      "No es un trámite que se entrega una vez. Es un programa que se ejecuta durante todo el año, con inspecciones, reparaciones y registros, y que al cierre se reporta.",
    ],
  },
  {
    titulo: "Quién debe tenerlo",
    parrafos: [
      "Las instalaciones del sector hidrocarburos donde puede haber emisiones de metano: estaciones de compresión, ductos y estaciones de regulación, plantas de proceso, terminales y tanques de almacenamiento, entre otras.",
      "Si tu empresa no es del sector hidrocarburos pero usa gas natural, no estás obligado al PPCIEM. Aun así, una inspección de fugas encuentra gas que se está pagando sin usarse y quita un riesgo junto a calderas, hornos y quemadores.",
    ],
  },
  {
    titulo: "Qué incluye",
    parrafos: [
      "En la práctica, el PPCIEM se sostiene en cuatro cosas: un programa de detección y reparación de fugas, inspecciones periódicas de los componentes que pueden fugar, el registro de cada fuga con su reparación y su reinspección, y un reporte anual de cumplimiento ante la ASEA.",
      "Los componentes que se revisan son los que tienen uniones o partes móviles: válvulas, bridas, sellos de compresores y bombas, conexiones roscadas, instrumentos, venteos y tapas de tanques.",
    ],
  },
  {
    titulo: "Cómo funciona un programa LDAR trimestral",
    parrafos: [
      "LDAR viene del inglés leak detection and repair: detección y reparación de fugas. Es el método con el que se cumple la parte operativa del PPCIEM, y se repite cada trimestre.",
      "Primero se levanta el inventario de componentes con su ubicación. Después se recorre la instalación con una cámara acústica, que ubica cada fuga por el ultrasonido que produce el gas al escapar. Cada fuga se confirma y se mide con un láser de metano (TDLAS), se clasifica por tamaño y riesgo, y se entrega un plan de reparación por prioridad. Al final, cada fuga reparada se vuelve a revisar antes de cerrarla.",
    ],
  },
  {
    titulo: "Qué evidencia hay que guardar",
    parrafos: [
      "Lo que se revisa en una auditoría es la trazabilidad: que cada fuga tenga un número, la fecha en que se detectó, el componente y su ubicación, la lectura con la que se confirmó, la reparación que se hizo y la reinspección que comprueba que quedó cerrada.",
      "La mejor evidencia es la que se genera en campo en el momento: la imagen de la cámara acústica, la lectura del láser y la foto de la reparación. Un registro sin evidencia, o una fuga reparada sin reinspección, es difícil de defender.",
    ],
  },
  {
    titulo: "Los errores más comunes",
    parrafos: [
      "Inspeccionar una vez al año y no cada trimestre. Encontrar fugas pero no volver a revisar las reparadas. Guardar una hoja de cálculo sin videos ni lecturas. Y dejar el reporte anual para el final, cuando la información de los trimestres ya está dispersa.",
    ],
  },
];

const FAQ = [
  { question: "¿Cada cuánto se inspecciona en un programa LDAR?", answer: "El esquema más común es trimestral: cuatro inspecciones al año, cada una con su reparación y su reinspección. La frecuencia exacta depende de lo que establezca tu PPCIEM y de las disposiciones vigentes." },
  { question: "¿Qué pasa si no tengo PPCIEM?", answer: "Si tu instalación es del sector hidrocarburos, la ASEA puede pedirlo en cualquier inspección o auditoría. Lo recomendable es armarlo cuanto antes y empezar el primer ciclo de detección y reparación de fugas." },
  { question: "¿Puedo hacer el LDAR con personal propio?", answer: "Sí, si cuentas con el equipo (cámara acústica, láser de metano) y con un método que genere evidencia trazable. Muchas empresas lo contratan con un tercero para no comprar el equipo y para tener un registro independiente." },
];

export default function GuiaPpciem() {
  return (
    <main>
      <JsonLd data={createArticleSchema({ headline: TITULO, description: DESCRIPCION, image: OG_IMAGE, datePublished: "2026-09-26", category: "Detección de fugas de gas" })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Detección de fugas de gas", url: "/servicios/deteccion-gas" },
        { name: "Guía del PPCIEM", url: URL },
      ])} />
      <JsonLd data={createFaqSchema(FAQ)} />

      <section className="w-full bg-[#00202f] pb-14 pt-36 text-white lg:pb-20 lg:pt-44">
        <div className="mx-auto max-w-3xl px-6">
          <nav aria-label="Migas" className="mb-6 font-mono text-[11px] text-white/45">
            <Link href="/" className="hover:text-white">Inicio</Link> / <Link href="/servicios/deteccion-gas" className="hover:text-white">Detección de gas</Link> / <span className="text-white/70">Guía del PPCIEM</span>
          </nav>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Guía · Emisiones de metano</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight lg:text-5xl">{TITULO}</h1>
          <p className="mt-5 text-justify text-lg leading-relaxed text-white/75">
            Para quien está en seguridad, medio ambiente o cumplimiento y necesita saber qué pide la ASEA, cómo se organiza el año y qué evidencia guardar.
          </p>
        </div>
      </section>

      <article className="w-full bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6">
          {SECCIONES.map((s, i) => (
            <section key={s.titulo} className={i ? "mt-12" : ""}>
              <h2 className="text-2xl font-extrabold leading-snug text-primary lg:text-3xl">{s.titulo}</h2>
              {s.parrafos.map((p) => (
                <p key={p.slice(0, 30)} className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{p}</p>
              ))}
            </section>
          ))}

          <section className="mt-12">
            <h2 className="text-2xl font-extrabold leading-snug text-primary lg:text-3xl">Preguntas frecuentes</h2>
            <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
              {FAQ.map((f) => (
                <details key={f.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-primary [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <span aria-hidden="true" className="shrink-0 text-2xl font-extrabold text-secondary transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-justify text-base leading-relaxed text-tertiary lg:text-lg">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <aside className="mt-12 rounded-sm bg-primary p-6 text-white lg:p-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Lo resolvemos</p>
            <p className="mt-2 text-2xl font-extrabold leading-snug">Programa LDAR trimestral con cámara acústica y láser TDLAS</p>
            <p className="mt-2 text-justify text-base leading-relaxed text-white/75">Inspección, confirmación, plan de reparación, reinspección y el expediente de cada fuga, listo para tu reporte anual ante la ASEA.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/servicios/deteccion-gas" className="inline-flex items-center justify-center rounded-xs bg-secondary px-6 py-3 font-bold text-primary transition-colors hover:bg-white">
                Ver el servicio
              </Link>
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent("Hola, leí la guía del PPCIEM y quiero información sobre el programa LDAR trimestral.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xs border-2 border-white/60 px-6 py-2.5 font-bold text-white transition-colors hover:bg-white hover:text-primary"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </aside>

          <p className="mt-8 text-justify text-sm leading-relaxed text-tertiary/80">
            Esta guía es informativa y resume la práctica del PPCIEM. No sustituye la lectura de las disposiciones vigentes de la ASEA ni de tu propio programa, que son las que fijan las obligaciones y los plazos de tu instalación.
          </p>
        </div>
      </article>
    </main>
  );
}
