import Image from "next/image"
import { CheckCircleIcon } from "../atoms/CheckCircleIcon"
export function WhoIsDiapsaSection() {
    return (
        <section className="w-full bg-white py-16">
            <div className="px-8 md:px-24">
                <div className="grid grid-cols-2 gap-24">
                    <div className="py-6 space-y-6">
                        <hr className="border-2 border-secondary w-16 " />
                        <h1 className="text-black text-4xl font-extrabold leading-tight">¿Quienes son <br /> <span className="text-secondary">GRUPO DIAPSA?</span> </h1>
                        <p className="text-black text-lg">Somos una empresa mexicana líder en mantenimiento predictivo industrial, especializada en ofrecer servicios,
                            equipos y capacitación en monitoreo de condición para sectores estrategicos. </p>
                        <p className="text-black text-lg"> Ayudamos a las organizaciones a
                            incrementar la confiabilidad de sus equipos críticos, reducir fallas no programadas y optimizar la operación, mediante el uso de tecnologías
                        </p>

                        <div className="grid  grid-cols-2 text-black text-lg">
                            <p className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Termofrafia Infrarroja</p>
                            <p className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Vibraciones mecanicas</p>
                            <p className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Ultrasonido</p>
                            <p className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Tierrras Fisicas y Estudios Eléctricos</p>
                            <p className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Alineación y Balanceo</p>
                            <p className="flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-secondary" />
                                Análisis de Lubricante</p>

                        </div>
                        <p className="text-black text-lg">

                            Con más de <strong>22 años de experiencia</strong> , acompañamos a la industria en la toma de decisiones técnicas basadas en datos, seguridad y prevención.
                        </p>
                    </div>
                    <div className="relative overflow-hidden">
                        <Image
                            src="/images/metodologia/22-años.jpg"
                            alt="representacion de que es Diapsa"
                            fill
                            className="object-cover" />
                    </div>
                </div>
            </div>
        </section>
    )
}