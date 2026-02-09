'use client';

import { useState, useEffect } from "react";
import { getCourses } from "../api/courses";
import type { Course, CoursesFilters } from "@/types/course";
import { PaginationMeta } from "@/types/api";

interface UseCoursesResult {
    courses: Course[];
    meta: PaginationMeta | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useCourses(filters: CoursesFilters = {}): UseCoursesResult {
    const [courses, setCourses] = useState<Course[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoding] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const filtersKey = JSON.stringify(filters);

    const fetchCourses = async () => {
        setLoding(true);
        setError(null);

        try {
            const response = await getCourses(filters);
            setCourses(response.data)
            setMeta(response.meta)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error al cargar cursos'));
            setCourses([]);
            setMeta(null);
        } finally {
            setLoding(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [filtersKey]);
    return {
        courses,
        meta,
        loading,
        error,
        refetch: fetchCourses,
    };
}