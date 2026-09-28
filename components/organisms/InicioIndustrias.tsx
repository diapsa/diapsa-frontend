import Image from "next/image";
import Link from "next/link";
import datos from "@/data/industrias.json";
import clientes from "@/data/clients.json";

/**
 * InicioIndustrias
 * Las industrias que atiende DIAPSA, en la portada (2026-09-27): quien
 * compra primero quiere saber si ya trabajamos en su giro.
 *
 * Cada tarjeta lleva una foto real, lo que le duele a esa industria en una
 * línea, sus equipos críticos, los servicios que más aplican (con enlace),
 * los logotipos de clientes de ese giro y, si hay, el caso documentado.
 * Todo sale de data/industrias.json; los logotipos, de data/clients.json.
 */

type Industria = {
  clave: string;
  nombre: string;
  texto: string;
  equipos: string[];
  servicios: { nombre: string; href: string }[];
  clientes: string[];
  foto: { src: string; alt: string };
  caso?: string;
};

const LOGOS = new Map((clientes.clients as { name: string; logo: string | null }[]).map((c) => [c.name, c.logo]));

export default function InicioIndustrias() {
  const industrias = datos.industrias as Industria[];
  return (
    <section className="w-full bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Industrias</span>
          <h2 className="mb-4 text-3xl font-extrabold text-primary lg:text-4xl">
            CONOCEMOS <span className="text-secondary">TU INDUSTRIA</span>
          </h2>
          <p className="text-justify text-lg text-tertiary sm:text-center">
            Cada giro tiene sus equipos críticos y sus modos de falla. Estos son los que medimos todos los días.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industrias.map((ind) => {
            const logos = ind.clientes.map((n) => ({ n, logo: LOGOS.get(n) })).filter((l): l is { n: string; logo: string } => Boolean(l.logo));
            return (
              <li key={ind.clave}>
                <article className="group flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={ind.foto.src}
                      alt={ind.foto.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                    <h3 className="absolute bottom-3 left-4 right-4 text-xl font-extrabold leading-tight text-white">{ind.nombre}</h3>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-justify text-sm leading-relaxed text-tertiary">{ind.texto}</p>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">Equipos críticos</p>
                    <p className="mt-1 text-sm leading-snug text-primary">{ind.equipos.join(", ")}.</p>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">Lo que aplicamos</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {ind.servicios.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            className="inline-block rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-secondary"
                          >
                            {s.nombre}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {logos.length > 0 && (
                      <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-100 pt-4" aria-label={`Clientes de ${ind.nombre}`}>
                        {logos.map((l) => (
                          <li key={l.n} className="relative h-7 w-20">
                            <Image src={l.logo} alt={l.n} fill sizes="80px" className="object-contain object-left opacity-60 brightness-0" />
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-5">
                      {ind.caso ? (
                        <Link href={`/casos-exito/${ind.caso}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-primary">
                          Ver el caso documentado →
                        </Link>
                      ) : (
                        <Link href="/contacto" className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-primary">
                          Platiquemos de tu planta →
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
