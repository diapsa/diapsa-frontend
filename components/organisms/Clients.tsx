'use client';

import Image from 'next/image';
import clientsData from '@/data/clients.json';

export function Clients() {
    // Duplicar los clientes para crear el efecto de loop infinito
    // NO usar Math.random() aquí porque causa hydration mismatch entre servidor y cliente
    const duplicatedClients = [...clientsData.clients, ...clientsData.clients];
    const randomClients = [...clientsData.clients, ...clientsData.clients];

    return (
        <section className="w-full flex flex-col pt-10 bg-white">
            {/* Header Section */}
            <div className="w-full flex flex-col items-center gap-4 mb-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black text-center leading-tight">
                    PASIÓN POR APORTAR VALOR
                </h2>
                <div className="border-2 border-secondary w-32 md:w-48" />
                <p className="text-2xl md:text-3xl text-tertiary font-light mt-2">
                    Clientes Satisfechos
                </p>
            </div>

            {/* Carousel Section */}
            <div className="w-full relative space-y-4 md:space-y-6 py-8 md:py-10 [background-image:repeating-linear-gradient(45deg,#003853_0px,#003853_10px,transparent_10px,transparent_15px),linear-gradient(135deg,#003853,#002e46)] [background-blend-mode:multiply] overflow-hidden">


                {/* Infinite carousel wrapper */}
                <div className="relative z-0">
                    <style jsx>{`
                        @keyframes scroll {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-50%);
                            }
                        }
                        .animate-scroll {
                            animation: scroll 10s linear infinite;
                        }
                        @media (min-width: 768px) {
                            .animate-scroll {
                                animation: scroll 40s linear infinite;
                            }
                        }
                
                    `}</style>

                    <div className="flex gap-6 sm:gap-10 md:gap-16 lg:gap-20 animate-scroll">
                        {duplicatedClients.map((client, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center justify-center min-w-[120px] sm:min-w-[160px] md:min-w-[220px] lg:min-w-[250px] h-16 sm:h-20 md:h-24 lg:h-28 group`}
                            >
                                {/* Case Study Hover Overlay */}
                                {/* {client.caseStudy && (
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-lg">
                                        <span className="text-secondary text-xs md:text-sm text-center px-4">
                                            VER CASO DE ÉXITO
                                        </span>
                                    </div>
                                )} */}

                                {/* Client Logo */}
                                <div className="relative w-full h-full px-2 sm:px-3 md:px-4">
                                    <Image
                                        src={client.logo}
                                        alt={`Logo de ${client.name}`}
                                        fill
                                        className="object-contain filter brightness-0 invert"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative z-0">
                    <style jsx>{`
                        @keyframes scroll-2 {
                            0% {
                                transform: translateX(-50%);
                            }
                            100% {
                                transform: translateX(0);
                            }
                        }
                        .animate-scroll-2 {
                            animation: scroll-2 10s linear infinite;
                        }
                        @media (min-width: 768px) {
                            .animate-scroll-2 {
                                animation: scroll-2 40s linear infinite;
                            }
                        }
                     
                        
                    `}</style>

                    <div className="flex gap-6 sm:gap-10 md:gap-16 lg:gap-20 animate-scroll-2">
                        {randomClients.map((client, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center justify-center min-w-[120px] sm:min-w-[160px] md:min-w-[220px] lg:min-w-[250px] h-16 sm:h-20 md:h-24 lg:h-28 group`}
                            >
                                {/* Case Study Hover Overlay */}
                                {/* {client.caseStudy && (
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-lg">
                                        <span className="text-secondary text-xs md:text-sm text-center px-4">
                                            VER CASO DE ÉXITO
                                        </span>
                                    </div>
                                )} */}

                                {/* Client Logo */}
                                <div className="relative w-full h-full px-2 sm:px-3 md:px-4">
                                    <Image
                                        src={client.logo}
                                        alt={`Logo de ${client.name}`}
                                        fill
                                        className="object-contain filter brightness-0 invert"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}