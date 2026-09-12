import Image from "next/image";
import Antetitulo from "../atoms/Antetitulo";
import type { ServiceEntregable as Entregable } from "@/types/servicio";

/**
 * ServiceEntregable
 * Enseña el informe que recibe el cliente y dice qué trae. Nada más.
 *
 * Por qué ya no se descarga: la versión anterior pedía nombre, correo y
 * empresa a cambio del PDF. Eso convierte la sección en una captura de datos
 * y el visitante lo nota; además obligaba a publicar un informe de un cliente
 * real, aunque anonimizado. Ahora es una afirmación: esto es lo que recibes,
 * así se ve, esto contiene. Las páginas siguen siendo reales, escalonadas y
 * con un ligero movimiento al pasar el cursor, porque describir un informe
 * convence menos que verlo.
 *
 * Componente de servidor: sin estado, sin formulario, sin JavaScript.
 */

type Props = {
  entregable: Entregable;
  paso?: string;
};

export default function ServiceEntregable({ entregable, paso }: Props) {
  return (
    <section className="w-full overflow-hidden bg-white py-12 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        {/* Texto */}
        <div>
          <Antetitulo paso={paso}>{entregable.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {entregable.titulo}
          </h2>
          <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
            {entregable.descripcion}
          </p>

          <ul className="mt-7 space-y-3">
            {entregable.contenido.map((punto) => (
              <li key={punto} className="flex items-start gap-3 text-base leading-relaxed text-primary">
                <svg
                  className="mt-1.5 h-4 w-4 shrink-0 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{punto}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Vitrina: las páginas reales, escalonadas */}
        <div className="group relative mx-auto w-full max-w-xl">
          {/* Página 2 al fondo, girada, asomando por detrás */}
          <div className="absolute right-0 top-6 hidden w-[78%] rotate-[4deg] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5 transition-transform duration-500 motion-safe:group-hover:rotate-[6deg] motion-safe:group-hover:-translate-y-2 sm:block">
            <Image
              src={entregable.paginas[1]}
              alt=""
              aria-hidden="true"
              width={1253}
              height={1457}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 60vw, 380px"
            />
          </div>

          {/* Página 1 al frente */}
          <div className="relative w-[88%] overflow-hidden rounded-sm shadow-2xl ring-1 ring-black/10 transition-transform duration-500 motion-safe:group-hover:-translate-y-1.5">
            <Image
              src={entregable.paginas[0]}
              alt={entregable.altPaginas}
              width={1253}
              height={890}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 90vw, 460px"
            />
          </div>

          {/* Sello flotante con lo que trae el informe */}
          <div className="absolute -bottom-4 right-0 rounded-sm bg-primary px-5 py-3 text-white shadow-xl sm:right-4">
            <p className="text-2xl font-extrabold leading-none text-secondary">
              {entregable.dato}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/80">
              {entregable.datoTexto}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
