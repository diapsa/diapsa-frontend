import { notFound } from "next/navigation";
import PageHeader from "@/components/organisms/PageHeader";
import Antetitulo from "@/components/atoms/Antetitulo";
import Image from "next/image";
import type { Servicio } from "@/types/servicio";
import JsonLd, {
    createServiceSchema,
    createBreadcrumbSchema,
    createFaqSchema,
} from "@/components/atoms/JsonLd";
import ContactForm from "@/components/organisms/ContactForm";
import ServiceProof from "@/components/organisms/ServiceProof";
import ModosDeFalla from "@/components/organisms/ModosDeFalla";
import EscalaSeveridad from "@/components/organisms/EscalaSeveridad";
import FichaCompras from "@/components/organisms/FichaCompras";
import DiagramaServicio from "@/components/organisms/DiagramaServicio";
import ServicePuntos from "@/components/organisms/ServicePuntos";
import ServiceEntregable from "@/components/organisms/ServiceEntregable";
import CursosTeaser from "@/components/organisms/CursosTeaser";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import { getArticuloPorServicio } from "@/lib/recursos";

const OG_IMAGE = "/images/og-images/og-image-monitoreo-condicion.jpg";

// Lista de slugs disponibles
const serviceSlugs = [
    "termografia-infrarroja",
    "vibraciones-mecanicas",
    "analisis-de-aceite",
    "diagnostico-de-maquinaria",
    "analisis-de-ultrasonido",
    "estudios-electricos",
    "tierras-fisicas",
    "arco-electrico",
];

// Generar parámetros estáticos para pre-renderizado
export async function generateStaticParams() {
    return serviceSlugs.map((slug) => ({
        slug,
    }));
}

// Función para cargar datos del servicio
async function getServiceData(slug: string): Promise<Servicio | null> {
    try {
        const data = await import(`@/data/servicios/${slug}.json`);
        return data.default as Servicio;
    } catch {
        return null;
    }
}

