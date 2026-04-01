'use client';
import { useState } from 'react';
import Image from 'next/image';

export function GallerySection() {
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [showAll, setShowAll] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const categories = ['Todos', 'Capacitaciones', 'Trabajo en campo'];

    const images = [
        { src: '/images/gallery/campo-img-1.jpg', alt: 'Explicación del uso de equipo en campo', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-1.jpg', alt: 'Capacitaciones en DIAPSA', category: 'Capacitaciones' },
        { src: '/images/gallery/campo-img-2.jpg', alt: 'Monitoreo de condición - DIAPSA', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-2.jpg', alt: 'Curso de Certificación Alineamiento de Ejes y Balanceo', category: 'Capacitaciones' },
        { src: '/images/gallery/campo-img-3.jpg', alt: 'Inspección en DIAPSA', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-3.jpg', alt: 'Egresados DIAPSA', category: 'Capacitaciones' },
        { src: '/images/gallery/campo-img-4.jpg', alt: 'Lubricación a equipos', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-4.jpg', alt: 'Capacitación en DIAPSA', category: 'Capacitaciones' },
        { src: '/images/gallery/campo-img-5.jpg', alt: 'Inspección de corriente', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-5.jpg', alt: 'Redacción de informe de inspección', category: 'Capacitaciones' },
        { src: '/images/gallery/campo-img-6.jpg', alt: 'Profesionista DIAPSA', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-6.jpg', alt: 'Examen validado por DIAPSA', category: 'Capacitaciones' },
        { src: '/images/gallery/campo-img-7.jpg', alt: 'Análisis Eléctrico', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-7.jpg', alt: 'Revisión de Informes', category: 'Capacitaciones' },
        { src: '/images/gallery/campo-img-8.jpg', alt: 'Uso de equipo termográfico', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-8.jpg', alt: 'Capacitación en DIAPSA 2', category: 'Capacitaciones' },
        { src: '/images/gallery/campo-img-9.jpg', alt: 'Termografía Categoría 3', category: 'Trabajo en campo' },
        { src: '/images/gallery/capacitacion-img-9.jpg', alt: 'Curso de termografía', category: 'Capacitaciones' },
    ];

    const filteredImages = activeFilter === 'Todos'
        ? images
        : images.filter(img => img.category === activeFilter);

    const displayedImages = showAll ? filteredImages : filteredImages.slice(0, 6);

    return (
        <>
            <section className="w-full py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-4">
                            <span className="text-secondary font-semibold text-sm tracking-wider uppercase">
                                Galería Grupo DIAPSA
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
                            Experiencia en <span className="text-secondary">acción</span>
                        </h2>

                        <p className="max-w-2xl mx-auto text-tertiary text-lg">
                            Descubre cómo hemos ayudado a empresas industriales a optimizar
                            sus operaciones y mantener sus activos en óptimas condiciones
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setActiveFilter(category);
                                    setShowAll(false); // 🔥 reset
                                }}
                                className={`
                                    px-6 py-3 rounded-full font-semibold transition-all duration-300
                                    ${activeFilter === category
                                        ? 'bg-secondary text-primary shadow-lg scale-105'
                                        : 'bg-gray-100 text-tertiary hover:bg-gray-200'
                                    }
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {displayedImages.map((image, index) => (
                            <div
                                key={image.src}
                                onClick={() => setLightboxImage(image.src)}
                                className="group relative aspect-4/3 overflow-hidden rounded-2xl cursor-pointer bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-300"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    priority={index < 3} // 🔥 primeras visibles
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-secondary font-bold text-sm mb-2">
                                        {image.category}
                                    </span>
                                </div>

                                {/* Zoom icon */}
                                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ver más */}
                    {filteredImages.length > 6 && (
                        <div className="text-center">
                            <button
                                onClick={() => !showAll ? setShowAll(true) : setShowAll(false)}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-secondary hover:text-primary transition-all duration-300 shadow-lg hover:shadow-2xl"
                            >
                                {!showAll ? 'Ver más imagenes' : 'Ver menos imagenes'}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300"
                >
                    <button
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        onClick={() => setLightboxImage(null)}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="relative max-w-5xl w-full h-[80vh]">
                        <Image
                            src={lightboxImage}
                            alt="Imagen ampliada"
                            fill
                            priority
                            sizes="100vw"
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}