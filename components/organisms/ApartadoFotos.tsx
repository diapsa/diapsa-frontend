import Image from "next/image";
import Antetitulo from "../atoms/Antetitulo";
import type { ServiceApartadoFotos } from "@/types/servicio";

/**
 * ApartadoFotos
 * Una variante del servicio contada con fotos reales: encabezado, los datos
 * duros en fichas y tres fotos con su pie.
 *
 * Por qué existe. El análisis de aceite en transformadores (gases disueltos,
 * DGA) ya estaba en la página, pero repartido: una frase en "Dónde se
 * aplica" y una pregunta frecuente. No merece página propia, porque es el
 * mismo servicio con otro equipo, pero sí merece verse, porque la foto del
 * analista con traje contra arco eléctrico tomando la muestra con jeringa
 * en un transformador en carga dice más del rigor del servicio que
 * cualquier párrafo. Este bloque le da ese lugar sin abrir otra página.
 *
 * Es genérico a propósito: cualquier servicio con una variante que valga
 * la pena enseñar (otro equipo, otra técnica, otro entorno) lo usa desde su
 * JSON. Componente de servidor.
 */

type Props = {
  apartado: ServiceApartadoFotos;
  paso?: string;
};

export default function ApartadoFotos({ apartado, paso }: Props) {
  return (
    <section className="w-full bg-gray-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <Antetitulo paso={paso}>{apartado.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {apartado.titulo}
          </h2>
          <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{apartado.texto}</p>
        </div>

        {apartado.datos && apartado.datos.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {apartado.datos.map((d) => (
              <li
                key={d}
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-black/10"
              >
                {d}
              </li>
            ))}
          </ul>
        )}

        <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
          {apartado.fotos.map((f, i) => (
            <li key={f.src}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5">
                <Image src={f.src} alt={f.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                <span
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-sm bg-white/90 text-sm font-extrabold text-primary"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
              </div>
              {f.pie && <p className="mt-3 text-justify text-sm leading-relaxed text-tertiary">{f.pie}</p>}
            </li>
          ))}
        </ol>

        {apartado.nota && (
          <p className="mt-6 max-w-3xl text-justify text-xs leading-relaxed text-tertiary/70">{apartado.nota}</p>
        )}
      </div>
    </section>
  );
}
