'use client';
import Button from "@/components/atoms/Button";
import PageHeader from "@/components/organisms/PageHeader";
import LdarServiceCards from "@/components/organisms/LdarServiceCards";
import { DoubleCircleIcon, ChartIcon2, HistoryIcon, WarningIcon } from "@/components/atoms/icons";
import { Metadata } from "next";
import { useState, type ComponentType, type SVGProps } from "react";
import Image from "next/image";
import WhatAksPPCIEM from "@/components/organisms/WhatAskPPCIEM";
import ContactFormGeneral from "@/components/organisms/ContactFormGeneral";
import ContactFormExpo from "@/components/organisms/ContactFormExpo";
import ContactFormGasDetection from "@/components/organisms/ContactFormGasDetection";

// export const metadata: Metadata = {
//     title: "Detección de Gas y Fugas Industriales | Grupo DIAPSA",
//     description:
//         "Servicios profesionales de detección de gas y fugas con tecnología acústica y óptica (OGI). Localización precisa de emisiones en plantas industriales. Seguridad garantizada 24/7 en México.",
//     keywords: [
//         "detección de gas industrial",
//         "detección de fugas México",
//         "tecnología OGI",
//         "detección acústica de fugas",
//         "termografía infrarroja gas",
//         "seguridad industrial México",
//         "monitoreo emisiones industriales",
//         "detección ultrasónica fugas",
//         "Optical Gas Imaging",
//         "inspección fugas alta presión",
//         "reducción emisiones CO2",
//         "gestión de activos industriales",
//     ],
//     alternates: {
//         canonical: "/servicios/deteccion-gas",
//     },
//     openGraph: {
//         title: "Detección de Gas y Fugas con Tecnología Avanzada | DIAPSA",
//         description:
//             "Detección acústica y óptica (OGI) de última generación para localización precisa de emisiones y fugas. Seguridad industrial 24/7.",
//         url: "/servicios/deteccion-gas",
//         type: "website",
//     },
// };




const challenges: { icon: ComponentType<SVGProps<SVGSVGElement>>; iconBg: string; iconColor: string; title: string; description: string }[] = [
    {
        icon: DoubleCircleIcon,
        iconBg: "bg-red-100",
        iconColor: "text-red-500",
        title: "Detección y Precisión",
        description: "Fallas en la localización exacta de fugas imperceptibles que comprometen la seguridad operativa.",
    },
    {
        icon: ChartIcon2,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-500",
        title: "Cuantificación de Impacto",
        description: "Dificultad técnica para medir el volumen real de emisiones perdidas y su costo económico.",
    },
    {
        icon: HistoryIcon,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-500",
        title: "Trazabilidad Reparación",
        description: "Falta de seguimiento histórico y re-inspección en el ciclo crítico de mantenimiento de activos.",
    },
    {
        icon: WarningIcon,
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-500",
        title: "Reportes No Conformantes",
        description: "Alto riesgo de sanciones por auditorías de ASEA ante informes incompletos o mal documentados.",
    },
];

