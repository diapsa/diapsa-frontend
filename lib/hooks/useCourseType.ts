'use client';

import { CourseType } from "@/types/course";
import { useEffect, useState } from "react";
import { getCourseTypes } from "../api/courses";


let coursesTypesCache: CourseType[] | null = null;
let coursesTypesCacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000 //5 minutos

export function useCourseTypes() {
    const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCoursesTypes = async () => {
            //Verificar cache
            const now = Date.now();

            if (
                coursesTypesCache &&
                coursesTypesCacheTime &&
                now - coursesTypesCacheTime < CACHE_DURATION) {
                setCourseTypes(coursesTypesCache);
                setLoading(false);
                return
            }

            try {
                setLoading(true);
                setError(null);
                const data = await getCourseTypes();

                coursesTypesCache = data;
                coursesTypesCacheTime = now
                setCourseTypes(data);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Error al cargar tipos de curso');
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoursesTypes();

    }, []);
    return { courseTypes, loading, error };
}
