import Link from "next/link";

const faqs = [
    {
        q: "¿Hay que detener la producción para medir?",
        a: "No. Vibraciones, termografía, ultrasonido, calidad de energía y la toma de muestras de aceite se hacen con los equipos en operación normal. Esa es justamente la ventaja: datos reales sin paros programados.",
    },
    {
        q: "¿Cada cuánto hay que medir?",
        a: "Depende de qué tan críticos son tus equipos. Para los críticos de proceso continuo solemos recomendar rutas mensuales o trimestrales; para el resto, semestrales pueden bastar. La frecuencia de cada equipo se define en el plan inicial.",
    },
    {
        q: "¿Cuándo se ven resultados?",
        a: "Los primeros hallazgos salen desde la primera ruta. El ahorro en paros y refacciones se nota conforme el programa acumula historial y las intervenciones se planean con datos.",
    },
    {
        q: "¿Sale caro comparado con el correctivo?",
        a: "Compáralo con lo que te cuesta una hora de línea parada, más la reparación de emergencia y la refacción comprada con urgencia. Un solo paro evitado en un equipo crítico suele cubrir con creces el programa.",
    },
    {
        q: "¿Trabajan con maquinaria antigua?",
        a: "Sí, con cualquier equipo en operación sin importar su antigüedad. Los más antiguos suelen ser los que más ganan con el monitoreo: ya no tienen garantía y su riesgo de falla es mayor.",
    },
    {
        q: "¿Necesito un especialista para entender los informes?",
        a: "No. Los informes están hechos para que los entiendan mantenimiento y gerencia: resumen ejecutivo, hallazgos ordenados por severidad y recomendaciones en lenguaje claro.",
    },
    {
        q: "¿Tienen experiencia en mi industria?",
        a: "En más de 20 años hemos trabajado en manufactura, generación de energía, petroquímica, tratamiento de agua, alimentos y otras industrias. Conocemos los equipos típicos de cada sector y cómo suelen fallar.",
    },
    {
        q: "Si encuentran una falla, ¿ustedes la reparan?",
        a: "Nuestro trabajo es diagnosticar. Te entregamos el hallazgo con su severidad y la recomendación de qué hacer, y tu equipo o tu taller repara sabiendo exactamente qué. La excepción es la alineación y el balanceo: esos los corregimos en campo.",
    },
];

export default function MCFaq() {
    return (
        <section className="w-full bg-white py-16 lg:py-24 relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-4xl mx-auto px-6 relative z-10">

                <div className="text-center mb-12">

                    <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-4">
                        PREGUNTAS <span className="text-secondary">FRECUENTES</span>
                    </h2>
                    <p className="text-tertiary text-lg max-w-2xl mx-auto">
                        Las dudas más comunes antes de empezar.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <details
                            key={i}
                            className="group border border-gray-100 rounded-sm bg-white shadow-sm open:shadow-md transition-all duration-300"
                        >
                            <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none font-bold text-primary text-sm hover:text-secondary transition-colors">
                                {faq.q}
                                <svg
                                    className="w-4 h-4 shrink-0 text-secondary transition-transform duration-300 group-open:rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="px-6 pb-5 text-justify text-sm text-tertiary leading-relaxed border-t border-gray-100 pt-4">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <p className="mb-5 text-sm text-tertiary">
                        ¿Tu caso necesita una respuesta más específica?
                    </p>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 rounded-xs bg-primary px-8 py-3 font-bold text-white shadow-md transition-colors hover:bg-secondary hover:text-primary"
                    >
                        Resolver una duda sobre mi planta
                        <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
