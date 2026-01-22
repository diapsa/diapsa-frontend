import valuesData from '@/data/values.json';
export function ValuesSection() {

    return (

        <section className="w-full py-14 lg:py-18 border-y-4 border-secondary">
            <div className="sm:px-2 md:px-16 flex flex-col justify-center items-center gap-6">
                <h3 className='font-bold text-center text-secondary'>Nuestra identidiad</h3>
                <h3 className="text-center text-4xl font-extrabold">Valores dentro de nuestra empresa</h3>
                <div className='border-2  border-secondary md:w-[10%] justify-items-center' />
                <p className='md:w-3xl text-center text-lg'>Nuestros principios fundamentales guian cada decisión y acción, asegurando la excelencia operativa
                    y el compromiso con nuestros clientes industriales</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:gap-16 gap-8 justify-items-center mt-6 xs:px-4">
                    {valuesData.values.map((value) => (
                        <div className='flex flex-col items-center gap-6'>
                            <div key={value.name} className="w-8 h-8 bg-secondary rotate-45 flex justify-center items-center shadow-[0_0_50px_rgba(255,255,255,0.35)]" />
                            <p className='text-center text-xl font-bold'>{value.name}</p>
                            <p className='text-center '>{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    )
}