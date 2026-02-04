/**
 * CourseDetails Component
 * Vista detallada de curso con diseño tipo Udemy
 */

"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import {
    ThermometerIcon,
    VibrationIcon,
    SoundIcon,
    MonitorIcon,
    SettingsIcon,
    EnergyIcon,
    SecurityIcon,
} from "@/components/atoms/icons";

interface Course {
    id: number;
    name: string;
    slug: string;
    tipo_curso: string;
    icono: string;
    provider: string;
    contenido: {
        descripcion_general: string;
        normativa_referencia: string | null;
        objetivo_general: string;
        objetivos_especificos: string[] | null;
        metodologia: string;
        temario: string[];
        duracion: string | null;
        modalidad: string;
        requisitos: string[];
        evaluacion: string | null;
        certificacion: string | null;
        perfil_egreso: string | null;
        publico_objetivo?: string | null;
        instructor_profile?: string | null;
    };
}

interface CourseDetailsProps {
    course: Course;
}

// Mapeo de iconos
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    thermometer: ThermometerIcon,
    vibration: VibrationIcon,
    sound: SoundIcon,
    monitor: MonitorIcon,
    settings: SettingsIcon,
    energy: EnergyIcon,
    security: SecurityIcon,
    document: SecurityIcon, // Usar SecurityIcon como fallback para document
};

