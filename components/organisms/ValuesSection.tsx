export function ValuesSection() {

    return (

        <section className="w-full py-16 lg:py-24 border-y-4 border-secondary bg-primary">
            <div className="sm:px-16 md:px-32">
                <h3 className="text-center text-4xl">Valores dentro de nuestra empresa</h3>
                <div className="w-full grid sm:grid-cols-2 md:grid-cols-4 sm:gap-16 gap-8 justify-items-center mt-16">

                    {[{
                        value: "Responsabilidad"
                    },
                    {
                        value: "Compromiso",
                    },
                    {
                        value: "Calidad",
                    },
                    {
                        value: "Trabajo en equipo",
                    }
                    ].map((card) => (

                        <div key={card.value} className="w-28 h-28 bg-secondary rotate-45 flex justify-center items-center shadow-[0_0_50px_rgba(255,255,255,0.35)]">
                            <div className="-rotate-45 text-lg text-center font-medium text-black">
                                {card.value}
                            </div>

                        </div>
                    ))}

                </div>
                <div>

                </div>
            </div>
        </section>
    )
}