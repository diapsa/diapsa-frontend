import Image from "next/image";
import Link from "next/link";
import Antetitulo from "../atoms/Antetitulo";
import type { Course, CourseDetail } from "@/types/course";
import { FORMATOS, TECNICAS, extraDe, fechaGrupo, galeriaDe, imagenDe, proximosGrupos } from "@/lib/cursos";
import GaleriaCampo from "./GaleriaCampo";
import GuiasRelacionadas from "./GuiasRelacionadas";
import VideoBucle from "../atoms/VideoBucle";
import { SITE_CONFIG } from "@/lib/constants";
import { getArticulosPorServicio } from "@/lib/recursos";

/**
 * Por técnica, el video de Remotion de la página de servicio que muestra la
 * técnica en campo, y el servicio del que se toman las guías del blog
 * (Emiliano, 2026-10-04: las fichas eran solo texto y fotos). Dos cursos
 * tienen su propio par por su tema.
 */
const MEDIOS: Record<string, { video: string; titulo: string; texto: string; descripcion: string; servicio: string }> = {
  vibraciones: {
    video: "/videos/vibraciones/vib-proceso",
    titulo: "Así se analiza la vibración de un equipo",
    texto: "Lo que vas a aprender a hacer: medir en los puntos correctos, leer el espectro y decir qué falla hay y qué tan grave es. Este es el mismo proceso que aplican nuestros analistas en planta.",
    descripcion: "Un analista mide un motor y una bomba, el espectro muestra la falla y el informe la califica por severidad",
    servicio: "/servicios/monitoreo-condicion/vibraciones-mecanicas",
  },
  termografia: {
    video: "/videos/termografia/term-proceso",
    titulo: "Así se hace una inspección termográfica",
    texto: "Lo que vas a aprender a hacer: recorrer tableros y motores con la cámara, encontrar el punto caliente, calificarlo con la tabla NETA y dejarlo en un informe que el equipo de planta pueda atender.",
    descripcion: "Un analista recorre tableros con la cámara termográfica, encuentra un punto caliente y lo califica",
    servicio: "/servicios/monitoreo-condicion/termografia-infrarroja",
  },
  ultrasonido: {
    video: "/videos/ultrasonido/us-proceso",
    titulo: "Así se trabaja con ultrasonido en planta",
    texto: "Lo que vas a aprender a hacer: escuchar lo que el oído no alcanza, ubicar fugas, descargas eléctricas y rodamientos sin lubricación, y estimar cuánto cuesta cada hallazgo.",
    descripcion: "Un analista recorre la planta con el detector de ultrasonido y ubica una fuga de aire, una descarga y un rodamiento seco",
    servicio: "/servicios/monitoreo-condicion/analisis-de-ultrasonido",
  },
  confiabilidad: {
    video: "/videos/diagnostico-situacional/diag-proceso",
    titulo: "Así se arma un programa de confiabilidad",
    texto: "Lo que vas a aprender a hacer: calificar la criticidad de cada equipo, decidir qué técnica aplicar y cada cuánto, y convertir los hallazgos en decisiones de mantenimiento con datos.",
    descripcion: "Las cuatro etapas de un diagnóstico situacional: levantamiento, criticidad, medición base y hoja de ruta",
    servicio: "/servicios/diagnostico-situacional",
  },
};
const MEDIOS_POR_CURSO: Record<string, string> = {
  "alineamiento-balanceo-proactivo": "alineacion",
  "cursos-de-aprendizaje-practico-vibraciones-ultrasonido-termografia": "vibraciones",
};
MEDIOS.alineacion = {
  video: "/videos/alineacion-balanceo/ali-proceso",
  titulo: "Así se alinea y balancea un equipo en sitio",
  texto: "Lo que vas a aprender a hacer: medir la desalineación con equipo láser, corregirla dentro de tolerancia y balancear el rotor sin desmontarlo, con la máquina en su base.",
  descripcion: "Un analista alinea un motor y una bomba con equipo láser y balancea el rotor en sitio",
  servicio: "/servicios/monitoreo-condicion/alineacion-balanceo",
};
const GUIA_ISO_18436 = "certificacion-iso-18436-2-categorias-de-analista-de-vibraciones";

/**
 * CursoDetalle
 * La página de un curso, pensada para inscribirse: arriba los datos que se
 * comparan (formato, norma, categoría, modalidad, duración), al lado los
 * próximos grupos y la inscripción siempre a la vista, y el contenido del
 * CMS completo en lugar de repartido en pestañas: de qué se trata, qué vas a
 * lograr, temario, cómo se imparte, requisitos y certificación. Cierra con
 * los otros cursos de la misma técnica.
 *
 * Las fechas y la duración vienen de data/cursos-extra.json, porque el CMS
 * no las trae. Si no hay grupo programado, se invita a pedir la fecha.
 */

type Props = { curso: CourseDetail; relacionados: Course[] };

function lista(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && x.trim() !== "");
  if (typeof v === "string" && v.trim()) return v.split(/\n+/).map((x) => x.trim()).filter(Boolean);
  return [];
}

