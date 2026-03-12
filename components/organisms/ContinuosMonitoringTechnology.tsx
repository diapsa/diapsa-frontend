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
        image: "https://kcftech.com/wp-content/uploads/2022/03/SMARTSensor-product-updated.png",
        description:
            "Sensor inalámbrico de vibración triaxial MEMS de alta precisión para monitoreo continuo de maquinaria industrial. Detecta fallas incipientes antes de que generen paros no programados.",
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
        image: "https://kcftech.com/wp-content/uploads/2022/03/SMARTGateway-product.png",
        description:
            "Hub de comunicación que recopila datos de múltiples sensores inalámbricos y los transmite de forma segura hacia la nube para análisis en tiempo real.",
        specs: [],
    },
    {
        id: "iothub",
        name: "IoTHub",
        tagline: "Gestión centralizada del ecosistema IoT",
        category: "Plataforma",
        image: "https://placehold.co/400x400/001e30/fc9f01?text=IoTHub",
        description:
            "Plataforma centralizada para la administración, configuración y supervisión de todos los dispositivos conectados. Orquesta el ecosistema completo desde una sola interfaz.",
        specs: [],
    },
];

export default function ContinuosMonitoringTechnology() {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <section className="bg-primary text-white">

            {/* ── Section Header ── */}
            <div className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-120 h-120 rounded-full bg-secondary/5 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/3 blur-2xl" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                    {/* Left – text */}
                    <div className="flex-1 space-y-6">
                        <span className="inline-flex items-center gap-3 text-secondary font-bold text-xs tracking-widest uppercase border border-secondary/40 bg-secondary/5 px-4 py-2 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                            Tecnología de Monitoreo
                        </span>

                        <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                            SMARTSensing
                            <span className="block text-secondary">Suite</span>
                        </h2>

                        <p className="text-white/65 text-lg max-w-lg leading-relaxed">
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
                                    className="text-xs font-semibold text-white/55 border border-white/15 rounded-full px-3 py-1.5"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>


                    {/* Right – KCF partner card */}
                    <div className="lg:w-64 xl:w-1/3 shrink-0 flex flex-col gap-4">
                        <div className="bg-white/10 border border-white/20 rounded-3xl p-10 flex flex-col items-center gap-5 w-full">
                            <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Socio tecnológico</span>
                            <div className="relative w-full h-32">
                                <Image
                                    src="https://kcftech.com/wp-content/uploads/2025/05/kcf-logo-1200x630-1.png"
                                    fill
                                    className="object-contain"
                                    alt="Logo KCF Technologies"
                                />
                            </div>
                            <div className="h-px w-full bg-white/10" />
                            <p className="text-white/40 text-xs text-center leading-relaxed">
                                +20 años de experiencia en sensores industriales para mantenimiento predictivo
                            </p>
                            <Link href="https://kcftech.com" target="_blank" rel="noopener noreferrer">
                                <Button variant="primary" ghost className="w-full text-sm">
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
                    <h3 className="text-2xl lg:text-4xl font-bold">
                        3 componentes,{" "}
                        <span className="text-secondary">1 ecosistema conectado</span>
                    </h3>
                    <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
                        Se instalan e interconectan según las necesidades detectadas en tu planta.
                    </p>
                </div>

                {/* Diagram placeholder */}
                <div className="relative w-full aspect-3/1 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <Image
                        src="https://placehold.net/800x600.png"
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
                            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col sm:flex-row"
                        >
                            {/* Image panel – left */}
                            <div className="relative w-full h-48 sm:w-44 lg:w-52 sm:h-auto shrink-0 bg-primary/40">
                                <Image
                                    src={equipo.image}
                                    fill
                                    className="object-contain p-6"
                                    alt={`Imagen del equipo ${equipo.name} de KCF Technologies`}
                                />
                                {/* subtle right-side fade to blend with card body */}
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-primary/60 sm:to-primary/80 pointer-events-none" />
                                <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary/60 sm:to-transparent pointer-events-none sm:hidden" />
                            </div>

                            {/* Content – right */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Top row */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6">
                                    {/* Index badge */}
                                    <div className="shrink-0 w-11 h-11 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center">
                                        <span className="text-secondary font-bold text-base">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    {/* Name + tagline */}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/70">
                                            {equipo.category}
                                        </span>
                                        <h4 className="text-lg font-bold text-white mt-0.5">{equipo.name}</h4>
                                        <p className="text-white/45 text-sm mt-0.5">{equipo.tagline}</p>
                                    </div>

                                    {/* CTAs */}
                                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                                        {equipo.specs.length > 0 && (
                                            <button
                                                onClick={() =>
                                                    setExpanded(expanded === equipo.id ? null : equipo.id)
                                                }
                                                className="text-sm font-semibold text-white/50 hover:text-white border border-white/15 hover:border-white/40 rounded-lg px-4 py-2 transition-all cursor-pointer"
                                            >
                                                {expanded === equipo.id ? "Ocultar specs" : "Ver especificaciones"}
                                            </button>
                                        )}
                                        <Link href="#contacto">
                                            <Button variant="secondary" className="text-sm">
                                                Solicitar información
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="px-6 pb-5 border-t border-white/5 pt-4">
                                    <p className="text-white/55 text-sm leading-relaxed">{equipo.description}</p>
                                </div>

                                {/* Expandable specs */}
                                {equipo.specs.length > 0 && expanded === equipo.id && (
                                    <div className="border-t border-white/10 bg-white/0.03 px-6 py-5">
                                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
                                            Especificaciones Técnicas
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                            {equipo.specs.map((spec) => (
                                                <div
                                                    key={spec.label}
                                                    className="flex gap-3 py-2.5 text-sm border-b border-white/5 last:border-0"
                                                >
                                                    <span className="text-secondary font-semibold shrink-0">
                                                        {spec.label}:
                                                    </span>
                                                    <span className="text-white/70">{spec.value}</span>
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
                <div className="border border-secondary/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-secondary/5">
                    <div>
                        <p className="text-white font-semibold text-lg">
                            ¿La tecnología adecuada para tu operación?
                        </p>
                        <p className="text-white/45 text-sm mt-1">
                            Nuestros especialistas seleccionan y configuran el conjunto correcto para tu planta.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                        <Link href="#contacto">
                            <Button variant="secondary">Hablar con un experto</Button>
                        </Link>
                        <Link href="/metodologia">
                            <Button variant="primary" ghost>Ver metodología</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}