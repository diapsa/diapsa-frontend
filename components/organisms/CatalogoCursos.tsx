import Image from "next/image";
import Link from "next/link";
import Antetitulo from "../atoms/Antetitulo";
import type { Course } from "@/types/course";
import { TECNICAS, diaMes, extraDe, fechaGrupo, imagenDe, muestraFotos, proximosGrupos, type FormatoCurso } from "@/lib/cursos";
import EscenaCursos from "./EscenaCursos";
import GaleriaCampo from "./GaleriaCampo";
import dip from "@/data/diplomado.json";
import menuCursos from "@/data/menu-cursos.json";

/**
 * CatalogoCursos
 * El catálogo ordenado como lo busca quien capacita a su equipo: primero los
 * grupos que ya tienen fecha, después cada técnica con sus formatos
 * (formación, taller práctico, certificación) y al final los cursos de
 * confiabilidad y gestión.
 *
 * Antes se agrupaba por el tipo del CMS (certificado, taller, estratégico),
 * que mezclaba en "estratégicos" los cursos de introducción con la
 * formación técnica completa, y prometía "cursos certificados por ISO":
 * la ISO 18436 certifica personas por categoría, no cursos.
 */

const ORDEN: FormatoCurso[] = ["formacion", "practica", "certificacion", "especialidad", "gestion"];

/* Tarjeta compacta: foto chica, formato, nombre y enlace. Con 15 cursos en
   tarjetas grandes había que bajar cuatro pantallas; así cabe una técnica
   por renglón. */
/* Nombre corto y una línea, los mismos del menú: dentro del renglón de la
   técnica, "Formación técnica" dice más que "Curso Técnico Especializado:
   Vibraciones Mecánicas" cortado a la mitad. */
const CORTOS = new Map(
  (menuCursos as { items: { label: string; href: string; descripcion: string }[] }[])
    .flatMap((c) => c.items)
    .map((i) => [i.href.replace("/cursos/", ""), i] as const)
);

