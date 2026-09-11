export interface Breadcrumb {
  label: string;
  link: string;
}

export interface ServiceHeader {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
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

export interface ServiceEntregable {
  /** Antetítulo corto, ej. "El entregable". */
  etiqueta: string;
  titulo: string;
  descripcion: string;
  /** Texto del botón, ej. "Descargar el informe de ejemplo". */
  textoBoton: string;
  /** Imágenes de las páginas del informe, en orden. Se muestran dos. */
  paginas: string[];
  altPaginas: string;
  /** Cifra del sello flotante, ej. "3". */
  dato: string;
  datoTexto: string;
  /** Ruta pública del archivo descargable. */
  archivo: string;
}

export interface ZonaSeveridad {
  /** bueno | observacion | precaucion | alarma */
  clave: string;
  etiqueta: string;
  /** Rango legible, ej. "0 a 7.1". */
  rango: string;
  /** Peso relativo para el ancho de la barra. */
  peso: number;
  accion?: string;
}

export interface ServiceEscala {
  parametro: string;
  unidad: string;
  norma?: string;
  zonas: ZonaSeveridad[];
}

export interface BloqueCompras {
  /** documentacion | tiempos | cotizacion | cobertura */
  icono: string;
  titulo: string;
  puntos: string[];
}

export interface ServiceFichaCompras {
  titulo: string;
  subtitulo?: string;
  nota?: string;
  bloques: BloqueCompras[];
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

export interface ServiceCta {
  title: string;
  text: string;
  /** Mensaje prellenado para el enlace de WhatsApp. */
  whatsappMessage: string;
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
  /** Fotos reales de campo; si existen, la página muestra la franja "DIAPSA en campo". */
  galeria?: GaleriaFoto[];
  /** Tabla técnica de referencia. */
  tabla?: ServiceTabla;
  /** El informe que recibe el cliente, mostrado y descargable a cambio de contacto. */
  entregable?: ServiceEntregable;
  /** Diagramas a dibujar, por clave: "curva-pf", "flujo-servicio". */
  diagramas?: string[];
  /** Foto que acompaña a los puntos clave del servicio. */
  fotoPuntos?: GaleriaFoto;
  /** Lo que pregunta el área de compras: papeles, tiempos, cobro y cobertura. */
  fichaCompras?: ServiceFichaCompras;
  /** Rangos de severidad con los que se califica cada lectura. */
  escalas?: {
    titulo: string;
    subtitulo?: string;
    nota?: string;
    lista: ServiceEscala[];
  };
}
