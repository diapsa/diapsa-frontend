import Link from "next/link";
import Antetitulo from "../atoms/Antetitulo";
import type { Course } from "@/types/course";
import { FORMATOS, TECNICAS, diaMes, extraDe, fechaGrupo, galeriaDe, imagenDe, muestraFotos, proximosGrupos, type FormatoCurso } from "@/lib/cursos";
import CatalogoFiltros, { type TarjetaCurso } from "./CatalogoFiltros";
import BienvenidaCursos, { type Anuncio } from "./BienvenidaCursos";
import EscenaCursos from "./EscenaCursos";
import GaleriaCampo from "./GaleriaCampo";
import InicioDiplomado from "@/components/organisms/InicioDiplomado";
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


/* Nombre corto y una línea, los mismos del menú: dentro del renglón de la
   técnica, "Formación técnica" dice más que "Curso Técnico Especializado:
   Vibraciones Mecánicas" cortado a la mitad. */
const CORTOS = new Map(
  (menuCursos as { items: { label: string; href: string; descripcion: string }[] }[])
    .flatMap((c) => c.items)
    .map((i) => [i.href.replace("/cursos/", ""), i] as const)
);


/* Si el CMS no responde, el catálogo se arma con los cursos del menú, que
   viven en el sitio: nombre, una línea y su enlace. Así la página nunca
   queda vacía. */
function respaldo(): Course[] {
  return (menuCursos as { titulo: string; items: { label: string; href: string; descripcion: string }[] }[]).flatMap((col) =>
    col.items.filter((i) => !i.href.includes(dip.slug)).map((i) => {
      const slug = i.href.replace("/cursos/", "");
      const generico = /^(Formación técnica|Taller práctico|Certificación)/.test(i.label);
      const name = generico ? `${i.label} en ${col.titulo.toLowerCase()}` : i.label;
      return { id: slug, slug, name, description: i.descripcion, url_img: "", alt_img: "", reference_norm: "" } as unknown as Course;
    })
  );
}

