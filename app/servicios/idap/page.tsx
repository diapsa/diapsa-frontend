import { CheckCircleIcon, EcoIcon, EnergyIcon, PrecisionManufacturingIcon, SoundIcon, ThermometerIcon, VibrationIcon } from "@/components/atoms/icons";
import IdapHero from "@/components/organisms/IdapHero";
import { information as idapdata } from "@/data/idap.json";
import Image from "next/image";
import { ComponentType } from "react";

const data = [
    { id: 1, description: 'visualiza el estado de e historial de tu maquinaria' },
    { id: 2, description: "Obten reportes a medida de tu operacion" }
];


export default function PageIdap() {
    const colorStatus: Record<string, { border: string, text: string, bg: string }> = {
        Baja: { border: "border-[#009700]", text: "text-[#009700]", bg: "bg-[#00970040]" },
        Media: { border: "border-[#ffc000]", text: "text-[#ffc000]", bg: "bg-[#ffc00040]" },
        Alta: { border: "border-[#ff0000]", text: "text-[#ff0000]", bg: "bg-[#ff000040]" },
    }
    return (
        <main className="bg-primary">
            <IdapHero />

            {idapdata.map((id) => (
                <section key={id.title} className={`w-full space-y-10 p-6 md:p-12 lg:p-24 ${id.bg === true ? `bg-black` : 'bg-primary'}`}>
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 lg:px-10">
                        <div className="w-full lg:w-1/2 space-y-6">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl uppercase font-bold">
                                {id.title}
                            </h3>
                            {id.description && (
                                <p className="text-lg md:text-xl lg:text-2xl text-gray-300">
                                    {id.description}
                                </p>
                            )}
                            {id.items && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                                    {id.items.map((i) => (
                                        <div key={i} className="flex items-center gap-1 px-3 py-2 md:py-5 bg-white/10 rounded-lg font-bold text-gray-300">
                                            <CheckCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-green-400 shrink-0" />
                                            <p className="text-sm md:text-base">{i}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {id.diciplines && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {id.diciplines.map((d) => (
                                        <div key={d.id} className="bg-white/10 p-3 md:p-4 rounded-lg flex items-center gap-2">
                                            <div className="p-2 rounded-full bg-secondary" />
                                            <p className="text-sm md:text-base font-bold">{d.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="relative w-full h-64 md:h-96 lg:h-110">
                                {id.image && (
                                    <Image
                                        src={id.image}
                                        alt={id.alt}
                                        fill
                                        className="object-contain border rounded-lg md:rounded-2xl lg:rounded-4xl"
                                        priority
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {id.status && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-10 lg:mt-24">
                            {id.status.map((s) => (
                                <div key={s.name} className={`border-b-3 bg-white/10 ${colorStatus[s.name].border} p-3 md:p-10 rounded-lg space-y-3`}>
                                    <p className={`font-bold uppercase text-sm md:text-base lg:text-xl ${colorStatus[s.name].text} ${colorStatus[s.name].bg} border  ${colorStatus[s.name].border} inline py-1 px-3 md:px-6 rounded-md`}>{s.name}</p>
                                    <p className="mt-10 text-sm md:text-lg h-auto">{s.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {id.indicadores && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-4 lg:mt-24">
                            {id.indicadores.map(({ id, name, recommendation }) => (
                                <div key={id} className="bg-white/10 border border-white/20 rounded-2xl space-y-5 p-6 bg-">
                                    <p className="font-bold text-lg">{name}</p>
                                    <p className="">{recommendation}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </section>
            ))}
        </main>
    )
}