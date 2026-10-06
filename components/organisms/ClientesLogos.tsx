import Image from "next/image";
import Link from "next/link";
import Antetitulo from "../atoms/Antetitulo";
import clientes from "@/data/clients.json";

/**
 * ClientesLogos
 * Pared de logotipos de plantas que ya trabajan con DIAPSA, como cierre de la
 * página de servicio.
 *
 * Por qué sustituye a la ficha de compras: la ficha (REPSE, IMSS, tiempos,
 * cobro) era información de trámite y se leía como tal; cerraba la página con
 * papeleo. Dynamox y Fracttal cierran con prueba: quién ya confía. Los tres
 * datos de contratación que sí importan (REPSE, plazo del informe, cobertura)
 * se muestran ahora en la banda de cotización, en una línea.
 *
 * Los logotipos son los mismos de la home (data/clients.json), estáticos en
 * rejilla en lugar del carrusel, para que se puedan leer. Los SVG vienen en
 * blanco porque la home los pone sobre azul marino; aquí se oscurecen con
 * brightness-0 para que se vean sobre blanco.
 */

type Props = {
  paso?: string;
  /** Antetítulo y título propios, por ejemplo en las fichas de curso. */
  antetitulo?: string;
  titulo?: string;
  /** Enlace del botón; con null no hay botón. */
  enlace?: { href: string; texto: string } | null;
};

// Aquí solo van los clientes con archivo de logotipo; los que aún no lo
// tienen (logo en null) se muestran por nombre en la barra de la portada.
const CON_LOGO = (clientes.clients as { name: string; logo: string | null }[]).filter(
  (c): c is { name: string; logo: string } => Boolean(c.logo),
);

export default function ClientesLogos({ paso, antetitulo = "Quién ya confía", titulo = "Plantas que ya miden con nosotros", enlace = { href: "/casos-exito", texto: "Ver casos de éxito" } }: Props) {
  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Antetitulo paso={paso}>{antetitulo}</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
              {titulo}
            </h2>
          </div>
          {enlace && (
            <Link prefetch={false}
              href={enlace.href}
              className="inline-flex shrink-0 items-center gap-2 border-2 border-primary px-6 py-2.5 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white rounded-xs"
            >
              {enlace.texto}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-gray-200 bg-gray-200 sm:grid-cols-3 lg:grid-cols-6">
          {CON_LOGO.map((cliente) => (
            <li
              key={cliente.name}
              className="flex h-28 items-center justify-center bg-white px-6 transition-colors duration-300 hover:bg-gray-50"
            >
              <Image
                src={cliente.logo}
                alt={cliente.name}
                width={160}
                height={56}
                className="h-12 w-auto max-w-full object-contain brightness-0 opacity-50 transition-opacity duration-300 hover:opacity-90"
              />
            </li>
          ))}
          {/* Si la última fila de seis queda incompleta, se rellena en blanco
              para que no se vea un hueco gris. */}
          {Array.from({ length: (6 - (CON_LOGO.length % 6)) % 6 }, (_, i) => (
            <li key={`vacio-${i}`} className="hidden bg-white lg:block" aria-hidden="true" />
          ))}
        </ul>
      </div>
    </section>
  );
}
