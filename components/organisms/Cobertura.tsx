import Image from "next/image";
import Antetitulo from "../atoms/Antetitulo";
import IlustracionEquipo from "../atoms/IlustracionEquipo";
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
        {/* Fotos de los equipos, si el servicio las trae. Cuando no son de
            DIAPSA llevan su crédito, como pide su licencia. */}
        {cobertura.fotos && cobertura.fotos.length > 0 && (
          <ul className={`mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 ${cobertura.fotos.length === 6 ? "lg:grid-cols-6" : "lg:grid-cols-5"}`}>
            {cobertura.fotos.map((f) => (
              <li key={f.nombre} className="overflow-hidden rounded-sm bg-white/5 ring-1 ring-white/10">
                <div className="relative aspect-[4/3]">
                  {f.ilustracion ? (
                    <IlustracionEquipo clave={f.ilustracion} />
                  ) : f.src ? (
                    <Image src={f.src} alt={f.alt ?? f.nombre} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
                  ) : null}
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold leading-snug text-white">{f.nombre}</p>
                  {f.credito && (
                    <p className="mt-1 text-[10px] leading-snug text-white/50">
                      Foto:{" "}
                      {f.fuente ? (
                        <a href={f.fuente} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">
                          {f.credito}
                        </a>
                      ) : (
                        f.credito
                      )}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <Lista titulo={cobertura.equiposTitulo} items={cobertura.equipos} />
          <Lista titulo={cobertura.fallasTitulo} items={cobertura.fallas} />
        </div>
      </div>
    </section>
  );
}