function Tarjeta({ curso }: { curso: Course }) {
  const corto = CORTOS.get(curso.slug);
  const grupo = proximosGrupos(curso.slug)[0];
  const foto = imagenDe(curso.slug, curso.url_img, curso.alt_img || curso.name);
  return (
    <Link href={`/cursos/${curso.slug}`} className="group flex h-full overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative w-24 shrink-0 bg-primary">
        {foto && <Image src={foto.src} alt={foto.alt} fill sizes="96px" className="object-cover" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <h3 className="text-base font-extrabold leading-snug text-primary">{corto?.label ?? curso.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-tertiary">{corto?.descripcion ?? curso.description}</p>
        {grupo && <p className="mt-1 text-xs font-bold text-emerald-700">Próximo grupo: {fechaGrupo(grupo)}</p>}
        <span className="mt-auto pt-2 text-sm font-bold text-secondary group-hover:underline">Ver curso →</span>
      </div>
    </Link>
  );
}

/* Si el CMS no responde, el catálogo se arma con los cursos del menú, que
   viven en el sitio: nombre, una línea y su enlace. Así la página nunca
   queda vacía. */
function respaldo(): Course[] {
  return (menuCursos as { items: { label: string; href: string; descripcion: string }[] }[]).flatMap((col) =>
    col.items.filter((i) => !i.href.includes(dip.slug)).map((i) => {
      const slug = i.href.replace("/cursos/", "");
      return { id: slug, slug, name: i.label, description: i.descripcion, url_img: "", alt_img: "", reference_norm: "" } as unknown as Course;
    })
  );
}

export default function CatalogoCursos({ cursos: delCms }: { cursos: Course[] }) {
  const cursos = delCms.length ? delCms : respaldo();
  const porSlug = new Map(cursos.map((c) => [c.slug, c]));
  const grupos = proximosGrupos().filter((g) => porSlug.has(g.curso));
  const ordenar = (a: Course, b: Course) => ORDEN.indexOf(extraDe(a.slug)?.formato ?? "gestion") - ORDEN.indexOf(extraDe(b.slug)?.formato ?? "gestion");
  const sinClasificar = cursos.filter((c) => !extraDe(c.slug));

  return (
    <>
      {/* Presentación: texto y acciones a la izquierda, la escena a la derecha */}
      <section className="w-full bg-white py-10 lg:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <Antetitulo>Capacitación</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">Aprende la técnica con quien la aplica todos los días</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
              Nuestros instructores diagnostican maquinaria real en planta, y eso es lo que enseñan: casos de equipos inspeccionados, no ejemplos de libro.
              Cada técnica tiene tres formas de aprenderla, de la formación completa a la certificación por categoría.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#vibraciones" className="inline-flex items-center justify-center rounded-xs bg-primary px-7 py-3.5 font-bold text-white transition-colors hover:bg-secondary hover:text-primary">
                Ver los cursos
              </a>
              <a href="#contacto" className="inline-flex items-center justify-center rounded-xs border-2 border-primary px-7 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                Capacitar a mi equipo
              </a>
            </div>
          </div>
          {/* La escena: del aula a la planta y a la certificación */}
          <EscenaCursos foto={muestraFotos(1)[0]} />
        </div>
      </section>

      {/* Los datos, en una franja */}
      <section className="w-full bg-primary text-white">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { v: "+3,000", t: "especialistas capacitados" },
            { v: String(cursos.length || 15), t: "cursos" },
            { v: "ISO 18436", t: "certificación" },
          ].map((x) => (
            <li key={x.t} className="px-2 py-7 sm:px-8 sm:first:pl-0 lg:py-10">
              <p className="text-4xl font-extrabold leading-none text-secondary lg:text-5xl">{x.v}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/60">{x.t}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* El programa insignia, antes que todo el catálogo */}
      <section className="w-full bg-white py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-8 overflow-hidden rounded-sm bg-[#00202f] p-6 text-white shadow-2xl lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:p-10">
            <div>
              <p className="inline-flex rounded-full bg-secondary px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-primary">Programa insignia</p>
              <p className="mt-4 text-4xl font-extrabold uppercase leading-none lg:text-5xl">Diplomado</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-secondary lg:text-3xl">{dip.corto}</h2>
              <p className="mt-4 text-justify text-base leading-relaxed text-white/75 lg:text-lg">{dip.resumen}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={`/cursos/${dip.slug}`} className="inline-flex items-center justify-center rounded-xs bg-secondary px-7 py-3.5 font-bold text-primary transition-colors hover:bg-white">Ver el diplomado</Link>
                <Link href={`/cursos/${dip.slug}#brochure`} className="inline-flex items-center justify-center rounded-xs border-2 border-white/60 px-7 py-3 font-bold text-white transition-colors hover:bg-white hover:text-primary">Descargar brochure</Link>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {dip.datos.map((d) => (
                <li key={d.v} className="rounded-sm bg-white/[0.06] px-4 py-4 ring-1 ring-white/10">
                  <p className="text-3xl font-extrabold leading-none">{d.v}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/55">{d.t}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Grupos con fecha */}
      {grupos.length > 0 && (
        <section className="w-full bg-[#00202f] py-12 text-white lg:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Inscripciones abiertas</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight lg:text-4xl">Próximos grupos</h2>
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grupos.map((g) => {
                const c = porSlug.get(g.curso)!;
                const { dia, mes } = diaMes(g);
                return (
                  <li key={`${g.curso}-${g.inicio}`}>
                    <Link href={`/cursos/${g.curso}#grupos`} className="flex h-full gap-4 rounded-sm bg-white/[0.06] p-5 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]">
                      <span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-sm bg-secondary text-primary">
                        <span className="text-2xl font-extrabold leading-none">{dia}</span>
                        <span className="text-xs font-bold uppercase">{mes}</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-extrabold leading-snug">{c.name}</span>
                        <span className="mt-1 block text-sm text-white/70">{[fechaGrupo(g), g.modalidad, g.sede].filter(Boolean).join(" · ")}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Cursos por técnica: un renglón por técnica */}
      <section className="w-full bg-gray-100 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Antetitulo>El catálogo</Antetitulo>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Cursos por técnica</h2>
          <div className="mt-8 space-y-4">
            {TECNICAS.map((t) => {
              const lista = cursos.filter((c) => extraDe(c.slug)?.tecnica === t.clave).sort(ordenar);
              if (!lista.length) return null;
              return (
                <div key={t.clave} id={t.clave} className="grid scroll-mt-28 grid-cols-1 gap-4 rounded-sm bg-white p-4 shadow-sm ring-1 ring-black/5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-6 lg:p-5">
                  <div className="flex flex-row items-center justify-between gap-3 border-b border-gray-100 pb-3 lg:flex-col lg:items-start lg:justify-start lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
                    <div>
                      <h3 className="text-xl font-extrabold leading-tight text-primary">{t.nombre}</h3>
                      <p className="mt-1 text-sm text-tertiary">{lista.length} cursos</p>
                    </div>
                    {t.norma && <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{t.norma}</span>}
                  </div>
                  {/* En teléfono, los cursos de la técnica se deslizan de lado */}
                  <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
                    {lista.map((c) => (
                      <div key={c.slug} className="w-[85%] shrink-0 snap-start sm:w-auto">
                        <Tarjeta curso={c} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fotos reales de los cursos, de todas las técnicas */}
      <GaleriaCampo
        fotos={muestraFotos(24)}
        titulo="Así son nuestros cursos"
        texto="Fotos reales de grupos de DIAPSA, en aula y en planta."
        intervalo={3000}
      />

      {sinClasificar.length > 0 && (
        <section className="w-full bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Más cursos</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sinClasificar.map((c) => <Tarjeta key={c.slug} curso={c} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
