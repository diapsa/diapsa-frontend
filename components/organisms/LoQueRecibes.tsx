import Image from "next/image";
import Link from "next/link";

/**
 * LoQueRecibes
 * Los tres entregables de DIAPSA contados con imagen: el aviso inmediato en
 * el teléfono durante el recorrido, la página del informe al cerrar la ruta
 * y la pantalla de IDAP con el historial.
 *
 * Vive aparte porque lo usan la página de monitoreo de condición y la
 * portada; así los dos dicen lo mismo con las mismas imágenes.
 */

function Flecha() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

const REPORTES = [
  {
    cuando: "Durante el recorrido",
    titulo: "Aviso inmediato",
    texto: "Si un equipo está en riesgo, no esperas el informe: te avisamos en ese momento, con la falla y la acción recomendada.",
  },
  {
    cuando: "Al cerrar la ruta",
    titulo: "Informe de la ruta",
    texto: "Cada equipo con su estado, el resultado por técnica, los hallazgos y las recomendaciones ordenadas por prioridad.",
    foto: { src: "/images/informe/pagina-1.png", alt: "Página de un informe integral de DIAPSA: estado del equipo, resultado por disciplina y recomendaciones" },
  },
  {
    cuando: "Siempre, en IDAP",
    titulo: "Historial en línea",
    texto: "Todas las mediciones en nuestra plataforma: tendencias por equipo, comparativas entre rutas y trazabilidad para auditorías.",
    foto: { src: "/images/idap/capturas/inspeccion-vibraciones.jpg", alt: "Pantalla de IDAP con el estado por técnica y las lecturas de vibración de un equipo" },
  },
];

/* El aviso tal como llega al teléfono del jefe de mantenimiento. Es un
   ejemplo armado, sin datos de ningún cliente. */
function AvisoTelefono() {
  return (
    <div className="flex h-full items-center justify-center bg-[#e9eef2] px-4 pb-10 pt-4">
      <div className="w-full max-w-[15rem] rounded-[1.6rem] bg-primary p-1.5 shadow-xl">
        <div className="rounded-[1.25rem] bg-[#f3f6f8] px-3 pb-3 pt-3">
          <p className="mb-2 text-center text-[10px] font-semibold text-tertiary">Hoy, 10:42</p>
          <div className="rounded-lg rounded-tl-none bg-white p-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Aviso DIAPSA</p>
            <p className="mt-1 text-sm font-extrabold leading-tight text-primary">Bomba de alimentación 2</p>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
              Alarma en vibraciones
            </p>
            <p className="mt-2 text-[11px] leading-snug text-primary">
              Daño en el rodamiento del lado acoplado. Recomendación: programar el cambio esta semana.
            </p>
          </div>
          <p className="mt-2 text-right text-[10px] font-semibold text-emerald-600">✓ Recibido por mantenimiento</p>
        </div>
      </div>
    </div>
  );
}

export default function LoQueRecibes() {
  return (
      <section className="relative w-full overflow-hidden bg-primary py-14 lg:py-20">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              Entregables
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-white lg:text-4xl">
              LO QUE <span className="text-secondary">RECIBES</span>
            </h2>
            <p className="text-justify text-lg text-white/70 sm:text-center">
              Tres entregas en tres momentos: lo urgente en el momento, el informe al cerrar la ruta y el historial siempre a la mano.
            </p>
          </div>
          <ol className="mx-auto grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
            {REPORTES.map((r, i) => (
              <li key={r.titulo} className="flex flex-col overflow-hidden rounded-sm bg-white shadow-xl">
                <div className={`relative aspect-[4/3] w-full overflow-hidden border-b border-gray-100 bg-[#e9eef2] ${r.foto ? "" : "min-h-[17.5rem]"}`}>
                  {r.foto ? (
                    <Image
                      src={r.foto.src}
                      alt={r.foto.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 33vw, 576px"
                    />
                  ) : (
                    <AvisoTelefono />
                  )}
                  <span className="absolute bottom-3 left-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary shadow">
                    {r.cuando}
                  </span>
                </div>
                <div className="flex flex-1 gap-4 p-5 sm:p-6">
                  <span className="text-3xl font-extrabold leading-none text-secondary">{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-bold text-primary">{r.titulo}</h3>
                    <p className="mt-1 text-justify text-sm leading-relaxed text-tertiary">{r.texto}</p>
                    {r.titulo === "Historial en línea" && (
                      <Link href="/servicios/idap" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-primary">
                        Conocer IDAP <Flecha />
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-xs bg-secondary px-8 py-3 font-bold text-primary shadow-md transition-colors hover:bg-white"
            >
              Quiero ver un informe de ejemplo <Flecha />
            </Link>
          </div>
        </div>
      </section>
  );
}
