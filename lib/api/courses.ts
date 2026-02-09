/**
 * Products API
 * Functions to consume product endpoints from cms.grupodiapsa.com.mx
 */

import { apiFetch } from "./config";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
    Course,
    CourseDetail,
    CoursesFilters
} from '@/types/course';


export async function getCourses(
    filters: CoursesFilters = {}
): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams();

    if (filters.courseType) params.append('cursoType', filters.courseType);

    const queryString = params.toString();
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;

    return apiFetch<PaginatedResponse<Course>>(endpoint);
}

export async function getCourseBySlug(
    slug: string
): Promise<CourseDetail> {
    const response = await apiFetch<ApiResponse<CourseDetail>>(
        `/courses/${slug}`
    );

    return response.data
}