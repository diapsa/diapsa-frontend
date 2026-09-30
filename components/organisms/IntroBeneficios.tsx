import Image from "next/image";
import Link from "next/link";
import VideoBucle from "../atoms/VideoBucle";
import CarruselFotos from "../molecules/CarruselFotos";
import type { ServiceIntroBeneficios } from "@/types/servicio";

/**
 * IntroBeneficios
 * La primera parte de una página de servicio, reestructurada (Emiliano,
 * 2026-09-29): en lugar del acordeón de cuatro puntos, lo que ganas en
 * cuatro tarjetas con ícono junto a fotos de campo que se van cambiando, las dos formas de
 * contratarlo y una banda propia para IDAP con su video. "Dónde se aplica"
 * ya no va aquí porque tiene su sección con videos más abajo.
 *
 * Fondo claro con recursos en azul, como pidió Emiliano para esta página.
 */

const ICONOS: Record<string, React.ReactNode> = {
  paro: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 3v5.25c0 4.5-3.2 8.4-7.5 9.75-4.3-1.35-7.5-5.25-7.5-9.75V6L12 3zm-3 9l2 2 4-4" />,
  gota: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5c3 4 6 7.2 6 10.5a6 6 0 01-12 0c0-3.3 3-6.5 6-10.5zM9.5 14.5a2.5 2.5 0 002.5 2.5" />,
  aire: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h11a3 3 0 10-3-3M3 12h15a3 3 0 11-3 3M3 16h7" />,
  rayo: <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L4.5 13.5H12L11 21l8.5-10.5H12L13 3z" />,
};

function Check() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-black text-white" aria-hidden="true">
      ✓
    </span>
  );
}

export default function IntroBeneficios({ intro }: { intro: ServiceIntroBeneficios }) {
  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Lo que ganas, junto a la foto de campo */}
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">{intro.beneficiosTitulo ?? "Qué ganas"}</p>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {intro.beneficios.map((b) => (
              <li key={b.titulo} className="rounded-xl bg-white p-5 ring-1 ring-primary/10 transition-shadow hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/[0.07] text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                    {ICONOS[b.icono] ?? ICONOS.paro}
                  </svg>
                </span>
                <p className="mt-3 text-base font-extrabold leading-snug text-primary">{b.titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-tertiary">{b.texto}</p>
              </li>
            ))}
          </ul>
          {/* Puntual o continuo */}
          {intro.modalidades && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {intro.modalidades.map((m) => {
                const contenido = (
                  <>
                    <p className="text-sm font-extrabold text-primary">
                      {m.titulo}
                      {m.enlace && <span className="ml-1 text-secondary">→</span>}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-tertiary">{m.texto}</p>
                  </>
                );
                return m.enlace ? (
                  <Link key={m.titulo} href={m.enlace} className="block rounded-xl border-2 border-dashed border-primary/15 p-4 transition-colors hover:border-secondary">
                    {contenido}
                  </Link>
                ) : (
                  <div key={m.titulo} className="rounded-xl border-2 border-dashed border-primary/15 p-4">
                    {contenido}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Fotos de campo que se van cambiando solas */}
        <CarruselFotos
          fotos={intro.fotos}
          intervalo={3500}
          etiqueta="Fotografías de analistas de DIAPSA midiendo con ultrasonido en campo"
          className="aspect-[4/3] rounded-2xl shadow-[0_30px_70px_-35px_rgba(13,26,56,0.45)] lg:aspect-auto"
        />
      </div>

      {/* Tus datos viven en IDAP */}
      <div className="grid grid-cols-1 items-center gap-8 rounded-2xl bg-[#eef4fb] p-6 ring-1 ring-primary/10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:p-10">
        <div>
          <Image src="/images/idap/idap-logo.png" alt="IDAP" width={566} height={207} className="h-auto w-28" />
          <p className="mt-4 text-2xl font-extrabold leading-tight text-primary">{intro.idap.titulo}</p>
          <p className="mt-2 text-justify text-base leading-relaxed text-tertiary">{intro.idap.texto}</p>
          <ul className="mt-5 space-y-2.5">
            {intro.idap.puntos.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm font-semibold text-primary">
                <Check />
                {p}
              </li>
            ))}
          </ul>
          <Link href={intro.idap.enlace} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105">
            Conoce IDAP <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl bg-white p-2 shadow-[0_30px_70px_-35px_rgba(13,26,56,0.45)] ring-1 ring-primary/10">
          <VideoBucle
            className="block aspect-[16/10] w-full rounded-lg object-cover"
            src={`${intro.idap.video}.mp4`}
            poster={`${intro.idap.video}.jpg`}
            descripcion={intro.idap.descripcionVideo}
          />
        </div>
      </div>
    </div>
  );
}
