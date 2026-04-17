/**
 * CourseCard Component
 * Tarjeta individual de curso con diseño variante segun tipo de certificado
 * 
 * Estrategia de storytelling:
 * - Certificados: "Tu credencial ISO" - Validación profesional
 * - Talleres: "Aprende haciendo" - Experiencia práctica
 * - Estratégicos: "Tu punto de partida" - Fundamentos accesibles
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Course } from '@/types/course';
import { minutesToTimeString } from '@/lib/utils/time';

interface CourseCardProps {
    course: Course;
    variant?: 'certificado' | 'taller' | 'estrategico'
}

export default function CourseCard({ course, variant = 'certificado' }: CourseCardProps) {
    const layouts: Record<NonNullable<CourseCardProps['variant']>, React.ReactElement> = {
        certificado: <CertificateLayout course={course} />,
        taller: <WorkshopLayout course={course} />,
        estrategico: <StrategicLayout course={course} />,
    };
    return layouts[variant];
}

/**
 * CertificateLayout - "Tu credencial ISO"
 * Positioning: Validación profesional, confianza, reconocimiento internacional
 * Visual: Formal, azul primario dominante, ISO badge prominente
 */
function CertificateLayout({ course }: { course: Course }) {
    const formatDate = (date: string | Date) => {
        try {
            const d = new Date(date);
            return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
        } catch {
            return 'Pronto';
        }
    };

    return (
        <Link href={`/cursos/${course.slug}`}
            className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-secondary/30 transition-all duration-300 overflow-hidden group"
        >
            {/* Header con badge ISO */}
            <div className='bg-primary text-white px-4 py-2 flex items-center justify-between'>
                <span className='text-xs font-bold uppercase tracking-wide'>Certificado</span>
                <span className='text-xs font-bold px-2 py-1 bg-secondary/20 rounded text-yellow-200'>ISO {course.reference_norm || 'ISO'}</span>
            </div>

            {/* Imagen */}
            <div className='relative w-full h-40 bg-linear-to-br from-primary/10 to-secondary/5 overflow-hidden'>
                {course.image ? (
                    <Image
                        src={course.image}
                        alt={course.name}
                        fill
                        className="object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                        sizes="200px"
                    />
                ) : (
                    <Image
                        src="/images/fondo-mantenimiento.webp"
                        alt={course.name}
                        fill
                        className="object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                        sizes="200px"
                    />
                )}
                {/* Overlay para legibilidad */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all"></div>
            </div>

            {/* Contenido */}
            <div className='p-5 flex flex-col space-y-4 flex-1'>
                {/* Nombre */}
                <h3 className='font-bold text-gray-900 text-base leading-snug line-clamp-2'>
                    {course.name}
                </h3>

                {/* Descripción */}
                <p className='text-gray-600 text-sm line-clamp-2'>
                    {course.description}
                </p>

                {/* Metadata - Duración y próxima fecha */}
                <div className='space-y-3 pt-2 border-t border-gray-100'>
                    <div className='flex items-center justify-between text-xs text-gray-700'>
                        {course.duration && (
                            <span className='flex items-center gap-1'>
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                                </svg>

                                {minutesToTimeString(course.duration)}
                            </span>
                        )}
                        {course.next_date && (

                            <span className='flex items-center gap-1 bg-secondary/10 text-secondary font-semibold px-2 py-1 rounded'>
                                📅 {formatDate(course.next_date)}
                            </span>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <span className='mt-auto flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary text-white font-semibold text-sm rounded-lg group-hover:bg-secondary group-hover:text-primary transition-all duration-300'>
                    Ver programa completo
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </Link>
    )
}

/**
 * StrategicLayout - "Tu punto de partida"
 * Positioning: Fundamentos accesibles, bajo riesgo, introducción
 * Visual: Limpio, accesible, categoría prominente, diseño minimalista
 */
function StrategicLayout({ course }: { course: Course }) {
    const formatDate = (date: string | Date) => {
        try {
            const d = new Date(date);
            return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: '2-digit' });
        } catch {
            return 'Próximamente';
        }
    };

    return (
        <Link
            href={`/cursos/${course.slug}`}
            className="flex flex-col h-full bg-white border border-gray-200 rounded-xl hover:border-tertiary hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
            {/* Header - Categoría prominente (Tu punto de partida) */}
            <div className='bg-tertiary/5 border-b border-tertiary/20 px-4 py-2 flex items-center justify-between'>
                <span className='text-xs font-bold uppercase tracking-wide text-tertiary'>Estratégico</span>
                {course.category?.name && (
                    <span className='text-xs font-semibold text-primary bg-primary/5 px-2 py-1 rounded'>
                        {course.category.name}
                    </span>
                )}
            </div>

            {/* Contenido principal */}
            <div className='p-6 flex flex-col space-y-4 flex-1'>
                {/* Nombre - Clear y prominente */}
                <h3 className='font-bold text-gray-900 text-base leading-snug group-hover:text-primary transition-colors'>
                    {course.name}
                </h3>

                {/* Descripción - Contexto */}
                <p className='text-gray-600 text-sm line-clamp-3'>
                    {course.description}
                </p>

                {/* Divider */}
                <div className='border-t border-gray-100'></div>

                {/* Metadata - Acciones y detalles */}
                <div className='space-y-2 pt-2 flex-1'>
                    {/* Duración - Compromiso claro */}
                    {course.duration && (
                        <div className='flex items-center gap-2 text-sm'>
                            <span className='text-lg'>⏱️</span>
                            <span className='font-semibold text-gray-900'>{minutesToTimeString(course.duration)}</span>
                            <span className='text-gray-500 text-xs'>de aprendizaje</span>
                        </div>
                    )}

                    {/* Próxima fecha - solo si existe y es válida */}
                    {course.next_date && !isNaN(new Date(course.next_date).getTime()) && (
                        <div className='flex items-center gap-2 text-sm'>
                            <span className='text-lg'>📅</span>
                            <div className='flex-1'>
                                <span className='text-gray-500 text-xs'>Próxima sesión:</span>
                                <span className='font-semibold text-primary block'>{formatDate(course.next_date)}</span>
                            </div>
                        </div>
                    )}

                    {/* Proveedor - Credibilidad */}
                    {course.provider && (
                        <div className='flex items-center gap-2 text-xs text-gray-600'>
                            <span>🏢</span>
                            <span>{course.provider}</span>
                        </div>
                    )}
                </div>

                {/* CTA - Explorar */}
                <span className='mt-auto flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary/5 text-primary font-semibold text-sm rounded-lg group-hover:bg-primary group-hover:text-white transition-all duration-300'>
                    Explorar curso
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </Link>
    )
}

/**
 * WorkshopLayout - "Aprende haciendo"
 * Positioning: Experiencia práctica, acción inmediata, resultados tangibles
 * Visual: Dinámico, naranja secondary, horizontal, energía visual
 */
function WorkshopLayout({ course }: { course: Course }) {
    const formatDate = (date: string | Date) => {
        try {
            const d = new Date(date);
            return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
        } catch {
            return 'Pronto';
        }
    };

    return (
        <Link
            href={`/cursos/${course.slug}`}
            className="flex flex-col h-full bg-white border border-gray-200 rounded-lg hover:border-secondary hover:shadow-lg transition-all duration-300 overflow-hidden group"
        >
            {/* Header - Energía visual */}
            <div className='bg-linear-to-r from-secondary/10 to-secondary/5 border-b border-secondary/20 px-4 py-2'>
                <span className='text-xs font-bold uppercase tracking-widest text-secondary'>Taller Práctico</span>
            </div>

            {/* Contenido - horizontal en sm+, vertical en mobile */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 flex-1">
                {/* Imagen - Visual hook */}
                <div className="relative w-full h-40 sm:w-28 sm:h-24 shrink-0 bg-linear-to-br from-secondary/20 to-primary/10 rounded-lg overflow-hidden shadow-sm">
                    {course.image ? (
                        <Image
                            src={course.image}
                            alt={course.name}
                            fill
                            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                            sizes="112px"
                        />
                    ) : (
                        <Image
                            src="/images/fondo-mantenimiento.webp"
                            alt={course.name}
                            fill
                            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                            sizes="112px"
                        />
                    )}
                    {/* Overlay dinámico */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent group-hover:from-black/20 transition-all"></div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* Nombre y categoría */}
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-secondary transition-colors">
                            {course.name}
                        </h3>

                        {/* Proveedor - Credibilidad */}
                        <p className="text-xs text-secondary font-semibold mb-2">
                            🏢 {course.provider}
                        </p>

                        {/* Descripción */}
                        <p className="text-gray-600 text-xs line-clamp-2">
                            {course.description}
                        </p>
                    </div>

                    {/* Metadata - Duración, Categoría, Fecha */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 pt-3">
                        {course.duration && (
                            <span className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded text-primary font-semibold">
                                ⏱ {minutesToTimeString(course.duration)}
                            </span>
                        )}
                        <span className="flex items-center gap-1 bg-secondary/5 px-2 py-1 rounded text-secondary font-semibold">
                            📅 {formatDate(course.next_date)}
                        </span>
                        {course.category?.name && (
                            <span className="flex items-center gap-1 truncate" title={course.category.name}>
                                🏷️ {course.category.name}
                            </span>
                        )}
                    </div>

                    {/* CTA mobile - solo visible en stack vertical */}
                    <span className='sm:hidden mt-3 flex items-center justify-center gap-2 w-full py-2 px-4 bg-secondary/10 text-secondary font-semibold text-xs rounded-lg group-hover:bg-secondary group-hover:text-primary transition-all duration-300'>
                        Ver taller
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>

                {/* CTA Arrow + label */}
                <div className="hidden sm:flex items-center shrink-0 text-secondary group-hover:translate-x-1 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}
