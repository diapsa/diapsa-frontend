import Button from "@/components/atoms/Button";
import Link from "next/link";
import Image from "next/image";

export default function ContinuosMonitoringCta() {
    return (
        <section className="relative min-h-screen bg-primary py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 opacity-20">
                <Image
                    src="/images/monitoreo-continuo/fondo-mantenimiento.jpg"
                    alt="Decorativo (se usa al 20% de opacidad como textura de fondo)"
                    fill
                    className="object-cover"
                />
            </div>
            {/* Línea decorativa */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
            {/* Glow principal */}
            <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
            {/* Glow secundario */}
            <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-primary/40 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    Convierte tus datos en{" "}
                    <span className="text-secondary">decisiones reales</span>
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Nuestros especialistas están listos para diagnosticar tu programa y
                    diseñar la solución correcta para tu planta.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <Link href="/contacto?motivo=servicios">
                        <Button variant="secondary" className="px-10 py-4 text-lg">
                            Solicitar diagnóstico
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />
        </section>
    );
}
