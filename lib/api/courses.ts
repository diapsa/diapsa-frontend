/**
 * Products API
 * Functions to consume product endpoints from cms.grupodiapsa.com.mx
 */

import { apiFetch } from "./config";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Category } from "@/types/category";
import type {
    Course,
    CourseDetail,
    CoursesFilters,
    CourseType
} from '@/types/course';

/**
 * Get all courses 
 * 
 */
export async function getCourses(
    filters: CoursesFilters = {}
): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams();

    // Filtro por tipo de curso
    if (filters.courseType) params.append('courseType', filters.courseType);

    // Paginación
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const queryString = params.toString();
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;

    return apiFetch<PaginatedResponse<Course>>(endpoint);
}
/**
 * 
 * Get course by slug 
 * GET /api/v1/courses/{slug}
 */
export async function getCourseBySlug(
    slug: string
): Promise<CourseDetail> {
    const response = await apiFetch<ApiResponse<CourseDetail>>(
        `/courses/${slug}`
    );

    return response.data
}
/**
 * Get All courses types
 * GET /api/v1/course-types/
 */
export async function getCourseCategories(): Promise<Category[]> {
    const response = await apiFetch<ApiResponse<Category[]>>('/course-categories');
    return response.data;
}
/**
 * Get course type by slug
 * GET /api/v1/course-types/{slug}
 */
export async function getCourseCategoriesBySlug(slug: string): Promise<Category> {
    const response = await apiFetch<ApiResponse<Category>>(`/course-categories/${slug}`);
    return response.data;
}

export async function getNextCourse() {
    const response = await apiFetch<ApiResponse<CourseDetail>>('/courses/next');
    return response.data;
}