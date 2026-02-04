'use client';

import { useState, useMemo } from 'react';
import cursosData from '@/data/cursos/new.json';
import {
    ThermometerIcon,
    VibrationIcon,
    SoundIcon,
    SettingsIcon,
    MonitorIcon,
    EnergyIcon,
    SecurityIcon
} from '@/components/atoms/icons';

interface Curso {
    id: number;
    name: string;
    slug: string;
    tipo_curso: string;
    icono: string;
    provider: string;
    contenido: {
        descripcion_general: string;
        modalidad: string;
    };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    thermometer: ThermometerIcon,
    vibration: VibrationIcon,
    sound: SoundIcon,
    settings: SettingsIcon,
    monitor: MonitorIcon,
    energy: EnergyIcon,
    security: SecurityIcon,
};

export function CoursesListSection() {
    // Obtener todos los tipos de curso únicos
    const tiposCurso = useMemo(() => {
        const tipos = [...new Set(cursosData.courses.map(c => c.tipo_curso))];
        return tipos;
    }, []);

    const [activeTab, setActiveTab] = useState<string>(tiposCurso[0] || 'Certificación');

    const cursosFiltrados = cursosData.courses.filter(c => c.tipo_curso === activeTab);

    // Mapeo de colores por tipo de curso
    const getTabColor = (tipo: string) => {
        if (tipo === 'Certificación') return 'secondary';
        if (tipo === 'Ejecutivo') return 'tertiary';
        return 'primary';
    };

    return (
        <section className="w-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Texto introductorio */}
                <div className="text-center mb-8 space-y-4">
                    <p className="text-gray-700 text-base sm:text-lg">
                        Ofrecemos cursos especializados en mantenimiento predictivo y confiabilidad operativa.
                    </p>
                    <p className="text-gray-700 text-base sm:text-lg">
                        A continuación, se presenta una lista concisa de sus principales programas de capacitación:
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    {tiposCurso.map((tipo) => {
                        const color = getTabColor(tipo);
                        const isActive = activeTab === tipo;

                        return (
                            <button
                                key={tipo}
                                onClick={() => setActiveTab(tipo)}
                                className={`px-6 py-3 font-bold text-sm sm:text-base transition-all rounded-md ${isActive
                                    ? `bg-${color} text-white shadow-lg`
                                    : `bg-white text-gray-700 border-2 border-gray-300 hover:border-${color}`
                                    }`}
                            >
                                {tipo}
                            </button>
                        );
                    })}
                </div>

                {/* Lista de cursos */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {cursosFiltrados.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {cursosFiltrados.map((curso: Curso) => {
                                const IconComponent = iconMap[curso.icono] || MonitorIcon;
                                return (
                                    <li
                                        key={curso.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Icono */}
                                        <div className="shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                <IconComponent className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>

                                        {/* Contenido */}
                                        <div className="grow space-y-1">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {curso.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {curso.contenido.descripcion_general}
                                            </p>
                                        </div>

                                        {/* Modalidad y enlace */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                {curso.contenido.modalidad}
                                            </span>
                                            <a
                                                href={`/cursos/${curso.slug}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline whitespace-nowrap"
                                            >
                                                Ver detalles
                                            </a>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 text-lg">
                                Próximamente disponibles cursos en esta categoría.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}