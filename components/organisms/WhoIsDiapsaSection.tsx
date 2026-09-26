import Image from "next/image"
import { CheckCircleIcon } from "../atoms/icons/CheckCircleIcon"
export function WhoIsDiapsaSection() {
    return (
        <section className="w-full bg-white py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                    <div className="py-6 space-y-6">
                        <hr className="border-2 border-secondary w-16 " />
                        <h2 className="text-black text-4xl font-extrabold leading-tight">¿Quiénes son <br /> <span className="text-secondary">GRUPO DIAPSA?</span> </h2>
                        <p className="text-black text-lg">Somos una empresa mexicana lider en mantenimiento predictivo industrial, especializada en ofrecer servicios,
                            equipos y capacitacion en monitoreo de condicion para sectores estrategicos en Mexico y Sudamerica. </p>
                        <p className="text-black text-lg"> Ayudamos a las organizaciones a
                            incrementar la confiabilidad de sus equipos críticos, reducir fallas no programadas y optimizar la operación, mediante el uso de tecnologías
                        </p>
                        <ul className="text-black grid grid-cols-1 lg:grid-cols-2 gap-1">
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Termografía Infrarroja</li>
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Vibraciones mecánicas</li>
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Ultrasonido Pasivo</li>
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Tierras Físicas y Calidad de Energía</li>
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Alineación de ejes</li>
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Balanceo dinámico (en sitio)</li>
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Análisis de lubricante</li>
                        </ul>
                        <p className="text-tertiary text-lg">

                            Con más de <strong>22 años de experiencia</strong>, acompañamos a la industria en la toma de decisiones técnicas basadas en datos, seguridad y prevención.
                        </p>
                    </div>
                    <div className="relative hidden md:block overflow-hidden ">
                        <Image
                            src="/images/about.jpg"
                            alt="Representación de que es Diapsa"
                            fill
                            className="object-cover" />
                    </div>
                </div>
            </div>
        </section>
    )
}
