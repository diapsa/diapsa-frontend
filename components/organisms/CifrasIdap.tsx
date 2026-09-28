import Image from "next/image";
import Link from "next/link";
import AnimacionIdap from "@/components/atoms/AnimacionIdap";
import { FONDO_IDAP, RUTA_IDAP } from "@/lib/idap-estilo";
import CountUp from "@/components/atoms/CountUp";
import datos from "@/data/cifras-idap.json";

/**
 * CifrasIdap
 * La franja de resultados de la portada: hallazgos, equipos, mediciones,
 * plantas y países, con la fecha de corte y la leyenda de que salen de IDAP.
 *
 * Cómo crecen: data/cifras-idap.json guarda el total real a una fecha
 * (base y corteBase) y el promedio mensual (porMes). Aquí se suma porMes
 * por cada mes transcurrido desde el corte, así la cifra sube sola al
 * cambiar el mes sin tocar el código; la página se regenera a diario.
 *
 * Mientras no haya cifras reales (base en null) la franja no se publica:
 * en producción serían números inventados presentados como datos de IDAP.
 * En local se muestra con los valores de ejemplo, marcados como tales, para
 * revisar el diseño. Arriba de las cifras va AnimacionIdap: hallazgos que
 * viajan de las plantas a IDAP. Fondo y logo son los de la plataforma y
 * todo lo que dice IDAP lleva a su página.
 */

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function mesesDesde(fechaIso: string, hoy: Date) {
  const [a, m] = fechaIso.split("-").map(Number);
  return Math.max(0, (hoy.getFullYear() - a) * 12 + (hoy.getMonth() + 1 - m));
}

export default function CifrasIdap() {
  const hoy = new Date();
  const reales = datos.cifras.every((c) => c.base !== null);
  const ejemplo = !reales && process.env.NODE_ENV === "development";
  if (!reales && !ejemplo) return null;

  const meses = mesesDesde(datos.corteBase, hoy);
  const cifras = datos.cifras.map((c) => {
    const base = (reales ? c.base : c.ejemplo) ?? 0;
    const porMes = (reales ? c.porMes : c.ejemploPorMes) ?? 0;
    return { ...c, valor: base + porMes * meses };
  });
  const corte = `1 de ${MESES[hoy.getMonth()]} de ${hoy.getFullYear()}`;

  return (
    <section className="relative w-full overflow-hidden py-14 lg:py-16" style={{ background: FONDO_IDAP }}>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <Link href={RUTA_IDAP} aria-label="Conocer IDAP" className="mb-1 transition-opacity hover:opacity-80">
            <Image src="/images/idap/idap-bco.png" alt="IDAP" width={1632} height={486} className="h-10 w-auto lg:h-12" />
          </Link>
          <Link
            href={RUTA_IDAP}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 transition-colors hover:bg-white/20"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" aria-hidden="true" />
            Conectado con IDAP
          </Link>
          <h2 className="text-3xl font-extrabold text-white lg:text-4xl">
            RESULTADOS QUE <span className="text-secondary">CRECEN CADA MES</span>
          </h2>
          <p className="max-w-2xl text-justify text-white/70 sm:text-center">
            Cada ruta que hacemos queda registrada en IDAP, nuestra plataforma. Estas cifras se alimentan de ese historial.
          </p>
          {ejemplo && (
            <p className="rounded-sm bg-secondary px-3 py-1 text-xs font-bold text-primary">
              Valores de ejemplo, solo en local. No se publican hasta cargar las cifras reales en data/cifras-idap.json.
            </p>
          )}
        </div>
        <div className="mx-auto mb-10 max-w-5xl">
          <AnimacionIdap />
        </div>
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {cifras.map((c) => (
            <div key={c.clave} className="flex flex-col-reverse rounded-sm border border-white/10 bg-white/5 p-5 text-center">
              <dt className="mt-2 text-sm leading-snug text-white/70">{c.texto}</dt>
              <dd className="text-3xl font-extrabold text-secondary lg:text-4xl">
                {c.clave !== "paises" && "+"}
                <CountUp valor={c.valor} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-center text-xs text-white/50">Cifras con base en el historial de IDAP, actualizadas al {corte}.</p>
        <div className="mt-8 text-center">
          <Link
            href={RUTA_IDAP}
            className="inline-flex items-center gap-2 rounded-xs bg-secondary px-7 py-3 font-bold text-primary shadow-md transition-colors hover:bg-white"
          >
            Conocer IDAP
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
