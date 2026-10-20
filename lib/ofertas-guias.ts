import { SITE_CONFIG } from "@/lib/constants";
import { enlaceContacto, type Motivo } from "@/lib/contacto-opciones";
import { getServicioPorArticulo } from "@/lib/recursos";

/**
 * La oferta que va a media lectura en cada guía del blog (Emiliano,
 * 2026-10-19). El blog es por donde entra casi todo el tráfico nuevo y las
 * guías solo ofrecían el servicio al final; en octubre: 195 clics de Google,
 * 9 solicitudes. Cada oferta es concreta y ligada al tema que la persona
 * acaba de leer, con WhatsApp con el mensaje ya escrito y el formulario con
 * el motivo y el interés marcados. Las guías sin oferta propia usan la de su
 * servicio; las que no tienen servicio, ninguna.
 */

export type OfertaGuia = {
  etiqueta: string;
  titulo: string;
  texto: string;
  /** Mensaje con que se abre WhatsApp. */
  whatsapp: string;
  /** Interés que va marcado en el formulario. */
  interes: string;
  motivo?: Motivo;
};

/** Por guía, para las que más tráfico traen. */
const POR_GUIA: Record<string, OfertaGuia> = {
  "tabla-iso-10816-3-y-20816-3-limites-de-vibracion": {
    etiqueta: "Sin costo",
    titulo: "¿Quieres saber en qué zona están tus motores?",
    texto: "Medimos tres equipos de tu planta sin costo y te decimos cuáles están en alarma según la ISO 10816-3, con el espectro y la recomendación de cada uno.",
    whatsapp: "Hola, leí la guía de la ISO 10816-3. Me interesa la medición sin costo de tres equipos de mi planta.",
    interes: "Análisis de Vibraciones Mecánicas",
  },
  "diferencia-entre-desbalance-y-desalineacion": {
    etiqueta: "En sitio",
    titulo: "¿Un equipo vibra de más?",
    texto: "Lo medimos, te decimos si es desbalance o desalineación y lo corregimos en sitio, sin desmontar, con la vibración medida antes y después.",
    whatsapp: "Hola, leí la guía de desbalance y desalineación. Tengo un equipo que vibra de más y quiero que lo revisen.",
    interes: "Alineación y Balanceo",
  },
  "nom-022-stps-2015-que-pide-sobre-tierras-fisicas-y-pararrayos": {
    etiqueta: "Antes de la auditoría",
    titulo: "Revisamos tu sistema de tierras antes de que llegue la STPS",
    texto: "Medición de resistencia y continuidad conforme a la NOM-022-STPS-2015, con el informe que acredita el cumplimiento en la inspección.",
    whatsapp: "Hola, leí la guía de la NOM-022. Quiero revisar el sistema de tierras de mi planta antes de la auditoría.",
    interes: "Tierras Físicas",
  },
  "valor-de-resistencia-de-tierra-fisica-cuanto-debe-medir": {
    etiqueta: "Antes de la auditoría",
    titulo: "¿Tu tierra sale alta o no sabes cuánto mide?",
    texto: "La medimos conforme a la NOM-022, te decimos si cumple y, si no, qué corregir para que pase la inspección de la STPS.",
    whatsapp: "Hola, leí la guía del valor de resistencia de tierra. Quiero medir el sistema de tierras de mi planta.",
    interes: "Tierras Físicas",
  },
  "tabla-neta-termografia-como-se-califica-un-punto-caliente": {
    etiqueta: "Informe en 2 días",
    titulo: "Te decimos qué puntos calientes atender primero",
    texto: "Inspección termográfica de tus tableros con la planta operando, cada hallazgo calificado con la tabla NETA y el informe en dos días hábiles.",
    whatsapp: "Hola, leí la guía de la tabla NETA. Quiero una inspección termográfica de los tableros de mi planta.",
    interes: "Termografía Infrarroja",
  },
  "termografia-industrial-una-herramienta-clave-para-el-mantenimiento-predictivo": {
    etiqueta: "Informe en 2 días",
    titulo: "¿Quieres ver qué se calienta en tu planta?",
    texto: "Inspección termográfica de tableros, motores y subestación con la planta operando, y el informe con cada hallazgo calificado en dos días hábiles.",
    whatsapp: "Hola, leí la guía de termografía industrial. Quiero una inspección termográfica para mi planta.",
    interes: "Termografía Infrarroja",
  },
  "importancia-del-ppciem-y-que-pasa-si-no-cumples": {
    etiqueta: "Cumplimiento ASEA",
    titulo: "¿Tu PPCIEM está al día?",
    texto: "Te ayudamos a armar o actualizar el programa de detección de fugas de metano antes de que lo pida la ASEA, con la detección en campo incluida.",
    whatsapp: "Hola, leí la guía del PPCIEM. Quiero ayuda para armar o actualizar el PPCIEM de mi instalación.",
    interes: "Detección de Gas",
  },
};

