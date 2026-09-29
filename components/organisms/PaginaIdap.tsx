import Image from "next/image";
import Aparece from "@/components/atoms/Aparece";
import Contador from "@/components/atoms/Contador";
import EscenaIdap from "@/components/organisms/EscenaIdap";
import EscenaIdapHero from "@/components/organisms/EscenaIdapHero";
import IdapFormulario from "@/components/organisms/IdapFormulario";
import { IlustracionAnticipa, IlustracionPrioriza, IlustracionRespalda, IlustracionTecnicas } from "@/components/organisms/IdapIlustraciones";
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
 *
 * Segunda vuelta (2026-09-28, "hay mucho texto"): escena 3D en el inicio,
 * textos más cortos, animaciones al entrar en pantalla, cifras que cuentan,
 * capturas en marco de navegador con inclinación 3D y pestañas que avanzan
 * solas.
 *
 * Tercera vuelta: la escena 3D del inicio es la que hizo Emiliano en Claude
 * Diseño, y los beneficios usan ilustraciones animadas (IdapIlustraciones)
 * en lugar de las infografías.
 */

const DISCIPLINAS = ["Termografía", "Vibraciones", "Ultrasonido", "Aceite", "Análisis eléctrico", "Integrales"];

const BENEFICIOS: PestanaIdap[] = [
  {
    id: "anticipa",
    nombre: "Anticipa las fallas",
    titulo: "Sabes qué equipo va a fallar antes de que pare la línea",
    texto:
      "Cinco estados, de Bueno a Alarma, con la recomendación del especialista.",
    puntos: [
      "Un estado claro por equipo.",
      "Alertas automáticas desde los sensores.",
      "Lo crítico se avisa en el momento.",
    ],
    visual: <IlustracionAnticipa />,
  },
  {
    id: "prioriza",
    nombre: "Prioriza lo importante",
    titulo: "Atiendes primero lo que de verdad detiene tu operación",
    texto:
      "El estado de cada equipo, cruzado con lo que pesa en tu proceso.",
    puntos: [
      "Criticidad baja, media o alta.",
      "La IA sugiere el orden de atención.",
      "Un especialista valida cada decisión.",
    ],
    visual: <IlustracionPrioriza />,
  },
  {
    id: "integra",
    nombre: "Todas las técnicas juntas",
    titulo: "Seis técnicas y los sensores en un mismo lugar",
    texto:
      "La condición completa de cada equipo, no un pedazo por reporte.",
    puntos: [
      "Rutas de campo y sensores en la misma ficha.",
      "Valores, imágenes y espectros por técnica.",
      "Un diagnóstico que las combina.",
    ],
    visual: <IlustracionTecnicas />,
  },
  {
    id: "respalda",
    nombre: "Respalda cada decisión",
    titulo: "Evidencia para justificar cada inversión ante gerencia",
    texto:
      "Cada inspección queda con su diagnóstico, su tendencia y su recomendación.",
    puntos: [
      "Historial y tendencias por equipo.",
      "Informes en PDF y datos en Excel.",
      "Conexión con tu ERP o CMMS.",
    ],
    visual: <IlustracionRespalda />,
  },
];

