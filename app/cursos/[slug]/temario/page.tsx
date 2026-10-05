import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import BotonImprimir from "@/components/atoms/BotonImprimir";
import { getCourseBySlug } from "@/lib/api/courses";
import { FORMATOS, TECNICAS, extraDe } from "@/lib/cursos";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Hoja del temario de un curso, para imprimir o guardar como PDF
 * (Emiliano, 2026-10-04). Se abre desde el botón "Descargar el temario" de
 * la ficha, después de dejar el correo. Es una página limpia, sin menú ni
 * pie, con los datos del curso, el temario, lo que se aprende, los
 * requisitos y el contacto. No se indexa.
 */

interface Props {
  params: Promise<{ slug: string }>;
}

function lista(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && x.trim() !== "");
  if (typeof v === "string" && v.trim()) return v.split(/\n+/).map((x) => x.trim()).filter(Boolean);
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const curso = await getCourseBySlug(slug);
    return { title: `Temario de ${curso.name}`, robots: { index: false, follow: false } };
  } catch {
    return { title: "Temario", robots: { index: false, follow: false } };
  }
}

export default async function TemarioPage({ params }: Props) {
  const { slug } = await params;
  let curso;
  try {
    curso = await getCourseBySlug(slug);
  } catch {
    notFound();
  }
  const x = extraDe(curso.slug);
  const formato = x ? FORMATOS[x.formato] : null;
  const tecnica = x ? TECNICAS.find((t) => t.clave === x.tecnica) : null;
  const temario = x?.temario?.length ? x.temario : lista(curso.syllabus);
  const aprenderas = x?.aprenderas?.length ? x.aprenderas : lista(curso.specific_objectives);
  const requisitos = lista(curso.requirements);
  const norma = curso.reference_norm ? `ISO ${curso.reference_norm.replace(/^ISO\s*/i, "")}` : "";
  const datos = [
    ["Formato", formato?.nombre ?? curso.category?.name ?? ""],
    ["Técnica", tecnica?.nombre ?? ""],
    ["Norma", norma],
    ["Categoría", x?.nivel ?? ""],
    ["Modalidad", x?.modalidad || curso.modality || ""],
    ["Duración", x?.duracion || (curso.duration ? `${curso.duration} horas` : "")],
  ].filter((d) => d[1]);

  return (
    <main className="temario mx-auto max-w-3xl bg-white px-8 py-10 text-primary print:max-w-none print:px-0 print:py-0">
      {/* Al imprimir, solo la hoja: el menú, el pie y el botón de WhatsApp del layout se ocultan */}
      <style>{`@media print { body * { visibility: hidden; } main.temario, main.temario * { visibility: visible; } main.temario { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link href={`/cursos/${curso.slug}`} className="text-sm font-bold text-tertiary hover:text-primary">
          ← Volver a la ficha del curso
        </Link>
        <BotonImprimir />
      </div>

      <header className="border-b-4 border-secondary pb-5">
        <div className="flex items-center justify-between gap-6">
          <Image src="/images/logo-diapsa.webp" alt="Grupo DIAPSA" width={160} height={48} className="h-10 w-auto" />
          <p className="text-right text-xs text-tertiary">
            {SITE_CONFIG.contact.email}
            <br />
            {SITE_CONFIG.contact.phone}
          </p>
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-tertiary">Temario</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight">{curso.name}</h1>
        {curso.objective && <p className="mt-3 text-justify text-base leading-relaxed text-tertiary">{curso.objective}</p>}
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {datos.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] font-bold uppercase tracking-widest text-tertiary">{k}</dt>
            <dd className="font-bold">{v}</dd>
          </div>
        ))}
      </dl>

      {curso.description && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold">De qué se trata</h2>
          <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">{curso.description}</p>
        </section>
      )}

      {temario.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold">Contenido</h2>
          <ol className="mt-3 space-y-2">
            {temario.map((t, i) => (
              <li key={`${i}-${t}`} className="flex gap-3 text-sm leading-relaxed">
                <span className="w-6 shrink-0 font-mono font-bold text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {aprenderas.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold">Qué vas a aprender</h2>
          <ul className="mt-3 space-y-1.5">
            {aprenderas.map((a) => (
              <li key={a} className="flex gap-2 text-sm leading-relaxed">
                <span className="text-secondary">✓</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {curso.methodology && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold">Cómo se imparte</h2>
          <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">{curso.methodology}</p>
        </section>
      )}

      {(requisitos.length > 0 || curso.certification) && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold">Requisitos y certificación</h2>
          {requisitos.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {requisitos.map((r) => (
                <li key={r} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-secondary">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}
          {curso.certification && <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">{curso.certification}</p>}
        </section>
      )}

      <footer className="mt-10 border-t border-gray-200 pt-4 text-xs leading-relaxed text-tertiary">
        Grupo DIAPSA · {SITE_CONFIG.contact.email} · {SITE_CONFIG.contact.phone} · {SITE_CONFIG.baseUrl}/cursos/{curso.slug}
        <br />
        Fechas, costo e inscripción: escríbenos o pide el curso para tu equipo en tu planta.
      </footer>
    </main>
  );
}
