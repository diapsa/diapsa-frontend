import Image from "next/image";
import clientsData from "@/data/clients.json";

/**
 * Clients
 * La barra de clientes de la portada: dos tiras de logotipos que corren en
 * sentidos opuestos sin fin.
 *
 * El error que tenía (2026-09-27): la tira medía lo mismo que la pantalla
 * (flex sin ancho propio) y la animación la movía la mitad de ESE ancho, no
 * la mitad de los logotipos; además el espacio entre logos era "gap", que
 * no se repite después del último. Al llegar al final saltaba hacia atrás.
 * Ahora la tira mide lo que miden sus logotipos (w-max), cada logo lleva su
 * propio margen a la derecha y la lista va dos veces, así desplazar -50%
 * cae exactamente donde empieza la copia y el giro no se nota.
 *
 * Los clientes sin archivo de logotipo todavía (logo en null) se muestran
 * con su nombre en letra blanca, en el mismo tamaño, hasta tener el logo.
 */

type Cliente = { name: string; logo: string | null };

const CLIENTES = clientsData.clients as Cliente[];

function Tira({ clientes, reversa = false }: { clientes: Cliente[]; reversa?: boolean }) {
  const doble = [...clientes, ...clientes];
  return (
    <div className="relative overflow-hidden">
      <div className={`flex w-max ${reversa ? "clientes-reversa" : "clientes-avance"}`}>
        {doble.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            aria-hidden={i >= clientes.length}
            className="relative mr-8 flex h-16 w-32 shrink-0 items-center justify-center sm:mr-12 sm:h-20 sm:w-40 md:mr-16 md:h-24 md:w-52 lg:mr-20 lg:h-28 lg:w-60"
          >
            {c.logo ? (
              <Image src={c.logo} alt={`Logo de ${c.name}`} fill sizes="240px" className="object-contain px-2 brightness-0 invert sm:px-3 md:px-4" />
            ) : (
              <span className="text-center text-lg font-extrabold uppercase leading-tight tracking-wide text-white sm:text-xl md:text-2xl lg:text-3xl">
                {c.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Clients() {
  const invertidos = [...CLIENTES].reverse();
  return (
    <section className="flex w-full flex-col bg-white pt-16 lg:pt-24">
      <style>{`
        @keyframes clientes-avance { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes clientes-reversa { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        .clientes-avance { animation: clientes-avance 45s linear infinite; }
        .clientes-reversa { animation: clientes-reversa 45s linear infinite; }
        @media (min-width: 768px) {
          .clientes-avance, .clientes-reversa { animation-duration: 70s; }
        }
        @media (prefers-reduced-motion: reduce) {
          .clientes-avance, .clientes-reversa { animation: none; }
        }
      `}</style>
      <div className="mb-8 flex w-full flex-col items-center gap-4">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Clientes Satisfechos</span>
        <h2 className="text-center text-3xl font-extrabold leading-tight text-primary lg:text-4xl">PASIÓN POR APORTAR VALOR</h2>
      </div>
      <div className="relative w-full space-y-4 bg-[repeating-linear-gradient(45deg,#003853_0px,#003853_10px,transparent_10px,transparent_15px),linear-gradient(135deg,#003853,#002e46)] py-8 bg-blend-multiply md:space-y-6 md:py-10">
        <Tira clientes={CLIENTES} />
        <Tira clientes={invertidos} reversa />
      </div>
    </section>
  );
}
