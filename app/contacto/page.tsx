import type { Metadata } from "next";
import ContactFormGeneral from "@/components/organisms/ContactFormGeneral";
import PageHeader from "@/components/organisms/PageHeader";

export const metadata: Metadata = {
    title: "Contacto",
    description: "Solicita un diagnóstico sin costo para tu planta industrial. Expertos en mantenimiento predictivo, monitoreo de condición y detección de gases listos para ayudarte.",
    alternates: {
        canonical: "/contacto",
    },
    openGraph: {
        title: "Contacto — Grupo DIAPSA",
        description: "Habla con un experto en mantenimiento predictivo. Respuesta en menos de 24 horas.",
        url: "/contacto",
        type: "website",
    },
};

export default function ContactPage() {
    return (
        <main className="bg-white">
            <PageHeader
                title="Hablemos de tu planta"
                subtitle="Un diagnóstico a tiempo puede evitar una parada de producción. Cuéntanos tu caso."
                breadcrumbs={[
                    { label: "Inicio", link: "/" },
                    { label: "Contacto", link: "/contacto" },
                ]}
            />

            {/* Main contact section — dark theme */}
            <section className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
                {/* Glows */}
                <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-100 h-100 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                        {/* Left — value proposition + trust signals + contact details */}
                        <div className="flex flex-col gap-8 lg:sticky lg:top-28">

                            {/* Badge */}
                            <span className="inline-block self-start text-secondary text-xs font-semibold tracking-widest uppercase border border-secondary/40 rounded-full px-3 py-1 bg-secondary/10">
                                Habla con un experto
                            </span>

                            {/* Headline */}
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                                    TRANSFORMAMOS DATOS EN{" "}
                                    <span className="text-secondary">DECISIONES QUE PROTEGEN TU PRODUCCIÓN</span>
                                </h2>
                                <p className="text-white/70 text-lg leading-relaxed">
                                    Cada hora de paro no programado cuesta más que un año de mantenimiento predictivo.
                                    Nuestro equipo de ingenieros está listo para diseñar una estrategia a la medida de tu operación — desde programas de monitoreo completos hasta la venta de equipos especializados como cámaras acústicas, térmicas y sensores de vibración.
                                </p>
                            </div>

                            {/* Trust signals */}
                            <div className="flex flex-col gap-3">
                                {[
                                    {
                                        icon: (
                                            <svg className="w-5 h-5 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        ),
                                        title: "Respuesta en menos de 24 h",
                                        desc: "Un ingeniero especialista revisará tu caso el mismo día hábil.",
                                    },
                                    {
                                        icon: (
                                            <svg className="w-5 h-5 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                                            </svg>
                                        ),
                                        title: "Disciplinas a la medida de tu planta",
                                        desc: "Termografía infrarroja, vibraciones mecánicas, ultrasonido, estudios eléctricos y monitoreo continuo — la técnica correcta para cada activo.",
                                    },
                                    {
                                        icon: (
                                            <svg className="w-5 h-5 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ),
                                        title: "Tecnología de vanguardia disponible",
                                        desc: "Cámaras acústicas Hertzinno, y sensores de vibración KCF — podemos cotizar el equipo ideal o implementar un programa completo de monitoreo.",
                                    },
                                    {
                                        icon: (
                                            <svg className="w-5 h-5 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                        ),
                                        title: "+20 años en la industria",
                                        desc: "Experiencia real en manufactura, energía y proceso continuo.",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-4 p-4 bg-white/10 rounded-sm border border-white/15 hover:border-secondary/50 transition-colors duration-300"
                                    >
                                        <span className="mt-0.5">{item.icon}</span>
                                        <div>
                                            <p className="font-bold text-white text-sm">{item.title}</p>
                                            <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* KPIs */}
                            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                                {[
                                    { value: "+500", label: "Plantas atendidas" },
                                    { value: "98%", label: "Tasa de satisfacción" },
                                    { value: "24 h", label: "Tiempo de respuesta" },
                                ].map((kpi) => (
                                    <div key={kpi.label} className="text-center">
                                        <span className="block text-2xl font-extrabold text-secondary">{kpi.value}</span>
                                        <span className="block text-xs uppercase tracking-wider text-white/60 mt-1">{kpi.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Contact details */}
                            <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
                                <p className="text-xs uppercase tracking-widest text-secondary font-semibold mb-1">
                                    O contáctenos directamente
                                </p>
                                <a
                                    href="tel:+528145903792"
                                    className="flex items-center gap-3 text-white/80 hover:text-secondary transition-colors duration-200 text-sm group"
                                >
                                    <svg className="w-4 h-4 shrink-0 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +52 (81) 4590-3792
                                </a>
                                <a
                                    href="mailto:info@grupodiapsa.com"
                                    className="flex items-center gap-3 text-white/80 hover:text-secondary transition-colors duration-200 text-sm group"
                                >
                                    <svg className="w-4 h-4 shrink-0 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    info@grupodiapsa.com
                                </a>
                            </div>
                        </div>

                        {/* Right — form in white card */}
                        <div className="bg-white  p-8 space-y-6 shadow-2xl shadow-secondary/50 ring-1 ring-secondary rounded-sm">
                            <div className="mb-6 border-b border-gray-100 pb-5">
                                <h3 className="text-xl font-extrabold text-primary">Cuéntanos tu caso</h3>
                                <p className="text-tertiary text-sm mt-1">
                                    Completa el formulario y un especialista te contactará a la brevedad.
                                </p>
                            </div>
                            <ContactFormGeneral />
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}