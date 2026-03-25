import { Course } from "@/types/course";

export default function (courses: Course[]) {
    return (
        <section className="bg-white min-w-screen">
            <p className="text-lg text-black">
                Cursos con Certificados
            </p>

            <div className="p-10 grid grid-cols-2 md:grid-cols-2">
                {courses.map((course) => (

                    <div key={course.id} className="p-10 bg-white text-black">
                        <div className="relative ">

                        </div>
                        <p>{course.name}</p>
                        <p>{course.description}</p>


                    </div>
                ))}
            </div>
        </section>
    )
}


