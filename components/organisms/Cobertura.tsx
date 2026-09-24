import Antetitulo from "../atoms/Antetitulo";
import type { ServiceCobertura } from "@/types/servicio";

/**
 * Cobertura
 * Qué equipos se pueden vigilar y qué fallas se detectan, en dos listas de
 * fichas sobre fondo azul marino.
 *
 * Por qué existe. El jefe de mantenimiento llega con una pregunta concreta:
 * "¿esto sirve para mi compresor?", "¿ve la cavitación?". Dos listas cortas
 * de nombres la contestan en segundos, sin párrafos. La estructura viene de
 * las páginas de producto del sector (Tractian la usa igual); el contenido
 * es el de DIAPSA y el de los sensores que instala.
 */

type Props = {
  cobertura: ServiceCobertura;
  paso?: string;
};

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <p className="text-center text-sm font-bold uppercase tracking-widest text-secondary">{titulo}</p>
      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {items.map((i) => (
          <li key={i} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 lg:text-sm">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Cobertura({ cobertura, paso }: Props) {
  return (
    <section className="w-full bg-primary py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Antetitulo paso={paso} className="text-secondary">
            {cobertura.etiqueta}
          </Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white lg:text-[2.75rem]">{cobertura.titulo}</h2>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <Lista titulo={cobertura.equiposTitulo} items={cobertura.equipos} />
          <Lista titulo={cobertura.fallasTitulo} items={cobertura.fallas} />
        </div>
      </div>
    </section>
  );
}
