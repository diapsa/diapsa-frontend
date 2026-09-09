import type { ServiceTabla } from "@/types/servicio";

/**
 * ServiceTable
 * Tabla técnica de referencia dentro de una página de servicio.
 *
 * Por qué existe: las páginas de servicio eran muros de texto. Una tabla de
 * referencia real, del tipo que un analista consulta, demuestra dominio del
 * tema mucho mejor que cualquier adjetivo, y responde búsquedas técnicas de
 * cola larga que hoy se van a foros y blogs de otros.
 *
 * La primera columna se resalta porque es la que se escanea al buscar.
 * En pantallas chicas la tabla se desplaza horizontalmente dentro de su propio
 * contenedor, nunca empuja el ancho de la página.
 */

type Props = {
  tabla: ServiceTabla;
};

export default function ServiceTable({ tabla }: Props) {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight">
            {tabla.titulo}
          </h2>
          {tabla.subtitulo && (
            <p className="text-tertiary text-lg mt-3 max-w-3xl leading-relaxed text-justify">
              {tabla.subtitulo}
            </p>
          )}
        </div>

        <div className="overflow-x-auto rounded-sm border border-gray-200 shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-primary text-white">
                {tabla.columnas.map((columna) => (
                  <th
                    key={columna}
                    scope="col"
                    className="px-5 py-4 text-sm font-bold uppercase tracking-wider"
                  >
                    {columna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabla.filas.map((fila, indice) => (
                <tr
                  key={fila[0]}
                  className={indice % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {fila.map((celda, columna) => (
                    <td
                      key={columna}
                      className={
                        columna === 0
                          ? "px-5 py-4 align-top border-t border-gray-200 font-bold text-primary"
                          : columna === 1
                            ? "px-5 py-4 align-top border-t border-gray-200 font-semibold text-secondary whitespace-nowrap"
                            : "px-5 py-4 align-top border-t border-gray-200 text-tertiary text-sm leading-relaxed"
                      }
                    >
                      {celda}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tabla.nota && (
          <p className="text-tertiary text-sm mt-4 leading-relaxed text-justify max-w-3xl">
            {tabla.nota}
          </p>
        )}
      </div>
    </section>
  );
}
