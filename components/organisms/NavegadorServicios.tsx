import Link from "next/link";
import IconoMenu from "@/components/atoms/IconoMenu";
import servicios from "@/data/servicios.json";
import menuCursos from "@/data/menu-cursos.json";

/**
 * NavegadorServicios
 * Todos los servicios de DIAPSA a la vista en la portada, para que quien ya
 * sabe qué busca llegue en un clic.
 *
 * Cinco grupos con el mismo mosaico de fichas del menú desplegable, así la
 * portada y el menú se ven iguales: maquinaria rotativa, sistemas
 * eléctricos, sensores en línea, gas y más servicios, y cursos. Nombres,
 * descripciones e íconos salen de los mismos archivos que el menú.
 */

type Ficha = { label: string; href: string; descripcion?: string; icono?: string };

const [condicion, continuo, ...sueltos] = servicios;
const porSlug = (slug: string) => (condicion.children ?? []).find((s) => s.href.endsWith(`/${slug}`)) as Ficha;
const corto = (label: string) => label.replace(/^Análisis de /, "").replace(/^Estudios de /, "");

const GRUPOS: { titulo: string; texto: string; href: string; fichas: Ficha[] }[] = [
  {
    titulo: "Maquinaria rotativa",
    texto: "Motores, bombas, ventiladores, compresores y transmisiones.",
    href: condicion.href,
    fichas: ["vibraciones-mecanicas", "alineacion-balanceo", "analisis-de-ultrasonido", "analisis-de-aceite", "diagnostico-de-maquinaria"].map(porSlug),
  },
  {
    titulo: "Sistemas eléctricos",
    texto: "Tableros, transformadores, subestaciones y la energía que los alimenta.",
    href: condicion.href,
    fichas: ["termografia-infrarroja", "calidad-de-energia", "tierras-fisicas", "arco-electrico"].map(porSlug),
  },
  {
    titulo: "Sensores en línea",
    texto: "Vigilancia permanente de los equipos que no pueden esperar la siguiente ruta.",
    href: continuo.href,
    fichas: (continuo.children ?? []) as Ficha[],
  },
  {
    titulo: "Gas y más servicios",
    texto: "Fugas de gas, arranque desde cero, la plataforma y el diagnóstico de toda la planta.",
    href: "/servicios",
    fichas: sueltos as Ficha[],
  },
  {
    titulo: "Cursos",
    texto: "Formación, talleres y certificaciones por técnica, y el diplomado en confiabilidad.",
    href: "/cursos",
    fichas: [
      { label: "Vibraciones", href: "/cursos#catalogo", descripcion: "Formación, taller y certificación ISO 18436-2", icono: "vibraciones" },
      { label: "Termografía", href: "/cursos#catalogo", descripcion: "Formación, taller y certificación ISO 18436-7", icono: "termografia" },
      { label: "Ultrasonido", href: "/cursos#catalogo", descripcion: "Formación, taller y certificación", icono: "ultrasonido" },
      { label: "Diplomado en Confiabilidad", href: "/cursos/diplomado-confiabilidad-operativa", descripcion: "Programa insignia de 60 horas en vivo", icono: "certificado" },
      ...(menuCursos[3]?.items ?? []).filter((c) => !c.href.includes("diplomado")).slice(0, 2).map((c) => ({ ...c, label: c.label })),
    ],
  },
];

export default function NavegadorServicios() {
  return (
    <section id="servicios" className="w-full bg-gray-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Lo que hacemos</span>
          <h2 className="mb-4 text-3xl font-extrabold text-primary lg:text-4xl">
            ELIGE POR DONDE <span className="text-secondary">QUIERES EMPEZAR</span>
          </h2>
          <p className="text-justify text-lg text-tertiary sm:text-center">
            Todos nuestros servicios, agrupados por el tipo de equipo o de necesidad. Cada ficha lleva a su página.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {GRUPOS.map((g) => (
            <div key={g.titulo}>
              <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="text-xl font-extrabold text-primary">{g.titulo}</h3>
                <p className="text-sm text-tertiary">{g.texto}</p>
                <Link href={g.href} className="ml-auto text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary">
                  Ver todo →
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {g.fichas.map((f) => (
                  <li key={f.href + f.label}>
                    <Link
                      href={f.href}
                      title={f.descripcion}
                      className="group flex h-full min-h-[7.5rem] flex-col items-center justify-center gap-3 rounded-lg bg-primary px-3 py-4 text-center transition-colors duration-200 hover:bg-[#0a3d5c]"
                    >
                      <IconoMenu icono={f.icono} oscuro className="h-11 w-11 group-hover:text-secondary" />
                      <span className="text-[11px] font-bold uppercase leading-snug tracking-wide text-white transition-colors group-hover:text-secondary">
                        {corto(f.label)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
