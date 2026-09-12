import Antetitulo from "../atoms/Antetitulo";
import type { ZonaSemaforo } from "@/types/servicio";

/**
 * Semaforo
 * Los tres colores con los que sale cada equipo en el informe, y qué pasa
 * en cada uno.
 *
 * Por qué sustituye a la escala numérica: la versión anterior mostraba los
 * rangos en mm/s y en g con referencia a ISO 10816 e ISO 20816. Al jefe de
 * mantenimiento eso le sobra; lo que quiere saber es que el informe le dirá
 * verde, ámbar o rojo y qué hacer en cada caso. Los números viven dentro del
 * informe, donde sí hacen falta.
 *
 * Sin texto de norma, sin unidades, sin nota al pie. Tres lámparas.
 */

type Props = {
  titulo: string;
  subtitulo?: string;
  zonas: ZonaSemaforo[];
  paso?: string;
};

const LAMPARA: Record<string, { fondo: string; halo: string; texto: string }> = {
  bueno: { fondo: "bg-emerald-500", halo: "shadow-emerald-500/40", texto: "text-emerald-700" },
  precaucion: { fondo: "bg-amber-400", halo: "shadow-amber-400/40", texto: "text-amber-700" },
  alarma: { fondo: "bg-red-600", halo: "shadow-red-600/40", texto: "text-red-700" },
};

export default function Semaforo({ titulo, subtitulo, zonas, paso }: Props) {
  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <Antetitulo paso={paso}>Cómo lo calificamos</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">
            {titulo}
          </h2>
          {subtitulo && (
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">{subtitulo}</p>
          )}
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {zonas.map((zona) => {
            const color = LAMPARA[zona.clave] ?? LAMPARA.bueno;
            return (
              <li
                key={zona.clave}
                className="flex flex-col items-center rounded-sm border border-gray-200 bg-white px-6 py-10 text-center"
              >
                <span
                  className={`h-20 w-20 rounded-full shadow-[0_0_0_10px] ${color.fondo} ${color.halo}`}
                  aria-hidden="true"
                />
                <h3 className={`mt-7 text-2xl font-extrabold ${color.texto}`}>{zona.etiqueta}</h3>
                <p className="mt-2 max-w-xs text-base leading-relaxed text-tertiary">{zona.texto}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
