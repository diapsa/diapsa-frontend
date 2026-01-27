"use client";

import { useState } from "react";
import Image from "next/image";
import idapdata from '@/data/idap.json';
import Button from "../atoms/Button";


export default function IdapIntro() {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    return (

        <section className="w-full bg-white">
            <div className="flex items-center justify-center lg:gap-10 bg-white text-black">

                <div className="relative w-80 h-28">
                    <Image fill src='/images/idap/idap-logo.png' alt="logo de idap" className="object-contain" />
                </div>
            </div>
            <div className="w-lg lg:w-2xl mx-auto border-2 border-primary" />
            <div className="lg:p-10 bg-linear-to-t from-[#fda101] from-85% via-[#fda101] to-white text-black">
                <p className="text-center text-2xl lg:text-4xl text-black font-extralight tracking-wide my-10">La única plataforma digital de monitoreo <br />
                    predictivo que integra Inteligencia Artificial con el <br />
                    análisis de expertos</p>
                <div className="flex flex-wrap py-6 px-6 lg:px-24">
                    <div className="relative w-full lg:w-1/2 h-96 z-10">
                        <Image fill src="/images/idap/mockup.png" alt="Muestra Idap" className="object-contain md:scale-100 lg:scale-150" />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div>
                            <h2>¿QUÉ ES IDAP</h2>
                            <p className="text-sm font-sans">
                                IDAP (Interfaz de Diagnóstico y Análisis Predictivo) es la plataforma
                                desarrollada por DIAPSA para la gestión integral de resultados de
                                monitoreo de condición.
                            </p>
                        </div>
                        <div className="lg:mt-6 space-y-4">
                            {idapdata.tabs.map((tab) => (
                                <div key={tab.id} className={`border-b border-gray-30 px-6 transition-colors duration-300 ease-in-out ${activeTab === tab.id ? ' bg-linear-to-t from-white from-10% to-transparent' : ''}`}>
                                    <button
                                        onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                                        className={`w-full flex items-start justify-between gap-4 py-4 text-left hover:opacity-80 transition-all `}
                                    >
                                        <div className="flex gap-3 flex-1 items-center transition-all">
                                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTab === tab.id ? 'bg-primary' : 'bg-primary'}`}>
                                                <span className="text-secondary text-lg font-bold">•</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="uppercase">
                                                    {tab.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <svg
                                                className={`w-8 h-8 transition-transform ${activeTab === tab.id ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${activeTab === tab.id
                                            ? 'max-h-96 opacity-100'
                                            : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="pb-4 pl-16 pr-4">
                                            {tab.text.map((paragraph, idx) => (
                                                <p key={idx} className="text-sm leading-relaxed">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="relative grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-32 gap-10">
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <Image width={800} height={800} src="/images/idap/idap-bco.png" alt="" className="object-contain" />
                    </div>
                    {idapdata.questions.map((q) => (
                        <div key={q.title} className="space-y-3 relative z-10 mt-6">
                            <p>{q.title}</p>
                            <p className="text-sm p-4">
                                {q.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-around items-center p-6 text-black">
                <p className="text-2xl">¡INTEGRA IDAP EN TU OPERACIÓN YA!</p>
                <Button variant="black" className="text-2xl">
                    CONOCE PRECIOS Y PAQUETES
                </Button>
            </div>
            <div className="bg-gray-500 py-8 px-4 md:py-12 md:px-16 lg:py-16 lg:px-32 xl:px-48 flex justify-center items-center">
                <div className="p-4 md:p-6 lg:p-8 bg-[#002e46a0]">
                    <p className="text-base md:text-lg lg:text-4xl text-center">
                        La diferencia de IDAP está en el factor humano:
                        no es una plataforma autónoma que solo recopila datos,
                        sino un sistema vivo donde la tecnología y la experiencia de
                        especialistas convergen para dar certeza en la toma de
                        decisiones y confianza en la operación.

                    </p>
                </div>

            </div>
        </section>
    )
}