'use client';

import { useState } from 'react';
import cursosData from '@/data/cursos.json';
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
    id: string;
    nombre: string;
    descripcion: string;
    modalidad: string;
    categoria: string;
    icono: string;
    link: string;
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
    const [activeTab, setActiveTab] = useState<'tecnico' | 'estrategico' | 'diplomado'>('tecnico');

    const cursosTecnicos = cursosData.cursos.filter(c => c.categoria === 'tecnico');
    const cursosEstrategicos = cursosData.cursos.filter(c => c.categoria === 'estrategico');
    const diplomados = cursosData.cursos.filter(c => c.categoria === 'diplomado');

    const getCursosPorCategoria = () => {
        switch (activeTab) {
            case 'tecnico':
                return cursosTecnicos;
            case 'estrategico':
                return cursosEstrategicos;
            case 'diplomado':
                return diplomados;
            default:
                return [];
        }
    };

    const cursos = getCursosPorCategoria();

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
                    <button
                        onClick={() => setActiveTab('tecnico')}
                        className={`px-8 py-3 font-bold text-base sm:text-lg transition-all rounded-md ${activeTab === 'tecnico'
                            ? 'bg-secondary text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-secondary'
                            }`}
                    >
                        Cursos Técnicos
                    </button>
                    <button
                        onClick={() => setActiveTab('estrategico')}
                        className={`px-8 py-3 font-bold text-base sm:text-lg transition-all rounded-md ${activeTab === 'estrategico'
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary'
                            }`}
                    >
                        Cursos Estratégicos
                    </button>
                    <button
                        onClick={() => setActiveTab('diplomado')}
                        className={`px-8 py-3 font-bold text-base sm:text-lg transition-all rounded-md ${activeTab === 'diplomado'
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary'
                            }`}
                    >
                        Diplomados
                    </button>
                </div>

                {/* Lista de cursos */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {cursos.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {cursos.map((curso: Curso) => {
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
                                                {curso.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {curso.descripcion}
                                            </p>
                                        </div>

                                        {/* Modalidad y enlace */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                {curso.modalidad}
                                            </span>
                                            <a
                                                href={curso.link}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline whitespace-nowrap"
                                            >
                                                Solicita informes
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