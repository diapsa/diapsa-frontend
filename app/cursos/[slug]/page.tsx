import React from "react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/organisms/PageHeader";
import CourseDetails from "@/components/organisms/CourseDetails";
import ContactForm from "@/components/organisms/ContactForm";
import type { Metadata } from "next";
import JsonLd, {
    createServiceSchema,
    createBreadcrumbSchema,
} from "@/components/atoms/JsonLd";
import { getCourseBySlug } from "@/lib/api/courses";


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

        return {
            title: `${course.name} | Cursos DIAPSA`,
            description: course.description,
            keywords: [
                course.name,
                course.provider
            ],
            alternates: {
                canonical: `/cursos/${slug}`,
            },
            openGraph: {
                title: `${course.name} | Grupo DIAPSA`,
                description: course.description,
                url: `/cursos/${slug}`,
                type: "website",
            },
        };
    } catch (error) {
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
        notFound();
    }

    const breadcrumbItems = [
        { name: "Inicio", url: "/" },
        { name: "Cursos", url: "/cursos" },
        { name: course.name, url: `/cursos/${course.slug}` },
    ];
    // Datos estructurados para el curso
    const courseJsonLd = createServiceSchema({
        name: course.name,
        description: course.description,
        serviceType: `Curso de ${course.course_type}`,
    });

    // Breadcrumbs para datos estructurados
    const breadcrumbJsonLd = createBreadcrumbSchema(breadcrumbItems);

    return (
        <main>
            <JsonLd data={courseJsonLd} />
            <JsonLd data={breadcrumbJsonLd} />

            <PageHeader
                title={course.name}
                subtitle={`${course.course_type.name} • ${course.provider}`}
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