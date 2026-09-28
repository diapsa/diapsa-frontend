import Image from "next/image";
import CarruselBloque from "@/components/organisms/CarruselBloque";
import DoloresMonitoreo from "@/components/organisms/DoloresMonitoreo";
import GaleriaCampo from "@/components/organisms/GaleriaCampo";
import LoQueRecibes from "@/components/organisms/LoQueRecibes";
import galeria from "@/data/monitoreo-condicion-galeria.json";
import { APARTADOS_CONDICION } from "@/lib/bloques-inicio";

/**
 * PaginaMonitoreo
 * El cuerpo de /servicios/monitoreo-condicion.
 *
 * Por qué este orden: primero el problema en cuatro tarjetas cortas, para
 * que el visitante se reconozca, e inmediatamente los nueve servicios que lo
 * resuelven, en un carrusel de tarjetas con foto con dos apartados que un
 * jefe de mantenimiento reconoce: lo mecánico y lo eléctrico. Antes había que bajar tres secciones
 * (la filosofía, la analogía médica) para encontrarlos. Después vienen las
 * fotos de campo, el método y lo que se gana.
 *
 * Sin porcentajes ni cifras de plantas: no había cómo sostenerlos.
 * Nombre y descripción corta salen del menú, para que la página y el
 * desplegable digan lo mismo.
 */



const PASOS = [
  {
    nombre: "Diagnóstico",
    foto: "/images/servicios/diagnostico-integral/campo-equipo-ruta.webp",
    alt: "Analistas de DIAPSA recorriendo los equipos de la planta",
    texto: "Levantamos el inventario de equipos críticos, su historial de fallas y su condición actual. Así sabemos por dónde empezar.",
  },
  {
    nombre: "Diseño",
    foto: "/images/servicios/sensores-vibracion/sensor-motor.webp",
    alt: "Punto de medición definido sobre la carcasa de un motor",
    texto: "Armamos el plan: qué técnica en cada equipo, en qué puntos y cada cuánto se mide, según qué tan crítico es.",
  },
  {
    nombre: "Detección",
    foto: "/images/servicios/diagnostico-integral/campo-bombas-medicion.webp",
    alt: "Analistas midiendo bombas en operación",
    texto: "Nuestros analistas miden en tu planta con los equipos en operación. No hace falta parar la producción.",
  },
  {
    nombre: "Decisión",
    foto: "/images/servicios/diagnostico-integral/termograma-motor.webp",
    alt: "Termograma de un motor con el punto caliente marcado",
    texto: "Cada hallazgo llega con su severidad y su recomendación. Lo crítico se avisa en el mismo recorrido, sin esperar el informe.",
  },
  {
    nombre: "Datos",
    foto: "/images/idap/chart.png",
    alt: "Histórico de inspecciones en IDAP, con los equipos por estado",
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

// Un ícono de línea por ganancia, en el mismo trazo que el resto del sitio
const ICONOS_GANANCIA: Record<string, React.ReactNode> = {
  "Confiabilidad": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </>
  ),
  "Ahorro": (
    <>
      <circle cx="12" cy="12" r="8.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.8 9.2c-.5-.8-1.5-1.3-2.8-1.3-1.7 0-2.8.9-2.8 2.1 0 2.9 5.8 1.5 5.8 4.2 0 1.2-1.2 2.1-3 2.1-1.4 0-2.5-.6-3-1.5M12 6.5v1.4M12 16.1v1.4" />
    </>
  ),
  "Planeación": (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.5 10h17M8 3v4M16 3v4M8 14h3M8 17h6" />
    </>
  ),
  "Línea base": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16" /><path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2.5" d="M7 13h13" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 16l3-5 3 3 3-6 3 2" />
    </>
  ),
  "Contención": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5L2.8 19.5h18.4L12 3.5z" /><path strokeLinecap="round" d="M12 10v4.5M12 17.2v.3" />
    </>
  ),
  "Respaldo": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13H7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M10 17v-3M13 17v-5M16 17v-2" />
    </>
  ),
};

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

      {/* 2. Servicios: lo que viene a buscar, en carrusel por frente */}
      <section className="w-full bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <CarruselBloque
            etiqueta="Nuestros servicios"
            titulo={<>NUEVE SERVICIOS, <span className="text-secondary">DOS FRENTES</span></>}
            texto="Medimos la condición de tus equipos con ellos en operación y te decimos qué intervenir, cuándo y por qué. Elige por el tipo de equipo que te preocupa."
            apartados={APARTADOS_CONDICION}
            fondo="/images/servicios/diagnostico-integral/campo-bombas-vista-superior.webp"
            href="/contacto"
          />
        </div>
      </section>

      {/* 3. Fotos de campo: la prueba de que medimos nosotros */}
      <GaleriaCampo
        sinPie
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
          <ol className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {/* La línea que une los cinco pasos */}
            <span className="pointer-events-none absolute left-[10%] right-[10%] top-5 hidden h-0.5 bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20 lg:block" aria-hidden="true" />
            {PASOS.map((p, i) => (
              <li key={p.nombre} className="group relative flex flex-col">
                <span className="relative z-10 mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-black text-primary shadow-lg ring-4 ring-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 flex-col overflow-hidden rounded-sm border border-white/10 bg-white/5 transition-colors group-hover:border-secondary/60">
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={p.foto}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                    <h3 className="absolute bottom-3 left-4 text-lg font-bold text-white">{p.nombre}</h3>
                  </div>
                  <p className="flex-1 p-5 text-justify text-sm leading-relaxed text-white/75">{p.texto}</p>
                </div>
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GANANCIAS.map((g) => (
              <div
                key={g.titulo}
                className="group flex gap-4 rounded-sm bg-gray-50 p-6 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary transition-colors group-hover:bg-secondary group-hover:text-primary">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
                    {ICONOS_GANANCIA[g.titulo]}
                  </svg>
                </span>
                <div>
                  <h3 className="mb-1 text-base font-extrabold uppercase tracking-wider text-primary">{g.titulo}</h3>
                  <p className="text-justify text-sm leading-relaxed text-tertiary">{g.texto}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Lo que recibes */}
      <LoQueRecibes />

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
