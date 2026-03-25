import { TimerCourses } from "../molecules/TimerCourses";

const stats = [
    { value: "+15", label: "Cursos disponibles" },
    { value: "+500", label: "Profesionales formados" },
    { value: "3", label: "Modalidades de capacitación" },
];

const highlights = [
    { icon: "🎯", text: "Certificaciones alineadas a normas internacionales" },
    { icon: "🏭", text: "Casos reales de la industria" },
    { icon: "👨‍🏫", text: "Instructores con experiencia en campo" },
];

export function CoursesNCerts() {
    return (
        <section className="w-full bg-white py-12 sm:px-6">
            <div className="mx-auto flex flex-col md:flex-row justify-between gap-10 items-center">
                {/* ── Columna izquierda: texto + stats + highlights ── */}
                <div className="flex flex-col gap-6 w-full md:w-1/2">
                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 w-fit bg-secondary/10 text-secondary font-semibold text-sm px-3 py-1 rounded-full uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        Programa de capacitación
                    </span>

                    {/* Título principal */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight">
                            Cursos y
                        </h2>
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                            <span className="text-secondary">Certificaciones</span>
                        </h2>
                    </div>

                    {/* Párrafo descriptivo */}
                    <p className="text-gray-600 text-base leading-relaxed max-w-lg">
                        En DIAPSA compartimos el conocimiento que transforma la industria.
                        Diseñamos <strong className="text-primary">cursos y certificaciones</strong> que
                        forman expertos capaces de anticipar fallas, interpretar datos y tomar
                        decisiones clave con confianza.
                    </p>

                    {/* Highlights */}
                    <ul className="flex flex-col gap-2">
                        {highlights.map((h) => (
                            <li key={h.text} className="flex items-center gap-3 text-sm text-gray-700">
                                <span className="text-lg">{h.icon}</span>
                                {h.text}
                            </li>
                        ))}
                    </ul>

                    {/* Separador */}
                    <div className="w-16 h-1 rounded-full bg-secondary" />

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6">
                        {stats.map((s) => (
                            <div key={s.label} className="flex flex-col">
                                <span className="text-3xl font-extrabold text-primary">{s.value}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Columna derecha: Timer ── */}
                <div className="w-full md:w-1/2">
                    <TimerCourses />
                </div>
            </div>
        </section>
    );
}