export default function DeteccionGasPage() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <main>
            <ContactFormGasDetection isOpen={openModal} onClose={() => setOpenModal(false)} />
            <PageHeader title="Deteccion de Gas" />

            <div className="bg-white font-display">
                <section className="min-h-screen flex flex-col lg:flex-row p-10 gap-20">
                    <div className="space-y-10 text-black text-xl flex flex-col justify-center">
                        <p className="text-primary/60 font-bold bg-primary/10 rounded px-2">SECTOR HIDROCARBUROS</p>
                        <h2 className=" text-5xl lg:text-7xl font-bold text-black text-center lg:text-start">
                            Detección de <span className="text-secondary lg:block">Gases</span>
                        </h2>

                        <p className="lg:w-2/3">
                            Cumplimiento regulatorio <strong>PPCIEM</strong> y mitigación de riesgos
                            poer emisiones de metano en el sector hidrocarburos. <br />
                            Protegemos su operación y el medio ambiente.
                        </p>
                        <p className="text-gray-500 text-base lg:w-2/3 leading-relaxed">
                            Evite multas ASEA y reduzca emisiones de metano antes de la próxima auditoría.
                            Nuestro equipo especializado detecta lo que el ojo no puede ver.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="primary" className="hover:bg-secondary" onClick={() => setOpenModal(true)}>
                                Solicitar información
                            </Button>

                        </div>
                    </div>
                    <div className="relative h-52 w-full [clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)] lg:[clip-path:none] lg:h-auto lg:w-1/2">
                        <Image
                            src="/images/deteccion-gas/deteccion-gas-ppciem.jpg"
                            alt="Detector de Gas " fill className="object-cover rounded-2xl" />
                    </div>
                </section>
                <section className="bg-gray-100 text-black py-16 px-10 min-h-screen flex flex-col justify-center">
                    <p className="text-center font-bold text-primary/70 tracking-widest text-sm mb-4">
                        DESAFÍOS CRÍTICOS
                    </p>
                    <h2 className="font-bold text-center text-2xl lg:text-4xl text-black mb-12 max-w-xl mx-auto leading-tight">
                        Identificamos los riesgos que amenazan su cumplimiento
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {challenges.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
                            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${iconColor}`} />
                                </div>
                                <h3 className="font-bold text-black text-lg">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <WhatAksPPCIEM />
                <LdarServiceCards />

                <section className="bg-gray-100 py-20 px-10">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                        {/* Image */}
                        <div className="relative w-full lg:w-1/2 h-80 lg:h-125 shrink-0">
                            <Image
                                src="/images/deteccion-gas/observe-invisible.png"
                                alt="Solución DIAPSA - Detección de Fugas"
                                fill
                                className="object-cover rounded-3xl"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-6 text-black">
                            <p className="text-primary font-bold tracking-widest text-sm uppercase">
                                La Solución DIAPSA
                            </p>
                            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                                Transformamos la detección en cumplimiento integral
                            </h2>
                            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                                Implementamos un programa de Detección y Reparación de Fugas (LDAR) diseñado
                                específicamente para garantizar la continuidad operativa y seguridad normativa.
                            </p>

                            <ul className="flex flex-col gap-6 mt-2">
                                {[
                                    {
                                        title: "Inspección Trimestral",
                                        description:
                                            "Monitoreo periódico con tecnología de punta para asegurar la integridad total de sus activos.",
                                    },
                                    {
                                        title: "Confirmación de Metano",
                                        description:
                                            "Validación técnica de concentraciones mediante sensores especializados y calibrados.",
                                    },
                                    {
                                        title: "Priorización de Riesgos",
                                        description:
                                            "Clasificación inteligente de hallazgos para optimizar sus recursos y tiempos de reparación.",
                                    },
                                ].map(({ title, description }) => (
                                    <li key={title} className="flex items-start gap-4">
                                        <span className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-0.5">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-black text-base">{title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="bg-white text-black py-20 px-10">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                image: "/images/deteccion-gas/camaras-acusticas-deteccion-gas.png",
                                alt: "Tecnología OGI - Cámaras térmicas y detectores láser",
                                title: "Tecnología",
                                description:
                                    "Sistemas avanzados de Detection + Quantification. Utilizamos cámaras térmicas OGI y detectores láser de última generación para una precisión absoluta.",
                                tag: "EQUIPAMIENTO PREMIUM",
                            },
                            {
                                image: "/images/deteccion-gas/servicio-ldar.jpg",
                                alt: "Servicio LDAR - Ingenieros certificados en planta",
                                title: "Servicio",
                                description:
                                    "Inspections + Repairs + Follow-up. Un equipo de ingenieros certificados gestiona todo el ciclo de vida de la detección hasta la reparación final.",
                                tag: "GESTIÓN OPERATIVA",
                            },
                            // {
                            //     image: "/images/deteccion-gas/plataforma-digital.jpg",
                            //     alt: "Plataforma Digital - Dashboard ASEA reports",
                            //     title: "Plataforma Digital",
                            //     description:
                            //         "Data management + ASEA reports. Centralización de hallazgos en la nube para generación automática de reportes de cumplimiento normativo.",
                            //     tag: "CUMPLIMIENTO ASEA",
                            // },
                        ].map(({ image, alt, title, description, tag }) => (
                            <div key={title} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                                <div className="relative h-60 w-full">
                                    <Image src={image} alt={alt} fill className="object-cover" />
                                </div>
                                <div className="p-6 flex flex-col gap-3 flex-1">
                                    <h3 className="font-bold text-black text-2xl">{title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{description}</p>
                                    <span className="text-primary font-bold text-xs tracking-widest uppercase mt-2">
                                        {tag}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    )
}