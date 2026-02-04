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

// Interfaz para el curso
interface Course {
    id: number;
    name: string;
    slug: string;
    tipo_curso: string;
    icono: string;
    provider: string;
    contenido: {
        descripcion_general: string;
        normativa_referencia: string | null;
        objetivo_general: string;
        objetivos_especificos: string[] | null;
        metodologia: string;
        temario: string[];
        duracion: string | null;
        modalidad: string;
        requisitos: string[];
        evaluacion: string | null;
        certificacion: string | null;
        perfil_egreso: string | null;
        publico_objetivo?: string | null;
        instructor_profile?: string | null;
    };
}

// Cargar datos del curso
async function getCourseData(slug: string): Promise<Course | null> {
    try {
        const data = await import("@/data/cursos/new.json");
        const courses = data.courses as Course[];
        const course = courses.find((c) => c.slug === slug);
        return course || null;
    } catch (error) {
        return null;
    }
}

// Generar parámetros estáticos para pre-renderizado
export async function generateStaticParams() {
    try {
        const data = await import("@/data/cursos/new.json");
        const courses = data.courses as Course[];
        return courses.map((course) => ({
            slug: course.slug,
        }));
    } catch (error) {
        return [];
    }
}

// Generar metadata para SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourseData(slug);

    if (!course) {
        return {
            title: "Curso no encontrado",
        };
    }

    const keywords = [
        course.name.toLowerCase(),
        "curso",
        course.tipo_curso.toLowerCase(),
        "mantenimiento predictivo",
        "capacitación",
        "certificación",
        "México",
        "DIAPSA",
    ];

    return {
        title: `${course.name} | Cursos DIAPSA`,
        description: course.contenido.descripcion_general,
        keywords,
        alternates: {
            canonical: `/cursos/${slug}`,
        },
        openGraph: {
            title: `${course.name} | Grupo DIAPSA`,
            description: course.contenido.descripcion_general,
            url: `/cursos/${slug}`,
            type: "website",
        },
    };
}

// Componente principal
export default async function CoursePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const course = await getCourseData(slug);

    if (!course) {
        notFound();
    }

    // Datos estructurados para el curso
    const courseJsonLd = createServiceSchema({
        name: course.name,
        description: course.contenido.descripcion_general,
        serviceType: `Curso de ${course.tipo_curso}`,
    });

    // Breadcrumbs para datos estructurados
    const breadcrumbItems = [
        { name: "Inicio", url: "/" },
        { name: "Cursos", url: "/cursos" },
        { name: course.name, url: `/cursos/${slug}` },
    ];
    const breadcrumbJsonLd = createBreadcrumbSchema(breadcrumbItems);

    return (
        <main>
            <JsonLd data={courseJsonLd} />
            <JsonLd data={breadcrumbJsonLd} />

            <PageHeader
                title={course.name}
                subtitle={`${course.tipo_curso} • ${course.provider}`}
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