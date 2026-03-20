'use client';

import { CourseType } from "@/types/course";
import { useEffect, useState } from "react";
import { getCourseCategories } from "../api/courses";
import { Category } from "@/types/category";


let coursesCategoriesCache: Category[] | null = null;
let coursesCategoriesCacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000 //5 minutos

export function useCourseCategories() {
    const [courseCategories, setCourseCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCoursesCategories = async () => {
            //Verificar cache
            const now = Date.now();

            if (
                coursesCategoriesCache &&
                coursesCategoriesCacheTime &&
                now - coursesCategoriesCacheTime < CACHE_DURATION) {
                setCourseCategories(coursesCategoriesCache);
                setLoading(false);
                return
            }

            try {
                setLoading(true);
                setError(null);
                const data = await getCourseCategories();

                coursesCategoriesCache = data;
                coursesCategoriesCacheTime = now
                setCourseCategories(data);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Error al cargar tipos de curso');
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoursesCategories();

    }, []);
    return { courseCategories, loading, error };
}
