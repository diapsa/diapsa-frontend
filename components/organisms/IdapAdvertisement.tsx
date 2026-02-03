import Image from "next/image"
export function IdapAdvertisementSection() {
    return (
        <section className="w-full bg-black py-2 md:py-16 lg:py-24 border-y-4 border-secondary">
            <div className="px-8 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="relative overflow-hidden hidden md:block">
                    <Image
                        fill
                        alt="Imagen de IDAP"
                        src="/images/idap/mockup2.png"
                        className="object-cover"
                    />
                </div>
                <div className="py-10">
                    <h2 className="text-4xl text-white font-extrabold leading-thight">Nuestra plataforma IDAP</h2>
                    <h3 className="text-gray-400">Inspection Diagnostic and Assets Plataform</h3>
                    <hr className="border-2 border-secondary my-2" />
                    <div className="space-y-5 py-10">
                        <p className="font-semibold text-2xl text-white">IDAP transforma el monitoreo de condición en decisiones confiables.</p>
                        <p className="text-white">
                            Una plataforma que centraliza la información técnica de los activos industriales y permite visualizar su estado,
                            priorizar riesgos y anticiparse a fallas que afectan la operación.</p>

                        <a href="#historia" className="text-secondary font-semibold text-lg hover:underline inline-flex items-center gap-2">
                            CONOCE MÁS ACERCA DE NUESTRA PLATAFORMA
                            <span>→</span>
                        </a>
                    </div>

                </div>
            </div>
        </section>
    )
}