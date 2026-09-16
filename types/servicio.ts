export interface Breadcrumb {
  label: string;
  link: string;
}

export interface ServiceHeader {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface FotoPunto {
  src: string;
  alt: string;
  /** "contener" para renders con fondo transparente; si falta, la imagen va a sangre. */
  ajuste?: "cubrir" | "contener";
  /** Fondo detrás de un render contenido: claro (degradado gris) u oscuro (azul marino). */
  fondo?: "claro" | "oscuro";
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  /** Imagen que se muestra cuando este punto está seleccionado. */
  foto?: FotoPunto;
  /** Gráfico esquemático en lugar de foto, por clave: "paros". Tiene prioridad sobre foto. */
  grafico?: string;
  /** Escena 3D animada en lugar de foto: "vibracion-espectro" | "vibracion-semaforo".
      Tiene prioridad sobre grafico y foto; la foto queda de respaldo. */
  escena?: string;
}

export interface ServiceContent {
  title: string | null;
  subtitle: string | null;
  image: string | null;
  items: ContentItem[];
}

export interface RelatedProduct {
  name: string;
  description: string;
  image: string;
  link: string;
}

export interface RelatedProducts {
  title: string;
  subtitle: string;
  items: RelatedProduct[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GaleriaFoto {
  src: string;
  alt: string;
}

export interface ServiceInforme {
  /** Antetítulo de la ficha, ej. "Resumen de la ruta". */
  etiqueta: string;
  /** Encabezado, ej. "25 equipos evaluados". */
  titulo: string;
  /** Cuántos equipos salieron en cada nivel. La clave es la del semáforo. */
  resumen: { clave: string; etiqueta: string; total: number }[];
  /** Renglones de ejemplo, tal como salen en el informe. */
  filas: { equipo: string; componente: string; clave: string; estado: string; accion: string }[];
  nota: string;
}

export interface ServiceEntregable {
  /** Antetítulo corto, ej. "El entregable". */
  etiqueta: string;
  titulo: string;
  descripcion: string;
  /** Qué trae el informe, un renglón por punto. Se muestra como lista. */
  contenido: string[];
  /** Imágenes de las páginas del informe, en orden. Se muestran dos.
      No aplican cuando el servicio entrega `resultado` en vez de informe. */
  paginas?: string[];
  altPaginas?: string;
  /** Cifra del sello flotante, ej. "3". */
  dato?: string;
  datoTexto?: string;
  /** Ficha del informe de una ruta: cuántos equipos salieron en cada nivel
      del semáforo y algunos renglones de ejemplo. Para los servicios que
      entregan una ruta completa en vez de una inspección suelta, y donde lo
      que hay que enseñar es cómo queda priorizada. Si viene, sustituye a la
      vitrina de páginas. */
  informe?: ServiceInforme;
  /** Ficha con el antes y el después del equipo, para los servicios
      correctivos: ahí el entregable no es un informe de inspección sino la
      prueba de que el valor bajó. Si viene, sustituye a la vitrina de
      páginas. */
  resultado?: {
    etiqueta: string;
    equipo: string;
    estado: string;
    filas: { concepto: string; antes: string; despues: string }[];
    nota: string;
  };
  /** Captura de la misma inspección dentro de IDAP. Si existe, la vitrina
      ofrece las dos vistas, IDAP y PDF, y arranca en IDAP. */
  idap?: {
    src: string;
    alt: string;
    texto?: string;
    /** Tamaño natural de la captura, para que Next reserve el espacio. */
    ancho?: number;
    alto?: number;
    /** Encabezado del bloque. Si falta, "Así se ve la misma inspección en IDAP". */
    titulo?: string;
    /** Si viene, en lugar de la captura se muestra la recreación animada
        (EscenaIdap) abierta en esa disciplina. La captura queda de respaldo. */
    escena?: "term" | "vib" | "us";
    /** Fotografías térmicas reales para la pestaña de termografía de la escena. */
    imagenes?: { principal?: string; miniaturas?: string[]; visual?: string };
  };
}

export interface ZonaSemaforo {
  /** bueno | observacion | precaucion | alarma */
  clave: string;
  etiqueta: string;
  /** Qué significa ese color y qué pasa cuando un equipo sale en él. */
  texto: string;
}

export interface ServiceSemaforo {
  titulo: string;
  subtitulo?: string;
  zonas: ZonaSemaforo[];
}

export interface ServiceTabla {
  titulo: string;
  subtitulo?: string;
  columnas: string[];
  /** Cada fila con tantas celdas como columnas. */
  filas: string[][];
  /** Clave del patrón espectral a dibujar en cada fila, en el mismo orden. */
  patrones?: string[];
  nota?: string;
}

export interface FlujoPaso {
  titulo: string;
  texto: string;
}

export interface ServiceComparador {
  titulo: string;
  texto?: string;
  visual: GaleriaFoto;
  termica: GaleriaFoto;
  pie?: string;
}

export interface ClipSonoro {
  /** Antetítulo corto, ej. "Condición normal". */
  etiqueta: string;
  titulo: string;
  descripcion: string;
  /** Nivel medido, ej. "20 dB". */
  nivel: string;
  estado: "normal" | "alarma";
  /** Envolvente de la grabación real, 120 valores entre 0 y 1, con la que se dibuja la onda. */
  envolvente: number[];
}

export interface CostoFugas {
  titulo: string;
  texto?: string;
  /** Fugas encontradas en la ruta. */
  fugas: number;
  /** CFM sumados de todas ellas. */
  cfm: number;
  /** Costo mensual del aire fugado, en dólares, desde la primera ruta. */
  meses: number[];
  /** Supuesto de cálculo, para que la cifra se pueda auditar. */
  supuesto: string;
}

export interface AnalisisDescargas {
  titulo: string;
  texto?: string;
  /** Puntos del patrón PRPD que forman la firma: [fase 0-360, amplitud 0-100]. */
  patron: number[][];
  /** Puntos de fondo, sin patrón, con la misma forma. */
  ruido: number[][];
  /** Frecuencia de la red, en hercios. */
  frecuencia: number;
  /** Probabilidad por tipo de descarga, en porcentaje. */
  tipos: { texto: string; valor: number }[];
  /** Parámetros con los que se tomó la medición. */
  parametros: { texto: string; valor: string }[];
  /** Gravedad de 0 a 100 y cómo se llama ese nivel. */
  gravedad: number;
  gravedadTexto: string;
  /** Cómo se lee el patrón, en una línea. */
  lectura: string;
  nota: string;
}

export interface EstimadoFalla {
  titulo: string;
  texto?: string;
  /** Qué se está costeando, ej. "por equipo". Va en la línea de la diferencia. */
  unidad: string;
  /** Dos escenarios, el mismo hallazgo atendido a tiempo y llevado a la falla. */
  escenarios: { etiqueta: string; partidas: { texto: string; monto: number }[] }[];
  /** Cómo se nombra el escenario caro en la línea de cierre, ej. "dejar que
      falle". Si falta, se usa esa misma. */
  frase?: string;
  /** De dónde salen las cifras, para que el estimado se pueda discutir. */
  supuesto: string;
}

export interface GrupoSonoro {
  id: string;
  /** Nombre en el selector, ej. "Rodamientos". */
  etiqueta: string;
  /** Qué se está oyendo, en una línea. */
  resumen: string;
  /** "real" si las señales son la envolvente de una grabación de inspección;
      "tipico" si son la firma característica de esa falla, reconstruida. */
  origen: "real" | "tipico";
  /** Rótulo del eje, ej. "Nivel en decibeles". */
  escalaTexto: string;
  /** Tope de la escala en decibeles. */
  escalaMax: number;
  /** Umbrales de severidad, en decibeles absolutos sobre la misma escala. */
  umbrales: { db: number; texto: string }[];
  clips: ClipSonoro[];
  /** Cómo se califica esta familia; va debajo de la escala. */
  nota?: string;
  /** Lo que cuesta el aire que se fuga, mes a mes (solo aire comprimido). */
  costos?: CostoFugas;
  /** Clasificación de la descarga a partir del patrón PRPD (solo eléctrico). */
  descargas?: AnalisisDescargas;
  /** Lo que cuesta el hallazgo atendido a tiempo contra llevado a la falla. */
  estimado?: EstimadoFalla;
}

export interface ServiceComparadorSonoro {
  titulo: string;
  texto?: string;
  grupos: GrupoSonoro[];
  pie?: string;
}

export interface ServiceCta {
  title: string;
  text: string;
  /** Mensaje prellenado para el enlace de WhatsApp. */
  whatsappMessage: string;
  /** Tres datos de contratación confirmados, ej. "Registro REPSE vigente". */
  datos?: string[];
}

export interface Servicio {
  id: string;
  slug: string;
  type: string;
  breadcrumbs: Breadcrumb[];
  header: ServiceHeader;
  content: ServiceContent;
  relatedProducts: RelatedProducts;
  /** Meta descripción para Google. Si falta, se usa header.subtitle
      (que también es el subtítulo visible del hero). */
  seoDescription?: string;
  /** Preguntas frecuentes. Si existen, la página las muestra y emite
      schema FAQPage (elegible para resultado enriquecido en Google). */
  faq?: FaqItem[];
  /** Llamado a la acción específico del servicio (banda tras el FAQ). */
  cta?: ServiceCta;
  /** Certificación a resaltar en la banda de cifras, ej. "Analistas Categoría III · ISO 18436-2". */
  certificacion?: string;
  /** Con qué colores sale calificado cada equipo y qué hacer en cada uno.
      Responde la pregunta que sigue al resultado: ¿y ahora qué hago? */
  semaforo?: ServiceSemaforo;
  /** Fotos reales de campo; si existen, la página muestra la franja "DIAPSA en campo". */
  galeria?: GaleriaFoto[];
  /** Otro servicio que se compra junto con este. Va en las dos direcciones:
      si A apunta a B, B debe apuntar a A. */
  servicioRelacionado?: { href: string; etiqueta: string; titulo: string; texto: string; enlace: string };
  /** El informe que recibe el cliente: se enseña y se dice qué trae. */
  entregable?: ServiceEntregable;
  /** Diagramas a dibujar, por clave: "flujo-servicio". La curva P-F y los
      modos de falla viven en la guía del blog (types/guia.ts), no aquí. */
  diagramas?: string[];
  /** Textos de los cinco pasos del flujo, si el servicio los redacta a su
      manera. Los íconos se mantienen por posición. Si falta, se usan los
      de vibraciones. */
  flujo?: FlujoPaso[];
  /** Foto que acompaña a los puntos clave del servicio. */
  fotoPuntos?: GaleriaFoto;
  /** Si es verdadero, cierra con la pared de logotipos de clientes. */
  mostrarClientes?: boolean;
  /** Par visual y térmico de la misma escena (termografía). */
  comparador?: ServiceComparador;
  /** Gráfica de referencia con dos señales reales, normal y con hallazgo (ultrasonido). */
  comparadorSonoro?: ServiceComparadorSonoro;
}
