import CarruselBloque from "@/components/organisms/CarruselBloque";
import { APARTADOS_CURSOS, APARTADOS_SERVICIOS, apartadosProductos } from "@/lib/bloques-inicio";
import { getStorageUrl } from "@/lib/api/config";
import type { Product } from "@/types/product";

/**
 * InicioBloques
 * "Lo que hacemos" en la portada: tres bloques, cada uno con sus apartados y
 * un carrusel de tarjetas con foto. Servicios (monitoreo de condición,
 * monitoreo continuo y más servicios), cursos (por técnica) y productos
 * (por categoría del CMS). Sustituye al navegador de 23 fichas con ícono,
 * que resultó complejo.
 *
 * Productos viene del CMS; si la llamada falla o no hay productos, ese
 * bloque simplemente no aparece.
 */

export default function InicioBloques({ productos }: { productos: Product[] }) {
  const bloqueProductos = apartadosProductos(productos, (ruta) => getStorageUrl(ruta) ?? ruta);

  return (
    <section id="servicios" className="w-full bg-gray-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Lo que hacemos</span>
          <h2 className="mb-5 text-3xl font-extrabold text-primary lg:text-4xl">
            SERVICIOS, CURSOS <span className="text-secondary">Y EQUIPOS</span>
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2">
            <svg className="h-4 w-4 shrink-0 text-secondary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1l2.753 5.576 6.157.895-4.455 4.342 1.051 6.128L12 15l-5.506 2.941 1.051-6.128L3.09 7.471l6.157-.895L12 1z" />
            </svg>
            <span className="text-sm font-semibold text-white sm:text-base">
              Especialistas certificados <span className="text-secondary">Categoría 3</span> en cada disciplina
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-16">
          <CarruselBloque
            etiqueta="Servicios"
            titulo={<>Medimos, vigilamos y <span className="text-secondary">diagnosticamos</span></>}
            texto="Rutas con nuestros analistas, sensores en línea y servicios especializados, con tus equipos en operación."
            apartados={APARTADOS_SERVICIOS}
            href="/servicios"
          />
          <CarruselBloque
            etiqueta="Cursos"
            titulo={<>Formamos a <span className="text-secondary">tu gente</span></>}
            texto="Formación técnica, talleres y certificaciones por técnica, y el diplomado en confiabilidad operativa."
            apartados={APARTADOS_CURSOS}
            href="/cursos"
          />
          {bloqueProductos.length > 0 && (
            <CarruselBloque
              etiqueta="Productos"
              titulo={<>Los equipos que <span className="text-secondary">usamos en campo</span></>}
              texto="Te asesoramos en la selección para que compres el equipo que tu planta realmente necesita."
              apartados={bloqueProductos}
              href="/productos"
            />
          )}
        </div>
      </div>
    </section>
  );
}
