import { Course, GroupedCourses } from "@/types/course";

export function groupCoursesByType(courses: Course[]): GroupedCourses {
    const certificates: Course[] = []
    const workshops: Course[] = []
    const strategics: Course[] = []

    courses.forEach((course) => {
        const type = course.category.name

        switch (type) {
            case 'certificados':
            case 'certificado':
            case 'Certificación':
                certificates.push(course);
                break;
            case 'Taller':
            case 'talleres':
                workshops.push(course);
                break;
            case 'Estrategico':
            case 'estrategico':
                strategics.push(course);
        }
    })
    return {
        certificates,
        workshops,
        strategics
    }
}