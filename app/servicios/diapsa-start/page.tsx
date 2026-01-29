import PageHeader from "@/components/organisms/PageHeader"
import PlusCircleIcon from '@/components/atoms/icons/PlusCircleIcon'
import DoubleCircleIcon from "@/components/atoms/icons/DoubleCircleIcon"
import Button from "@/components/atoms/Button"
import WindowIcon from "@/components/atoms/icons/WindowIcon"
import ChartIcon from "@/components/atoms/icons/ChartIcon"
import ChartIcon2 from "@/components/atoms/icons/ChartIcon2"

export default function DiapsaStart() {
    return (
        <main>
            <PageHeader
                title="DIAPSA START"
                subtitle="Monitoreo de Condición desde cero o fortalecerlo de manera ordenada"
            />

            <section className="w-full  py-16 lg:py-12 space-y-32">
                <div className="space-y-6">

                    <div className="px-2 lg:px-10">
                        <h2 className="text-6xl font-extrabold">Aprender haciendo. <br />
                            Construir capacidades.</h2>
                        <h3 className="text-5xl italic text-secondary font-extrabold">Tomar control de los activos</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center w-full px-2 lg:px-24">
                        <p className="text-gray-300 text-xl">
                            El programa DIAPSA Start trasciende las simple instalación tecnica. Es una transformación
                            estructural en la cultura de mantenimiento, diseñada para empresas que demandan una estrategia
                            de predictibilidad sólida y robusta.
                        </p>
                        <p className="text-center text-xl">
                            <PlusCircleIcon className="w-12 h-12 text-secondary me-2" />
                            Acompañamiento integral
                        </p>
                    </div>
                </div>

                <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center gap-6">
                    <div className="relative px-8 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32 space-y-6 bg-primary aspect-8/12 w-full overflow-hidden">
                        <DoubleCircleIcon className="text-secondary w-8 h-8" />
                        <p className="text-secondary font-bold">Etapa 01</p>
                        <h3 className="text-xl font-bold">Formación técnica aplicada</h3>
                        <p className="text-gray-300 text-lg">Capacitación teórica y práctica directamente en planta para asegurar la
                            transferencia de conocimiento real
                        </p>
                        <div className="absolute -bottom-16 md:-bottom-20 lg:-bottom-24 -right-4 md:-right-6 lg:-right-8 text-secondary text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold opacity-40 select-none pointer-events-none leading-none">
                            1
                        </div>
                    </div>
                    <div className="relative px-8 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32 space-y-6 bg-primary border-4 border-secondary aspect-8/12 w-full overflow-hidden">
                        <WindowIcon className="text-secondary w-8 h-8" />
                        <p className="text-secondary font-bold">Etapa 02 (core)</p>
                        <h3 className="text-xl font-bold">Diagnóstico situacional</h3>
                        <ul className="text-gray-300 text-sm md:text-base lg:text-lg space-y-1">
                            <li className="flex items-center"><span className="text-secondary text-3xl mr-2">•</span> <p>Levatamiento de datos técnicos</p></li>
                            <li className="flex items-center"><span className="text-secondary text-3xl mr-2">•</span> <p>Revisión de manuales de fabricante</p></li>
                            <li className="flex items-center"><span className="text-secondary text-3xl mr-2">•</span> <p>Historial de fallas criticas</p></li>
                            <li className="flex items-center"><span className="text-secondary text-3xl mr-2">•</span> <p>Definición de KPIs estratégicos</p></li>
                        </ul>
                        <div className="absolute -bottom-16 md:-bottom-20 lg:-bottom-24 -right-4 md:-right-6 lg:-right-8 text-secondary text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold opacity-40 select-none pointer-events-none leading-none">
                            2
                        </div>
                    </div>
                    <div className="relative px-8 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32 space-y-6 bg-primary aspect-8/12 w-full overflow-hidden">
                        <ChartIcon className="text-secondary w-8 h-8" />
                        <p className="text-secondary font-bold">Etapa 03</p>
                        <h3 className="text-xl font-bold">Mediciones</h3>
                        <p className="text-gray-300 text-lg">Recolección de datos de alta precisión y confiabilidad para establecer
                            lineas de operación certificadas.

                        </p>
                        <div className="absolute -bottom-16 md:-bottom-20 lg:-bottom-24 -right-4 md:-right-6 lg:-right-8 text-secondary text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold opacity-40 select-none pointer-events-none leading-none">
                            3
                        </div>
                    </div>
                    <div className="relative px-8 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32 space-y-6 bg-primary aspect-8/12 w-full overflow-hidden">
                        <ChartIcon2 className="text-secondary w-8 h-8" />
                        <p className="text-secondary font-bold">Etapa 04</p>
                        <h3 className="text-xl font-bold">Gestión de datos</h3>
                        <p className="font-bold">"LO QUE NO SE MIDE, NO SE CONTROLA"</p>
                        <p className="text-gray-300 text-lg">
                            Transformamos datos complejos en decisiones estratégicas basadas en evidencia industrial.
                        </p>
                        <div className="absolute -bottom-16 md:-bottom-20 lg:-bottom-24 -right-4 md:-right-6 lg:-right-8 text-secondary text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold opacity-40 select-none pointer-events-none leading-none">
                            4
                        </div>
                    </div>
                </div>

                <div className="px-2 lg:px-24">

                    <div className="border-l-4 border-secondary p-8 flex justify-between bg-primary/90">
                        <div>
                            <p className="text-2xl font-bold">¿Listo para evolucionar su mantenimiento?</p>
                            <p className="text-gray-300">Nuestros expertos estan listos para realizar un pre-diagnóstico de sus activos</p>
                        </div>
                        <Button variant="secondary">AGENDAR CONSULTORÍA</Button>
                    </div>
                </div>

            </section>
        </main>
    )
}