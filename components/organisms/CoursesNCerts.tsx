import { TimerCourses } from "../molecules/TimerCourses";

export function CoursesNCerts() {
    return (
        <section className="w-full bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex flex-col items-center space-y-12">
                {/* Texto principal */}
                <div className="text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black leading-tight">
                        COMPROMISO <br />
                        CON EL DESARROLLO <br />
                        DE PROFESIONALES
                    </h2>

                    <div className="flex justify-center">
                        <div className="border-4 border-secondary w-24 sm:w-32" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-black pt-4">
                        Cursos y Certificaciones
                    </h3>

                    <div className="space-y-4 text-base sm:text-lg text-black max-w-3xl mx-auto">
                        <p className="leading-relaxed">
                            En DIAPSA creemos en compartir el conocimiento que transforma la industria. Por eso
                            diseñamos <b>cursos y certificados</b> que forman expertos capaces de anticipar fallas,
                            interpretar datos y tomar decisiones clave.
                        </p>
                        <p className="font-bold text-primary">
                            Más que teoría, brindamos herramientas reales para elevar la confiabilidad operativa.
                        </p>
                    </div>
                </div>

                {/* Timer de cursos */}
                <div className="w-full max-w-5xl">
                    <TimerCourses />
                </div>
            </div>
        </section>
    )
}