export default function CourseDetails({ course }: CourseDetailsProps) {
    const [activeTab, setActiveTab] = useState<
        | "descripcion"
        | "objetivos"
        | "temario"
        | "requisitos"
        | "certificacion"
    >("descripcion");

    const Icon = iconMap[course.icono] || MonitorIcon;

    // Scroll suave al formulario de contacto
    const scrollToContact = () => {
        const contactSection = document.getElementById("contacto");
        contactSection?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full bg-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contenido Principal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Descripción Rápida */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-secondary p-3 rounded-lg shrink-0">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-primary mb-2">
                                        {course.name}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {course.contenido.descripcion_general}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs de Navegación */}
                        <div className="border-b border-gray-200">
                            <nav className="flex gap-8 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab("descripcion")}
                                    className={`pb-4 px-1 font-semibold whitespace-nowrap transition-colors ${activeTab === "descripcion"
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-primary"
                                        }`}
                                >
                                    Descripción
                                </button>
                                <button
                                    onClick={() => setActiveTab("objetivos")}
                                    className={`pb-4 px-1 font-semibold whitespace-nowrap transition-colors ${activeTab === "objetivos"
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-primary"
                                        }`}
                                >
                                    Objetivos
                                </button>
                                <button
                                    onClick={() => setActiveTab("temario")}
                                    className={`pb-4 px-1 font-semibold whitespace-nowrap transition-colors ${activeTab === "temario"
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-primary"
                                        }`}
                                >
                                    Temario
                                </button>

                                {(course.contenido.certificacion || course.contenido.evaluacion) && (
                                    <button
                                        onClick={() => setActiveTab("certificacion")}
                                        className={`pb-4 px-1 font-semibold whitespace-nowrap transition-colors ${activeTab === "certificacion"
                                            ? "text-primary border-b-2 border-primary"
                                            : "text-gray-500 hover:text-primary"
                                            }`}
                                    >
                                        Certificación
                                    </button>
                                )}
                            </nav>
                        </div>

                        {/* Contenido de Tabs */}
                        <div className="py-6">
                            {/* Tab: Descripción */}
                            {activeTab === "descripcion" && (
                                <div className="space-y-6">
                                    {course.contenido.normativa_referencia && (
                                        <div>
                                            <h3 className="text-xl font-bold text-primary mb-3">
                                                Normativa de Referencia
                                            </h3>
                                            <p className="text-gray-700 bg-blue-50 border-l-4 border-primary p-4 rounded">
                                                {course.contenido.normativa_referencia}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-xl font-bold text-primary mb-3">
                                            Metodología
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {course.contenido.metodologia}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary mb-4">
                                            Requisitos para el Curso
                                        </h3>
                                        {course.contenido.requisitos.length > 0 ? (
                                            <ul className="space-y-3">
                                                {course.contenido.requisitos.map((requisito, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <svg
                                                            className="w-6 h-6 text-primary shrink-0 mt-0.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <span className="text-gray-700">{requisito}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-600 italic">
                                                No se requieren requisitos previos para este curso.
                                            </p>
                                        )}
                                    </div>

                                    {course.contenido.publico_objetivo && (
                                        <div>
                                            <h3 className="text-xl font-bold text-primary mb-3">
                                                ¿Quiénes deben tomar este curso?
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                {course.contenido.publico_objetivo}
                                            </p>
                                        </div>
                                    )}

                                    {course.contenido.instructor_profile && (
                                        <div>
                                            <h3 className="text-xl font-bold text-primary mb-3">
                                                Instructor
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                {course.contenido.instructor_profile}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab: Objetivos */}
                            {activeTab === "objetivos" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary mb-3">
                                            Objetivo General
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {course.contenido.objetivo_general}
                                        </p>
                                    </div>

                                    {course.contenido.objetivos_especificos &&
                                        course.contenido.objetivos_especificos.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-bold text-primary mb-4">
                                                    Objetivos Específicos
                                                </h3>
                                                <ul className="space-y-3">
                                                    {course.contenido.objetivos_especificos.map(
                                                        (objetivo, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start gap-3"
                                                            >
                                                                <svg
                                                                    className="w-6 h-6 text-secondary shrink-0 mt-0.5"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                <span className="text-gray-700">
                                                                    {objetivo}
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                    {course.contenido.perfil_egreso && (
                                        <div className="bg-linear-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
                                            <h3 className="text-xl font-bold text-primary mb-3">
                                                Perfil de Egreso
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                {course.contenido.perfil_egreso}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab: Temario */}
                            {activeTab === "temario" && (
                                <div>
                                    <h3 className="text-xl font-bold text-primary mb-4">
                                        Contenido del Curso
                                    </h3>
                                    <ul className="space-y-3">
                                        {course.contenido.temario.map((tema, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                                    {index + 1}
                                                </span>
                                                <span className="text-gray-700 pt-1">{tema}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}


                            {/* Tab: Certificación */}
                            {activeTab === "certificacion" &&
                                (course.contenido.certificacion ||
                                    course.contenido.evaluacion) && (
                                    <div className="space-y-6">
                                        {course.contenido.evaluacion && (
                                            <div>
                                                <h3 className="text-xl font-bold text-primary mb-3">
                                                    Evaluación
                                                </h3>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {course.contenido.evaluacion}
                                                </p>
                                            </div>
                                        )}

                                        {course.contenido.certificacion && (
                                            <div className="bg-linear-to-r from-secondary/10 to-primary/10 rounded-xl p-6 border border-secondary/30">
                                                <h3 className="text-xl font-bold text-primary mb-3">
                                                    Certificación
                                                </h3>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {course.contenido.certificacion}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Sidebar - Información Rápida */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Card de Información */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                                <h3 className="text-2xl font-bold text-primary mb-6">
                                    Información del Curso
                                </h3>

                                <div className="space-y-4">
                                    {/* Tipo de Curso */}
                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                        <svg
                                            className="w-6 h-6 text-primary shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                            />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Tipo de Curso</p>
                                            <p className="font-semibold text-gray-900">
                                                {course.tipo_curso}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Duración */}
                                    {course.contenido.duracion && (
                                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                            <svg
                                                className="w-6 h-6 text-primary shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-500">Duración</p>
                                                <p className="font-semibold text-gray-900">
                                                    {course.contenido.duracion}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Modalidad */}
                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                        <svg
                                            className="w-6 h-6 text-primary shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Modalidad</p>
                                            <p className="font-semibold text-gray-900">
                                                {course.contenido.modalidad}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Provider */}
                                    <div className="flex items-center gap-3">
                                        <svg
                                            className="w-6 h-6 text-primary shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Impartido por</p>
                                            <p className="font-semibold text-gray-900">
                                                {course.provider}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <Button
                                        variant="secondary"
                                        onClick={scrollToContact}
                                        className="w-full justify-center text-lg py-4"
                                    >
                                        Solicitar Información
                                    </Button>
                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        Nos pondremos en contacto contigo
                                    </p>
                                </div>
                            </div>

                            {/* Badge de Certificación */}
                            {course.tipo_curso === 'Certificación' && (
                                <div className="bg-linear-to-br from-primary to-primary/80 text-white rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <svg
                                            className="w-8 h-8 text-secondary"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <h4 className="font-bold text-lg">Curso Certificado</h4>
                                    </div>
                                    <p className="text-sm text-white/90 leading-relaxed">
                                        Al completar este curso recibirás una certificación oficial
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
