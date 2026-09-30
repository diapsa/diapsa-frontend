import Image from "next/image";
import Aparece from "@/components/atoms/Aparece";
import Contador from "@/components/atoms/Contador";
import VideoBucle from "@/components/atoms/VideoBucle";
import EscenaIdap from "@/components/organisms/EscenaIdap";
import EscenaIdapHero from "@/components/organisms/EscenaIdapHero";
import IdapFormulario from "@/components/organisms/IdapFormulario";
import { IlustracionRespalda } from "@/components/organisms/IdapIlustraciones";
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
 *
 * Cuarta vuelta (2026-09-29, "muy saturado de información"): como Fracttal,
 * cada función es un bloque con un solo recurso visual (ilustración
 * animada, la inspección animada o una foto), un título, dos líneas y un
 * botón, alternando izquierda y derecha sobre blanco. Se quitaron las
 * pestañas, el centro de mando y "Así empiezas".
 */

const DISCIPLINAS = ["Termografía", "Vibraciones", "Ultrasonido", "Aceite", "Análisis eléctrico", "Integrales"];

const KPIS = [
  { valor: "300%", texto: "de retorno de inversión en el primer año" },
  { valor: "95%", texto: "de confiabilidad operativa" },
  { valor: "30%", texto: "de ahorro en la planificación de refacciones" },
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

/* Íconos de los bloques: el círculo dorado que va sobre la esquina del recurso */
const ICONO = {
  alerta: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5L2.8 19.5h18.4L12 3.5zM12 10v4.5M12 17.2v.3" />,
  ia: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />,
  red: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5h.01M8.5 15a5 5 0 017 0M5.5 12a9 9 0 0113 0M2.5 9a13 13 0 0119 0" />,
  inspeccion: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 3h6a1 1 0 011 1v1h2a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h2V4a1 1 0 011-1zM9 12l2 2 4-4" />,
  documento: <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13H7zM14 3v5h5M10 17v-3M13 17v-5M16 17v-2" />,
  planta: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V10l6 3.5V10l6 3.5V6.5l6 2.5V21zM3 21h18M7 17h2M12 17h2M17 17h2" />,
  persona: <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />,
};

/**
 * Un bloque al estilo Fracttal: el recurso visual en un panel azul de IDAP
 * con el círculo dorado en la esquina, y al lado título, dos líneas y un
 * botón. `invertir` pone el recurso a la derecha; `ancho` lo pone debajo
 * del texto a todo lo ancho (para la inspección animada, que necesita ancho).
 */
function Fila({
  titulo,
  texto,
  icono,
  children,
  invertir = false,
  ancho = false,
}: {
  titulo: string;
  texto: string;
  icono: keyof typeof ICONO;
  children: React.ReactNode;
  invertir?: boolean;
  ancho?: boolean;
}) {
  const recurso = (
    <Aparece desde={invertir ? "derecha" : "izquierda"} className="relative">
      <span
        className={`absolute -top-5 z-10 flex h-16 w-16 ${ancho ? "-right-3 sm:-right-5" : "-left-3 sm:-left-5"} items-center justify-center rounded-full text-[#0a142e] shadow-xl sm:h-20 sm:w-20`}
        style={{ background: `radial-gradient(circle at 30% 30%, #ffe19a, ${ORO_IDAP})` }}
        aria-hidden="true"
      >
        <svg className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          {ICONO[icono]}
        </svg>
      </span>
      <div className="overflow-hidden rounded-3xl p-3 shadow-[0_30px_70px_-30px_rgba(10,20,46,0.6)] sm:p-4" style={{ background: FONDO_IDAP }}>
        <div className="relative overflow-hidden rounded-2xl">{children}</div>
      </div>
    </Aparece>
  );
  const textoBloque = (
    <Aparece desde={invertir ? "izquierda" : "derecha"} className={ancho ? "mx-auto max-w-3xl text-center" : ""}>
      <h2 className="text-3xl font-extrabold leading-tight text-[#0d1a38] lg:text-4xl">{titulo}</h2>
      <p className={`mt-4 text-lg leading-relaxed text-slate-600 ${ancho ? "sm:text-center" : "text-justify"}`}>{texto}</p>
      <a
        href="#demo-idap"
        className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3 font-bold text-[#0a142e] transition-transform hover:scale-105"
        style={{ background: ORO_IDAP }}
      >
        Agendar demo <Flecha />
      </a>
    </Aparece>
  );
  if (ancho) {
    return (
      <div className="space-y-12">
        {textoBloque}
        {recurso}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className={invertir ? "lg:order-2" : ""}>{recurso}</div>
      <div className={invertir ? "lg:order-1" : ""}>{textoBloque}</div>
    </div>
  );
}

/* Los videos de los bloques, hechos en Remotion (proyecto diapsa-videos) y
   exportados a 1280 x 800 en public/videos/idap/ */
function VideoIdap({ nombre, descripcion }: { nombre: string; descripcion: string }) {
  return (
    <VideoBucle
      className="block aspect-[16/10] w-full object-cover"
      src={`/videos/idap/${nombre}.mp4`}
      poster={`/videos/idap/${nombre}.jpg`}
      descripcion={descripcion}
    />
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
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-6 pb-10 pt-32 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:pb-16 lg:pt-36">
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
          <div className="relative h-[460px] w-full sm:h-[520px] lg:h-[600px]">
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

      {/* 2. Las funciones, un bloque cada una, en zigzag */}
      <section className="w-full overflow-hidden bg-white py-20 lg:py-28">
        <style>{`
          @keyframes idap-flota { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
          .idap-flota { animation: idap-flota 4s ease-in-out infinite }
          @media (prefers-reduced-motion: reduce) { .idap-flota { animation: none } }
        `}</style>
        <div className="mx-auto max-w-6xl space-y-28 px-6 lg:space-y-36">
          <Fila
            icono="planta"
            titulo="La salud de todas tus plantas, en una sola vista"
            texto="Cada planta con su gemelo digital, sus equipos por estado y el ahorro de las fallas evitadas. Del tablero general a cada medición en un clic."
          >
            <VideoIdap
              nombre="idap-plantas"
              descripcion="Recorrido por IDAP: salud de tres plantas de ciclo combinado y el tablero de métricas"
            />
          </Fila>

          <Fila
            invertir
            icono="alerta"
            titulo="Sabes qué equipo va a fallar antes del paro"
            texto="Cada medición se califica de Bueno a Alarma. Cuando un equipo empieza a empeorar, te avisamos antes de que detenga la línea."
          >
            <VideoIdap
              nombre="idap-aviso"
              descripcion="Gemelo digital de un motor-bomba con sensor en línea: la vibración cruza los límites, llega el aviso y queda programada la orden de trabajo antes del paro"
            />
          </Fila>

          <Fila
            icono="ia"
            titulo="PIA, la IA que ordena tus prioridades"
            texto="Cruza el estado de cada equipo con lo que pesa en tu proceso y te dice qué atender primero. Un especialista de DIAPSA valida cada decisión."
          >
            <VideoIdap
              nombre="idap-pia"
              descripcion="PIA, la IA de IDAP, ordena los equipos con hallazgos por orden de atención y un especialista de DIAPSA valida la primera prioridad"
            />
          </Fila>

          <Fila
            invertir
            icono="red"
            titulo="Todas las técnicas, un solo diagnóstico"
            texto="Cada equipo con su gemelo digital y el estado de cada componente. Termografía, vibraciones, ultrasonido, aceite y análisis eléctrico se evalúan juntos y dan un solo diagnóstico."
          >
            <VideoIdap
              nombre="idap-equipo"
              descripcion="Ficha de un equipo en IDAP como gemelo digital: estado por componente y diagnóstico integral a partir de cinco disciplinas"
            />
          </Fila>

          <Fila
            ancho
            icono="inspeccion"
            titulo="Así llega una inspección a IDAP"
            texto="La inspección llega de campo, cada técnica se califica en semáforo y termina en la recomendación. Pasa el cursor por una técnica para abrirla."
          >
            <EscenaIdap
              disciplina="term"
              imagenes={{
                principal: "/images/idap/inspeccion/termica-1.jpg",
                miniaturas: ["/images/idap/inspeccion/termica-1.jpg", "/images/idap/inspeccion/termica-2.jpg", "/images/idap/inspeccion/termica-3.jpg"],
              }}
            />
          </Fila>

          <Fila
            icono="documento"
            titulo="Evidencia para justificar cada inversión"
            texto="Historial y tendencias de cada equipo, informes en PDF, datos en Excel y conexión con tu ERP o tu sistema de mantenimiento."
          >
            <div className="aspect-[16/10]">
              <IlustracionRespalda />
            </div>
          </Fila>

          <Fila
            invertir
            icono="persona"
            titulo="No es software de terceros: es con lo que trabajamos"
            texto="IDAP nació en campo. Detrás de cada estado hay un especialista de DIAPSA y más de 20 años midiendo equipos."
          >
            <div className="relative aspect-[16/10]">
              <Image
                src="https://diapsa-storage.sfo3.cdn.digitaloceanspaces.com/grupo-diapsa/production/image/posts/generadora-de-ciclo-combinado-y-el-impacto-del-monitoreo-predictivo-en-la-generacion-de-energia.jpeg"
                alt="Analista de DIAPSA en ruta de inspección en una planta de generación de ciclo combinado"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a142e]/70 via-transparent to-transparent" />
            {[
              // Equipos que se ven en la foto (las bombas azules), en el cielo y el piso
              { eq: "Bombas de alimentación", estado: "Bueno", color: "#22c55e", pos: "right-3 top-3" },
              { eq: "Motor de bomba 2", estado: "Precaución", color: "#fc9f01", pos: "bottom-3 right-3" },
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
            </div>
          </Fila>
        </div>
      </section>

      {/* 3. Cifras */}
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

      {/* 4. Preguntas */}
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

      {/* 5. Contacto */}
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
