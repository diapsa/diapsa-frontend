import { notFound } from "next/navigation";
import PageHeader from "@/components/organisms/PageHeader";
import CourseDetails from "@/components/organisms/CourseDetails";
import ContactForm from "@/components/organisms/ContactForm";
import type { Metadata } from "next";
import CourseJsonLd from "@/components/molecules/CourseJsonLd";
import { getCourseBySlug } from "@/lib/api/courses";
import { SITE_CONFIG } from "@/lib/constants";


interface CoursePageProps {
    params: Promise<{ slug: string }>
}

// Generar metadata para SEO
export async function generateMetadata({
    params,
}: CoursePageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const course = await getCourseBySlug(slug);

        // El layout raíz aplica el template "%s | Grupo DIAPSA", así que el
        // <title> del documento solo lleva el nombre (la marca se agrega una
        // sola vez). Si el CMS trae meta_title se respeta tal cual (absolute).
        // Para redes sociales sí armamos el título con marca explícita.
        const description = course.meta_description ?? course.description;
        const brandedTitle = course.meta_title ?? `${course.name} | Grupo DIAPSA`;

        return {
            title: course.meta_title
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
    } catch {
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
    } catch {
        notFound();
    }

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

            <CourseDetails course={course} />

            {/* Formulario de contacto */}
            <section id="contacto" className="w-full bg-gray-50 ">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                            Solicita Información
                        </h2>
                        <p className="text-gray-600 text-lg">
                            ¿Interesado en este curso? Déjanos tus datos y nos pondremos en
                            contacto contigo.
                        </p>
                    </div>
                </div>
            </section>
            <ContactForm />
        </main>
    );
}