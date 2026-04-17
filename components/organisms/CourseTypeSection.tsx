/**
 * CourseTypeSection Component
 * Agrupa cursos por tipo con layouts diferenciados
 * 
 * Estrategia de storytelling:
 * - Certificados: "Validación Profesional" - Confianza, reconocimiento ISO
 * - Talleres: "Experiencia Práctica" - Acción, aprendizaje haciendo
 * - Estratégicos: "Fundamentos Accesibles" - Acceso, punto de partida
 */

'use client';

import { Course } from '@/types/course';
import CourseCard from '@/components/molecules/CourseCard';

interface CourseTypeSectionProps {
    title: string;
    subtle?: string
    courses: Course[];
    loading?: boolean;
    variant?: 'certificado' | 'taller' | 'estrategico'
}


export default function CourseTypeSection({ title, courses, loading = false, subtle, variant = 'certificado' }: CourseTypeSectionProps) {
    const layouts: Record<NonNullable<CourseTypeSectionProps['variant']>, React.ReactElement> = {
        certificado: <CertificatesCoursesSection courses={courses} title={title} loading={loading} subtle={subtle} variant={variant} />,
        taller: <WorkshopsSection courses={courses} title={title} loading={loading} subtle={subtle} variant={variant} />,
        estrategico: <StrategicCoursesSection courses={courses} title={title} loading={loading} subtle={subtle} variant={variant} />
    }

    return layouts[variant]

}

/**
 * CertificatesCoursesSection - "Validación Profesional"
 * Cursos certificados por ISO - Profesionalismo y confianza
 */
function CertificatesCoursesSection({ title, courses, loading = false, subtle, variant }: CourseTypeSectionProps) {
    if (loading) {
        return (
            <div className="px-4 md:px-8 py-8 flex flex-col h-full space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return null;
    }

    return (
        <section className="px-4 md:px-8 py-8 md:py-12 space-y-8">
            {/* Header con storytelling */}
            <div className="border-l-4 border-primary pl-4 md:pl-6">
                <div className="inline-block bg-primary text-white px-4 py-2 rounded-lg mb-3">
                    <span className='text-xs font-bold uppercase tracking-widest'>✓ Validación Profesional</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    {title}
                    <span className="text-base md:text-lg font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {courses.length}
                    </span>
                </h2>
                {subtle && (
                    <p className='text-gray-700 text-sm max-w-3xl mt-3'>{subtle}</p>
                )}
                <p className='text-gray-600 text-sm mt-4'>
                    Cursos certificados por ISO que te proporcionan credenciales reconocidas internacionalmente.
                    Diseñados para profesionales que buscan validar su expertise.
                </p>
            </div>

            {/* Grid de cursos - responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="h-full">
                        <CourseCard course={course} variant={variant} />
                    </div>
                ))}
            </div>
        </section>
    );
}

/**
 * WorkshopsSection - "Experiencia Práctica"
 * Talleres prácticos - Acción inmediata, aprendizaje haciendo
 */
function WorkshopsSection({ title, courses, loading = false, subtle, variant }: CourseTypeSectionProps) {
    if (loading) {
        return (
            <div className="px-4 md:px-8 py-8 flex flex-col h-full space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return null;
    }

    return (
        <section className="px-4 md:px-8 py-8 md:py-12 space-y-8">
            {/* Header con storytelling */}
            <div className="border-l-4 border-secondary pl-4 md:pl-6">
                <div className="inline-block bg-secondary text-primary px-4 py-2 rounded-lg mb-3 font-bold">
                    <span className='text-xs uppercase tracking-widest'>⚡ Experiencia Práctica</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    {title}
                    <span className="text-base md:text-lg font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {courses.length}
                    </span>
                </h2>
                {subtle && (
                    <p className='text-gray-700 text-sm max-w-3xl mt-3'>{subtle}</p>
                )}
                <p className='text-gray-600 text-sm mt-4'>
                    Talleres dinámicos donde aprendes haciendo. Desarrolla habilidades prácticas inmediatas
                    en un ambiente colaborativo y orientado a resultados.
                </p>
            </div>

            {/* Grid de cursos - responsivo */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                {courses.map((course) => (
                    <div key={course.id} className="h-full">
                        <CourseCard course={course} variant={variant} />
                    </div>
                ))}
            </div>
        </section>
    );
}

/**
 * StrategicCoursesSection - "Fundamentos Accesibles"
 * Cursos estratégicos - Punto de partida, acceso bajo riesgo
 */
function StrategicCoursesSection({ title, courses, loading = false, subtle, variant }: CourseTypeSectionProps) {
    if (loading) {
        return (
            <div className="px-4 md:px-8 py-8 flex flex-col h-full space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return null;
    }

    return (
        <section className="px-4 md:px-8 py-8 md:py-12 space-y-8">
            {/* Header con storytelling */}
            <div className="border-l-4 border-tertiary pl-4 md:pl-6">
                <div className="inline-block bg-tertiary text-white px-4 py-2 rounded-lg mb-3">
                    <span className='text-xs font-bold uppercase tracking-widest'>🎯 Tu Punto de Partida</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    {title}
                    <span className="text-base md:text-lg font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {courses.length}
                    </span>
                </h2>
                {subtle && (
                    <p className='text-gray-700 text-sm max-w-3xl mt-3'>{subtle}</p>
                )}
                <p className='text-gray-600 text-sm mt-4'>
                    Cursos fundamentales ideales para comenzar tu formación en mantenimiento predictivo.
                    Accesibles, claros y diseñados como introducción perfecta.
                </p>
            </div>

            {/* Grid de cursos - responsivo */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                {courses.map((course) => (
                    <div key={course.id} className="h-full">
                        <CourseCard course={course} variant={variant} />
                    </div>
                ))}
            </div>
        </section>
    );
}
