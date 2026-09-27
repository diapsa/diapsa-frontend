import Image from "next/image";
import Link from "next/link";
import IconoMenu from "@/components/atoms/IconoMenu";
import DoloresMonitoreo from "@/components/organisms/DoloresMonitoreo";
import GaleriaCampo from "@/components/organisms/GaleriaCampo";
import menu from "@/data/servicios.json";
import galeria from "@/data/monitoreo-condicion-galeria.json";
import dataAB from "@/data/servicios/alineacion-balanceo.json";
import dataAC from "@/data/servicios/analisis-de-aceite.json";
import dataAE from "@/data/servicios/arco-electrico.json";
import dataUl from "@/data/servicios/analisis-de-ultrasonido.json";
import dataDM from "@/data/servicios/diagnostico-de-maquinaria.json";
import dataEE from "@/data/servicios/calidad-de-energia.json";
import dataTF from "@/data/servicios/tierras-fisicas.json";
import dataTI from "@/data/servicios/termografia-infrarroja.json";
import dataVM from "@/data/servicios/vibraciones-mecanicas.json";

/**
 * PaginaMonitoreo
 * El cuerpo de /servicios/monitoreo-condicion.
 *
 * Por qué este orden: primero el problema en cuatro tarjetas cortas, para
 * que el visitante se reconozca, e inmediatamente los nueve servicios que lo
 * resuelven, separados en los dos frentes que un jefe de mantenimiento
 * reconoce: lo mecánico y lo eléctrico. Antes había que bajar tres secciones
 * (la filosofía, la analogía médica) para encontrarlos. Después vienen las
 * fotos de campo, el método y lo que se gana.
 *
 * Sin porcentajes ni cifras de plantas: no había cómo sostenerlos.
 * Nombre y descripción corta salen del menú, para que la página y el
 * desplegable digan lo mismo.
 */

const hijos = menu[0].children ?? [];
const delMenu = (slug: string) => hijos.find((h) => h.href.endsWith(`/${slug}`))!;

const FRENTES = [
  {
    titulo: "Maquinaria rotativa",
    texto: "Motores, bombas, ventiladores, compresores y transmisiones: lo que gira y detiene la línea si falla.",
    servicios: [dataVM, dataAB, dataUl, dataAC, dataDM],
  },
  {
    titulo: "Sistemas eléctricos",
    texto: "Tableros, transformadores, subestaciones y la energía que los alimenta.",
    servicios: [dataTI, dataEE, dataTF, dataAE],
  },
];


const PASOS = [
  {
    nombre: "Diagnóstico",
    texto: "Levantamos el inventario de equipos críticos, su historial de fallas y su condición actual. Así sabemos por dónde empezar.",
  },
  {
    nombre: "Diseño",
    texto: "Armamos el plan: qué técnica en cada equipo, en qué puntos y cada cuánto se mide, según qué tan crítico es.",
  },
  {
    nombre: "Detección",
    texto: "Nuestros analistas miden en tu planta con los equipos en operación. No hace falta parar la producción.",
  },
  {
    nombre: "Decisión",
    texto: "Cada hallazgo llega con su severidad y su recomendación. Lo crítico se avisa en el mismo recorrido, sin esperar el informe.",
  },
  {
    nombre: "Datos",
    texto: "Las mediciones quedan en IDAP, nuestra plataforma. Cada ruta se compara con la anterior y se ve hacia dónde va cada equipo.",
  },
];

const GANANCIAS = [
  { titulo: "Confiabilidad", texto: "Tus equipos críticos disponibles cuando la producción los necesita." },
  { titulo: "Ahorro", texto: "Menos reparaciones de emergencia y refacciones compradas cuando hacen falta, no por si acaso." },
  { titulo: "Planeación", texto: "Los paros de mantenimiento se agendan por condición real, en la ventana que tú eliges." },
  { titulo: "Línea base", texto: "Cada equipo nuevo o reparado arranca con una medición de referencia para comparar después." },
  { titulo: "Contención", texto: "Si en el recorrido encontramos algo que pone en riesgo la operación, te avisamos ahí mismo." },
  { titulo: "Respaldo", texto: "Informes con evidencia y tendencias para justificar ante gerencia cada inversión en mantenimiento." },
];

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

const SI = [
  "Tienes equipos críticos cuya falla detiene la producción.",
  "Has tenido paros no programados en el último año.",
  "Quieres gastar menos en refacciones y correctivos.",
  "Necesitas datos para justificar inversiones en tus equipos.",
];

const NO = [
  "Tienes una falla activa hoy: eso es un correctivo, aunque te podemos ayudar a encontrar la causa.",
  "Tu operación no depende de maquinaria ni de sistemas eléctricos críticos.",
];