function Bloque({ etiqueta, titulo, children }: { etiqueta: string; titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border-l-4 border-secondary bg-white p-6 shadow-sm ring-1 ring-black/5 lg:p-8">
      <Antetitulo>{etiqueta}</Antetitulo>
      {/* Palabras largas del CMS, como "desbalanceo/desalineación", se parten en teléfono */}
      <h2 className="mt-2 text-2xl font-extrabold leading-snug text-primary [overflow-wrap:anywhere] lg:text-3xl">{titulo}</h2>
      <div className="mt-4 [overflow-wrap:anywhere]">{children}</div>
    </section>
  );
}

function Palomita() {
  return (
    <svg className="mt-1 h-4 w-4 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function CursoDetalle({ curso, relacionados }: Props) {
  const x = extraDe(curso.slug);
  const formato = x ? FORMATOS[x.formato] : null;
  const tecnica = x ? TECNICAS.find((t) => t.clave === x.tecnica) : null;
  const grupos = proximosGrupos(curso.slug);
  const norma = curso.reference_norm ? `ISO ${curso.reference_norm.replace(/^ISO\s*/i, "")}` : "";
  const duracion = x?.duracion || (curso.duration ? `${curso.duration} horas` : "");
  const modalidad = x?.modalidad || curso.modality || "";

  const datos = [
    { k: "Formato", v: formato?.nombre ?? curso.category?.name ?? "" },
    { k: "Norma", v: norma },
    { k: "Categoría", v: x?.nivel ?? "" },
    { k: "Modalidad", v: modalidad },
    { k: "Duración", v: duracion },
    { k: "Imparte", v: curso.provider },
  ].filter((d) => d.v);

  // Lo que se aprende y lo que se podrá hacer: del complemento; si no, los objetivos del CMS
  const aprenderas = x?.aprenderas?.length ? x.aprenderas : lista(curso.specific_objectives);
  const podras = x?.podras ?? [];
  const temario = x?.temario?.length ? x.temario : lista(curso.syllabus);
  const imagen = imagenDe(curso.slug, curso.url_img, curso.alt_img);
  const requisitos = lista(curso.requirements);
  const whatsapp = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Hola, quiero información del curso ${curso.name}.`)}`;

  // El video de la técnica y tres guías del blog; en la certificación de
  // vibraciones, la guía de las categorías ISO 18436 va primero
  const medio = MEDIOS[MEDIOS_POR_CURSO[curso.slug] ?? x?.tecnica ?? ""] ?? null;
  const guias = (() => {
    if (!medio) return [];
    let lista = getArticulosPorServicio(medio.servicio);
    if (x?.formato === "certificacion" && x.tecnica === "vibraciones") {
      const iso = getArticulosPorServicio("/servicios/diapsa-start").find((a) => a.slug === GUIA_ISO_18436);
      if (iso) lista = [iso, ...lista.filter((a) => a.slug !== iso.slug)];
    }
    return lista.slice(0, 3);
  })();

  return (
    <>
      {/* Los datos que se comparan, en una franja */}
      <section className="w-full border-b border-gray-200 bg-white">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-4 px-6 py-6 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-12">
          {datos.map((d) => (
            <div key={d.k}>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-tertiary">{d.k}</dt>
              <dd className="mt-0.5 font-extrabold text-primary">{d.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Al inicio: fotos reales de cursos de la misma técnica */}
      {galeriaDe(curso.slug).length > 0 && (
        <GaleriaCampo
          fotos={galeriaDe(curso.slug)}
          titulo="Así son nuestros cursos"
          texto="Fotos reales de grupos de DIAPSA, en aula y en planta."
          intervalo={3500}
          sinPie
        />
      )}

      <section className="w-full bg-gray-100 py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          {/* Contenido */}
          <div className="min-w-0 space-y-6">
            <Bloque etiqueta="De qué se trata" titulo={curso.objective || "Objetivo del curso"}>
              <p className="text-justify text-lg leading-relaxed text-tertiary">{curso.description}</p>
              {formato && <p className="mt-3 text-justify text-base leading-relaxed text-primary"><span className="font-bold">{formato.nombre}:</span> {formato.texto}</p>}
            </Bloque>

            {aprenderas.length > 0 && (
              <Bloque etiqueta="Qué vas a aprender" titulo="En el curso">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {aprenderas.map((o) => (
                    <li key={o} className="flex gap-3 rounded-sm bg-gray-50 p-3 text-base leading-snug text-primary ring-1 ring-black/5"><Palomita />{o}</li>
                  ))}
                </ul>
              </Bloque>
            )}

            {medio && (
              <Bloque etiqueta="Así se ve en campo" titulo={medio.titulo}>
                <div className="overflow-hidden rounded-xl bg-gray-50 p-2 ring-1 ring-black/5">
                  <VideoBucle className="block aspect-[16/10] w-full rounded-lg object-cover" src={`${medio.video}.mp4`} poster={`${medio.video}.jpg`} descripcion={medio.descripcion} />
                </div>
                <p className="mt-4 text-justify text-base leading-relaxed text-tertiary">{medio.texto}</p>
              </Bloque>
            )}

            {(podras.length > 0 || curso.graduate_profile) && (
              <section className="rounded-sm bg-primary p-6 text-white shadow-lg lg:p-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Qué podrás hacer después</p>
                <h2 className="mt-2 text-2xl font-extrabold leading-snug lg:text-3xl">Al terminar el curso</h2>
                {podras.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {podras.map((o) => (
                      <li key={o} className="flex gap-3 text-base leading-relaxed text-white/90 lg:text-lg">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-extrabold text-primary" aria-hidden="true">✓</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                )}
                {curso.graduate_profile && (
                  <p className="mt-6 border-t border-white/15 pt-4 text-justify text-sm leading-relaxed text-white/75 lg:text-base">
                    <span className="font-bold text-white">Perfil de egreso:</span> {curso.graduate_profile}
                  </p>
                )}
              </section>
            )}

            {temario.length > 0 && (
              <Bloque etiqueta="Temario" titulo="Lo que se ve en el curso">
                <ol className="divide-y divide-gray-100 overflow-hidden rounded-sm bg-gray-50 ring-1 ring-black/5">
                  {temario.map((tm, i) => (
                    <li key={`${i}-${tm}`} className="flex gap-4 px-4 py-3">
                      <span className="w-6 shrink-0 font-mono text-sm font-bold text-secondary">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-base leading-relaxed text-primary">{tm}</span>
                    </li>
                  ))}
                </ol>
              </Bloque>
            )}

            {curso.methodology && (
              <Bloque etiqueta="Cómo se imparte" titulo="Metodología">
                <p className="text-justify text-base leading-relaxed text-tertiary">{curso.methodology}</p>
              </Bloque>
            )}

            {(requisitos.length > 0 || curso.certification) && (
              <Bloque etiqueta="Antes de inscribirte" titulo="Requisitos y certificación">
                {requisitos.length > 0 && (
                  <ul className="space-y-2">
                    {requisitos.map((r) => <li key={r} className="flex gap-3 text-base leading-relaxed text-primary"><Palomita />{r}</li>)}
                  </ul>
                )}
                {curso.certification && <p className="mt-4 text-justify text-base leading-relaxed text-tertiary"><span className="font-bold text-primary">Certificación:</span> {curso.certification}</p>}
              </Bloque>
            )}
          </div>

          {/* Inscripción, siempre a la vista */}
          <aside id="grupos" className="order-first lg:order-none lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-sm bg-white shadow-xl ring-1 ring-black/10">
              {imagen && (
                <div className="relative hidden aspect-[16/10] lg:block">
                  <Image src={imagen.src} alt={imagen.alt || curso.name} fill sizes="22rem" className="object-cover" />
                </div>
              )}
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Próximos grupos</p>
                {grupos.length > 0 ? (
                  <ul className="mt-3 space-y-3">
                    {grupos.map((g) => (
                      <li key={g.inicio} className="rounded-sm bg-gray-50 px-3 py-2.5 ring-1 ring-black/5">
                        <p className="font-extrabold text-primary">{fechaGrupo(g)}</p>
                        <p className="mt-0.5 text-sm text-tertiary">{[g.horario, g.modalidad, g.sede, g.duracion].filter(Boolean).join(" · ")}</p>
                        {(g.cupo || g.precio) && <p className="mt-1 text-xs font-bold text-primary">{[g.cupo, g.precio].filter(Boolean).join(" · ")}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">Aún no hay fecha publicada para el siguiente grupo. Déjanos tus datos y te avisamos cuando abra, o lo armamos para tu equipo en tu planta.</p>
                )}
                <div className="mt-5 flex flex-col gap-2">
                  <a href="#contacto" className="inline-flex items-center justify-center rounded-xs bg-secondary px-5 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                    {grupos.length > 0 ? "Quiero inscribirme" : "Quiero información"}
                  </a>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xs border-2 border-primary px-5 py-2.5 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                    Preguntar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Guías del blog de la misma técnica, para leer antes del curso */}
      {guias.length > 0 && <GuiasRelacionadas articulos={guias} />}

      {/* La misma técnica, en sus otros formatos */}
      {relacionados.length > 0 && (
        <section className="w-full bg-primary py-12 text-white lg:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">{tecnica ? tecnica.nombre : "Más cursos"}</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-snug lg:text-3xl">Sigue con la misma técnica</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((r) => {
                const rx = extraDe(r.slug);
                return (
                  <Link key={r.slug} href={`/cursos/${r.slug}`} className="group rounded-sm border-t-4 border-secondary bg-white p-5 shadow-lg transition-transform hover:-translate-y-1">
                    {rx && <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">{FORMATOS[rx.formato].nombre}</p>}
                    <p className="mt-1 font-extrabold leading-snug text-primary">{r.name}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tertiary">{r.description}</p>
                    <span className="mt-3 inline-block text-sm font-bold text-secondary group-hover:underline">Ver curso →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
