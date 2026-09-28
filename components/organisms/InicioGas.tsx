import Link from "next/link";
import CarruselFotos from "@/components/molecules/CarruselFotos";
import gas from "@/data/deteccion-gas.json";

/**
 * InicioGas
 * La franja de detección de gas en la portada, en lugar de las dos
 * tarjetas de "Detección de gas y equipos" (decisión de Emiliano,
 * 2026-09-27): gas es el servicio más especializado y merece su propio
 * espacio; los equipos ya tienen el bloque de Productos.
 *
 * Lleva la identidad de su página (azul petróleo con retícula), el ciclo
 * LDAR en cuatro pasos, fotos reales de campo en carrusel y los dos caminos:
 * la página del servicio y la guía del PPCIEM.
 */

const RETICULA = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

const PASOS = [
  { n: "01", titulo: "Inventario", texto: "Cada válvula, brida y sello de la instalación, clasificado por familia." },
  { n: "02", titulo: "Detección", texto: "Cámara OGI o cámara acústica con láser TDLAS, las dos que permite la norma." },
  { n: "03", titulo: "Reparación", texto: "Fugas priorizadas, reparadas y vueltas a inspeccionar para confirmarlo." },
  { n: "04", titulo: "Cumplimiento", texto: "El expediente del trimestre listo para la ASEA." },
];

export default function InicioGas() {
  const fotos = (gas as { galeria?: { src: string; alt: string }[] }).galeria ?? [];
  return (
    <section className="w-full bg-[#00202f] py-14 text-white lg:py-20" style={RETICULA}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-14">
        <div>
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
            Detección de fugas de gas · PPCIEM
          </span>
          <h2 className="text-3xl font-extrabold leading-tight lg:text-4xl">
            VE LA FUGA <span className="text-secondary">ANTES QUE LA MULTA</span>
          </h2>
          <p className="mt-4 text-justify leading-relaxed text-white/75">
            Programas LDAR completos para instalaciones de hidrocarburos: encontramos las fugas que no se ven, las documentamos y te dejamos el expediente para la autoridad cada trimestre.
          </p>
          <ol className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PASOS.map((p) => (
              <li key={p.n} className="rounded-sm border border-white/10 bg-white/5 p-4">
                <p className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-bold text-secondary">{p.n}</span>
                  <span className="font-bold">{p.titulo}</span>
                </p>
                <p className="mt-1 text-justify text-sm leading-snug text-white/70">{p.texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/servicios/deteccion-gas"
              className="inline-flex items-center gap-2 rounded-xs bg-secondary px-6 py-3 font-bold text-primary transition-colors hover:bg-white"
            >
              Ver detección de gas
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/servicios/deteccion-gas/guia-ppciem"
              className="inline-flex items-center gap-2 rounded-xs border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:border-secondary hover:text-secondary"
            >
              Guía del PPCIEM
            </Link>
          </div>
        </div>
        {fotos.length > 0 && <CarruselFotos fotos={fotos} intervalo={3500} />}
      </div>
    </section>
  );
}
