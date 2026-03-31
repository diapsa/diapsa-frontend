'use client';
import Image from "next/image";
import Button from "@/components/atoms/Button";

interface Props {
    onOpenModal: () => void;
}

const features = [
    { icon: "01", title: "INNOVACIÓN", description: "La PRIMERA detección ultrasonica y de imagenes térmicas a grandes distancias." },
    { icon: "02", title: "ALCANCE", description: "Traductor ultrasonico de alta sensibilidad con cobertura audible y ultrasonica" },
    { icon: "03", title: "SEGURIDAD", description: "Detección a larga distancia mas eficiente y segura sin contacto" },
    { icon: "04", title: "AI", description: "Reconocimiento del modo de patrón de la descarga parcial con impulsado con IA." },
];

const steps = [
    { step: "1", title: "Cámaras acústicas con fugas", description: "Reducción de ruido avanzada impulsada por procesamiento espacial, de frecuencia, de dominio temporal y aprendizaje profundo" },
    { step: "2", title: "Cámaras acústicas con equipo mecanico rotatorio", description: "Solución de problemas de desgaste a baja velocidad que los sensores de vibración no pueden manejar" },
];

const galleryPlaceholders = [
    "/images/deteccion-gas/acustic_cameras_in_action_2.jpg",
    "/images/deteccion-gas/acustic_cameras_in_action_3.jpg",
    "/images/deteccion-gas/acustic_cameras_in_action_4.jpg",
    "/images/deteccion-gas/acustic_cameras_in_action_5.jpg",
];

export default function GasDetectionTechnology({ onOpenModal }: Props) {
    return (
        <section className="w-full bg-primary overflow-hidden">

            {/* ── Hero Banner ── */}
            <div className="relative flex flex-col lg:flex-row items-center min-h-[70vh] px-10 lg:px-24 py-24 gap-12">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-150 h-150 rounded-full bg-secondary/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-white/5 blur-2xl" />
                </div>

                {/* Left – text */}
                <div className="relative z-10 flex flex-col gap-8 lg:w-1/2">
                    <div className="flex items-center gap-3 w-fit bg-white/10 border border-white/20 rounded-full px-4 py-2">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">
                            Tecnología de vanguardia
                        </span>
                    </div>

                    <h2 className="text-white text-5xl lg:text-7xl font-bold leading-tight">
                        Camaras <span className="text-secondary">termicas y acusticas</span>
                    </h2>

                    {/* Intro – highlighted key concepts */}
                    <div className="flex flex-col gap-4 max-w-lg">
                        <p className="text-white/80 text-lg leading-relaxed">
                            En DIAPSA, creemos en tener el mejor equipo para darte los mejores servicos por ello
                            usamos las camaras acusticas de <span className="text-secondary font-bold">Hertzinno</span>
                        </p>

                        {/* Sensor pills */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {["Acústico", "Térmico", "Láser TDLAS"].map((sensor) => (
                                <span
                                    key={sensor}
                                    className="text-xs font-semibold tracking-wide text-white/70 border border-white/20 bg-white/5 rounded-full px-3 py-1"
                                >
                                    {sensor}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-10 mt-4 border-t border-white/10 pt-8">
                        {[
                            { value: "128", label: "Microfonos MEMS" },
                            { value: "130MP", label: "Cámara optica" },
                            { value: "7hrs ", label: "Tempo operación" },
                            { value: "200m", label: "Distancia operación" },
                        ].map(({ value, label }) => (
                            <div key={label} className="flex flex-col gap-1">
                                <span className="text-secondary text-4xl font-bold">{value}</span>
                                <span className="text-white/50 text-sm">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right – logo card */}
                <div className="relative z-10 lg:w-1/2 flex flex-col items-center gap-8">
                    <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-3xl p-10 flex items-center justify-center w-full max-w-sm aspect-square">
                        <div className="relative w-full h-full">
                            <Image
                                src="/images/hertzinno/Logo-Hertzinno.png"
                                fill
                                className="object-contain"
                                alt="Logo Hertzinno – pionero tecnología TDLAS"
                            />
                        </div>
                    </div>
                    <p className="text-white/40 text-sm text-center">
                        En alianza con{" "}
                        <span className="text-white/70 font-semibold">Hertzinno</span>,
                        líder en tecnología TDLAS
                    </p>
                </div>
            </div>

            {/* ── Feature Cards ── */}
            <div className="bg-white/5 border-t border-white/10 px-10 lg:px-24 py-20">
                <p className="text-secondary font-bold tracking-widest text-sm text-center uppercase mb-4">
                    Capacidades
                </p>
                <h3 className="text-white text-3xl lg:text-5xl font-bold text-center mb-16 max-w-2xl mx-auto leading-tight">
                    ¿Que hace <span className="text-secondary font-bold">diferente</span> a las cámaras acusticas de <span className="text-secondary font-bold">Hertzinno?</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {features.map(({ icon, title, description }) => (
                        <div
                            key={icon}
                            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/40 rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300"
                        >
                            <span className="text-secondary/60 text-3xl font-black">{icon}</span>
                            <h4 className="text-white font-bold text-2xl">{title}</h4>
                            <p className="text-white/50 text-lg leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── How it Works ── */}
            <div className="px-10 lg:px-24 py-24">
                <p className="text-secondary font-bold tracking-widest text-sm uppercase mb-4">Resultados</p>
                <h3 className="text-white text-3xl lg:text-5xl font-bold mb-16 max-w-xl leading-tight">
                    Impacto de las cámaras acústicas en la industria.
                </h3>

                <div className="flex flex-col gap-0 max-w-4xl">
                    {steps.map(({ step, title, description }, i) => (
                        <div key={step} className="flex gap-8 items-start">
                            <div className="flex flex-col items-center shrink-0">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-black text-lg">
                                    {step}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-px h-16 bg-white/10 my-1" />
                                )}
                            </div>
                            <div className="pb-12">
                                <h4 className="text-white font-bold text-xl mb-2">{title}</h4>
                                <p className="text-white/50 text-sm leading-relaxed max-w-xl">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Image Gallery ── */}
            <div className="px-10 lg:px-24 pb-24">
                <p className="text-secondary font-bold tracking-widest text-sm uppercase mb-4">Galería</p>
                <h3 className="text-white text-3xl lg:text-4xl font-bold mb-12">
                    La tecnología en acción
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="col-span-2 row-span-2 relative h-80 lg:h-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">

                        <Image src="/images/deteccion-gas/acustic_cameras_in_action_1.png" fill alt={`Camara acustica en acción`} />
                    </div>
                    {galleryPlaceholders.map((src, index) => (
                        <div
                            key={index}
                            className="relative h-44 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center"
                        >
                            <Image src={src} fill alt={`Camara acustica en acción. img-${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA Banner ── */}
            <div className="bg-secondary/10 border-t border-secondary/20 px-10 lg:px-24 py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-3">
                    <h3 className="text-white text-3xl font-bold">
                        ¿Listo para adoptar la siguiente generación?
                    </h3>
                    <p className="text-white/50 text-base max-w-xl">
                        [Frase de cierre invitando al cliente a conocer más o agendar una demostración de la tecnología TLA.]
                    </p>
                </div>
                <div className="flex gap-4 shrink-0">
                    <Button variant="secondary" onClick={onOpenModal}>
                        Solicitar demostración
                    </Button>
                </div>
            </div>

        </section>
    );
}