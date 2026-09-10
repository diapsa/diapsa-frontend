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
/* Curva P-F: el intervalo que se busca alargar                        */
/* ------------------------------------------------------------------ */

/**
 * La lectura correcta de la curva no es "así se deteriora el equipo", sino
 * "este es el tiempo que tienes, y tu trabajo es alargarlo". Por eso el
 * diagrama marca los tres campos (proactivo, monitoreo de condición y
 * correctivo) y remata con el intervalo P-F como la medida a maximizar.
 */

// Técnicas que detectan dentro del campo de monitoreo de condición.
// El orden es el que se acepta en la industria; las posiciones son
// indicativas, no una escala de tiempo real.
const TECNICAS = [
  { x: 352, y: 150, etiquetaY: 96, nombre: "Ultrasonido", destacado: false },
  { x: 436, y: 190, etiquetaY: 136, nombre: "Vibraciones mecánicas", destacado: true },
  { x: 524, y: 236, etiquetaY: 182, nombre: "Análisis de lubricante", destacado: false },
  { x: 610, y: 288, etiquetaY: 234, nombre: "Termografía infrarroja", destacado: false },
];

// Señales que ya sólo aparecen cuando la falla está encima.
const TARDIAS = [
  { x: 700, y: 330, etiquetaX: 700, etiquetaY: 268, nombre: "Ruido audible" },
  { x: 748, y: 356, etiquetaX: 790, etiquetaY: 312, nombre: "Calor por contacto" },
];

