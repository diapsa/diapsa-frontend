import Link from "next/link";
import IconoMenu from "@/components/atoms/IconoMenu";
import menu from "@/data/servicios.json";

/**
 * InicioPuertas
 * La segunda pantalla de la portada: el problema en corto y las tres formas
 * en que DIAPSA lo resuelve (plan-home-2026-09.md, fase 2).
 *
 * Arriba, los dos dolores que el visitante reconoce (no tengo predictivo, o
 * lo tengo pero no me da el tiempo), cada uno con su salida. Abajo, las tres
 * puertas: medimos por ti (monitoreo de condición), vigilamos las 24 horas
 * (monitoreo continuo) y formamos a tu gente (cursos). Los nombres, las
 * descripciones y los íconos salen del menú, para que la portada y el
 * desplegable hablen igual.
 */

const [condicion, continuo] = menu;

const DOLORES = [
  {
    etiqueta: "Todavía no tengo predictivo",
    texto: "Los paros llegan sin aviso, se cambian piezas por calendario y nadie sabe con certeza cómo están los equipos.",
    salida: "Arrancamos el programa contigo, desde el inventario y la primera ruta.",
    href: "/servicios/diapsa-start",
    boton: "Empezar desde cero",
  },
  {
    etiqueta: "Ya tengo, pero no me da el tiempo",
    texto: "Cientos de activos, poca gente, pendientes que se acumulan y sistemas llenos de datos que nadie vuelve decisiones.",
    salida: "Ponemos la capacidad: medimos, analizamos y te entregamos solo lo que hay que decidir.",
    href: "/servicios/monitoreo-condicion",
    boton: "Ver cómo trabajamos",
  },
];

const CURSOS = [
  { label: "Vibraciones mecánicas", descripcion: "Formación, taller y certificación ISO 18436-2", icono: "vibraciones" },
  { label: "Termografía infrarroja", descripcion: "Formación, taller y certificación ISO 18436-7", icono: "termografia" },
  { label: "Ultrasonido pasivo", descripcion: "Formación, taller y certificación", icono: "ultrasonido" },
  { label: "Diplomado en Confiabilidad", descripcion: "Programa insignia de 60 horas en vivo", icono: "certificado" },
];

function Flecha() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function Puerta({
  numero,
  antetitulo,
  titulo,
  texto,
  href,
  boton,
  children,
}: {
  numero: string;
  antetitulo: string;
  titulo: string;
  texto: string;
  href: string;
  boton: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-sm border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-3xl font-extrabold leading-none text-secondary">{numero}</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-tertiary">{antetitulo}</span>
      </div>
      <h3 className="text-xl font-extrabold text-primary lg:text-2xl">{titulo}</h3>
      <p className="mb-5 mt-2 text-justify text-sm leading-relaxed text-tertiary">{texto}</p>
      <div className="flex-1">{children}</div>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 self-start rounded-xs bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary hover:text-primary"
      >
        {boton} <Flecha />
      </Link>
    </div>
  );
}

export default function InicioPuertas() {
  return (
    <>
      {/* El problema, en corto */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Lo que duele</span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              ¿DÓNDE ESTÁ <span className="text-secondary">TU PLANTA?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {DOLORES.map((d) => (
              <div key={d.etiqueta} className="flex flex-col rounded-sm border-l-4 border-secondary bg-gray-50 p-6 sm:p-7">
                <h3 className="text-lg font-extrabold text-primary">{d.etiqueta}</h3>
                <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">{d.texto}</p>
                <p className="mt-3 text-justify text-sm font-semibold leading-relaxed text-primary">{d.salida}</p>
                <Link
                  href={d.href}
                  className="mt-5 inline-flex items-center gap-2 self-start text-sm font-bold text-secondary transition-colors hover:text-primary"
                >
                  {d.boton} <Flecha />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Las tres puertas */}
      <section className="w-full bg-gray-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">Lo que hacemos</span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary lg:text-4xl">
              TRES FORMAS DE <span className="text-secondary">RESOLVERLO</span>
            </h2>
            <p className="text-justify text-lg text-tertiary sm:text-center">
              Medimos por ti, vigilamos tus equipos las 24 horas o formamos a tu gente para que lo haga. Muchas plantas combinan las tres.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Puerta
              numero="01"
              antetitulo="Medimos por ti"
              titulo={condicion.label}
              texto="Rutas periódicas con nuestros analistas y nueve técnicas, con tus equipos en operación."
              href={condicion.href}
              boton="Ver los nueve servicios"
            >
              <ul className="grid grid-cols-3 gap-2">
                {(condicion.children ?? []).map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      title={s.descripcion}
                      className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-md bg-primary px-1.5 text-center transition-colors hover:bg-primary/90"
                    >
                      <IconoMenu icono={s.icono} oscuro className="h-9 w-9 group-hover:text-secondary" />
                      <span className="text-[10px] font-bold uppercase leading-tight text-white transition-colors group-hover:text-secondary sm:text-[11px]">
                        {s.label.replace(/^Análisis de /, "").replace(/^Estudios de /, "")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Puerta>

            <Puerta
              numero="02"
              antetitulo="Vigilamos las 24 horas"
              titulo={continuo.label}
              texto="Sensores y cámaras fijas en tus equipos críticos, para cuando la falla no da tiempo de esperar la siguiente ruta."
              href={continuo.href}
              boton="Ver monitoreo continuo"
            >
              <ul className="flex flex-col gap-2">
                {(continuo.children ?? []).map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="group flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                      <IconoMenu icono={s.icono} className="h-10 w-10" />
                      <span className="min-w-0">
                        <span className="block font-bold leading-snug text-primary group-hover:text-secondary">{s.label}</span>
                        <span className="block text-xs leading-snug text-tertiary">{s.descripcion}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Puerta>

            <Puerta
              numero="03"
              antetitulo="Formamos a tu gente"
              titulo="Cursos y certificaciones"
              texto="Instructores que trabajan en campo y certificaciones con respaldo de ITZAM, para que tu equipo mida y analice por su cuenta."
              href="/cursos"
              boton="Ver los cursos"
            >
              <ul className="flex flex-col gap-2">
                {CURSOS.map((c) => (
                  <li key={c.label} className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
                    <IconoMenu icono={c.icono} className="h-10 w-10" />
                    <span className="min-w-0">
                      <span className="block font-bold leading-snug text-primary">{c.label}</span>
                      <span className="block text-xs leading-snug text-tertiary">{c.descripcion}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Puerta>
          </div>
        </div>
      </section>
    </>
  );
}
