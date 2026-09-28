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
