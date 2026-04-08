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
            <section className="p-10 bg-primary ">
                <h4 className="text-center text-5xl text-white font-bold">Inteligencia detras del <br /> mantenimineto predictivo</h4>
                <div className="flex justify-between items-center">
                    {data.map((d) => (
                        <div key={d.id} className="bg-primary p-4">
                            <p className="font-bold text-white">{d.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            {idapdata.map((id) => (
                <section key={id.title} className={`w-full space-y-10 p-24 ${id.bg === true ? `bg-black` : 'bg-primary'}`}>
                    <div className="flex items-center gap-16">
                        <div className="w-1/2 space-y-6">
                            <h3 className="text-5xl uppercase font-bold max-w-lg">
                                {id.title}
                            </h3>
                            {id.description && (
                                <p className="text-2xl text-gray-300 max-w-lg">
                                    {id.description}
                                </p>
                            )}
                            {id.items && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {id.items.map((i) => (
                                        <div className="flex items-center gap-1 px-3 py-9 bg-white/10 rounded-lg font-bold text-center text-gray-300 max-w-lg">
                                            <CheckCircleIcon className="w-8 h-8 text-green-400" />
                                            <p>{i}</p>
                                        </div>

                                    ))}
                                </div>
                            )}
                            {id.status && (

                                <div className="space-y-4 flex flex-col gap-5 h-auto">
                                    {id.status.map((s) => (
                                        <div key={s.name} className={`border-r-2 border-b-2 ${colorStatus[s.name].border} p-2`}>
                                            <p className={`font-bold text-xl ${colorStatus[s.name].text} ${colorStatus[s.name].bg} border  ${colorStatus[s.name].border} inline py-1 px-6 rounded-xl`}>{s.name}</p>
                                            <p className="mt-2 h-auto">{s.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-1/2">

                            <div className="relative shrink-0 w-200 h-110">
                                {id.image ? (
                                    <Image
                                        src={id.image}
                                        alt="Dashboard iDAP"
                                        fill
                                        className="object-contain  border rounded-4"
                                        // style={{ boxShadow: '0 10px 80px rgba(255,255,255,0.6)' }}
                                        priority
                                    />
                                ) : (

                                    <Image
                                        src="/images/idap/idap-dashboard.png"
                                        alt="Dashboard iDAP"
                                        fill
                                        className="object-cover  border rounded-4xl shadow-2xl"
                                        // style={{ boxShadow: '0 10px 80px rgba(255,255,255,0.6)' }}
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