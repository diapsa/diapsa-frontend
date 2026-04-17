import Image from "next/image";
import Button from "@/components/atoms/Button";

export default function CourseMainContent() {
    return (
        <div className="relative w-full bg-primary flex flex-col md:flex-row min-h-72 md:min-h-120">
            {/* Contenido izquierdo */}
            <div className="relative z-10 flex flex-col justify-center gap-5 p-8 sm:p-10 md:p-12 w-full md:w-1/2 md:shrink-0">
                <span className="py-1 px-3 bg-secondary text-white text-xs font-semibold uppercase tracking-widest rounded-sm w-fit">
                    FEATURED DIPLOMADO
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
                    CONFIABILIDAD{" "}
                    <span className="text-secondary block">RCM</span>
                </h1>
                <p className="text-white/80 text-sm sm:text-base max-w-sm leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident sequi a,
                    exercitationem ullam et temporibus, quisquam, sit vero fugiat fuga.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Button variant="secondary">Inscribirme →</Button>
                    <Button variant="primary" ghost>Ver temario</Button>
                </div>
            </div>

            {/* Imagen derecha — en móvil actúa como fondo detrás del contenido */}
            <div className="absolute inset-0 md:static  md:w-1/2 h-full">
                <Image
                    src="/images/vision-image.jpeg"
                    alt="Técnico tomando Diplomado"
                    fill
                    priority
                    className="object-cover"
                />
                {/* En móvil: overlay denso para asegurar legibilidad del texto encima */}
                <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/80 to-primary/40 md:from-primary md:via-primary/60 md:to-primary/20" />
            </div>
        </div>
    )
}