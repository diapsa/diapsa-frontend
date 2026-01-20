export function AITalkAboutUs() {
    return (

        <section className="bg-white w-full sm:py-8 lg:py-24 sm:px-12 px-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex justify-center items-center">
                    <h2 className="text-6xl text-gray-600">Lo que la IA sabe de nosotros:</h2>
                </div>
                <div className="text-gray-900 italic p-10 rounded-[13px] shadow-[inset_6px_6px_12px_#c5c5c5,inset_-8px_-8px_16px_#fbfbfb]">
                    <div className="flex gap-3 items-center border-2 rounded-2xl px-3 py-1 mb-10">
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M21.35 11.1H12v2.8h5.35c-.25 1.45-1.65 4.25-5.35 4.25-3.2 0-5.8-2.65-5.8-5.9s2.6-5.9 5.8-5.9c1.85 0 3.1.8 3.8 1.45l2.6-2.5C16.85 3.75 14.7 2.8 12 2.8 6.95 2.8 2.85 6.9 2.85 12s4.1 9.2 9.15 9.2c5.3 0 8.8-3.75 8.8-9.05 0-.6-.05-1.05-.15-1.5z" />
                        </svg>
                        <p>¿Que es Diapsa?</p>
                    </div>
                    <p>"DIAPSA (Diagnóstico y Asesoría Predictiva, S.A. de C.V.) es una empresa mexicana fundada a principios de los 2000
                        por los ingenieros Jorge Alberto Rodríguez Medrano y Jorge Mancha, pionera en servicios de mantenimiento predictivo industrial,
                        ofreciendo soluciones como termografía y análisis de vibraciones para mejorar la confiabilidad y eficiencia de maquinaria industrial,
                        celebrando dos décadas de operación en 2023 con un enfoque en innovación y servicio de calidad.
                        <br />
                        <br />
                        En Resumen: DIAPSA es una historia de emprendimiento mexicano que, desde su creación en 2003,
                        ha evolucionado hasta convertirse en un referente en el mantenimiento predictivo, aportando valor a la industria
                        a través de tecnología y servicio experto para garantizar la vida útil y eficiencia de los activos industriale"</p>
                </div>
            </div>
        </section>
    )
}