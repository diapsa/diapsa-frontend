/**
 * DiagramaServicio
 * Diagramas técnicos dibujados en SVG para las páginas de servicio.
 *
 * Por qué existe: la página era una sucesión de tarjetas de prosa. Los dos
 * argumentos más importantes del mantenimiento predictivo (cuánta anticipación
 * te da cada técnica, y cómo se convierte una medición en una decisión) se
 * entienden en segundos dibujados y casi no se leen escritos.
 *
 * Se dibujan a mano en SVG: sin librería de gráficas, sin imágenes, nítidos en
 * cualquier pantalla y sin peso extra de descarga.
 */

type Props = {
  clave: string;
};

/* ------------------------------------------------------------------ */
/* Curva P-F: cuánta anticipación da cada técnica                      */
/* ------------------------------------------------------------------ */

// Puntos sobre la curva donde cada técnica empieza a detectar la falla.
// El orden es el que se acepta en la industria; las posiciones son
// indicativas, no una escala de tiempo real.
const TECNICAS = [
  { x: 236, y: 104, nombre: "Ultrasonido", destacado: false, arriba: true },
  { x: 330, y: 128, nombre: "Análisis de vibraciones", destacado: true, arriba: true },
  { x: 430, y: 166, nombre: "Análisis de aceite", destacado: false, arriba: true },
  { x: 530, y: 218, nombre: "Termografía", destacado: false, arriba: false },
  { x: 622, y: 274, nombre: "Ruido audible", destacado: false, arriba: false },
  { x: 700, y: 322, nombre: "Calor y vibración perceptibles", destacado: false, arriba: false },
];

function CurvaPF() {
  return (
    <figure className="w-full">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 860 430"
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label="Curva P-F: la condición del equipo cae con el tiempo y cada técnica de monitoreo detecta la falla en un momento distinto. El ultrasonido y el análisis de vibraciones detectan primero; el ruido audible y el calor, cuando la falla ya está avanzada."
        >
          {/* Ejes */}
          <line x1="70" y1="42" x2="70" y2="366" className="stroke-primary/30" strokeWidth="2" />
          <line x1="70" y1="366" x2="812" y2="366" className="stroke-primary/30" strokeWidth="2" />
          <text x="70" y="30" className="fill-primary text-[13px] font-bold">
            Condición del equipo
          </text>
          <text x="812" y="392" textAnchor="end" className="fill-primary text-[13px] font-bold">
            Tiempo
          </text>

          {/* Zona de oportunidad: desde que se detecta hasta que falla */}
          <rect x="330" y="42" width="418" height="324" className="fill-secondary/10" />
          <text x="539" y="62" textAnchor="middle" className="fill-secondary text-[12px] font-bold uppercase tracking-wider">
            Tiempo para actuar
          </text>

          {/* La curva */}
          <path
            d="M 92 88 C 220 96, 330 118, 430 168 S 640 300, 748 358"
            className="fill-none stroke-primary"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Punto P: donde la falla empieza a ser detectable */}
          <circle cx="150" cy="92" r="6" className="fill-primary" />
          <text x="150" y="78" textAnchor="middle" className="fill-primary text-[13px] font-extrabold">
            P
          </text>
          <text x="150" y="418" textAnchor="middle" className="fill-tertiary text-[11px]">
            Falla potencial
          </text>
          <line x1="150" y1="98" x2="150" y2="366" className="stroke-primary/25" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Punto F: falla funcional */}
          <circle cx="748" cy="358" r="6" className="fill-red-600" />
          <text x="748" y="344" textAnchor="middle" className="fill-red-600 text-[13px] font-extrabold">
            F
          </text>
          <text x="748" y="418" textAnchor="middle" className="fill-tertiary text-[11px]">
            Falla funcional
          </text>

          {/* Técnicas sobre la curva */}
          {TECNICAS.map((t) => (
            <g key={t.nombre}>
              <circle
                cx={t.x}
                cy={t.y}
                r={t.destacado ? 8 : 5.5}
                className={t.destacado ? "fill-secondary stroke-white" : "fill-primary/70 stroke-white"}
                strokeWidth="2"
              />
              <line
                x1={t.x}
                y1={t.arriba ? t.y - 10 : t.y + 10}
                x2={t.x}
                y2={t.arriba ? t.y - 28 : t.y + 26}
                className={t.destacado ? "stroke-secondary" : "stroke-primary/40"}
                strokeWidth="1.5"
              />
              <text
                x={t.x}
                y={t.arriba ? t.y - 34 : t.y + 40}
                textAnchor="middle"
                className={
                  t.destacado
                    ? "fill-secondary text-[13px] font-extrabold"
                    : "fill-primary/80 text-[12px] font-semibold"
                }
              >
                {t.nombre}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-4 max-w-3xl text-justify text-sm leading-relaxed text-tertiary">
        Curva P-F, el esquema con el que se explica el mantenimiento predictivo. Una falla no
        aparece de golpe: se incuba. Mientras más temprano se detecta, más tiempo hay para
        conseguir la refacción, agendar el paro y evitar el daño mayor. Cuando la máquina ya
        suena o se calienta, ese margen casi se acabó. Las posiciones son indicativas y varían
        según el equipo y el modo de falla.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Flujo del servicio: del dato a la decisión                          */
/* ------------------------------------------------------------------ */

const PASOS = [
  {
    titulo: "Medición en campo",
    texto: "Ruta de puntos por equipo con analizador certificado, en operación normal.",
    trazo: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z",
  },
  {
    titulo: "Análisis espectral",
    texto: "Un analista Categoría III lee el espectro y la tendencia contra la línea base.",
    trazo: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    titulo: "Diagnóstico",
    texto: "Se nombra el modo de falla y su severidad, no solo se reporta un número alto.",
    trazo: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  {
    titulo: "Recomendación",
    texto: "Qué intervenir, con qué urgencia y qué vigilar en la siguiente ruta.",
    trazo: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
  {
    titulo: "Seguimiento",
    texto: "El equipo con hallazgo entra a reinspección hasta que se corrige.",
    trazo: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
  },
];

function FlujoServicio() {
  return (
    <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
      {PASOS.map((paso, indice) => (
        <li key={paso.titulo} className="relative">
          {/* Conector hacia el siguiente paso, sólo en escritorio */}
          {indice < PASOS.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute -right-2 top-9 hidden h-0.5 w-4 bg-secondary/50 lg:block"
            />
          )}
          <div className="h-full rounded-sm border border-gray-200 bg-white p-5 transition-transform duration-300 motion-safe:hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary">
                <svg className="h-5 w-5 text-secondary" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={paso.trazo} />
                </svg>
              </span>
              <span className="text-3xl font-extrabold leading-none text-gray-200">
                {indice + 1}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold leading-snug text-primary">{paso.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-tertiary">{paso.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */

export default function DiagramaServicio({ clave }: Props) {
  if (clave === "curva-pf") {
    return (
      <section className="w-full bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">
              Por qué medir antes
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">
              Cuánta anticipación te da cada técnica
            </h2>
          </div>
          <CurvaPF />
        </div>
      </section>
    );
  }

  if (clave === "flujo-servicio") {
    return (
      <section className="w-full bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">
              Cómo trabajamos
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">
              Del dato a la decisión
            </h2>
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">
              El objetivo no es medir, es que alguien pueda decidir con lo medido. Estos son los
              cinco pasos de cada servicio.
            </p>
          </div>
          <FlujoServicio />
        </div>
      </section>
    );
  }

  return null;
}
