import Image from "next/image";
import Link from "next/link";
import dataAB from "@/data/servicios/alineacion-balanceo.json";
import dataAC from "@/data/servicios/analisis-de-aceite.json";
import dataAE from "@/data/servicios/arco-electrico.json";
import dataUl from "@/data/servicios/analisis-de-ultrasonido.json";
import dataDM from "@/data/servicios/diagnostico-de-maquinaria.json";
import dataEE from "@/data/servicios/estudios-electricos.json";
import dataTF from "@/data/servicios/tierras-fisicas.json";
import dataTI from "@/data/servicios/termografia-infrarroja.json";
import dataVM from "@/data/servicios/vibraciones-mecanicas.json";

// Las nueve del menú, en el mismo orden que el menú, para que quien vio el
// desplegable encuentre aquí la misma secuencia. Nueve entra exacto en tres
// columnas; si se agrega una décima, hay que revisar la rejilla.
const services = [dataVM, dataAB, dataTI, dataEE, dataDM, dataUl, dataAC, dataTF, dataAE];

const operationalResults = [
    {
        label: "CONFIABILIDAD",
        text: "Incremente la disponibilidad de sus activos críticos mediante monitoreo constante y preciso.",
    },
    {
        label: "AHORROS",
        text: "Reduzca drásticamente los costos de reparaciones de emergencia y pérdidas de producción.",
    },
    {
        label: "PLANEACIÓN",
        text: "Tome decisiones informadas sobre paros de mantenimiento basados en la condición real, no en el calendario.",
    },
    {
        label: "SALUD",
        text: "Conozca el estado y condición de su equipo y cree lineas bases desde su instalación (nuevos o reparados).",
    },
    {
        label: "CONTENCIÓN",
        text: "Identificamos e informamos puntualmente durante el recorrido las condiciones criticas o falla potencial no detectadas previamente que ponen en riego la operación, para una toa de desición inmediata",
    },
];

export default function MCSolution() {
    return (
        <section className="w-full bg-white py-16 lg:py-24 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary/6 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-12">
                    <span className="inline-block text-secondary text-xs font-semibold tracking-widest uppercase mb-4">
                        La solución
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-4">
                        DIAPSA Y EL MONITOREO <span className="text-secondary">DE CONDICIÓN</span>
                    </h2>
                    <p className="text-tertiary text-lg max-w-2xl mx-auto">
                        El mantenimiento no se trata de reparar piezas rotas. Se trata de predecir el comportamiento futuro de sus activos antes de que fallen.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <p className="text-base lg:text-lg text-tertiary leading-relaxed">
                            En DIAPSA, nuestra filosofía de <strong className="text-primary">Monitoreo de Condición</strong> se basa en la vigilancia constante y el análisis profundo para garantizar que su operación nunca se detenga. No intervenimos equipos al azar: diagnosticamos con precisión y recomendamos con respaldo técnico.
                        </p>
                        <div className="border-l-2 border-secondary bg-secondary/10 p-6 rounded-sm">
                            <p className="text-sm text-primary leading-relaxed italic">
                                &ldquo;Nuestra visión 360° combina análisis de vibraciones, termografía, ultrasonido y análisis de aceites para entregar un diagnóstico preciso que evita paros no programados y extiende la vida de su maquinaria.&rdquo;
                            </p>
                            <p className="text-xs text-tertiary mt-3 font-semibold uppercase tracking-wider">
                                — Filosofía DIAPSA, más de 20 años en la industria
                            </p>
                        </div>
                        <Link
                            href="/contacto"
                            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xs hover:bg-secondary hover:text-primary transition-all duration-300 shadow-md"
                        >
                            Solicitar diagnóstico
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="bg-primary rounded-sm px-10 py-8 flex flex-col gap-6">
                        <h3 className="font-extrabold text-2xl text-white">
                            Resultados <span className="text-secondary">Operativos</span>
                        </h3>
                        {operationalResults.map((item) => (
                            <div key={item.label} className="border-l-2 border-secondary pl-4">
                                <p className="font-bold text-sm text-secondary uppercase tracking-wider mb-1">{item.label}</p>
                                <p className="text-white/70 text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analogía médica + grid de servicios */}
                <div className="text-center mb-8">
                    <span className="inline-block text-secondary text-xs font-semibold tracking-widest uppercase mb-4">
                        Analogía médica
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-extrabold text-primary mb-3">
                        Un chequeo general <span className="text-secondary">para sus máquinas</span>
                    </h3>
                    <p className="text-tertiary text-base max-w-2xl mx-auto">
                        Al igual que un médico usa diferentes pruebas para diagnosticar a un paciente, nosotros integramos herramientas predictivas para una visión de 360° de sus activos.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {services.map((s, i) => {
                        // En dos columnas, una lista impar deja la última sola:
                        // se centra en lugar de quedar pegada a la izquierda.
                        const sola = services.length % 2 === 1 && i === services.length - 1;
                        return (
                        <Link
                            key={s.id}
                            href={`/servicios/monitoreo-condicion/${s.slug}`}
                            className={`relative aspect-square rounded-sm overflow-hidden group cursor-pointer ${
                                sola ? "col-span-2 mx-auto w-[calc(50%-0.5rem)] sm:col-span-1 sm:mx-0 sm:w-auto" : ""
                            }`}
                        >
                            <Image
                                src={s.content.image}
                                alt={`Imagen de ${s.header.title}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-primary/60 flex flex-col items-center justify-center p-5 transition-all duration-300 group-hover:bg-primary/80">
                                <p className="text-white text-base font-bold text-center leading-snug">
                                    {s.header.title}
                                </p>
                                <p className="text-white/80 text-center text-xs mt-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 leading-relaxed">
                                    {s.header.subtitle}
                                </p>
                                <span className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-secondary text-xs font-semibold uppercase tracking-wider">
                                    Ver más →
                                </span>
                            </div>
                        </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}