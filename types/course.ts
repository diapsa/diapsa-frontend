export interface Course {
    id: string;
    name: string;
    course_type: CourseType;
    provider: string;
    description: string;
    slug: string;
    next_date: string | Date;
    icon: string;
    reference_norm: string;
    duration: number;
}

export interface CourseType {
    id: string;
    name: string;
}

export interface CoursesFilters {
    courseType?: string
    per_page?: number;
    page?: number;
}

export interface CourseDetail {
    id: string;
    name: string;
    course_type: CourseType;
    description: string;
    objective: string;
    slug: string;
    next_date: string | Date;
    icon: string;
    referecne_norm: string;
    specification_objectives: string[];
    methodology: string;
    syllabus: string;
    duration: number;
    modality: string;
    requiresment: string[];
    certification: string;
    graduate_profile: string;
    technical_specification: string | File;

}