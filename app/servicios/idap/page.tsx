import { CheckCircleIcon } from "@/components/atoms/icons";
import IdapHero from "@/components/organisms/IdapHero";
import { information as idapdata } from "@/data/idap.json";
import Image from "next/image";

const data = [
    { id: 1, description: 'visualiza el estado de e historial de tu maquinaria' },
    { id: 2, description: "Obten reportes a medida de tu operacion" }
]


export default function PageIdap() {
    const colorStatus: Record<string, { border: string, text: string, bg: string }> = {
        Baja: { border: "border-[#009700]", text: "text-[#009700]", bg: "bg-[#00970040]" },
        Media: { border: "border-[#ffc000]", text: "text-[#ffc000]", bg: "bg-[#ffc00040]" },
        Alta: { border: "border-[#ff0000]", text: "text-[#ff0000]", bg: "bg-[#ff000040]" },
    }
    return (
        <main className="">
            <IdapHero />
            <section className="p-6 md:p-10 bg-primary">
                <h4 className="text-center text-2xl md:text-4xl lg:text-5xl text-white font-bold mb-8">Inteligencia detras del <br /> mantenimineto predictivo</h4>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                    {data.map((d) => (
                        <div key={d.id} className="w-full md:w-auto bg-primary p-4">
                            <p className="font-bold text-white text-sm md:text-base text-center">{d.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            {idapdata.map((id) => (
                <section key={id.title} className={`w-full space-y-10 p-6 md:p-12 lg:p-24 ${id.bg === true ? `bg-black` : 'bg-primary'}`}>
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {id.items.map((i) => (
                                        <div className="flex items-center gap-1 px-3 py-4 md:py-9 bg-white/10 rounded-lg font-bold text-gray-300">
                                            <CheckCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-green-400 flex-shrink-0" />
                                            <p className="text-sm md:text-base">{i}</p>
                                        </div>

                                    ))}
                                </div>
                            )}
                            {id.status && (

                                <div className="space-y-3 lg:space-y-4 flex flex-col gap-3 lg:gap-5">
                                    {id.status.map((s) => (
                                        <div key={s.name} className={` border-b-2 bg-white/10 ${colorStatus[s.name].border} p-3 md:p-4 rounded-lg`}>
                                            <p className={`font-bold text-sm md:text-base lg:text-xl ${colorStatus[s.name].text} ${colorStatus[s.name].bg} border  ${colorStatus[s.name].border} inline py-1 px-3 md:px-6 rounded-md`}>{s.name}</p>
                                            <p className="mt-2 text-sm md:text-base h-auto">{s.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full lg:w-1/2">

                            <div className="relative w-full h-64 md:h-96 lg:h-[440px]">
                                {id.image ? (
                                    <Image
                                        src={id.image}
                                        alt="Dashboard iDAP"
                                        fill
                                        className="object-contain border rounded-lg md:rounded-2xl lg:rounded-4xl"
                                        priority
                                    />
                                ) : (

                                    <Image
                                        src="/images/idap/idap-dashboard.png"
                                        alt="Dashboard iDAP"
                                        fill
                                        className="object-cover border rounded-lg md:rounded-2xl lg:rounded-4xl shadow-2xl"
                                        priority
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                </section>
            ))}
        </main>
    )
}

//    beneficios

//             Vision en tiempo real del comportamiento de cada equipo
//             Deteccion de comportamientos anomalos y genera aertas automaticas mostrando el impacto economico de cada hallazgo
//             El valor surge de convertir datos en deciciones cada alarma cada 