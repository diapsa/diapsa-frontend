import JsonLd, {
    createBreadcrumbSchema,
    createCourseSchema,
    createFaqSchema,
} from "@/components/atoms/JsonLd";
import type { CourseDetail } from "@/types/course";

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface CourseJsonLdProps {
    course: CourseDetail;
    /** Debe reflejar el breadcrumb visual del PageHeader. */
    breadcrumbItems: BreadcrumbItem[];
    /** Ruta canónica del curso (ej: /cursos/{slug}). */
    url: string;
}

/**
 * Datos estructurados reutilizables para el template de cursos.
 * Emite schema.org/Course, BreadcrumbList y, cuando el curso tiene FAQs,
 * schema.org/FAQPage. Todo se puebla con datos reales del CMS.
 */
export default function CourseJsonLd({
    course,
    breadcrumbItems,
    url,
}: CourseJsonLdProps) {
    const courseSchema = createCourseSchema({
        name: course.name,
        description: course.description,
        url: `https://grupodiapsa.com${url}`,
        provider: "Grupo DIAPSA",
        courseModes: ["Onsite", "Online"],
        duration: course.duration,
    });

    const breadcrumbSchema = createBreadcrumbSchema(breadcrumbItems);

    // Solo se emite FAQPage cuando el CMS entrega FAQs con pregunta y respuesta.
    const faqs = (course.faqs ?? []).filter(
        (faq) => faq?.question?.trim() && faq?.answer?.trim()
    );

    return (
        <>
            <JsonLd data={courseSchema} />
            <JsonLd data={breadcrumbSchema} />
            {faqs.length > 0 && <JsonLd data={createFaqSchema(faqs)} />}
        </>
    );
}
