"use client";

import Button from "@/components/atoms/Button";
import Image from "next/image";


export default function MethodologyProcess() {
    return (
        <>
            <section className="w-full bg-black py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left side - Content */}
                        <div className="relative flex flex-col justify-center space-y-6 px-6 lg:px-20">
                            {/* Number - Background */}
                            <div className="absolute -top-30 left-0  text-secondary text-[20rem] font-bold opacity-10 select-none pointer-events-none">
                                #1
                            </div>

                            {/* Title */}
                            <h3 className="relative z-10 text-white text-2xl font-bold leading-tight">
                                Nuestro servicio comienza con un levantamiento técnico experto que identifica riesgos ocultos y abre la puerta a decisiones estratégicas.
                            </h3>

                            {/* Border */}
                            <div className="relative z-10 w-full h-0.5 bg-secondary"></div>

                            {/* Description */}
                            <div className="relative z-10 text-gray-300 text-lg leading-relaxed">
                                <ul className="space-y-3">
                                    <li className="text-gray-400 text-base leading-relaxed">
                                        • En todo proyecto realizamos una evaluación precisa para entender el estado real de los activos y su operación.
                                    </li>
                                    <li className="text-gray-400 text-base leading-relaxed">
                                        • Los levantamientos realizados son el fundamento perfecto para poder diagnosticar puntos críticos y riesgos ocultos lo que nos permite determinar qué evaluar, cómo hacerlo y qué acciones son prioritarias.
                                    </li>
                                </ul>
                            </div>


                        </div>

                        {/* Right side - Image */}
                        <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                            <Image
                                src="/images/metodologia/metodologia-1.jpg"
                                alt="Técnico realizando inspección en instalación industrial"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-16 md:py-24 bg-gradient-to-b from-black from-70% via-gray-800 via-85% to-zinc-100 to-100%">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left side - Image */}
                        <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                            <Image
                                src="/images/metodologia/metodologia-2.png"
                                alt="Técnico realizando inspección en instalación industrial"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Right side - Content */}
                        <div className="relative flex flex-col justify-center space-y-6 px-6 lg:px-20">
                            {/* Number - Background */}
                            <div className="absolute -top-30 right-0 text-secondary text-[20rem] font-bold opacity-10 select-none pointer-events-none">
                                #2
                            </div>

                            {/* Title */}
                            <h3 className="relative z-10 text-white text-2xl font-bold leading-tight">
                                Según los resultados, se recomienda desde la instalación estratégica de sensores, hasta revisiones periódicas o análisis especializados más profundos.
                            </h3>

                            {/* Border */}
                            <div className="relative z-10 w-full h-0.5 bg-secondary"></div>

                            {/* Description */}
                            <div className="relative z-10 text-gray-300 text-lg leading-relaxed">
                                <ul className="space-y-3">
                                    <li className="text-gray-400 text-base leading-relaxed">
                                        • El objetivo es gestionar que cada acción responda a una necesidad real y se traduzca en información certera que mejore decisiones técnicas y asegure continuidad operativa.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-8 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left side - Content */}
                        <div className="relative flex flex-col justify-center space-y-6 px-6 lg:px-20">
                            {/* Number - Background */}
                            <div className="absolute -top-30 left-0 text-secondary text-[20rem] font-bold opacity-10 select-none pointer-events-none">
                                #3
                            </div>

                            {/* Title */}
                            <h3 className="relative z-10 text-black text-2xl font-bold leading-tight">
                                Implementamos el 360 de nuestra solución integral de confiabilidad de activos y más allá del simple monitoreo
                            </h3>

                            {/* Border */}
                            <div className="relative z-10 w-full h-0.5 bg-secondary"></div>

                            {/* Description */}
                            <div className="relative z-10 text-gray-800 text-lg leading-relaxed">
                                <ul className="space-y-3">
                                    <li className="text-gray-700 text-base leading-relaxed">
                                        • Esta dinámica para mantener la disponibilidad del equipo crítico lo logra de toda la vida útil, desde el diseño hasta el abandono de activos.
                                    </li>
                                    <li className="text-gray-700 text-base leading-relaxed">
                                        • Esto incluye detectar problemas de origen, anticipar la ocurrencia de eventos de detención y proponer acciones oportunas y eficientes.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right side - Image */}
                        <div >
                            <div className=" h-[400px] lg:h-[500px] rounded-lg">
                                <Image
                                    src="/images/360DIAPSADIAGRAMA.svg"
                                    alt="Diagrama DIAPSA 360 de solución integral"
                                    width="500"
                                    height="500"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
