/**
 * CourseTypeSection Component
 * Card que agrupa cursos por tipo con scroll vertical
 */

'use client';

import { Course } from '@/types/course';
import CourseCard from '@/components/molecules/CourseCard';

interface CourseTypeSectionProps {
    title: string;
    courses: Course[];
    loading?: boolean;
}

export default function CourseTypeSection({ title, courses, loading = false }: CourseTypeSectionProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-80 bg-gray-100 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return null;
    }

    return (
        <div className="p-6 flex flex-col h-full max-h-150">
            {/* Título del tipo de curso */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                {title}
                <span className="text-sm font-normal text-gray-500">({courses.length})</span>
            </h2>

            {/* Scroll container con altura fija */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
                <div className="space-y-4">
                    {courses.map((course) => (
                        <div key={course.id} className="shrink-0">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
        </div>
    );
}
