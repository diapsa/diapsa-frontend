import { Category } from "./category";


export interface Course {
    id: string;
    name: string;
    alt_img: string;
    url_img: string;
    category: Category;
    provider: string;
    description: string;
    slug: string;
    next_date: string | Date;
    icon: string;
    reference_norm: string;
    duration: number;
    modality?: string;
}

export interface CourseType {
    id: string;
    name: string;
    slug: string;
}

export interface GroupedCourses {
    certificates: Course[];
    workshops: Course[];
    strategics: Course[];
}

export interface CoursesFilters {
    courseType?: string
    per_page?: number;
    page?: number;
}

/**
 * Pregunta frecuente de un curso (schema.org/FAQPage).
 * El CMS aún no expone este campo; el template lo soporta cuando exista.
 */
export interface CourseFaq {
    question: string;
    answer: string;
}

export interface CourseDetail {
    id: string;
    name: string;
    category: Category;
    description: string;
    objective: string;
    slug: string;
    next_date: string | Date;
    icon: string;
    reference_norm: string;
    specific_objectives: string[];
    methodology: string;
    syllabus: string;
    duration: number;
    modality: string;
    requirements: string[];
    certification: string;
    graduate_profile: string;
    technical_specification: string;
    provider: string;
    // Campos SEO opcionales: el template los usa si el CMS los provee.
    meta_title?: string;
    meta_description?: string;
    faqs?: CourseFaq[];
}
