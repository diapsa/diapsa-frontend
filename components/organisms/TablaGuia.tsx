import type { TablaGuia as Tabla } from "@/lib/tablas-guias";

/**
 * TablaGuia
 * Una tabla real dentro de una guía del blog, dibujada en código porque el
 * renderizador no admite tablas. La primera columna va en negritas y los
 * valores centrados, con el pie que explica cómo leerla.
 */
export default function TablaGuia({ tabla }: { tabla: Tabla }) {
  return (
    <figure className="my-8 overflow-hidden rounded-sm ring-1 ring-primary/10">
      <figcaption className="bg-primary px-5 py-3 text-sm font-bold text-white">{tabla.titulo}</figcaption>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-xs font-bold uppercase tracking-wider text-primary">
              {tabla.columnas.map((c, i) => (
                <th key={c} scope="col" className={`px-4 py-3 ${i > 0 ? "text-center" : ""}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.filas.map((f) => (
              <tr key={f[0]} className="border-t border-gray-100">
                {f.map((celda, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="px-4 py-3 text-left font-bold text-primary">
                      {celda}
                    </th>
                  ) : (
                    <td key={i} className="px-4 py-3 text-center font-semibold tabular-nums text-tertiary">
                      {celda}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tabla.pie && <p className="bg-gray-50 px-5 py-3 text-justify text-xs leading-relaxed text-tertiary">{tabla.pie}</p>}
    </figure>
  );
}
