import type { Metadata } from "next";

import PageHeader from "@/components/organisms/PageHeader";
import Image from "next/image";
import Link from "next/link";
import dataUl from '@/data/servicios/analisis-de-ultrasonido.json'
import dataDM from '@/data/servicios/diagnostico-de-maquinaria.json'
import dataEE from '@/data/servicios/estudios-electricos.json'
import dataTI from '@/data/servicios/termografia-infrarroja.json'
import dataVM from '@/data/servicios/vibraciones-mecanicas.json'
const services = [dataDM, dataEE, dataTI, dataUl, dataVM];

export const metadata: Metadata = {
    title: "Monitoreo de Condicion | Grupo Diapsa",
    description:
        "Servicios de mantenimiento predictivo industrial: Termografía Infrarroja, Análisis de Vibraciones, Ultrasonido, Estudios Eléctricos y Diagnóstico de Maquinaria. Soluciones integrales para tu industria en México.",
    keywords: [
        "servicios mantenimiento predictivo",
        "termografía industrial México",
        "análisis de vibraciones",
        "ultrasonido industrial",
        "diagnóstico de maquinaria",
        "estudios eléctricos industriales",
    ],
    alternates: {
        canonical: "/servicios/monitoreo-condicion",
    },
    openGraph: {
        title: "Monitoreo de Condición | Grupo DIAPSA",
        description:
            "Soluciones integrales de mantenimiento predictivo: termografía, vibraciones, ultrasonido y diagnóstico de maquinaria.",
        url: "/servicios/monitoreo-condicion",
        type: "website",
    },
};

export default function MonitoreoConditionPage() {
    return (
        <main>
            <PageHeader title="MONITOREO DE CONDICIÓN"
                subtitle="Soluciones integrales de mantenimiento predictivo para tu industria" />
            <section className="w-full bg-white text-gray-900 py-16 px-6 lg:py-24 lg:px-32 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8 justify-center flex flex-col">

                        <h2 className="border-l-4 border-primary text-4xl font-extrabold px-4">LA FILOSOFIA DIAPSA</h2>
                        <p>
                            En DIAPSA entendemos que el mantenimineto no se trata de reparar pioezas rotas, sino de predecir el comportamiento
                            furuto de sus activos. Nueestra filosofía de <b>Monitoreo de Condición</b> se basa en la vigilancia constatne y el analisis profundo
                            para garantizar que su operación nunca se detenga.
                        </p>
                        <p className="p-6 text-sm rounded-2xl border-secondary border-l-4 bg-secondary/10">
                            "Nuestra vision 360° combina el analisis de vibraciones, termografía y ultrasonido
                            para entregar un diagnostico preciso que evita paros no programados y extiende la vida de su maquinaria"
                        </p>
                    </div>
                    <div className="lg:px-16">
                        <div className="px-10 py-8 bg-primary  flex space-y-4 flex-col">
                            <h3 className="font-extrabold text-2xl text-white">Resultados Operativos</h3>
                            <div>
                                <p className="font-bold text-lg text-secondary">CONFIABILIDAD</p>
                                <p className="text-gray-400">Incremente la disponibilidad de sus activos criticos mediante un monitoreo cosntante y preciso</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-secondary">AHORROS</p>
                                <p className="text-gray-400">Reduzca drásticamente los costos de la reparación de emergencia y la pérdida de producción</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-secondary">PLANEACIÓN</p>
                                <p className="text-gray-400">Tome deciciones informadas sobre paros de mantenimiento basados en la condición real, no en el calendario</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="space-y-4">
                    <p className="text-center font-bold text-secondary">ANALOGÍA MEDICA</p>

                    <h3 className="text-2xl font-bold text-center">Un chuequeo General para sus Máquianas</h3>
                    <p className="text-gray-500 text-center">Al igual que un médico utiliza diferentes pruebas para diagnosticar la salud de un <br /> paciente, nosotros
                        integramos múltiples tecnologías para una visión de 360 grados</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 justify-items-center">
                        {services.map((s) => (
                            <Link
                                key={s.id}
                                href={`/servicios/monitoreo-condicion/${s.slug}`}
                                className="relative w-62.5 h-62.5 rounded-sm overflow-hidden group cursor-pointer"
                            >
                                <Image src={s.content.image} alt={`Imagen de ${s.header.title}`} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:bg-black/80">
                                    <p className="text-white text-xl md:text-2xl font-bold text-center transform">
                                        {s.header.title}

                                    </p>
                                    <p className="text-gray-200 text-center text-sm md:text-base mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" >
                                        {s.header.subtitle}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    )
}