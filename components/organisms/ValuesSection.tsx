'use client'

import valuesData from '@/data/values.json';

import { useState } from 'react';

export function ValuesSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const icons = {
        "Responsabilidad": (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        "Compromiso": (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
        ),
        "Calidad": (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
        "Trabajo en equipo": (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    };

    return (
        <section className="relative w-full py-20 lg:py-28 overflow-hidden bg-linear-to-b from-[#001a28] via-black to-black">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                        <span className="text-secondary font-semibold text-sm tracking-wider uppercase">
                            Nuestra Identidad
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
                        Valores que nos{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-orange-400">
                            definen
                        </span>
                    </h2>

                    <p className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl leading-relaxed">
                        Principios fundamentales que guían cada decisión y acción, asegurando
                        excelencia operativa y compromiso absoluto con nuestros clientes industriales
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {valuesData.values.map((value, index) => (
                        <div
                            key={value.name}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className={`
                                relative h-full p-8 rounded-2xl border transition-all duration-500
                                ${hoveredIndex === index
                                    ? 'bg-linear-to-br from-secondary/20 to-transparent border-secondary shadow-[0_0_40px_rgba(252,159,1,0.3)] -translate-y-2'
                                    : 'bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20'
                                }
                            `}>
                                {/* Icon Container */}
                                <div className={`
                                    relative w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center
                                    transition-all duration-500
                                    ${hoveredIndex === index
                                        ? 'bg-secondary text-primary rotate-6 scale-110'
                                        : 'bg-white/10 text-secondary'
                                    }
                                `}>
                                    {icons[value.name as keyof typeof icons]}

                                    {/* Glow effect */}
                                    {hoveredIndex === index && (
                                        <div className="absolute inset-0 bg-secondary/30 rounded-xl blur-xl animate-pulse" />
                                    )}
                                </div>

                                {/* Number Badge */}
                                <div className={`
                                    absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
                                    text-xs font-bold transition-all duration-300
                                    ${hoveredIndex === index
                                        ? 'bg-secondary text-primary scale-110'
                                        : 'bg-white/10 text-white/60'
                                    }
                                `}>
                                    {index + 1}
                                </div>

                                {/* Content */}
                                <h3 className={`
                                    text-center text-2xl font-bold mb-4 transition-colors duration-300
                                    ${hoveredIndex === index ? 'text-secondary' : 'text-white'}
                                `}>
                                    {value.name}
                                </h3>

                                <p className="text-center text-gray-300 leading-relaxed text-sm">
                                    {value.description}
                                </p>

                                {/* Bottom accent line */}
                                <div className={`
                                    absolute bottom-0 left-0 h-1 bg-linear-to-r from-transparent via-secondary to-transparent
                                    transition-all duration-500 rounded-full
                                    ${hoveredIndex === index ? 'w-full' : 'w-0'}
                                `} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA or Stats */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-secondary">100%</div>
                            <div className="text-sm text-gray-400 mt-1">Compromiso</div>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <div className="text-3xl font-bold text-secondary">+20</div>
                            <div className="text-sm text-gray-400 mt-1">Años experiencia</div>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <div className="text-3xl font-bold text-secondary">24/7</div>
                            <div className="text-sm text-gray-400 mt-1">Soporte</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}