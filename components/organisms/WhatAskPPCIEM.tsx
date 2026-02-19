import Image from "next/image";

export default function WhatAksPPCIEM() {
    return (
        <section className="bg-white text-black p-10 min-h-screen flex flex-col justify-center">
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="space-y-10 w-full lg:w-1/2 p-0 lg:p-4">

                    <h2 className="text-4xl lg:text-6xl font-bold">
                        ¿QUÉ EXIGE <span className="lg:block">CADA <span className="text-secondary">PPCIEM?</span></span>
                    </h2>
                    <div className="justify-items-end space-y-4">
                        <p>Programas trimestrales LDAR</p>
                        <p>Evidencia documentada</p>
                        <p>Reportes anuales de cumpliminento</p>
                    </div>

                    <div className="border-3 bg-secondary/5 border-secondary rounded-2xl p-4">
                        Sin embargo, la cobertura real de cumplimiento en el mercado <b>ha sido históricamente
                            baja (7%).
                        </b> Esto es evidencia de una  brecha entre obligación y capacidad operativa
                    </div>
                </div>
                <div className="relative w-full lg:w-1/2 h-52 lg:h-auto">
                    <Image fill className="object-cover rounded-4xl aspect-square" src="/images/deteccion-gas/operador-frente-a-maquina.png" alt="Operador revisando equipos" />
                </div>

            </div>
        </section>
    )
}