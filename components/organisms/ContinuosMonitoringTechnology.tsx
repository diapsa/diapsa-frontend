"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/atoms/Button";

const equipos = [
    {
        id: "sensor-vibracion",
        name: "Sensor de Vibración",
        tagline: "Monitoreo triaxial MEMS inalámbrico",
        category: "Sensor",
        image: "/images/monitoreo-continuo/wireless-vibration-sensor-kcf.png",
        description: "El sensor de vibración remoto inalámbrico de alta definición de KCF establece el estándar de la industria para el monitoreo en tiempo real y de alta definición del estado de las máquinas a una fracción del costo de nuestros competidores promedio. Obtenga monitoreo continuo del estado operativo.",
        specs: [
            { label: "Tipo", value: "Wireless Vibration Sensor, triaxial MEMS" },
            { label: "Frecuencia", value: "Hasta 10 kHz" },
            { label: "Aceleración", value: "±16 g" },
            { label: "Resolución", value: "0.001 g" },
            { label: "Temperatura op.", value: "-40°C a +85°C" },
            { label: "Protección", value: "IP67 (polvo, agua, ambientes agresivos)" },
            { label: "Conectividad", value: "Inalámbrica via Base Station Gateway" },
            { label: "Autonomía", value: "Batería de larga duración (varios años)" },
        ],
    },
    {
        id: "base-station",
        name: "Estación Base",
        tagline: "Comunicación bidireccional sensores-nube",
        category: "Conectividad",
        image: "/images/monitoreo-continuo/base-station-gateway-kcf.png",

        description:
            "DART Wireless es el protocolo de comunicación de KCF utilizado para enviar datos a través de nuestra red de malla de estaciones base. Los sensores no necesitan estar emparejados con una estación base específica. En su lugar, los datos se envían utilizando la ruta de señal más potente, creando una solución modular y escalable para instalaciones de todos los tamaños.",
        specs: [],
    },
    {
        id: "iothub",
        name: "IoTHub",
        tagline: "Gestión centralizada del ecosistema IoT",
        category: "Plataforma",
        image: "/images/monitoreo-continuo/iot-hub-kcf.png",
        description: "El SMARTdiagnostics IoT HUB es la próxima generación de soluciones integrales para activos, diseñadas para satisfacer las necesidades más complejas de monitorización del estado de los activos.",
        specs: [],
    },
];

