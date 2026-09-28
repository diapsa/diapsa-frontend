import datos from "@/data/industrias.json";

/**
 * InicioIndustrias
 * Las industrias que atiende DIAPSA, en la portada, en un apartado simple
 * (decisión de Emiliano, 2026-09-27, con Fracttal de referencia): título,
 * un párrafo y los nombres en pastillas. La lista vive en
 * data/industrias.json.
 */

export default function InicioIndustrias() {
  return (
    <section className="w-full bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Industrias</span>
        <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
          CONOCEMOS <span className="text-secondary">TU INDUSTRIA</span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-justify text-lg leading-relaxed text-tertiary sm:text-center">
          Cada giro tiene sus equipos críticos y sus modos de falla. Llevamos más de 20 años midiéndolos en plantas de estas industrias, con los equipos en operación.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {datos.industrias.map((nombre) => (
            <li key={nombre} className="rounded-sm bg-primary/5 px-5 py-3 text-base font-bold text-primary ring-1 ring-primary/10">
              {nombre}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
