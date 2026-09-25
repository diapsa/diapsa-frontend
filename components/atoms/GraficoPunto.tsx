/**
 * GraficoPunto
 * Gráfico esquemático que acompaña a un punto clave del servicio, en lugar
 * de una foto.
 *
 * Por qué existe: "Qué ganas" promete algo que una foto de planta no puede
 * enseñar. Un esquema sí. Son esquemas y lo dicen: sin eje numérico a
 * propósito, para no inventar cifras de cliente.
 *
 * Hay dos. "paros" sirve a las disciplinas que monitorean: el beneficio se
 * ve en el tiempo, conforme el programa corre. "alineacion" sirve a lo
 * correctivo, donde no hay programa que arranque sino un trabajo que se hace
 * bien o se hace mal, y lo que está en juego es cuánto aguanta el equipo
 * después. Se eligen por clave desde el JSON del servicio.
 *
 * Por qué la maquetación es HTML y no un lienzo: antes todo iba dentro de un
 * SVG de ancho fijo, rótulos incluidos, así que en un teléfono el texto se
 * encogía junto con el dibujo y terminaba en seis píxeles, ilegible. Ahora
 * las barras son bloques con altura en porcentaje y los rótulos son texto
 * normal, que conserva su tamaño y crece por punto de quiebre. Las barras
 * crecen al aparecer, bajo motion-safe.
 */

import IlustracionDga from "./IlustracionDga";

type Props = {
  clave: string;
  className?: string;
};

/* Doce meses. Los primeros cuatro sin monitoreo; después arranca el
   programa y los paros bajan. Alturas relativas, de 0 a 100. */
const PAROS = [78, 92, 70, 88, 64, 48, 36, 30, 22, 18, 16, 14];
const ARRANQUE = 4;
/* Deja aire arriba para el rótulo de la línea de arranque. */
const TECHO_PAROS = 0.8;

/* Vida relativa del rodamiento según cómo quedó la alineación. */
const ALINEACION = [
  { estado: "Dentro de tolerancia", nota: "Llega a su vida esperada", altura: 100, color: "bg-emerald-500" },
  { estado: "Fuera de tolerancia", nota: "Se acorta sin que se note", altura: 52, color: "bg-amber-400" },
  { estado: "Muy fuera", nota: "Falla antes de tiempo", altura: 22, color: "bg-red-500" },
];
const TECHO_ALINEACION = 0.94;

const LEYENDA = [
  ["bg-red-500", "Paro por falla"],
  ["bg-amber-400", "Intervención programada"],
  ["bg-emerald-500", "Ruta normal"],
];

function colorBarra(altura: number) {
  if (altura >= 60) return "bg-red-500";
  if (altura >= 30) return "bg-amber-400";
  return "bg-emerald-500";
}

function Titulo({ titulo, pie }: { titulo: string; pie: string }) {
  return (
    <>
      <p className="text-sm font-extrabold leading-tight text-primary lg:text-xl">{titulo}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-tertiary lg:text-sm">{pie}</p>
    </>
  );
}

function Paros() {
  const corte = `${(ARRANQUE / PAROS.length) * 100}%`;
  return (
    <div
      className="flex h-full w-full flex-col"
      role="img"
      aria-label="Esquema: los paros no programados bajan mes a mes a partir de que arranca el monitoreo de condición"
    >
      <Titulo titulo="Paros no programados por mes" pie="Esquema ilustrativo, sin cifras de un cliente en particular" />

      <div className="relative mt-3 min-h-0 flex-1 lg:mt-5">
        <div className="flex h-full items-end gap-[3px] border-b-2 border-gray-300 lg:gap-1.5">
          {PAROS.map((h, i) => (
            <span
              key={i}
              className={`block flex-1 rounded-t-[2px] ${colorBarra(h)} motion-safe:animate-[crecer_.7s_cubic-bezier(.2,.8,.2,1)_both]`}
              style={{ height: `${h * TECHO_PAROS}%`, transformOrigin: "bottom", animationDelay: `${i * 55}ms` }}
            />
          ))}
        </div>

        {/* Arranque del programa */}
        <span
          className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-primary"
          style={{ left: corte }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute top-0 ml-1.5 text-[9px] font-bold leading-tight text-primary lg:ml-2 lg:text-xs"
          style={{ left: corte }}
        >
          Arranca el monitoreo
        </span>
      </div>

      <div className="mt-1.5 flex text-[9px] font-semibold leading-tight text-tertiary lg:text-xs">
        <span className="shrink-0 text-center" style={{ flexBasis: corte }}>
          Sin monitoreo
        </span>
        <span className="flex-1 text-center">Con monitoreo de condición</span>
      </div>

      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 lg:mt-4 lg:gap-x-6">
        {LEYENDA.map(([color, texto]) => (
          <li key={texto} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 shrink-0 rounded-[2px] ${color} lg:h-3 lg:w-3`} aria-hidden="true" />
            <span className="text-[9px] leading-tight text-tertiary lg:text-xs">{texto}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Alineacion() {
  return (
    <div
      className="flex h-full w-full flex-col"
      role="img"
      aria-label="Esquema: la vida del rodamiento cae conforme la alineación se sale de tolerancia, y detrás del rodamiento se dañan los sellos, el acople y el eje"
    >
      <Titulo titulo="Lo que dura un rodamiento" pie="Esquema ilustrativo, sin cifras de un cliente en particular" />

      <div className="mt-3 flex min-h-0 flex-1 items-end gap-4 border-b-2 border-gray-300 lg:mt-5 lg:gap-8">
        {ALINEACION.map((b, i) => (
          <span key={b.estado} className="flex h-full flex-1 items-end justify-center">
            <span
              className={`block w-1/2 rounded-t-[2px] ${b.color} motion-safe:animate-[crecer_.7s_cubic-bezier(.2,.8,.2,1)_both]`}
              style={{ height: `${b.altura * TECHO_ALINEACION}%`, transformOrigin: "bottom", animationDelay: `${i * 140}ms` }}
            />
          </span>
        ))}
      </div>

      <div className="mt-1.5 flex gap-4 lg:gap-8">
        {ALINEACION.map((b) => (
          <span key={b.estado} className="flex-1 text-center">
            <span className="block text-[10px] font-bold leading-tight text-primary lg:text-sm">{b.estado}</span>
            <span className="mt-0.5 block text-[9px] leading-tight text-tertiary lg:text-xs">{b.nota}</span>
          </span>
        ))}
      </div>

      {/* El rodamiento es solo el primero de la fila. */}
      <div className="mt-2 lg:mt-4">
        <p className="text-[10px] font-bold leading-tight text-primary lg:text-sm">
          Y el rodamiento es el primero, no el único
        </p>
        <p className="mt-0.5 text-[9px] leading-tight text-tertiary lg:text-xs">
          Detrás vienen los sellos, el acople, el eje y, si llega lejos, el motor.
        </p>
      </div>
    </div>
  );
}

export default function GraficoPunto({ clave, className = "" }: Props) {
  // Las ilustraciones de DGA en línea traen su propio marco.
  if (clave.startsWith("dga-")) return <IlustracionDga clave={clave} />;
  const esquema = clave === "paros" ? <Paros /> : clave === "alineacion" ? <Alineacion /> : null;
  if (!esquema) return null;
  return <div className={`h-full w-full bg-white p-4 lg:p-6 ${className}`}>{esquema}</div>;
}
