import Image from "next/image"
export function MisionVisionSection() {
    return (
        <section className="w-full bg-white py-10 space-y-4">
            <div className="space-y-2 mb-16 px-8" >
                <div className="flex flex-col items-center">
                    <p className="bg-secondary/10 p-2 text-secondary rounded-lg font-bold">Exelencia operativa</p>
                </div>
                <h2 className="text-black text-4xl font-extrabold text-center">Comprometidos con la  <span className="text-secondary">Confiabilidad</span></h2>
                <p className="text-black text-center">Somos lideres en mantenimiento predicivo y monitoreo de condiciones, asegurando que su planta opera con la maxima eficiencia y seguridad</p>

            </div>
            {/* Misión */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 items-center p-8 lg:px-28 lg:py-0 md:min-h-[50vh]">
                <div className="md:py-16">
                    <h3 className="font-semibold text-2xl text-gray-600 border-b-4 border-secondary mb-4 pb-2">Nuestra misión</h3>
                    <p className="text-lg italic text-gray-700 leading-relaxed">
                        "Ser líderes en las disciplinas que
                        desarrollamos a través de un servicio de calidad, precisión y rapidez, beneficiando a
                        nuestros clientes, incrementando la confiabilidad de los equipos y la productividad de
                        la planta."
                    </p>
                </div>
                <div className="relative w-full h-full rounded-4xl border-e-4 border-t-4 border-secondary hidden md:block p-4">
                    <div className="relative w-full h-full overflow-hidden rounded-2xl">
                        <Image
                            src="/images/metodologia/metodologia-1.jpg"
                            fill
                            className="object-cover"
                            alt="Representación de la misión de la empresa"
                        />
                    </div>
                </div>
            </div>

            {/* Visión */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 items-center p-8 lg:px-28 lg:py-0 md:min-h-[50vh]">
                <div className="relative w-full h-full rounded-4xl border-b-4 border-s-4 border-primary hidden md:block p-4">
                    <div className="relative w-full h-full overflow-hidden rounded-2xl">
                        <Image
                            src="/images/metodologia/metodologia-1.jpg"
                            fill
                            className="object-cover"
                            alt="Representación de la misión de la empresa"
                        />
                    </div>
                </div>
                <div className="md:py-16">
                    <h3 className="font-semibold text-2xl text-gray-600  border-b-4 border-primary mb-4 pb-2">Nuestra visión</h3>
                    <p className="text-lg italic text-gray-700 leading-relaxed">
                        "Elevar la confiabilidad y seguridad de las plantas a través
                        del monitoreo de condición del estado de la maquinaria mediante herramientas
                        predictivas, desarrollando los servicios con eficiencia y calidad, comprometidos como
                        equipo con las normativas de seguridad e higiene."
                    </p>
                </div>
            </div>
        </section>
    )
}