export default function CatalogoCursos({ cursos: delCms }: { cursos: Course[] }) {
  const cursos = delCms.length ? delCms : respaldo();
  const porSlug = new Map(cursos.map((c) => [c.slug, c]));
  const grupos = proximosGrupos().filter((g) => porSlug.has(g.curso));
  // Dentro de cada bloque, en el orden de las técnicas
  const orden = TECNICAS.map((t) => t.clave);

  // Las tarjetas del catálogo: el diplomado primero y después cada curso,
  // ordenados por técnica y por tipo.
  const nombreTecnica = (clave?: string) => TECNICAS.find((t) => t.clave === clave)?.nombre ?? "Más cursos";
  const ordenTipo: string[] = ["diplomado", "formacion", "practica", "certificacion", "especialidad", "gestion"];
  const grupoDip = proximosGrupos(dip.slug)[0];
  // Si el curso no trae foto propia del CMS, toma una distinta de la
  // galería de su técnica para que las tarjetas de una técnica no se repitan.
  const vistos = new Map<string, number>();
  const fotoDe = (c: Course) => {
    const x = extraDe(c.slug);
    const delCms = imagenDe(c.slug, c.url_img, c.alt_img || c.name);
    if (c.url_img && !x?.ocultarImagenCms) return delCms ?? undefined;
    const lista = galeriaDe(c.slug);
    const n = vistos.get(x?.tecnica ?? "") ?? 0;
    vistos.set(x?.tecnica ?? "", n + 1);
    return lista.length ? lista[(n * 3) % lista.length] : delCms ?? undefined;
  };
  const tarjetas: TarjetaCurso[] = [
    {
      slug: dip.slug,
      href: `/cursos/${dip.slug}`,
      titulo: dip.nombre,
      descripcion: dip.resumen,
      tipo: "Diplomado",
      tipoClave: "diplomado",
      tecnica: nombreTecnica("confiabilidad"),
      tecnicaClave: "confiabilidad",
      foto: { src: "/images/cursos/confiabilidad/confiabilidad-03.webp", alt: "Sesión del diplomado en confiabilidad operativa" },
      fecha: grupoDip ? fechaGrupo(grupoDip) : null,
      diplomado: true,
    },
    ...cursos
      .filter((c) => c.slug !== dip.slug)
      .map((c): TarjetaCurso => {
        const x = extraDe(c.slug);
        const g = proximosGrupos(c.slug)[0];
        const tipoClave = x?.formato ?? "otros";
        return {
          slug: c.slug,
          href: `/cursos/${c.slug}`,
          titulo: c.name,
          descripcion: c.description || CORTOS.get(c.slug)?.descripcion || "",
          tipo: x ? FORMATOS[x.formato as FormatoCurso]?.nombre ?? "Curso" : "Curso",
          tipoClave,
          tecnica: nombreTecnica(x?.tecnica),
          tecnicaClave: x?.tecnica ?? "otros",
          foto: fotoDe(c),
          fecha: g ? fechaGrupo(g) : null,
        };
      })
      .sort((a, b) => orden.indexOf(a.tecnicaClave) - orden.indexOf(b.tecnicaClave) || ordenTipo.indexOf(a.tipoClave) - ordenTipo.indexOf(b.tipoClave)),
  ];
  const contar = (campo: "tecnicaClave" | "tipoClave", clave: string) => tarjetas.filter((x) => x[campo] === clave).length;
  const filtrosTecnica = TECNICAS.map((x) => ({ clave: x.clave, nombre: x.nombre, n: contar("tecnicaClave", x.clave) })).filter((x) => x.n > 0);
  const filtrosTipo = [
    { clave: "diplomado", nombre: "Diplomado" },
    ...(Object.entries(FORMATOS) as [string, { nombre: string }][]).map(([clave, f]) => ({ clave, nombre: f.nombre })),
  ]
    .map((x) => ({ ...x, n: contar("tipoClave", x.clave) }))
    .filter((x) => x.n > 0)
    .sort((a, b) => ordenTipo.indexOf(a.clave) - ordenTipo.indexOf(b.clave));
  const textoTipo: Record<string, string> = {
    diplomado: "El programa insignia: 60 horas en vivo con especialistas de varios países, en cinco fases.",
    ...Object.fromEntries((Object.entries(FORMATOS) as [string, { texto: string }][]).map(([k, f]) => [k, f.texto])),
  };

  // El anuncio de la ventana de bienvenida: el grupo con fecha más próximo;
  // si no hay ninguno, el diplomado.
  const proximo = grupos[0];
  const cursoProximo = proximo ? porSlug.get(proximo.curso) : undefined;
  const anuncio: Anuncio = proximo && cursoProximo
    ? {
        etiqueta: "Próximo curso",
        titulo: cursoProximo.name,
        detalle: [fechaGrupo(proximo), proximo.modalidad, proximo.sede, proximo.duracion].filter(Boolean).join(". ") + ".",
        fecha: diaMes(proximo),
        href: `/cursos/${proximo.curso}`,
        foto: imagenDe(proximo.curso, cursoProximo.url_img, cursoProximo.name) ?? undefined,
      }
    : {
        etiqueta: "Programa insignia",
        titulo: dip.corto,
        detalle: dip.resumen,
        fecha: grupoDip ? diaMes(grupoDip) : null,
        href: `/cursos/${dip.slug}`,
        foto: { src: "/images/cursos/confiabilidad/confiabilidad-03.webp", alt: "" },
        diplomado: true,
      };

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
              <a href="#catalogo" className="inline-flex items-center justify-center rounded-xs bg-primary px-7 py-3.5 font-bold text-white transition-colors hover:bg-secondary hover:text-primary">
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

      {/* Fotos reales de los cursos, de todas las técnicas */}
      <GaleriaCampo
        fotos={muestraFotos(24)}
        titulo="Así son nuestros cursos"
        texto="Fotos reales de grupos de DIAPSA, en aula y en planta."
        intervalo={3000}
        sinPie
      />

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

      {/* El programa insignia, antes que todo el catálogo, con la identidad de su brochure */}
      <InicioDiplomado />

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

      {/* El catálogo con filtros, al estilo NeoPetrol: técnica y tipo a la
          izquierda, tarjetas a la derecha */}
      <section id="catalogo" className="w-full scroll-mt-28 bg-gray-100 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Antetitulo>El catálogo</Antetitulo>
          <h2 className="mb-8 mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">Encuentra el curso indicado para tu equipo</h2>
          <CatalogoFiltros tarjetas={tarjetas} tecnicas={filtrosTecnica} tipos={filtrosTipo} textoTipo={textoTipo} />
        </div>
      </section>

      {/* Al entrar: el anuncio del curso más próximo y el formulario corto */}
      <BienvenidaCursos anuncio={anuncio} cursos={tarjetas.map((c) => c.titulo)} />
    </>
  );
}
