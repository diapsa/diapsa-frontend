import { notFound } from "next/navigation";
import PageHeader from "@/components/organisms/PageHeader";
import CursoDetalle from "@/components/organisms/CursoDetalle";
import ContactForm from "@/components/organisms/ContactForm";
import type { Metadata } from "next";
import CourseJsonLd from "@/components/molecules/CourseJsonLd";
import { getCourseBySlug, getCourses } from "@/lib/api/courses";
import { extraDe, seoDe } from "@/lib/cursos";
import { SITE_CONFIG } from "@/lib/constants";
import { esNoEncontrado } from "@/lib/api/config";


interface CoursePageProps {
    params: Promise<{ slug: string }>
}

// La ficha se sirve desde el caché y se rehace cada hora, como la portada y
// /servicios (2026-11-15): sin generateStaticParams Next la marcaba dinámica
// (ƒ), con "Cache-Control: no-store" y 0.6 a 1.2 s por visita. Devuelve []
// para no pedirle cada curso al CMS en el build (limita peticiones, 429): cada
// ficha se genera con su primer visitante y las siguientes salen del caché.
export const revalidate = 3600;

export function generateStaticParams() {
    return [];
}

// Generar metadata para SEO
export async function generateMetadata({
    params,
}: CoursePageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const course = await getCourseBySlug(slug);

        // El layout raíz aplica el template "%s | DIAPSA", así que el
        // <title> del documento solo lleva el nombre (la marca se agrega una
        // sola vez). Si el CMS trae meta_title se respeta tal cual (absolute).
        // Para redes sociales sí armamos el título con marca explícita.
        // Sobreescritura del sitio (2026-11-15, Search Console 16 oct a 12 nov:
        // el curso de certificación de termografía en el puesto 35 con el nombre
        // del CMS). Si data/cursos-extra.json trae "seo" para el slug, manda sobre
        // el CMS; si no, todo sigue igual.
        const seo = seoDe(slug);
        const description = seo?.descripcion ?? course.meta_description ?? course.description;
        const brandedTitle = seo?.titulo
            ? `${seo.titulo} | Grupo DIAPSA`
            : course.meta_title ?? `${course.name} | Grupo DIAPSA`;

        return {
            title: seo?.titulo
                ? seo.titulo
                : course.meta_title
                ? { absolute: course.meta_title }
                : course.name,
            description,
            keywords: [
                course.name,
                course.provider
            ],
            alternates: {
                canonical: `${SITE_CONFIG.baseUrl}/cursos/${slug}`,
            },
            openGraph: {
                title: brandedTitle,
                description,
                url: `${SITE_CONFIG.baseUrl}/cursos/${slug}`,
                type: "website",
            },
        };
    } catch (error) {
        // Solo un 404 real del CMS es "no encontrado" (2026-11-15); un timeout o
        // un 429 se relanza para que ese título no se quede guardado en caché.
        if (!esNoEncontrado(error)) throw error;
        return {
            title: 'Curso no encontrado'
        };
    }
}

// Componente principal
export default async function CoursePage({
    params,
}: CoursePageProps) {
    const { slug } = await params;

    let course;
    try {
        course = await getCourseBySlug(slug)
    } catch (error) {
        // notFound() solo si el CMS dice 404 (2026-11-15). Con el sitemap pedido
        // de ocho en ocho, 15 cursos que existen salieron en 404 por errores
        // pasajeros del CMS; ahora se relanzan y Next sirve la versión en caché
        // o un 5xx que Google reintenta.
        if (!esNoEncontrado(error)) throw error;
        notFound();
    }

    // Otros cursos de la misma técnica, para seguir la ruta
    const tecnica = extraDe(course.slug)?.tecnica;
    const lista = tecnica
        ? await getCourses({ per_page: 50 }).then((r) => r.data).catch(() => [])
        : [];
    const relacionados = lista.filter((c) => c.slug !== course.slug && extraDe(c.slug)?.tecnica === tecnica);

    const breadcrumbItems = [
        { name: "Inicio", url: "/" },
        { name: "Cursos", url: "/cursos" },
        { name: course.name, url: `/cursos/${course.slug}` },
    ];

    return (
        <main>
            {/* Datos estructurados: Course + BreadcrumbList + FAQPage (si hay FAQs) */}
            <CourseJsonLd
                course={course}
                breadcrumbItems={breadcrumbItems}
                url={`/cursos/${course.slug}`}
            />

            <PageHeader
                title={course.name}
                subtitle={`${course.category?.name ?? ''} • ${course.provider}`}
                breadcrumbs={breadcrumbItems.map((item) => ({
                    label: item.name,
                    link: item.url,
                }))}
            />

            <CursoDetalle curso={course} relacionados={relacionados} />

            {/* Inscripción: el formulario ya llega con este curso marcado */}
            <section id="contacto" className="w-full">
                <div className="w-full bg-secondary px-6 py-10 text-center lg:py-12">
                    <h2 className="text-3xl font-extrabold leading-tight text-primary lg:text-4xl">
                        Inscríbete o pide información
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-justify text-lg leading-relaxed text-primary/80">
                        Déjanos tus datos y te respondemos con la próxima fecha, el costo y la forma de inscripción de {course.name}.
                    </p>
                </div>
                <ContactForm curso={course.name} />
            </section>
        </main>
    );
}