import Image from "next/image";
import EscenaIdap from "@/components/organisms/EscenaIdap";
import IdapFormulario from "@/components/organisms/IdapFormulario";
import IdapPestanas, { type PestanaIdap } from "@/components/organisms/IdapPestanas";
import { FONDO_IDAP, ORO_IDAP, PIE_IDAP } from "@/lib/idap-estilo";

/**
 * PaginaIdap
 * El cuerpo de /servicios/idap, rehecho (2026-09-28) con la estructura que
 * Emiliano tomó de Fracttal One: promesa y dos botones, beneficios en
 * pestañas con captura, quién está detrás, IA y conexiones, cifras, el
 * centro de mando por módulos, cómo se empieza, preguntas y formulario.
 *
 * Todo con la identidad de IDAP (su azul radial y su dorado), no el azul
 * marino de DIAPSA. Las funciones que se mencionan las confirmó Emiliano:
 * acceso del cliente, datos de sensores con alertas, IA en el análisis,
 * exportar e integrar. Las cifras son las mismas de la portada.
 *
 * Las capturas se difuminaron donde aparecían nombres de clientes o de
 * plantas (mockup, mockup2, idap-dashboard, history).
 */

const DISCIPLINAS = ["Termografía", "Vibraciones", "Ultrasonido", "Aceite", "Análisis eléctrico", "Integrales"];

const BENEFICIOS: PestanaIdap[] = [
  {
    id: "anticipa",
    nombre: "Anticipa las fallas",
    titulo: "Sabes qué equipo va a fallar antes de que pare la línea",
    texto:
      "Cada medición se califica en cinco estados, de Bueno a Alarma, con la recomendación del especialista. Lo que va empeorando salta a la vista antes de convertirse en un paro.",
    puntos: [
      "Estados claros por equipo: Bueno, Observación, Precaución, Alarma y Seguimiento.",
      "Los sensores en línea envían sus lecturas y una desviación genera una alerta automática.",
      "Lo crítico se avisa en el momento, sin esperar al informe.",
    ],
    imagen: "/images/idap/status-v2.png",
    alt: "Los cinco estados de IDAP con su recomendación: Bueno, Observación, Precaución, Alarma y Seguimiento",
    ajuste: "contain",
  },
  {
    id: "prioriza",
    nombre: "Prioriza lo importante",
    titulo: "Atiendes primero lo que de verdad detiene tu operación",
    texto:
      "IDAP cruza el estado de cada equipo con su criticidad. Un motor en Precaución que detiene la línea va antes que uno en Alarma que tiene respaldo.",
    puntos: [
      "Criticidad baja, media o alta según el impacto real en tu proceso.",
      "La IA sugiere prioridades a partir del estado, la criticidad y la tendencia.",
      "La decisión final la valida un especialista de DIAPSA.",
    ],
    imagen: "/images/idap/estatus-criticidad.png",
    alt: "Criticidad de equipos en IDAP: baja, media y alta",
    ajuste: "contain",
  },
  {
    id: "integra",
    nombre: "Todas las técnicas juntas",
    titulo: "Seis técnicas y los sensores en un mismo lugar",
    texto:
      "Termografía, vibraciones, ultrasonido, aceite, análisis eléctrico e inspecciones integrales quedan en la ficha de cada equipo. Ves la condición completa, no un pedazo por reporte.",
    puntos: [
      "Rutas de campo y sensores en línea en la misma ficha del equipo.",
      "Cada técnica con sus valores, imágenes y espectros.",
      "Un diagnóstico que combina lo que dicen todas.",
    ],
    imagen: "/images/idap/diciplines-idap.png",
    alt: "Las seis disciplinas que integra IDAP alrededor de su logotipo",
    ajuste: "contain",
  },
  {
    id: "respalda",
    nombre: "Respalda cada decisión",
    titulo: "Evidencia para justificar cada inversión ante gerencia",
    texto:
      "Cada inspección queda registrada con su diagnóstico, su tendencia y su recomendación. Comparas ruta contra ruta y demuestras hacia dónde va cada equipo.",
    puntos: [
      "Historial y tendencias por equipo, planta y técnica.",
      "Informes en PDF y datos en Excel cuando los necesites.",
      "Se conecta con tu ERP o tu sistema de mantenimiento.",
    ],
    imagen: "/images/idap/chart.png",
    alt: "Histórico de inspecciones en IDAP con los equipos por estado mes a mes",
    ajuste: "contain",
  },
];

