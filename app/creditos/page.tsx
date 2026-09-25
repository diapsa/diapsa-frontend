import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/organisms/PageHeader";
import creditos from "@/data/creditos-imagenes.json";

/**
 * Créditos de imágenes
 * Autor, licencia y fuente de cada imagen de terceros que usa el sitio.
 *
 * Por qué existe. Algunas fotos genéricas de equipos (por ejemplo, los
 * transformadores de DGA en línea) vienen de Wikimedia Commons con licencia
 * Creative Commons, que permite usarlas a cambio de dar crédito al autor,
 * enlazar la licencia e indicar si se modificaron. Poner ese crédito en cada
 * tarjeta ensuciaba el diseño, así que vive aquí, enlazado desde el pie del
 * sitio. Las fotos de DIAPSA en campo son propias y no aparecen.
 *
 * La lista sale de data/creditos-imagenes.json: al agregar una imagen de
 * terceros, se registra ahí.
 */

export const metadata: Metadata = {
  title: "Créditos de imágenes",
  description: "Autor, licencia y fuente de las imágenes de terceros que usa el sitio de Grupo DIAPSA.",
  alternates: { canonical: "/creditos" },
  robots: { index: false, follow: true },
};

export default function CreditosPage() {
  return (
    <main>
      <PageHeader title="Créditos de imágenes" subtitle="Imágenes de terceros usadas en este sitio" />
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="max-w-3xl text-justify text-base leading-relaxed text-tertiary">
            Las fotografías de trabajo en campo son de Grupo DIAPSA. Las imágenes de esta lista son de sus autores y se usan
            bajo la licencia indicada en cada una. Todas se recortaron y redimensionaron para el sitio.
          </p>

          {creditos.map((grupo) => (
            <div key={grupo.pagina} className="mt-10">
              <h2 className="text-xl font-extrabold text-primary">
                <Link href={grupo.href} className="hover:text-secondary">
                  {grupo.pagina}
                </Link>
              </h2>
              <ul className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
                {grupo.imagenes.map((img) => (
                  <li key={img.src} className="flex gap-4 py-4">
                    <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-sm bg-gray-100 sm:w-32">
                      <Image src={img.src} alt={img.descripcion} fill sizes="128px" className="object-cover" />
                    </div>
                    <div className="min-w-0 text-sm leading-relaxed text-tertiary">
                      <p className="font-bold text-primary">{img.descripcion}</p>
                      <p className="break-words">
                        «{img.original}», de {img.autor}.{" "}
                        <a href={img.fuente} target="_blank" rel="noopener noreferrer" className="underline hover:text-secondary">
                          Ver original
                        </a>
                      </p>
                      <p>
                        Licencia{" "}
                        <a href={img.licenciaUrl} target="_blank" rel="noopener noreferrer license" className="underline hover:text-secondary">
                          {img.licencia}
                        </a>
                        . {img.cambios}.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
