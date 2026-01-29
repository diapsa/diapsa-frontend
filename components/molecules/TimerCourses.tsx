import dataCurso from '@/data/cursos.json';
export function TimerCourses() {
    return (

        <div className="flex text-black flex-col justify-center items-center">
            <p>Falta poco para el curso de : {dataCurso.ultimoCurso.name}</p>
            <div className='border-2 border-black bg-gray-600'>


            </div>
        </div>
    )
}