const MODULOS: PestanaIdap[] = [
  {
    id: "tablero",
    nombre: "Tablero",
    titulo: "Toda tu planta en una pantalla",
    texto:
      "Cuántos equipos están en buen estado, en observación, en precaución o en alarma, qué cambió desde la última ruta y las mediciones más recientes. Filtras por planta, área, tipo de equipo o técnica.",
    imagen: "/images/idap/idap-dashboard.png",
    alt: "Tablero de IDAP con los equipos por estado, las transiciones y las últimas mediciones",
  },
  {
    id: "inspeccion",
    nombre: "Inspecciones",
    titulo: "Cada inspección, con su evidencia",
    texto:
      "La inspección llega de campo con los valores de cada técnica calificados en semáforo. En termografía ves la imagen térmica con el punto marcado; en vibraciones, la amplitud de cada punto.",
    imagen: "/images/idap/capturas/inspeccion-termografia.jpg",
    alt: "Inspección en IDAP: pestaña de termografía con la imagen térmica del motor y sus indicadores",
  },
  {
    id: "vibraciones",
    nombre: "Vibraciones",
    titulo: "Los valores de cada punto, comparados contra su límite",
    texto:
      "Velocidad y aceleración por punto y dirección, con el color del estado. Si un punto se sale de su rango, lo ves sin abrir el espectro.",
    imagen: "/images/idap/capturas/inspeccion-vibraciones.jpg",
    alt: "Inspección en IDAP: pestaña de vibraciones con la amplitud global por punto",
  },
  {
    id: "alertas",
    nombre: "Alertas",
    titulo: "Las últimas mediciones y sus alertas",
    texto:
      "Cada medición nueva aparece con su estado y el resumen del diagnóstico. Entras al equipo con un clic para ver el detalle y la recomendación.",
    imagen: "/images/idap/history.png",
    alt: "Lista de últimas mediciones en IDAP con su estado y su diagnóstico",
    ajuste: "contain",
  },
  {
    id: "tendencias",
    nombre: "Tendencias",
    titulo: "Hacia dónde va cada equipo",
    texto:
      "El histórico muestra cuántos equipos pasaron de un estado a otro mes con mes. Así mides si el programa de mantenimiento está funcionando.",
    imagen: "/images/idap/chart.png",
    alt: "Gráfica del histórico de inspecciones por estado en IDAP",
    ajuste: "contain",
  },
];

const KPIS = [
  { valor: "300%", texto: "de retorno de inversión en el primer año" },
  { valor: "95%", texto: "de confiabilidad operativa" },
  { valor: "30%", texto: "de ahorro en la planificación de refacciones" },
];

const PASOS = [
  { titulo: "Levantamiento", texto: "Recorremos tu planta, registramos los equipos críticos y definimos su criticidad." },
  { titulo: "Puntos y rutas", texto: "Definimos qué técnica va en cada equipo, en qué puntos y cada cuánto se mide." },
  { titulo: "Primera ruta", texto: "Medimos en campo o conectamos los sensores; los resultados entran a IDAP con su diagnóstico." },
  { titulo: "Acceso y acompañamiento", texto: "Tu equipo entra con su usuario y un especialista te acompaña en cada ruta." },
];

const PREGUNTAS = [
  {
    p: "¿Qué es IDAP?",
    r: "Es la plataforma de DIAPSA donde quedan los resultados del monitoreo de condición de tus equipos: estado, diagnóstico, recomendación, historial y tendencias de cada uno.",
  },
  {
    p: "¿Mi equipo puede entrar a consultarla?",
    r: "Sí. Cada cliente tiene su acceso con usuario propio y ve sus plantas, equipos, inspecciones e informes cuando lo necesita.",
  },
  {
    p: "¿Recibe datos de sensores?",
    r: "Sí. Los sensores inalámbricos y en línea envían sus lecturas a IDAP y, cuando una se sale de su rango, se genera una alerta automática.",
  },
  {
    p: "¿La IA reemplaza al especialista?",
    r: "No. La IA sugiere diagnósticos y prioridades a partir de los datos; un especialista de DIAPSA los revisa y da la recomendación final.",
  },
  {
    p: "¿Puedo sacar la información o conectarla con mis sistemas?",
    r: "Sí. Descargas informes en PDF y datos en Excel, y IDAP se puede conectar con tu ERP o tu sistema de mantenimiento.",
  },
  {
    p: "¿Cuánto cuesta?",
    r: "Depende de cuántos equipos y técnicas incluya tu programa. En la demo revisamos tu planta y te damos el alcance y la propuesta.",
  },
];

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function Encabezado({ etiqueta, titulo, resalta, texto }: { etiqueta: string; titulo: string; resalta: string; texto?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest" style={{ color: ORO_IDAP }}>
        {etiqueta}
      </span>
      <h2 className="text-3xl font-extrabold leading-tight text-white lg:text-4xl">
        {titulo} <span style={{ color: ORO_IDAP }}>{resalta}</span>
      </h2>
      {texto && <p className="mt-4 text-justify text-lg leading-relaxed text-white/70 sm:text-center">{texto}</p>}
    </div>
  );
}

