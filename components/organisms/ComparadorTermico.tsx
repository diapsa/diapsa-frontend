import Image from "next/image";
import Antetitulo from "../atoms/Antetitulo";
import type { ServiceComparador } from "@/types/servicio";

/**
 * ComparadorTermico
 * La misma escena dos veces: como la ve el ojo y como la ve la cámara
 * térmica, lado a lado, con el hallazgo señalado.
 *
 * Por qué existe: es el diferenciador de termografía frente a las demás
 * disciplinas. En vibraciones el argumento es el espectro; aquí es que el
 * problema no se ve y la cámara sí lo ve. Enseñar el par visual y térmico
 * de una inspección real lo demuestra sin explicarlo.
 *
 * No se superponen con un deslizador porque la cámara visual y la térmica
 * tienen campos de visión y perspectiva distintos; un deslizador con las
 * imágenes desfasadas se ve mal. Lado a lado se lee limpio en escritorio y
 * apilado en móvil. Las imágenes vienen del JSON del servicio.
 */

type Props = {
  comparador: ServiceComparador;
  paso?: string;
};

export default function ComparadorTermico({ comparador, paso }: Props) {
  return (
    <section className="w-full bg-gray-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>Lo que ve la cámara</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {comparador.titulo}
          </h2>
          {comparador.texto && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{comparador.texto}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {[
            { etiqueta: "A simple vista", foto: comparador.visual, oscuro: false },
            { etiqueta: "Con cámara térmica", foto: comparador.termica, oscuro: true },
          ].map(({ etiqueta, foto, oscuro }) => (
            <figure
              key={etiqueta}
              className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 620px"
              />
              <figcaption
                className={`absolute left-4 top-4 rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                  oscuro ? "bg-primary text-secondary" : "bg-white/90 text-primary"
                }`}
              >
                {etiqueta}
              </figcaption>
            </figure>
          ))}
        </div>

        {comparador.pie && (
          <p className="mt-6 max-w-3xl text-justify text-sm leading-relaxed text-tertiary">
            {comparador.pie}
          </p>
        )}
      </div>
    </section>
  );
}
