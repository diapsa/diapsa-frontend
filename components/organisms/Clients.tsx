import Image from 'next/image';
import clientsData from '@/data/clients.json';
import Button from '@/components/atoms/Button';

export function Clients() {
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

            {/* Clients Grid Section */}
            <div className="w-full relative py-12 px-4  [background-image:repeating-linear-gradient(45deg,#003853_0px,#003853_10px,transparent_10px,transparent_15px),linear-gradient(135deg,#003853,#002e46)] [background-blend-mode:multiply]">
                {/* Fade overlay from top to bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-white from-5% via-transparent via-15% to-transparent pointer-events-none z-10" />

                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center relative z-0">
                    {clientsData.clients.map((client, index) => (
                        <div
                            key={index}
                            className={`relative flex items-center justify-center w-full h-24 md:h-28 group ${client.caseStudy ? 'cursor-pointer' : ''}`}
                        >
                            {/* Case Study Hover Overlay */}
                            {client.caseStudy && (
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-lg">
                                    <span className="text-secondary text-xs md:text-sm text-center px-4">
                                        VER CASO DE ÉXITO
                                    </span>
                                </div>
                            )}

                            {/* Client Logo */}
                            <div className="relative w-full h-full">
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
        </section>
    )
}