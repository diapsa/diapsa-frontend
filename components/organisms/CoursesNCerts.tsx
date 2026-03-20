import { TimerCourses } from "../molecules/TimerCourses";

export function CoursesNCerts() {
    return (
        <section className="w-full bg-white content-center-safe space-y-6 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center space-y-12">
                {/* Texto principal */}
                <div className="text-start space-y-6 w-full md:w-1/2">
                    <div className="space-y-4 text-base sm:text-lg text-black  mx-auto">
                        <h3 className="text-3xl md:text-5xl font-extrabold text-black pt-4">
                            Cursos y Certificaciones
                        </h3>
                        <p className="leading-relaxed">
                            En DIAPSA creemos en compartir el conocimiento que transforma la industria. <br /> Por eso
                            diseñamos <b>cursos y certificados</b> que forman expertos capaces de anticipar fallas,
                            interpretar datos y tomar decisiones clave.
                        </p>
                        <p className="font-bold text-primary">
                            Más que teoría, brindamos herramientas reales para elevar la confiabilidad operativa.
                        </p>
                    </div>
                </div>
                {/* Timer de cursos */}
                <div className="w-full md:w-1/2">
                    <TimerCourses />
                </div>
            </div>
            <h2 className="text-4xl text-center lg:text-4xl italic text-gray-700 leading-tight">
                COMPROMETIDOS
                CON EL <br /> DESARROLLO
                DE PROFESIONALES
            </h2>

        </section>
    )
}