export default function PaginaIdap() {
  const oro = { background: ORO_IDAP };
  return (
    <main style={{ background: PIE_IDAP }} className="text-white">
      {/* 1. Hero */}
      <section className="relative w-full overflow-hidden" style={{ background: FONDO_IDAP }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(${ORO_IDAP} 1px, transparent 1px), linear-gradient(90deg, ${ORO_IDAP} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:pb-24 lg:pt-40">
          <div>
            <Image src="/images/idap/idap-bco.png" alt="IDAP" width={220} height={66} priority className="h-auto w-44 lg:w-56" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/60">Inspection, Diagnostic &amp; Asset Platform</p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight lg:text-5xl">
              Cada medición de tu planta, <span style={{ color: ORO_IDAP }}>convertida en una decisión</span>
            </h1>
            <p className="mt-5 max-w-xl text-justify text-lg leading-relaxed text-white/80">
              La plataforma de DIAPSA que reúne las inspecciones, los sensores y el criterio de nuestros especialistas para decirte qué equipo atender, cuándo y por qué.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#demo-idap" className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-bold text-[#0a142e] transition-opacity hover:opacity-90" style={oro}>
                Agendar demo <Flecha />
              </a>
              <a
                href="#informe-idap"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 font-bold text-white transition-colors hover:border-white"
              >
                Ver informe de ejemplo
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {DISCIPLINAS.map((d) => (
                <li key={d} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/85 ring-1 ring-white/15">
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[3/2] w-full">
            <div className="absolute inset-10 rounded-full blur-3xl" style={{ background: `${ORO_IDAP}22` }} />
            <Image src="/images/idap/mockup.png" alt="IDAP en una laptop con sus pantallas de tablero, tendencias y equipos" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain" />
          </div>
        </div>
      </section>

      {/* 2. Beneficios */}
      <section className="w-full py-16 lg:py-24" style={{ background: PIE_IDAP }}>
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado
            etiqueta="Toma el control"
            titulo="MENOS PAROS,"
            resalta="MEJORES DECISIONES"
            texto="Lo que tu equipo de mantenimiento gana con IDAP, sin cambiar la forma en que trabaja."
          />
          <IdapPestanas pestanas={BENEFICIOS} />
        </div>
      </section>

      {/* 3. Así se ve una inspección, animada */}
      <section className="w-full py-16 lg:py-24" style={{ background: FONDO_IDAP }}>
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado
            etiqueta="En vivo"
            titulo="ASÍ LLEGA UNA INSPECCIÓN"
            resalta="A IDAP"
            texto="La inspección llega de campo, cada técnica se llena con sus valores y se califica en semáforo, y termina en la recomendación. Pasa el cursor por una técnica para abrirla."
          />
          <div className="overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/10">
            <EscenaIdap
              disciplina="term"
              imagenes={{
                principal: "/images/idap/inspeccion/termica-1.jpg",
                miniaturas: ["/images/idap/inspeccion/termica-1.jpg", "/images/idap/inspeccion/termica-2.jpg", "/images/idap/inspeccion/termica-3.jpg"],
              }}
            />
          </div>
        </div>
      </section>

      {/* 4. Quién está detrás */}
      <section className="w-full py-16 lg:py-24" style={{ background: PIE_IDAP }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2">
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest" style={{ color: ORO_IDAP }}>
              Más que un software
            </span>
            <h2 className="text-3xl font-extrabold leading-tight lg:text-4xl">
              No es software de terceros. <span style={{ color: ORO_IDAP }}>Es la herramienta con la que trabajamos.</span>
            </h2>
            <p className="mt-5 text-justify leading-relaxed text-white/75">
              IDAP nació en campo, de la necesidad de nuestros analistas de entregar resultados claros y comparables. Detrás de cada estado hay más de 20 años midiendo equipos en plantas de energía, hidrocarburos, alimentos y manufactura.
            </p>
            <p className="mt-4 text-justify leading-relaxed text-white/75">
              Por eso no te entregamos tablas: te entregamos qué hacer, en qué equipo y cuándo, revisado por un especialista.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                titulo: "IA que apoya al especialista",
                texto: "Sugiere diagnósticos y prioridades a partir de los datos; el analista los revisa y da la recomendación final.",
                icono: <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zM9.5 9.5h5v5h-5z" />,
              },
              {
                titulo: "Conectada a tus sensores",
                texto: "Los sensores inalámbricos y en línea envían sus lecturas; una desviación dispara una alerta.",
                icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5h.01M8.5 15a5 5 0 017 0M5.5 12a9 9 0 0113 0M2.5 9a13 13 0 0119 0" />,
              },
              {
                titulo: "Tu acceso, tus datos",
                texto: "Tu equipo entra con su propio usuario a ver plantas, equipos, inspecciones e informes.",
                icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />,
              },
              {
                titulo: "Exporta e integra",
                texto: "Informes en PDF, datos en Excel y conexión con tu ERP o tu sistema de mantenimiento.",
                icono: <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V5a1 1 0 011-1h14a1 1 0 011 1v3M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3M8 12h8M13 9l3 3-3 3" />,
              },
            ].map((c) => (
              <div key={c.titulo} className="rounded-sm bg-white/5 p-6 ring-1 ring-white/10">
                <span className="flex h-12 w-12 items-center justify-center rounded-full text-[#0a142e]" style={oro}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                    {c.icono}
                  </svg>
                </span>
                <h3 className="mt-4 font-extrabold">{c.titulo}</h3>
                <p className="mt-2 text-justify text-sm leading-relaxed text-white/70">{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cifras */}
      <section className="w-full py-14 lg:py-20" style={{ background: FONDO_IDAP }}>
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado etiqueta="Resultados" titulo="LO QUE LOGRAN" resalta="NUESTROS CLIENTES" />
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {KPIS.map((k) => (
              <li key={k.valor} className="rounded-sm bg-white/5 px-6 py-10 text-center ring-1 ring-white/10">
                <span className="block text-6xl font-black leading-none lg:text-7xl" style={{ color: ORO_IDAP }}>
                  {k.valor}
                </span>
                <span className="mt-4 block text-xl font-bold leading-snug lg:text-2xl">{k.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Centro de mando */}
      <section id="plataforma" className="w-full scroll-mt-24 py-16 lg:py-24" style={{ background: PIE_IDAP }}>
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado
            etiqueta="La plataforma"
            titulo="TU CENTRO DE MANDO"
            resalta="DEL MANTENIMIENTO PREDICTIVO"
            texto="Recorre las pantallas que usa tu equipo todos los días."
          />
          <IdapPestanas pestanas={MODULOS} vertical />
        </div>
      </section>

      {/* 7. Cómo empiezas */}
      <section className="w-full py-16 lg:py-24" style={{ background: FONDO_IDAP }}>
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado etiqueta="Implementación" titulo="ASÍ EMPIEZAS" resalta="CON IDAP" texto="Nosotros cargamos todo; tu equipo solo entra a consultar y decidir." />
          <ol className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <span className="pointer-events-none absolute left-[12%] right-[12%] top-6 hidden h-0.5 lg:block" style={{ background: `linear-gradient(90deg, transparent, ${ORO_IDAP}, transparent)` }} aria-hidden="true" />
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-[#0a142e] ring-4 ring-[#0d1a38]" style={oro}>
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-extrabold">{p.titulo}</h3>
                <p className="mx-auto mt-2 max-w-xs text-justify text-sm leading-relaxed text-white/70 sm:text-center">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Preguntas */}
      <section className="w-full py-16 lg:py-24" style={{ background: PIE_IDAP }}>
        <div className="mx-auto max-w-4xl px-6">
          <Encabezado etiqueta="Preguntas frecuentes" titulo="LO QUE NECESITAS SABER" resalta="SOBRE IDAP" />
          <div className="space-y-3">
            {PREGUNTAS.map((q, i) => (
              <details key={q.p} open={i === 0} className="group rounded-sm bg-white/5 ring-1 ring-white/10 open:ring-[#ffc34d]/50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold">
                  {q.p}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-white/20 transition-transform group-open:rotate-45">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </span>
                </summary>
                <p className="px-5 pb-5 text-justify leading-relaxed text-white/75">{q.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contacto */}
      <section id="contacto-idap" className="relative w-full scroll-mt-24 py-16 lg:py-24" style={{ background: FONDO_IDAP }}>
        {/* Anclas de los botones del inicio: cada una deja elegida su opción en el formulario */}
        <span id="demo-idap" className="absolute top-0 scroll-mt-24" aria-hidden="true" />
        <span id="informe-idap" className="absolute top-0 scroll-mt-24" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <Image src="/images/idap/idap-bco.png" alt="IDAP" width={180} height={54} className="h-auto w-40" />
            <h2 className="mt-6 text-3xl font-extrabold leading-tight lg:text-4xl">
              Mira IDAP <span style={{ color: ORO_IDAP }}>con tus propios ojos</span>
            </h2>
            <p className="mt-4 text-justify leading-relaxed text-white/75">
              Agenda una demo con un especialista o pide un informe de ejemplo hecho en IDAP.
            </p>
          </div>
          <IdapFormulario />
        </div>
      </section>
    </main>
  );
}
