import { TimerCourses } from "../molecules/TimerCourses";

export function CoursesNCerts() {
    return (
        <section className="w-full space-y-4 bg-white flex flex-col justify-center items-center py-6 text-black">
            <h2 className="text-center text-4xl font-extrabold">
                COMPROMISO <br />
                CON EL DESARROLLO <br />
                DE PROFESIONALES
            </h2>
            <div className="border-4 border-secondary w-2xl" />

            <h3 className="text-3xl">Cursos y Certificaciones</h3>

            <p className="text-center">
                En DIAPSA creemos en compartir el conocimiento que transforma la industria. Por eso <br />
                diseñamos <b>cursos y certificados</b> que forman expertos capaces de anticipar fallas, <br />
                interpretar datos y tomar decisiones clave.
            </p>
            <p className="font-bold">Más que teoría, brindamos herramientas reales para elevar la confiabilidad operativa.</p>

            <TimerCourses />

        </section>
    )
}