const MODULOS: PestanaIdap[] = [
  {
    id: "tablero",
    nombre: "Tablero",
    titulo: "Toda tu planta en una pantalla",
    texto:
      "Equipos por estado, qué cambió desde la última ruta y las mediciones recientes.",
    imagen: "/images/idap/idap-dashboard.png",
    alt: "Tablero de IDAP con los equipos por estado, las transiciones y las últimas mediciones",
  },
  {
    id: "inspeccion",
    nombre: "Inspecciones",
    titulo: "Cada inspección, con su evidencia",
    texto:
      "Cada técnica calificada en semáforo, con la imagen térmica y el punto marcado.",
    imagen: "/images/idap/capturas/inspeccion-termografia.jpg",
    alt: "Inspección en IDAP: pestaña de termografía con la imagen térmica del motor y sus indicadores",
  },
  {
    id: "vibraciones",
    nombre: "Vibraciones",
    titulo: "Los valores de cada punto, comparados contra su límite",
    texto:
      "Velocidad y aceleración por punto, con el color de su estado.",
    imagen: "/images/idap/capturas/inspeccion-vibraciones.jpg",
    alt: "Inspección en IDAP: pestaña de vibraciones con la amplitud global por punto",
  },
  {
    id: "alertas",
    nombre: "Alertas",
    titulo: "Las últimas mediciones y sus alertas",
    texto:
      "Cada medición nueva con su estado y su diagnóstico, a un clic del detalle.",
    imagen: "/images/idap/history.png",
    alt: "Lista de últimas mediciones en IDAP con su estado y su diagnóstico",
    ajuste: "contain",
  },
  {
    id: "tendencias",
    nombre: "Tendencias",
    titulo: "Hacia dónde va cada equipo",
    texto:
      "Cuántos equipos cambian de estado mes con mes: así mides si el programa funciona.",
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
  {
    titulo: "Levantamiento",
    texto: "Registramos tus equipos críticos.",
    icono: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 3h6a1 1 0 011 1v1h2a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h2V4a1 1 0 011-1zM9 12l2 2 4-4" />,
  },
  {
    titulo: "Puntos y rutas",
    texto: "Qué técnica, en qué punto y cada cuándo.",
    icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10zM12 13a2 2 0 100-4 2 2 0 000 4z" />,
  },
  {
    titulo: "Primera ruta",
    texto: "Medimos o conectamos los sensores.",
    icono: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-7 4 14 3-7h4" />,
  },
  {
    titulo: "Acceso",
    texto: "Tu equipo entra y decide.",
    icono: <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />,
  },
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

/* Dorado más oscuro para que se lea sobre blanco; el claro es el del logo */
const ORO_OSCURO = "#b07d0a";

function Encabezado({
  etiqueta,
  titulo,
  resalta,
  texto,
  claro = false,
}: {
  etiqueta: string;
  titulo: string;
  resalta: string;
  texto?: string;
  claro?: boolean;
}) {
  const acento = claro ? ORO_OSCURO : ORO_IDAP;
  return (
    <Aparece className="mx-auto mb-10 max-w-3xl text-center">
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest" style={{ color: acento }}>
        {etiqueta}
      </span>
      <h2 className={`text-3xl font-extrabold leading-tight lg:text-4xl ${claro ? "text-[#0d1a38]" : "text-white"}`}>
        {titulo} <span style={{ color: acento }}>{resalta}</span>
      </h2>
      {texto && (
        <p className={`mt-4 text-justify text-lg leading-relaxed sm:text-center ${claro ? "text-slate-600" : "text-white/70"}`}>{texto}</p>
      )}
    </Aparece>
  );
}

export default function PaginaIdap() {
  const oro = { background: ORO_IDAP };
  return (
    <main style={{ background: PIE_IDAP }} className="text-white">
      {/* 1. Hero con la escena 3D */}
      <section className="relative w-full overflow-hidden" style={{ background: FONDO_IDAP }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(${ORO_IDAP} 1px, transparent 1px), linear-gradient(90deg, ${ORO_IDAP} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-6 pb-10 pt-32 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:pb-16 lg:pt-36">
          <Aparece desde="izquierda">
            <Image src="/images/idap/idap-bco.png" alt="IDAP" width={220} height={66} priority className="h-auto w-40 lg:w-52" />
            <h1 className="mt-6 text-4xl font-extrabold leading-tight lg:text-5xl">
              Cada medición, <span style={{ color: ORO_IDAP }}>una decisión</span>
            </h1>
            <p className="mt-4 max-w-md text-justify text-lg leading-relaxed text-white/80">
              Inspecciones, sensores y especialistas en una sola plataforma.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#demo-idap" className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-bold text-[#0a142e] transition-transform hover:scale-105" style={oro}>
                Agendar demo <Flecha />
              </a>
              <a
                href="#informe-idap"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 font-bold text-white transition-colors hover:border-white"
              >
                Ver informe de ejemplo
              </a>
            </div>
          </Aparece>
          <div className="relative h-[340px] w-full sm:h-[420px] lg:h-[560px]">
            <div className="pointer-events-none absolute inset-12 rounded-full blur-3xl" style={{ background: `${ORO_IDAP}18` }} />
            <EscenaIdapHero />
          </div>
        </div>
        {/* Las seis técnicas, desfilando */}
        <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-4">
          <style>{`
            @keyframes idap-desfile { from { transform: translateX(0) } to { transform: translateX(-50%) } }
            .idap-desfile { animation: idap-desfile 40s linear infinite }
            @media (prefers-reduced-motion: reduce) { .idap-desfile { animation: none } }
          `}</style>
          <ul className="idap-desfile flex w-max gap-10">
            {[...DISCIPLINAS, ...DISCIPLINAS, ...DISCIPLINAS, ...DISCIPLINAS].map((d, i) => (
              <li key={`${d}-${i}`} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/60">
                <span className="h-2 w-2 rounded-full" style={oro} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Beneficios */}
      <section className="w-full bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado
            claro
            etiqueta="Toma el control"
            titulo="MENOS PAROS,"
            resalta="MEJORES DECISIONES"
          />
          <IdapPestanas pestanas={BENEFICIOS} claro />
        </div>
      </section>

      {/* 3. Así se ve una inspección, animada */}
      <section className="w-full py-16 lg:py-24" style={{ background: FONDO_IDAP }}>
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado
            etiqueta="En vivo"
            titulo="ASÍ LLEGA UNA INSPECCIÓN"
            resalta="A IDAP"
            texto="Pasa el cursor por una técnica para abrirla."
          />
          <Aparece desde="zoom" className="overflow-hidden rounded-lg shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
            <EscenaIdap
              disciplina="term"
              imagenes={{
                principal: "/images/idap/inspeccion/termica-1.jpg",
                miniaturas: ["/images/idap/inspeccion/termica-1.jpg", "/images/idap/inspeccion/termica-2.jpg", "/images/idap/inspeccion/termica-3.jpg"],
              }}
            />
          </Aparece>
        </div>
      </section>

      {/* 4. Quién está detrás: foto de campo con estados flotando */}
      <section className="w-full overflow-hidden bg-white py-16 lg:py-24">
        <style>{`
          @keyframes idap-flota { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
          .idap-flota { animation: idap-flota 4s ease-in-out infinite }
          @media (prefers-reduced-motion: reduce) { .idap-flota { animation: none } }
        `}</style>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          <Aparece desde="izquierda" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg ring-1 ring-white/10 sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/images/quienes-somos/analista-termografia.webp"
                alt="Analista de DIAPSA haciendo termografía en planta"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a142e] via-transparent to-transparent" />
            </div>
            {[
              { eq: "Rodamiento lado acople", estado: "Precaución", color: "#fc9f01", pos: "left-4 top-8 sm:-left-6" },
              { eq: "Tablero principal", estado: "Bueno", color: "#22c55e", pos: "right-4 top-1/3 sm:-right-6" },
              { eq: "Bomba de condensado", estado: "Observación", color: "#facc15", pos: "bottom-10 left-6 sm:-left-4" },
            ].map((c, i) => (
              <div
                key={c.eq}
                className={`idap-flota absolute ${c.pos} flex items-center gap-3 rounded-full bg-[#0a142e]/90 px-4 py-2 shadow-xl ring-1 ring-white/15 backdrop-blur`}
                style={{ animationDelay: `${i * 1.2}s` }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full motion-reduce:animate-none" style={{ background: c.color }} />
                  <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                </span>
                <span className="text-xs font-bold text-white">{c.eq}</span>
                <span className="text-xs font-bold" style={{ color: c.color }}>
                  {c.estado}
                </span>
              </div>
            ))}
          </Aparece>
          <div>
            <Aparece>
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest" style={{ color: ORO_OSCURO }}>
                Más que un software
              </span>
              <h2 className="text-3xl font-extrabold leading-tight text-[#0d1a38] lg:text-4xl">
                No es software de terceros. <span style={{ color: ORO_OSCURO }}>Es con lo que trabajamos.</span>
              </h2>
              <p className="mt-4 text-justify leading-relaxed text-slate-600">
                IDAP nació en campo. Detrás de cada estado hay un especialista de DIAPSA y más de 20 años midiendo equipos.
              </p>
            </Aparece>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                titulo: "IA que apoya al especialista",
                texto: "Sugiere; el especialista decide.",
                icono: <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zM9.5 9.5h5v5h-5z" />,
              },
              {
                titulo: "Conectada a tus sensores",
                texto: "Una desviación dispara una alerta.",
                icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5h.01M8.5 15a5 5 0 017 0M5.5 12a9 9 0 0113 0M2.5 9a13 13 0 0119 0" />,
              },
              {
                titulo: "Tu acceso, tus datos",
                texto: "Usuario propio para tu equipo.",
                icono: <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />,
              },
              {
                titulo: "Exporta e integra",
                texto: "PDF, Excel, ERP y CMMS.",
                icono: <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V5a1 1 0 011-1h14a1 1 0 011 1v3M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3M8 12h8M13 9l3 3-3 3" />,
              },
            ].map((c, i) => (
              <Aparece key={c.titulo} retraso={i * 120} className="group rounded-sm bg-slate-50 p-5 ring-1 ring-slate-200 transition-shadow hover:shadow-lg">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full text-[#0a142e]" style={oro}>
                  <span className="absolute inset-0 animate-ping rounded-full opacity-20 motion-reduce:animate-none" style={oro} aria-hidden="true" />
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                    {c.icono}
                  </svg>
                </span>
                <h3 className="mt-4 font-extrabold text-[#0d1a38]">{c.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.texto}</p>
              </Aparece>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Cifras */}
      <section className="w-full py-14 lg:py-20" style={{ background: FONDO_IDAP }}>
        <div className="mx-auto max-w-7xl px-6">
          <style>{`
            @keyframes idap-giro { to { transform: translate(-50%, -50%) rotate(360deg) } }
            .idap-giro { animation: idap-giro 6s linear infinite }
            @media (prefers-reduced-motion: reduce) { .idap-giro { animation: none } }
          `}</style>
          <Encabezado etiqueta="Resultados" titulo="LO QUE LOGRAN" resalta="NUESTROS CLIENTES" />
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {KPIS.map((k) => (
              <li key={k.valor} className="relative overflow-hidden rounded-lg bg-white/5 px-6 py-10 text-center ring-1 ring-white/10">
                <span
                  className="idap-giro pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
                  style={{ background: `conic-gradient(from 0deg, transparent, ${ORO_IDAP}, transparent 40%)` }}
                  aria-hidden="true"
                />
                <span className="absolute inset-[2px] rounded-lg" style={{ background: "#0d1a38" }} aria-hidden="true" />
                <span className="relative block text-6xl font-black leading-none lg:text-7xl" style={{ color: ORO_IDAP }}>
                  <Contador valor={k.valor} />
                </span>
                <span className="relative mt-4 block text-xl font-bold leading-snug lg:text-2xl">{k.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Centro de mando */}
      <section id="plataforma" className="w-full scroll-mt-24 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado
            claro
            etiqueta="La plataforma"
            titulo="TU CENTRO DE MANDO"
            resalta="DEL MANTENIMIENTO PREDICTIVO"
          />
          <IdapPestanas pestanas={MODULOS} vertical claro />
        </div>
      </section>

      {/* 7. Cómo empiezas */}
      <section className="w-full py-16 lg:py-24" style={{ background: FONDO_IDAP }}>
        <div className="mx-auto max-w-7xl px-6">
          <Encabezado etiqueta="Implementación" titulo="ASÍ EMPIEZAS" resalta="CON IDAP" texto="Nosotros cargamos todo." />
          <ol className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <span className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-0.5 lg:block" style={{ background: `linear-gradient(90deg, transparent, ${ORO_IDAP}, transparent)` }} aria-hidden="true" />
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="relative text-center">
                <Aparece retraso={i * 180} desde="zoom">
                  <span className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-[#0a142e] shadow-lg ring-4 ring-[#0d1a38] transition-transform hover:-translate-y-1 hover:rotate-3" style={oro}>
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                      {p.icono}
                    </svg>
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0a142e] text-xs font-black text-white ring-2 ring-[#ffc34d]">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold">{p.titulo}</h3>
                  <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-white/65">{p.texto}</p>
                </Aparece>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Preguntas */}
      <section className="w-full bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <Encabezado claro etiqueta="Preguntas frecuentes" titulo="LO QUE NECESITAS SABER" resalta="SOBRE IDAP" />
          <div className="space-y-3">
            {PREGUNTAS.map((q, i) => (
              <details key={q.p} open={i === 0} className="group rounded-sm bg-slate-50 text-[#0d1a38] ring-1 ring-slate-200 open:ring-[#b07d0a]/60">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold">
                  {q.p}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-slate-300 transition-transform group-open:rotate-45">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </span>
                </summary>
                <p className="px-5 pb-5 text-justify leading-relaxed text-slate-600">{q.r}</p>
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
              Agenda una demo o pide un informe de ejemplo.
            </p>
          </div>
          <IdapFormulario />
        </div>
      </section>
    </main>
  );
}
