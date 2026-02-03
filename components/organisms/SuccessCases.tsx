import casesData from '@/data/casos-exito.json';
export default function SuccessCases() {
    return (
        <section>

            <h2 className="text-4xl text-center font-extrabold">Casos de Exito</h2>
            <p className="text-lg text-center">Conoce los <b>casos de exito</b> de nuestros servicos</p>
            <div className='flex justify-between'>

                {casesData.map((c) => (
                    <a href="">
                        {c.slug}
                    </a>
                ))}

            </div>



        </section>
    )
}