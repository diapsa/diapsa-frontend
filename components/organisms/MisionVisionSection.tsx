import Image from "next/image"
export function MisionVisionSection() {
    return (
        <section className="w-full bg-white py-16 lg:py-16">
            {/* Misión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-8 lg:px-16 mb-16">
                <div className="px-6">
                    <h3 className="text-2xl text-gray-600 font-bold border-b-4 border-secondary mb-4 pb-2">Nuestra misión</h3>
                    <p className="text-center text-lg italic text-gray-700 leading-relaxed">
                        "Ser líderes en las disciplinas que
                        desarrollamos a través de un servicio de calidad, precisión y rapidez, beneficiando a
                        nuestros clientes, incrementando la confiabilidad de los equipos y la productividad de
                        la planta."
                    </p>
                </div>
                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md hidden md:block ">
                    <Image
                        src="/images/metodologia/metodologia-1.jpg"
                        fill
                        className="hidden md:block object-cover"
                        alt="Representación de la misión de la empresa" />
                </div>
            </div>

            {/* Visión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-8 lg:px-16 ">
                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md xs:order-2 hidden md:block ">
                    <Image
                        src="/images/metodologia/metodologia-1.jpg"
                        fill
                        className="hidden md:block object-cover"
                        alt="Representación de la visión de la empresa" />
                </div>
                <div className="px-6 xs:order-1">
                    <h3 className="text-2xl text-gray-600 font-bold border-b-4 border-secondary mb-4 pb-2">Nuestra visión</h3>
                    <p className="text-center text-lg italic text-gray-700 leading-relaxed">
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