import Image from "next/image";
import Link from "next/link";
import Antetitulo from "../atoms/Antetitulo";
import type { Course } from "@/types/course";
import { FORMATOS, TECNICAS, diaMes, extraDe, fechaGrupo, proximosGrupos, type FormatoCurso } from "@/lib/cursos";

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

function Tarjeta({ curso }: { curso: Course }) {
  const x = extraDe(curso.slug);
  const formato = x ? FORMATOS[x.formato] : null;
  const grupo = proximosGrupos(curso.slug)[0];
  return (
    <Link href={`/cursos/${curso.slug}`} className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl">
      <div className="relative aspect-[16/10] bg-primary">
        {curso.url_img ? (
          <Image src={curso.url_img} alt={curso.alt_img || curso.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          /* Sin imagen en el CMS: la técnica sobre la retícula de la marca, sin repetir el título */
          <div
            className="absolute inset-0 flex items-end bg-[linear-gradient(135deg,#002e46,#2b5671)] p-4"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(135deg,#002e46,#2b5671)", backgroundSize: "28px 28px, 28px 28px, auto" }}
          >
            <span className="text-sm font-bold uppercase tracking-widest text-secondary">{TECNICAS.find((t) => t.clave === x?.tecnica)?.nombre ?? "Curso"}</span>
          </div>
        )}
        {formato && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
            {formato.nombre}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {(curso.reference_norm || x?.nivel) && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">
            {[curso.reference_norm ? `ISO ${curso.reference_norm.replace(/^ISO\s*/i, "")}` : "", x?.nivel ?? ""].filter(Boolean).join(" · ")}
          </p>
        )}
        <h3 className="mt-1 text-lg font-extrabold leading-snug text-primary">{curso.name}</h3>
        <p className="mt-2 line-clamp-3 text-justify text-sm leading-relaxed text-tertiary">{curso.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {grupo ? (
            <span className="rounded-sm bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/20">Próximo grupo: {fechaGrupo(grupo)}</span>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-sm font-bold text-secondary group-hover:underline">Ver curso →</span>
        </div>
      </div>
    </Link>
  );
}

export default function CatalogoCursos({ cursos }: { cursos: Course[] }) {
  const porSlug = new Map(cursos.map((c) => [c.slug, c]));
  const grupos = proximosGrupos().filter((g) => porSlug.has(g.curso));
  const ordenar = (a: Course, b: Course) => ORDEN.indexOf(extraDe(a.slug)?.formato ?? "gestion") - ORDEN.indexOf(extraDe(b.slug)?.formato ?? "gestion");
  const sinClasificar = cursos.filter((c) => !extraDe(c.slug));

  return (
    <>
      {/* Presentación */}
      <section className="w-full bg-white py-12 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <Antetitulo>Capacitación</Antetitulo>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-[2.75rem]">Aprende la técnica con quien la aplica todos los días</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">
              Nuestros instructores diagnostican maquinaria real en planta, y eso es lo que enseñan: casos de equipos inspeccionados, no ejemplos de libro.
              Cada técnica tiene tres formas de aprenderla, de la formación completa a la certificación por categoría.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { v: String(cursos.length || 15), t: "cursos en vibraciones, termografía, ultrasonido y confiabilidad" },
              { v: "ISO 18436", t: "cursos de certificación bajo lineamientos ISO 18436 en vibraciones y termografía" },
              { v: "Casos reales", t: "de equipos que nuestros analistas inspeccionan en planta" },
            ].map((x) => (
              <li key={x.t} className="flex flex-col gap-1 rounded-sm bg-gray-50 px-5 py-4 ring-1 ring-black/5 lg:flex-row lg:items-baseline lg:gap-4">
                <span className="shrink-0 text-2xl font-extrabold text-primary">{x.v}</span>
                <span className="text-sm leading-snug text-tertiary">{x.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Grupos con fecha */}
      {grupos.length > 0 && (
        <section className="w-full bg-primary py-12 text-white lg:py-16">
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

      {/* Por técnica */}
      {TECNICAS.map((t, i) => {
        const lista = cursos.filter((c) => extraDe(c.slug)?.tecnica === t.clave).sort(ordenar);
        if (!lista.length) return null;
        return (
          <section key={t.clave} className={`w-full py-12 lg:py-16 ${i % 2 ? "bg-white" : "bg-gray-50"}`}>
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-3xl">
                  <Antetitulo>{t.clave === "confiabilidad" ? "Para quien decide" : "Técnica"}</Antetitulo>
                  <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">{t.nombre}</h2>
                </div>
                {t.norma && <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">Certificación {t.norma}</span>}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {lista.map((c) => <Tarjeta key={c.slug} curso={c} />)}
              </div>
            </div>
          </section>
        );
      })}

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
