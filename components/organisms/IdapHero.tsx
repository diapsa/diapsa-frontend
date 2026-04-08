import Button from "@/components/atoms/Button"
import Image from "next/image"

export default function IdapHero() {
    return (
        <div className="relative bg-primary flex items-stretch h-screen overflow-hidden">

            {/* ── Fondo: rejilla sutil ── */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fc9f01 1px, transparent 1px), linear-gradient(90deg, #fc9f01 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* ── Acento naranja: blob superior izquierdo ── */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

            {/* ── Acento naranja: línea vertical izquierda ── */}
            <div className="absolute left-8 top-1/4 h-1/2 w-1 bg-linear-to-b from-transparent via-secondary to-transparent opacity-60" />

            {/* ── Acento azul oscuro: separador diagonal ── */}
            <div
                className="absolute inset-y-0 left-1/2 w-1/2 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(105deg, transparent 0%, #001f30 60%, #001520 100%)",
                }}
            />

            {/* ══ COLUMNA IZQUIERDA — TEXTO ══ */}
            <div className="relative z-10 w-full lg:w-1/2 text-white px-8 lg:ps-20 2xl:ps-28 flex flex-col justify-center space-y-8 2xl:space-y-10">

                {/* Badge de categoría */}
                <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 backdrop-blur-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                        Plataforma Tecnológica
                    </span>
                </div>

                {/* Título + subtítulo */}
                <div className="space-y-3">
                    <h1 className="text-8xl 2xl:text-[9rem] font-black leading-none tracking-tight">
                        <span className="text-secondary">I</span>DAP
                    </h1>

                    {/* Línea acento + tagline */}
                    <div className="flex items-center gap-3">
                        <div className="h-0.5 w-12 rounded-full bg-secondary" />
                        <p className="text-sm italic text-gray-300">
                            Inspection, Diagnostic &amp; Asset Platform
                        </p>
                    </div>
                </div>

                {/* Descripción con palabra clave resaltada */}
                <p className="max-w-md 2xl:max-w-xl text-lg 2xl:text-xl leading-relaxed text-gray-300">
                    Plataforma desarrollada para la{" "}
                    <span className="font-semibold text-secondary">
                        gestión integral de resultados
                    </span>{" "}
                    basados en el monitoreo de condición de activos industriales.
                </p>

                {/* Métricas clave */}
                <div className="flex flex-wrap gap-x-6 gap-y-4">
                    {[
                        { value: "+500", label: "Activos monitoreados" },
                        { value: "24/7", label: "Disponibilidad" },
                        { value: "Real-time", label: "Datos en vivo" },
                    ].map(({ value, label }) => (
                        <div key={label} className="flex flex-col">
                            <span className="text-2xl 2xl:text-3xl font-bold text-secondary">{value}</span>
                            <span className="text-xs 2xl:text-sm text-gray-400">{label}</span>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 pt-2">
                    <Button variant="secondary">Solicitar demo</Button>
                    <Button variant="primary" ghost ghostVariant="dark">
                        Conocer más
                    </Button>
                </div>
            </div>

            {/* ══ COLUMNA DERECHA — GRÁFICA ══ */}
            <div className="relative z-10 hidden lg:flex w-1/2 flex-col py-12 2xl:py-16 justify-center items-end">

                {/* Halo naranja detrás del panel */}
                <div className="absolute right-24 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

                {/* Frame del panel */}
                <div
                    className="relative mr-0 w-full flex-1 overflow-hidden rounded-tl-2xl rounded-bl-2xl flex flex-col"

                >
                    {/* Barra superior de "ventana" de app */}
                    <div className="flex-none flex h-9 items-center gap-2 bg-primary/80 px-4 backdrop-blur-sm border-b border-white/10">
                        <span className="h-2.5 w-2.5 rounded-full bg-secondary/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                        <span className="ml-4 text-xs text-white/40 font-mono">
                            idap.diapsa.com / activos / tendencias
                        </span>
                    </div>

                    {/* Gráfica */}
                    <div className="relative flex-1 overflow-hidden">
                        <Image src="/images/idap/chart.png" fill className="object-cover " alt="Dashboard de IDAP" />
                    </div>
                </div>
            </div>

            {/* ── Acento inferior: línea degradada ── */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/40 to-transparent" />
        </div>
    )
}