function Flecha() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function PaginaMonitoreo() {
  return (
    <>
      {/* 1. El problema, en corto: que se reconozca antes de elegir */}
      <section className="w-full bg-gray-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              Lo que duele
            </span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              ¿TE SUENA <span className="text-secondary">FAMILIAR?</span>
            </h2>
            <p className="mt-4 text-justify text-lg text-tertiary sm:text-center">
              Depende de dónde estás. Elige lo que se parece más a tu planta.
            </p>
          </div>
          <DoloresMonitoreo />
        </div>
      </section>

      {/* 2. Servicios: lo que viene a buscar */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              Nuestros servicios
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary lg:text-4xl">
              NUEVE SERVICIOS, <span className="text-secondary">DOS FRENTES</span>
            </h2>
            <p className="text-justify text-lg text-tertiary sm:text-center">
              Medimos la condición de tus equipos con ellos en operación y te decimos qué intervenir, cuándo y por qué. Elige por el tipo de equipo que te preocupa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {FRENTES.map((f) => (
              <div key={f.titulo} className="flex flex-col rounded-sm border border-gray-100 bg-gray-50 p-5 sm:p-6">
                <h3 className="text-xl font-extrabold text-primary">{f.titulo}</h3>
                <p className="mb-5 mt-1 text-justify text-sm text-tertiary">{f.texto}</p>
                <ul className="flex flex-col gap-3">
                  {f.servicios.map((s) => {
                    const m = delMenu(s.slug);
                    return (
                      <li key={s.id}>
                        <Link
                          href={m.href}
                          className="group flex items-stretch overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-secondary/50 hover:shadow-md"
                        >
                          <div className="relative w-24 shrink-0 sm:w-28">
                            <Image
                              src={s.content.image}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="112px"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 items-center gap-3 p-4">
                            <IconoMenu icono={m.icono} className="hidden h-6 w-6 shrink-0 text-secondary sm:block" />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold leading-snug text-primary transition-colors group-hover:text-secondary">
                                {m.label}
                              </p>
                              <p className="mt-0.5 text-sm leading-snug text-tertiary">{m.descripcion}</p>
                            </div>
                            <span className="text-secondary transition-transform group-hover:translate-x-1">
                              <Flecha />
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {f.servicios.length < 5 && (
                  <Link
                    href="/contacto"
                    className="mt-3 flex flex-1 flex-col justify-center rounded-sm bg-primary p-5 text-white transition-colors hover:bg-primary/90"
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                      ¿No sabes cuál necesitas?
                    </span>
                    <span className="mt-1 text-justify text-sm text-white/80">
                      Cuéntanos qué equipo te preocupa y te decimos qué técnica aplica. Si son varias, las combinamos en una sola ruta.
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-secondary">
                      Pedir recomendación <Flecha />
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Fotos de campo: la prueba de que medimos nosotros */}
      <GaleriaCampo
        fotos={galeria}
        texto="Nuestros analistas en planta con vibraciones, termografía, ultrasonido, aceite y calidad de energía. Mediciones reales, sin fotos de banco de imágenes."
      />

      {/* 4. Cómo trabajamos: las cinco D */}
      <section className="relative w-full overflow-hidden bg-primary py-14 lg:py-20">
        <div className="pointer-events-none absolute left-1/3 top-1/4 h-150 w-150 rounded-full bg-secondary/8 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              Cómo trabajamos
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-white lg:text-4xl">
              DEL INVENTARIO <span className="text-secondary">A LA DECISIÓN</span>
            </h2>
            <p className="text-justify text-lg text-white/70 sm:text-center">
              El mismo método para cualquier técnica y cualquier planta, en cinco pasos.
            </p>
          </div>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PASOS.map((p, i) => (
              <li key={p.nombre} className="flex flex-col rounded-sm border border-white/10 bg-white/5 p-5">
                <span className="text-3xl font-extrabold text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mb-2 mt-2 text-lg font-bold text-white">{p.nombre}</h3>
                <p className="text-justify text-sm leading-relaxed text-white/70">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Lo que gana tu operación y lo que recibes */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              Resultados
            </span>
            <h2 className="text-3xl font-extrabold text-primary lg:text-4xl">
              LO QUE GANA <span className="text-secondary">TU OPERACIÓN</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {GANANCIAS.map((g) => (
              <div key={g.titulo} className="border-l-2 border-secondary pl-4">
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-primary">{g.titulo}</h3>
                <p className="text-justify text-sm leading-relaxed text-tertiary">{g.texto}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Lo que recibes: cada entregable con su imagen */}
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

      {/* 7. Para quién es */}
      <section className="w-full bg-gray-50 py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-center text-3xl font-extrabold text-primary lg:text-4xl">
            ¿ES PARA <span className="text-secondary">TU PLANTA?</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-primary">Es para ti si…</h3>
              <ul className="space-y-3">
                {SI.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-tertiary">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-justify">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-primary">No es para ti si…</h3>
              <ul className="space-y-3">
                {NO.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-tertiary">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-justify">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-sm border-l-2 border-secondary bg-secondary/10 p-4 text-justify text-sm text-primary">
                <strong>¿No estás seguro?</strong> Con una llamada corta sobre tu operación te decimos si el monitoreo es la herramienta correcta.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