/** Por servicio, para las guías sin oferta propia. */
const POR_SERVICIO: Record<string, OfertaGuia> = {
  "/servicios/monitoreo-condicion/vibraciones-mecanicas": {
    etiqueta: "Sin costo",
    titulo: "¿Quieres saber cómo están tus equipos?",
    texto: "Medimos tres equipos de tu planta sin costo y te decimos cuáles están en alarma, con el espectro y la recomendación de cada uno.",
    whatsapp: "Hola, leí una guía de vibraciones. Me interesa la medición sin costo de tres equipos de mi planta.",
    interes: "Análisis de Vibraciones Mecánicas",
  },
  "/servicios/monitoreo-condicion/alineacion-balanceo": {
    etiqueta: "En sitio",
    titulo: "¿Un equipo vibra de más?",
    texto: "Lo medimos y lo alineamos o balanceamos en sitio, sin desmontar, con la vibración medida antes y después.",
    whatsapp: "Hola, leí una guía de alineación y balanceo. Tengo un equipo que vibra de más y quiero que lo revisen.",
    interes: "Alineación y Balanceo",
  },
  "/servicios/monitoreo-condicion/termografia-infrarroja": {
    etiqueta: "Informe en 2 días",
    titulo: "Te decimos qué puntos calientes atender primero",
    texto: "Inspección termográfica de tus tableros y motores con la planta operando y el informe en dos días hábiles.",
    whatsapp: "Hola, leí una guía de termografía. Quiero una inspección termográfica para mi planta.",
    interes: "Termografía Infrarroja",
  },
  "/servicios/monitoreo-condicion/tierras-fisicas": {
    etiqueta: "Antes de la auditoría",
    titulo: "Revisamos tu sistema de tierras antes de que llegue la STPS",
    texto: "Medición conforme a la NOM-022-STPS-2015 con el informe que acredita el cumplimiento.",
    whatsapp: "Hola, leí una guía de tierras físicas. Quiero revisar el sistema de tierras de mi planta.",
    interes: "Tierras Físicas",
  },
  "/servicios/monitoreo-condicion/analisis-de-ultrasonido": {
    etiqueta: "En una visita",
    titulo: "¿Cuánto aire comprimido se te está fugando?",
    texto: "Recorremos tu red de aire con ultrasonido, ubicamos cada fuga y te decimos cuánto cuesta y en qué orden repararlas.",
    whatsapp: "Hola, leí una guía de ultrasonido. Quiero una inspección de fugas de aire comprimido en mi planta.",
    interes: "Análisis de Ultrasonido",
  },
  "/servicios/monitoreo-condicion/analisis-de-aceite": {
    etiqueta: "Por muestra",
    titulo: "¿Sabes cómo está el aceite de tus equipos críticos?",
    texto: "Tomamos la muestra en campo, la analizamos y te decimos si el lubricante y la máquina están bien o qué está empezando a fallar.",
    whatsapp: "Hola, leí una guía de análisis de aceite. Quiero analizar el aceite de mis equipos críticos.",
    interes: "Análisis de Aceite",
  },
  "/servicios/monitoreo-condicion/arco-electrico": {
    etiqueta: "Cumplimiento NOM-029",
    titulo: "¿Tus tableros ya tienen su etiqueta de arco?",
    texto: "Calculamos la energía incidente de cada tablero y entregamos las etiquetas y el EPP que pide la NOM-029-STPS.",
    whatsapp: "Hola, leí una guía de arco eléctrico. Quiero el estudio de arco eléctrico para mis tableros.",
    interes: "Estudios de Arco Eléctrico",
  },
  "/servicios/monitoreo-condicion/calidad-de-energia": {
    etiqueta: "Código de Red",
    titulo: "¿Te está cobrando CFE por factor de potencia o armónicos?",
    texto: "Medimos la calidad de la energía en tu acometida y te decimos qué corregir para cumplir el Código de Red y dejar de pagar penalizaciones.",
    whatsapp: "Hola, leí una guía de calidad de energía. Quiero un estudio de calidad de energía para mi planta.",
    interes: "Análisis de Calidad de Energía",
  },
  "/servicios/deteccion-gas": {
    etiqueta: "Cumplimiento ASEA",
    titulo: "¿Tu PPCIEM está al día?",
    texto: "Te ayudamos a armar o actualizar el programa de detección de fugas de metano, con la detección en campo incluida.",
    whatsapp: "Hola, leí una guía sobre el PPCIEM. Quiero ayuda con el PPCIEM de mi instalación.",
    interes: "Detección de Gas",
  },
  "/servicios/monitoreo-continuo/camaras-termicas": {
    etiqueta: "Vigilancia 24 horas",
    titulo: "¿Hay un punto de tu planta donde un incendio no da tiempo?",
    texto: "Te proponemos dónde conviene una cámara térmica fija y qué avisa, con una visita sin costo para ubicarlas.",
    whatsapp: "Hola, leí una guía de cámaras térmicas. Quiero una propuesta de cámaras térmicas fijas para mi planta.",
    interes: "Proyectos de Cámaras Térmicas",
  },
  "/servicios/monitoreo-continuo/sensores-vibracion": {
    etiqueta: "Vigilancia 24 horas",
    titulo: "¿Qué equipos no pueden esperar a la siguiente ruta?",
    texto: "Te proponemos qué equipos conviene vigilar con sensores en línea y qué te avisarían, con una visita sin costo.",
    whatsapp: "Hola, leí una guía de sensores de vibración. Quiero una propuesta de monitoreo en línea para mis equipos críticos.",
    interes: "Sensores de Vibración",
  },
  "/servicios/monitoreo-continuo/sensores-acusticos": {
    etiqueta: "Vigilancia 24 horas",
    titulo: "¿Tus transformadores avisan antes de fallar?",
    texto: "Te proponemos cómo vigilar en línea tus transformadores críticos con sensores acústicos y gases, con una visita sin costo.",
    whatsapp: "Hola, leí una guía de transformadores. Quiero una propuesta de monitoreo en línea para mis transformadores.",
    interes: "Sensores Acústicos",
  },
  "/servicios/monitoreo-continuo/dga-en-linea": {
    etiqueta: "Vigilancia 24 horas",
    titulo: "¿Tus transformadores avisan antes de fallar?",
    texto: "Te proponemos cómo vigilar en línea los gases de tus transformadores críticos, con una visita sin costo.",
    whatsapp: "Hola, leí una guía de gases del transformador. Quiero una propuesta de DGA en línea para mis transformadores.",
    interes: "DGA en Línea",
  },
  "/servicios/seguridad-de-ductos": {
    etiqueta: "Vigilancia 24 horas",
    titulo: "¿Sabrías hoy si alguien tocó tu ducto?",
    texto: "Te proponemos cómo vigilar el derecho de vía con sensores que avisan de fugas, excavaciones y tomas clandestinas.",
    whatsapp: "Hola, leí una guía de ductos. Quiero una propuesta de vigilancia para mi ducto.",
    interes: "Seguridad de Ductos",
  },
  "/servicios/diagnostico-situacional": {
    etiqueta: "Para empezar",
    titulo: "¿No sabes por dónde empezar con el predictivo?",
    texto: "Levantamos tus equipos, calificamos su criticidad y te damos la hoja de ruta de qué medir, cada cuánto y con qué técnica.",
    whatsapp: "Hola, leí una guía de mantenimiento predictivo. Quiero saber por dónde empezar un programa en mi planta.",
    interes: "Diagnóstico Situacional",
  },
  "/servicios/diapsa-start": {
    etiqueta: "Para empezar",
    titulo: "¿Quieres arrancar el predictivo sin comprar equipo?",
    texto: "Con DIAPSA START medimos tus equipos críticos en rutas periódicas y te entregamos el estado de cada uno en IDAP.",
    whatsapp: "Hola, leí una guía de mantenimiento predictivo. Quiero información de DIAPSA START para mi planta.",
    interes: "DIAPSA START",
  },
};

/** La oferta de una guía, por su slug; null si no hay servicio relacionado. */
export function ofertaDeGuia(slug: string): OfertaGuia | null {
  if (POR_GUIA[slug]) return POR_GUIA[slug];
  const servicio = getServicioPorArticulo(slug);
  if (!servicio) return null;
  return POR_SERVICIO[servicio.href] ?? null;
}

export function enlaceWhatsApp(o: OfertaGuia) {
  return `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(o.whatsapp)}`;
}

export function enlaceFormulario(o: OfertaGuia) {
  return enlaceContacto(o.motivo ?? "servicios", o.interes);
}
