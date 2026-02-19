/**
 * CourseCard Component
 * Tarjeta individual de curso con diseño similar a Udemy
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types/course';

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <Link
            href={`/cursos/${course.slug}`}
            className="block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 overflow-hidden h-full"
        >
            <div className="flex gap-4 p-4">
                {/* Imagen del curso */}
                <div className="relative w-32 h-24 shrink-0 bg-linear-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
                    <Image
                        src="/images/fondo-mantenimiento.webp"
                        alt={course.name}
                        fill
                        className="object-cover opacity-80"
                        sizes="128px"
                    />
                    {/* Overlay de degradado para mejor legibilidad */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    {/* Nombre del curso */}
                    <h3 className="font-bold text-gray-900  mb-1 line-clamp-2">
                        {course.name}
                    </h3>

                    {/* Proveedor */}
                    <p className="text-sm text-gray-600 mb-2">
                        {course.provider}
                    </p>

                    {/* Descripción */}
                    <p className="text-gray-700 line-clamp-2 mb-2">
                        {course.description}
                    </p>

                    {/* Metadata adicional */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        {course.duration && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {course.duration}h
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="truncate">{course.course_type.name}</span>
                        </span>
                    </div>
                </div>

                {/* Indicador de ver más */}
                <div className="flex items-center shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
