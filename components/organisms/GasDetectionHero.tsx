'use client';
import Image from "next/image";
import Button from "@/components/atoms/Button";

interface Props {
    onOpenModal: () => void;
}

export default function GasDetectionHero({ onOpenModal }: Props) {
    return (
        <section className="relative min-h-screen flex flex-col lg:flex-row items-center px-10 lg:px-24 py-24 gap-16 overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-125 h-125 rounded-full bg-secondary/5 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-75 h-75 rounded-full bg-primary/5 blur-2xl" />
            </div>

            <div className="relative z-10 space-y-8 text-black flex flex-col justify-center lg:w-1/2">
                {/* Badge */}
                <div className="flex items-center gap-3 w-fit bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-primary/70 text-sm font-semibold tracking-widest uppercase">
                        Sector Hidrocarburos
                    </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-black">
                    Detección de <span className="text-secondary lg:block">Gases</span>
                </h1>

                <p className="text-black/70 text-xl lg:w-5/6 leading-relaxed">
                    Cumplimiento regulatorio <strong>PPCIEM</strong> y mitigación de riesgos
                    por emisiones de metano en el sector hidrocarburos. <br />
                    Protegemos su operación y el medio ambiente.
                </p>
                <p className="text-gray-500 text-base lg:w-5/6 leading-relaxed">
                    Evite multas ASEA y reduzca emisiones de metano antes de la próxima auditoría.
                    Nuestro equipo especializado detecta lo que el ojo no puede ver.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button variant="primary" onClick={onOpenModal}>
                        Solicitar información
                    </Button>
                </div>
            </div>

            <div className="relative z-10 h-112 w-full lg:w-1/2 lg:h-144 shrink-0">
                <Image
                    src="/images/deteccion-gas/deteccion-gas-ppciem.jpg"
                    alt="Detector de Gas"
                    fill
                    className="object-cover rounded-3xl"
                />
            </div>
        </section>
    );
}