// Generar metadata para SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const service = await getServiceData(slug);

    if (!service) {
        return {
            title: "Servicio no encontrado",
        };
    }

    const keywords = [
        service.header.title.toLowerCase(),
        "mantenimiento predictivo",
        "diagnóstico industrial",
        "México",
        "DIAPSA",
    ];

    // La descripción para Google puede ser más larga y vendedora que el
    // subtítulo visible del hero; por eso se separan.
    const descripcion = service.seoDescription ?? service.header.subtitle;

    return {
        title: service.header.title,
        description: descripcion,
        keywords,
        alternates: {
            canonical: `${SITE_CONFIG.baseUrl}/servicios/monitoreo-condicion/${slug}`,
        },
        openGraph: {
            title: `${service.header.title} | Grupo DIAPSA`,
            description: descripcion,
            url: `${SITE_CONFIG.baseUrl}/servicios/monitoreo-condicion/${slug}`,
            type: "website",
            locale: "es_MX",
            siteName: "Grupo DIAPSA",
            images: [
                {
                    url: OG_IMAGE,
                    width: 1200,
                    height: 630,
                    type: "image/jpeg",
                    alt: `${service.header.title} Grupo DIAPSA`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@grupodiapsa",
            title: `${service.header.title} | Grupo DIAPSA`,
            description: descripcion,
            images: [OG_IMAGE],
        },
    };
}

export default async function ServicePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const service = await getServiceData(slug);

    if (!service) {
        notFound();
    }

    // Datos estructurados para el servicio
    const serviceJsonLd = createServiceSchema({
        name: service.header.title,
        description: service.header.subtitle,
        image: service.content?.image || undefined,
        serviceType: service.header.title,
    });

    // Breadcrumbs para datos estructurados
    const breadcrumbItems = [
        { name: "Inicio", url: "/" },
        { name: "Servicios", url: "" },
        { name: service.header.title, url: `/servicios/monitoreo-condicion/${slug}` },
    ];
    const breadcrumbJsonLd = createBreadcrumbSchema(breadcrumbItems);
    // Solo si el JSON del servicio trae preguntas frecuentes.
    const faqJsonLd = service.faq?.length ? createFaqSchema(service.faq) : null;
    // Artículo del blog que trata el mismo tema, si existe.
    const articuloRelacionado = getArticuloPorServicio(`/servicios/monitoreo-condicion/${slug}`);
    const overviewTitle =
        service.content.title || `Servicio especializado de ${service.header.title}`;
    const overviewSubtitle =
        service.content.subtitle || service.header.subtitle;
    // Antes había un .slice(0, 3) que descartaba en silencio cualquier
    // contenido extra del JSON. Se renderizan todos: la cuadrícula de 3
    // columnas simplemente agrega renglones.
    const detailItems = service.content.items;
    // Foto que acompaña a los puntos clave; si el servicio no trae una
    // específica se usa la imagen principal del contenido.
    const fotoPuntos =
        service.fotoPuntos ??
        (service.content.image ? { src: service.content.image, alt: service.header.title } : undefined);

    // La página cuenta un argumento en orden: qué es, por qué medir, qué
    // detectamos, cómo lo calificamos, cómo trabajamos, qué recibes, cómo
    // contratar. El número se asigna al renderizar, así que las secciones
    // opcionales que un servicio no traiga no dejan huecos en la cuenta.
    let numero = 0;
    const paso = () => String(++numero).padStart(2, "0");

    return (
        <main>
            <JsonLd data={serviceJsonLd} />
            <JsonLd data={breadcrumbJsonLd} />
            {faqJsonLd && <JsonLd data={faqJsonLd} />}
            {/* Page Header with Breadcrumb */}
            <PageHeader
                title={service.header.title}
                subtitle={service.header.subtitle}
                breadcrumbs={service.breadcrumbs}
            />
            {/* Barra de cotización pegada al hero. Antes el primer botón de
                acción aparecía hasta después del FAQ, cuatro pantallas abajo;
                quien llega de Google decide en los primeros segundos. */}
            {service.cta && (
                <div className="w-full bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
                        {service.certificacion && (
                            <span className="text-tertiary text-sm font-semibold">
                                {service.certificacion}
                            </span>
                        )}
                        <a
                            href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(service.cta.whatsappMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-2.5 rounded-xs hover:bg-secondary hover:text-primary transition-all duration-300"
                        >
                            Cotizar por WhatsApp
                        </a>
                        <a
                            href="#contacto"
                            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-6 py-2 rounded-xs hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            Solicitar propuesta
                        </a>
                    </div>
                </div>
            )}
            {/* 01 Qué es. Antes eran dos secciones: esta, con un párrafo
                genérico y tres pasos numerados, y otra más abajo con los seis
                puntos clave y su propia foto. Los tres pasos repetían el flujo
                de trabajo que ya viene después, así que se quitaron, y los
                puntos se trajeron aquí: una sección, una foto. */}
            <section className="w-full bg-white py-12 lg:py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-10 max-w-3xl">
                        <Antetitulo paso={paso()}>Qué es</Antetitulo>
                        <h2 className="mt-2 text-3xl lg:text-[2.75rem] font-extrabold text-primary leading-tight">
                            {overviewTitle}
                        </h2>
                        <p className="mt-3 text-tertiary text-lg leading-relaxed text-justify">
                            {overviewSubtitle}
                        </p>
                    </div>
                    <ServicePuntos puntos={detailItems} foto={fotoPuntos} />
                </div>
            </section>

            <ServiceProof certificacion={service.certificacion} />

            {service.diagramas?.includes("curva-pf") && (
                <DiagramaServicio clave="curva-pf" paso={paso()} />
            )}

            {service.tabla && <ModosDeFalla tabla={service.tabla} paso={paso()} />}

            {/* Después de los modos de falla, porque la pregunta que sigue a
                "qué falla es" siempre es "¿y ese número es mucho?". */}
            {service.escalas && (
                <EscalaSeveridad
                    escalas={service.escalas.lista}
                    titulo={service.escalas.titulo}
                    subtitulo={service.escalas.subtitulo}
                    nota={service.escalas.nota}
                    paso={paso()}
                />
            )}

            {service.diagramas?.includes("flujo-servicio") && (
                <DiagramaServicio clave="flujo-servicio" paso={paso()} />
            )}

            {/* Qué recibes. Va después del flujo porque es su desenlace: el
                último paso del proceso es el informe, y aquí se enseña. */}
            {service.entregable && (
                <ServiceEntregable entregable={service.entregable} paso={paso()} />
            )}

            {/* Related Products */}
            {/* <RelatedProducts
                title={service.relatedProducts.title}
                subtitle={service.relatedProducts.subtitle}
                items={service.relatedProducts.items}
            /> */}

            {/* Evidencia visual: fotos reales de analistas de DIAPSA en campo.
                Valen más que cualquier adjetivo; vienen del JSON del servicio. */}
            {service.galeria && service.galeria.length > 0 && (
                <section className="w-full bg-gray-50 py-12 lg:py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-10">
                            <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-primary leading-tight">
                                DIAPSA <span className="text-secondary">en campo</span>
                            </h2>
                            <p className="text-tertiary text-lg mt-2 max-w-2xl text-justify">
                                Nuestros analistas, nuestros equipos y mediciones reales. Sin fotos de banco de imágenes.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                            {service.galeria.map((foto) => (
                                <div key={foto.src} className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-md">
                                    <Image
                                        src={foto.src}
                                        alt={foto.alt}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Va antes de las preguntas porque el comprador llega hasta
                aquí buscando exactamente esto y no debería tener que leer
                el FAQ completo para encontrarlo. */}
            {service.fichaCompras && <FichaCompras ficha={service.fichaCompras} paso={paso()} />}

            {/* Preguntas frecuentes: responden las búsquedas de cola larga
                ("qué es", "cada cuánto", "qué norma", "cuánto cuesta") y
                alimentan el schema FAQPage de arriba. <details> nativo:
                acordeón sin JavaScript y contenido siempre en el HTML. */}
            {service.faq && service.faq.length > 0 && (
                <section className="w-full bg-gray-50 py-12 lg:py-20">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-primary mb-10 leading-tight">
                            Preguntas <span className="text-secondary">frecuentes</span>
                        </h2>
                        <div className="divide-y divide-gray-200 border-y border-gray-200">
                            {service.faq.map((item) => (
                                <details key={item.question} className="group py-5">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-primary [&::-webkit-details-marker]:hidden">
                                        {item.question}
                                        <span
                                            aria-hidden="true"
                                            className="shrink-0 text-secondary text-2xl font-extrabold transition-transform duration-200 group-open:rotate-45"
                                        >
                                            +
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-tertiary text-base lg:text-lg leading-relaxed text-justify">
                                        {item.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Artículo del blog sobre el mismo tema. Sirve al lector que
                todavía está aprendiendo y no listo para cotizar, y enlaza dos
                páginas que competían por la misma búsqueda sin apoyarse. */}
            {articuloRelacionado && (
                <section className="w-full bg-white py-12 lg:py-16">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="rounded-sm border-l-4 border-secondary bg-white p-6 lg:p-8 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                                Guía relacionada
                            </p>
                            <h2 className="mt-2 text-2xl lg:text-3xl font-extrabold text-primary leading-snug">
                                {articuloRelacionado.titulo}
                            </h2>
                            <p className="mt-3 text-tertiary text-base lg:text-lg leading-relaxed text-justify">
                                {articuloRelacionado.resumen}
                            </p>
                            <Link
                                href={`/blog/${articuloRelacionado.slug}`}
                                className="mt-5 inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-6 py-2.5 rounded-xs hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                Leer la guía
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Llamado a la acción específico del servicio. Va justo después
                del FAQ porque la última pregunta ("¿cuánto cuesta?") deja al
                lector a un paso de pedir cotización: WhatsApp para el que
                escribe, ancla al formulario para el que prefiere correo. */}
            {service.cta && (
                <section className="w-full bg-secondary py-14 lg:py-20">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-primary mb-4 leading-tight">
                            {service.cta.title}
                        </h2>
                        <p className="text-primary/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8 text-justify">
                            {service.cta.text}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(service.cta.whatsappMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xs hover:bg-white hover:text-primary transition-all duration-300 shadow-md"
                            >
                                Cotizar por WhatsApp
                            </a>
                            <a
                                href="#contacto"
                                className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3 rounded-xs hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                Prefiero el formulario
                            </a>
                        </div>
                    </div>
                </section>
            )}


            <CursosTeaser />

            {/* <CoursesPromo /> */}
            <section id="contacto">
                <ContactForm />
            </section>
        </main>
    );
}
