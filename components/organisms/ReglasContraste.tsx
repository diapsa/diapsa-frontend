import Antetitulo from "../atoms/Antetitulo";
import type { ServiceContraste } from "@/types/servicio";

/**
 * ReglasContraste
 * Dos columnas enfrentadas: lo que hace válido un trabajo y lo que lo
 * invalida, renglón por renglón.
 *
 * Por qué existe: hay servicios donde el valor no está en el instrumento
 * sino en el procedimiento, y eso es difícil de vender porque no se ve. En
 * análisis de aceite el laboratorio mide con precisión lo que le llegue; si
 * la muestra no representa al equipo, el informe sale impecable y
 * equivocado. Enfrentar la práctica correcta con la incorrecta hace visible
 * ese trabajo, que es justo lo que separa a un especialista de alguien que
 * llena un frasco.
 *
 * En escritorio son dos columnas con su encabezado. En teléfono se apilan y
 * el encabezado sobra: la palomita y la tacha ya dicen cuál es cuál.
 *
 * Componente de servidor: sin estado y sin JavaScript.
 */

type Props = {
  contraste: ServiceContraste;
  paso?: string;
};

export default function ReglasContraste({ contraste, paso }: Props) {
  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>{contraste.etiqueta}</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {contraste.titulo}
          </h2>
          {contraste.texto && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">
              {contraste.texto}
            </p>
          )}
        </div>

        {/* Encabezados de columna, solo donde hay dos columnas */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
          <p className="border-b-2 border-emerald-500 pb-2 text-sm font-bold uppercase tracking-widest text-emerald-700">
            {contraste.bienEtiqueta}
          </p>
          <p className="border-b-2 border-red-300 pb-2 text-sm font-bold uppercase tracking-widest text-red-600/70">
            {contraste.malEtiqueta}
          </p>
        </div>

        <ul className="lg:mt-2">
          {contraste.filas.map((fila) => (
            <li
              key={fila.bien}
              className="grid grid-cols-1 gap-3 border-b border-gray-200 py-5 lg:grid-cols-2 lg:gap-8"
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-600/20"
                >
                  <svg
                    className="h-3.5 w-3.5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <p className="text-base leading-relaxed text-primary">{fila.bien}</p>
              </div>

              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-600/20"
                >
                  <svg
                    className="h-3.5 w-3.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <p className="text-base leading-relaxed text-tertiary">{fila.mal}</p>
              </div>
            </li>
          ))}
        </ul>

        {contraste.nota && (
          <p className="mt-8 max-w-3xl text-justify text-base leading-relaxed text-tertiary">
            {contraste.nota}
          </p>
        )}
      </div>
    </section>
  );
}