function CurvaPF() {
  return (
    <figure className="w-full">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 900 500"
          className="h-auto w-full min-w-[760px]"
          role="img"
          aria-label="Curva P-F. La capacidad funcional del equipo cae con el tiempo. Antes del punto P está el campo proactivo. Entre el punto P, donde la falla se vuelve detectable, y el punto F, donde ocurre la falla funcional, está el intervalo P-F: primero detectan el ultrasonido y el análisis de vibraciones, después el análisis de lubricante y la termografía; el ruido audible y el calor por contacto aparecen ya en el campo correctivo. El objetivo del monitoreo de condición es alargar ese intervalo."
        >
          {/* Ejes */}
          <line x1="88" y1="52" x2="88" y2="392" className="stroke-primary/30" strokeWidth="2" />
          <line x1="88" y1="392" x2="858" y2="392" className="stroke-primary/30" strokeWidth="2" />
          <text x="88" y="38" className="fill-primary text-[13px] font-bold">
            Capacidad funcional
          </text>
          <text x="858" y="418" textAnchor="end" className="fill-primary text-[13px] font-bold">
            Tiempo
          </text>

          {/* Los tres campos */}
          <rect x="88" y="52" width="212" height="340" className="fill-primary/5" />
          <rect x="300" y="52" width="360" height="340" className="fill-secondary/10" />
          <rect x="660" y="52" width="198" height="340" className="fill-red-600/5" />

          <text x="194" y="72" textAnchor="middle" className="fill-primary/70 text-[11px] font-bold uppercase tracking-wider">
            Campo proactivo
          </text>
          <text x="480" y="72" textAnchor="middle" className="fill-secondary text-[11px] font-bold uppercase tracking-wider">
            Campo de monitoreo de condición
          </text>
          <text x="759" y="72" textAnchor="middle" className="fill-red-600 text-[11px] font-bold uppercase tracking-wider">
            Campo correctivo
          </text>

          {/* Divisiones */}
          <line x1="300" y1="52" x2="300" y2="392" className="stroke-red-600" strokeWidth="2" strokeDasharray="7 6" />
          <line x1="660" y1="52" x2="660" y2="392" className="stroke-red-600" strokeWidth="2" strokeDasharray="7 6" />

          {/* La curva */}
          <path
            d="M 106 108 C 190 112, 250 116, 300 124 C 400 142, 520 232, 610 292 S 742 366, 790 386"
            className="fill-none stroke-primary"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Punto P */}
          <circle cx="300" cy="124" r="7" className="fill-red-600 stroke-white" strokeWidth="2" />
          <rect x="286" y="88" width="28" height="24" rx="3" className="fill-secondary" />
          <text x="300" y="105" textAnchor="middle" className="fill-primary text-[15px] font-extrabold">
            P
          </text>
          <text x="300" y="438" textAnchor="middle" className="fill-primary text-[12px] font-bold">
            Aquí la falla ya es detectable
          </text>

          {/* Punto F */}
          <circle cx="790" cy="386" r="7" className="fill-red-600 stroke-white" strokeWidth="2" />
          <rect x="806" y="360" width="28" height="24" rx="3" className="fill-red-600" />
          <text x="820" y="377" textAnchor="middle" className="fill-white text-[15px] font-extrabold">
            F
          </text>
          <text x="790" y="438" textAnchor="middle" className="fill-red-600 text-[12px] font-bold">
            Falla funcional
          </text>

          {/* Técnicas de monitoreo */}
          {TECNICAS.map((t) => (
            <g key={t.nombre}>
              <circle
                cx={t.x}
                cy={t.y}
                r={t.destacado ? 8.5 : 6}
                className={t.destacado ? "fill-secondary stroke-white" : "fill-primary/70 stroke-white"}
                strokeWidth="2"
              />
              <line
                x1={t.x}
                y1={t.y - 10}
                x2={t.x}
                y2={t.etiquetaY + 6}
                className={t.destacado ? "stroke-secondary" : "stroke-primary/40"}
                strokeWidth="1.5"
              />
              <text
                x={t.x}
                y={t.etiquetaY}
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

          {/* Señales tardías */}
          {TARDIAS.map((t) => (
            <g key={t.nombre}>
              <circle cx={t.x} cy={t.y} r="5.5" className="fill-red-600 stroke-white" strokeWidth="2" />
              <line
                x1={t.x}
                y1={t.y - 9}
                x2={t.etiquetaX}
                y2={t.etiquetaY + 6}
                className="stroke-red-600/50"
                strokeWidth="1.5"
              />
              <text
                x={t.etiquetaX}
                y={t.etiquetaY}
                textAnchor="middle"
                className="fill-red-600 text-[12px] font-semibold"
              >
                {t.nombre}
              </text>
            </g>
          ))}

          {/* El intervalo, que es lo que se busca alargar */}
          <line x1="300" y1="462" x2="790" y2="462" className="stroke-secondary" strokeWidth="2.5" />
          <path d="M 300 462 l 12 -6 v 12 z" className="fill-secondary" />
          <path d="M 790 462 l -12 -6 v 12 z" className="fill-secondary" />
          <rect x="418" y="450" width="254" height="24" rx="3" className="fill-white" />
          <text x="545" y="467" textAnchor="middle" className="fill-primary text-[13px] font-extrabold">
            Intervalo P-F: el tiempo que tienes
          </text>
        </svg>
      </div>
      <figcaption className="mt-4 max-w-3xl text-justify text-sm leading-relaxed text-tertiary">
        Una falla no aparece de golpe: se incuba. El intervalo P-F es el tiempo entre el momento
        en que la falla ya se puede detectar y el momento en que el equipo deja de servir, y ese
        tiempo es lo que se busca alargar. Mientras más temprano detecte la técnica, más largo es
        el intervalo y más margen tienes para conseguir la refacción, agendar el paro y evitar el
        daño colateral. Cuando el equipo ya suena o se calienta al tacto, el margen se acabó y
        sólo queda corregir. Las posiciones son indicativas y varían según el equipo y el modo de
        falla.
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
            <h3 className="mt-4 text-lg font-bold leading-snug text-primary">{paso.titulo}</h3>
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
      <section className="w-full bg-gray-50 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">
              Curva P-F
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-primary lg:text-4xl">
              El objetivo no es ver la falla, es alargar el tiempo que tienes
            </h2>
            <p className="mt-3 text-justify text-lg leading-relaxed text-tertiary">
              Si no haces nada, el equipo se degrada hasta fallar. La técnica que elijas decide
              qué tan pronto te enteras, y eso es exactamente lo que alarga tu margen de
              maniobra.
            </p>
          </div>
          <CurvaPF />
        </div>
      </section>
    );
  }

  if (clave === "flujo-servicio") {
    return (
      <section className="w-full bg-gray-50 py-12 lg:py-20">
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
