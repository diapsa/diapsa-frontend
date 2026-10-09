import Image from "next/image";
import Link from "next/link";
import { RUTA_CLINICAS, duracionDe, nivelDe, nombreTecnica, proximasFechas, type Clinica } from "@/lib/clinicas";

/**
 * La tarjeta de una clínica técnica en vivo: foto, técnica, nivel, título, una
 * línea y la próxima fecha (o que se puede apartar lugar si aún no hay).
 */
export default function TarjetaClinica({ curso }: { curso: Clinica }) {
  const fecha = proximasFechas(curso)[0];
  return (
    <Link
      href={`${RUTA_CLINICAS}/${curso.slug}`}
      prefetch={false}
      className="group flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary">
        <Image
          src={curso.foto}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-xs bg-secondary px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary">
          En vivo · {duracionDe(curso)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-tertiary">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2 py-0.5 text-white">
            <span className="text-secondary">{curso.nivel}</span> {nivelDe(curso).nombre}
          </span>
          {nombreTecnica(curso.tecnica)}
        </p>
        <h3 className="mt-2 text-lg font-extrabold leading-snug text-primary">{curso.titulo}</h3>
        <p className="mt-2 flex-1 text-justify text-sm leading-relaxed text-tertiary">{curso.resumen}</p>
        <p className="mt-4 border-t border-gray-100 pt-3 text-sm font-bold text-primary">
          {fecha ? `Próxima fecha: ${fecha.texto}` : "Aparta tu lugar para la próxima fecha"}
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </p>
      </div>
    </Link>
  );
}
