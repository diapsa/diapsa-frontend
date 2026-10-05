import diplomado from "@/data/diplomado.json";

/**
 * Preguntas frecuentes del diplomado (Emiliano, 2026-10-04): lo que se
 * pregunta antes de pagar un programa de 60 horas. Las respuestas se
 * limitan a lo que ya afirma la página (fases sueltas, 85 por ciento de
 * asistencia, constancia por fase, certificado al aprobar, países). Lo que
 * DIAPSA no ha confirmado (grabaciones, costo, formas de pago) se contesta
 * remitiendo al contacto, sin inventar.
 */

export type FaqDiplomado = { question: string; answer: string };

export const FAQ_DIPLOMADO: FaqDiplomado[] = [
  {
    question: "¿Puedo tomar solo algunas fases?",
    answer: "Sí. El diplomado se puede cursar completo o por fases sueltas, según lo que necesite tu puesto. Cada fase tiene su propio temario y entrega su constancia de participación. Para recibir el certificado del diplomado sí hay que aprobar las cinco fases.",
  },
  {
    question: "¿Las sesiones son en vivo o grabadas?",
    answer: "Las 17 sesiones son en vivo, por videoconferencia, para que preguntes directo al especialista y participes en los paneles y los casos. Si necesitas saber cómo se maneja una ausencia o el acceso al material de una sesión, pregúntanos al inscribirte.",
  },
  {
    question: "¿Qué constancia recibo?",
    answer: `Una constancia por cada fase que completes y, al aprobar el diplomado, el certificado con valor curricular. Para aprobarlo se pide ${diplomado.requisitos[0].toLowerCase()}, las cinco constancias de fase y la entrega del proyecto final.`,
  },
  {
    question: "¿Necesito dominar las técnicas de monitoreo?",
    answer: "No. El diplomado está pensado para quien gestiona el mantenimiento: la fase 2 recorre las técnicas (vibraciones, ultrasonido, aceite, termografía y análisis eléctricos) para que sepas qué aporta cada una, qué pedirle a un analista y cómo leer sus informes. Si lo que buscas es operar una técnica y certificarte, eso se cubre en los cursos de certificación de cada técnica.",
  },
  {
    question: "¿Sirve como certificación en vibraciones o termografía?",
    answer: "No sustituye a la certificación por categoría de la norma ISO 18436, que se obtiene en los cursos de certificación de cada técnica. El diplomado forma el criterio de gestión: confiabilidad desde el diseño, estrategia de mantenimiento, indicadores y uso de la información de las técnicas.",
  },
  {
    question: "¿Desde qué países puedo tomarlo?",
    answer: `Es virtual y en vivo, y ya se ha impartido para ${diplomado.paises}. Los horarios se ajustan a los husos de los grupos inscritos. Si estás en otro país, escríbenos y lo revisamos.`,
  },
  {
    question: "¿Cuándo empieza la próxima generación y cuánto cuesta?",
    answer: "Las fechas y la inversión cambian por generación, y hay precio por fase y por el diplomado completo. Déjanos tus datos en el formulario y te respondemos con el calendario, el costo y la forma de inscripción, o descarga antes el brochure con el programa completo.",
  },
];