export default function ContinuosMonitoringTechnology() {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <section className="bg-white">
            <div className="bg-tertiary/30">

                {/* ── Section Header ── */}
                <div className="relative overflow-hidden border-b border-white/15">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-32 -right-32 w-120 h-120 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        {/* Left – text */}
                        <div className="flex-1 space-y-6">
                            <span className="inline-flex items-center gap-3 text-primary/70 font-bold text-xs tracking-widest uppercase border border-gray-200 bg-white/30 px-4 py-2 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                                Tecnología de Monitoreo
                            </span>

                            <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-primary">
                                SMARTSensing
                                <span className="block text-primary/70">Suite</span>
                            </h2>

                            <p className="text-black text-lg max-w-lg leading-relaxed">
                                DIAPSA integra el portafolio completo de KCF Technologies dentro
                                de un ecosistema robusto de monitoreo predictivo industrial.
                            </p>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {[
                                    "Wireless Vibration Sensors",
                                    "Ultrasonic Sensors",
                                    "Temperature Sensors",
                                    "Base Station Gateway",
                                ].map((s) => (
                                    <span
                                        key={s}
                                        className="text-xs font-semibold text-primary/70 border border-gray-200 bg-white/30 rounded-full px-3 py-1.5"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>


                        {/* Right – KCF partner card */}
                        <div className="lg:w-64 xl:w-1/3 shrink-0 flex flex-col gap-4">
                            <div className="bg-white/30 border border-gray-200 rounded-sm p-10 flex flex-col items-center gap-5 w-full">
                                <span className="text-tertiary text-[10px] uppercase tracking-widest font-bold">Socio tecnológico</span>
                                <div className="relative w-full h-32">
                                    <Image
                                        src="/images/monitoreo-continuo/logo-kcf-without-bg.png"
                                        fill
                                        className="object-contain"
                                        alt="Logo KCF Technologies"
                                    />
                                </div>
                                <div className="h-px w-full bg-gray-400" />
                                <p className="text-tertiary text-xs text-center leading-relaxed">
                                    +20 años de experiencia en sensores industriales para mantenimiento predictivo
                                </p>
                                <Link href="https://kcftech.com" target="_blank" rel="noopener noreferrer">
                                    <Button variant="primary" ghost ghostVariant="light" className="w-full text-sm">
                                        Conocer KCF Technologies
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 3-component ecosystem ── */}
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-14">

                    {/* Intro */}
                    <div className="text-center space-y-3">
                        <h3 className="text-2xl lg:text-4xl font-bold text-black">
                            3 componentes,{" "}
                            <span className="text-primary/70">1 ecosistema conectado</span>
                        </h3>
                        <p className="text-black/75 max-w-xl mx-auto leading-relaxed">
                            Se instalan e interconectan según las necesidades detectadas en tu planta.
                        </p>
                    </div>

                    {/* Diagram placeholder */}
                    <div className="relative w-full aspect-3/1 rounded-sm overflow-hidden bg-white/30 border border-gray-200">
                        <Image
                            src="/images/monitoreo-continuo/kfc-enviroment-v2.png"
                            fill
                            className="object-contain p-4"
                            alt="Diagrama SMARTSensing Suite - KCF Technologies"
                        />
                    </div>

                    {/* Equipment cards */}
                    <div className="space-y-4">
                        {equipos.map((equipo, index) => (
                            <div
                                key={equipo.id}
                                className="rounded-sm border border-gray-200 bg-white/30 shadow-sm hover:shadow-xl hover:border-gray-400 overflow-hidden flex flex-col sm:flex-row transition-all duration-300"
                            >
                                {/* Image panel – left */}
                                <div className="relative w-full h-48 sm:w-44 lg:w-52 sm:h-auto shrink-0 bg-white/30">
                                    <Image
                                        src={equipo.image}
                                        fill
                                        className="object-contain p-2"
                                        alt={`Imagen del equipo ${equipo.name} de KCF Technologies`}
                                    />
                                    {/* subtle right-side fade to blend with card body */}
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-gray-100/60 sm:to-gray-100 pointer-events-none" />
                                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-100/60 sm:to-transparent pointer-events-none sm:hidden" />
                                </div>

                                {/* Content – right */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    {/* Top row */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6">
                                        {/* Index badge */}
                                        <div className="shrink-0 w-11 h-11 rounded-sm bg-primary/30 border border-gray-200 flex items-center justify-center">
                                            <span className="text-primary/70 font-bold text-base">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        {/* Name + tagline */}
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                                                {equipo.category}
                                            </span>
                                            <h4 className="text-lg font-bold text-primary mt-0.5">{equipo.name}</h4>
                                            <p className="text-tertiary text-sm mt-0.5">{equipo.tagline}</p>
                                        </div>

                                        {/* CTAs */}
                                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                                            {equipo.specs.length > 0 && (
                                                <button
                                                    onClick={() =>
                                                        setExpanded(expanded === equipo.id ? null : equipo.id)
                                                    }
                                                    className="text-sm font-semibold text-tertiary hover:text-primary border border-gray-200 hover:border-gray-400 rounded-xs px-4 py-2 transition-all cursor-pointer"
                                                >
                                                    {expanded === equipo.id ? "Ocultar specs" : "Ver especificaciones"}
                                                </button>
                                            )}
                                            <Link href="/contacto?motivo=servicios">
                                                <Button variant="primary" className="text-sm">
                                                    Solicitar información
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                                        <p className="text-tertiary text-sm leading-relaxed">{equipo.description}</p>
                                    </div>

                                    {/* Expandable specs */}
                                    {equipo.specs.length > 0 && expanded === equipo.id && (
                                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-4">
                                                Especificaciones Técnicas
                                            </h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                                {equipo.specs.map((spec) => (
                                                    <div
                                                        key={spec.label}
                                                        className="flex gap-3 py-2.5 text-sm border-b border-gray-100 last:border-0"
                                                    >
                                                        <span className="text-primary/70 font-semibold shrink-0">
                                                            {spec.label}:
                                                        </span>
                                                        <span className="text-primary">{spec.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>{/* end content */}
                            </div>
                        ))}
                    </div>

                    {/* Inline CTA strip */}
                    <div className="border border-gray-200 rounded-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/30">
                        <div>
                            <p className="text-black font-semibold text-lg">
                                ¿La tecnología adecuada para tu operación?
                            </p>
                            <p className="text-black/70 text-sm mt-1">
                                Nuestros especialistas seleccionan y configuran el conjunto correcto para tu planta.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 shrink-0">
                            <Link href="/contacto?motivo=servicios">
                                <Button variant="primary">Hablar con un experto</Button>
                            </Link>
                            <Link href="/metodologia">
                                <Button variant="primary" ghost ghostVariant="light">Ver metodología</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}