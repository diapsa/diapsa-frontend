import Antetitulo from "../atoms/Antetitulo";
import VitrinaEntregable from "./VitrinaEntregable";
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
 * La vitrina (VitrinaEntregable) es el único trozo con estado: alterna
 * entre la inspección como se ve en IDAP y las páginas del PDF.
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

        {/* Vitrina: IDAP o el PDF, según la pestaña */}
        <VitrinaEntregable entregable={entregable} />
      </div>
    </section>
  );
}
