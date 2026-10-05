/**
 * Preguntas frecuentes de las fichas de curso (Emiliano, 2026-10-04). El CMS
 * no trae FAQs, así que se arman por formato (formación, taller,
 * certificación, curso ejecutivo, especialidad) más tres comunes a todos. Se
 * muestran en la ficha y van como FAQPage a Google solo cuando el CMS no
 * manda las suyas. Las respuestas evitan cifras que DIAPSA no haya
 * confirmado (tamaño de grupo, costo, tipo de constancia).
 */

export type FaqCurso = { question: string; answer: string };

const COMUNES: FaqCurso[] = [
  {
    question: "¿Se puede dar en mi planta?",
    answer: "Sí. Cualquier curso se arma como grupo cerrado para tu equipo, en tu planta o en nuestras instalaciones en Saltillo. En planta, la práctica se hace sobre tus propios equipos, que es donde más se aprende.",
  },
  {
    question: "¿Cuántas personas conviene inscribir?",
    answer: "Trabajamos con grupos chicos, para que todos midan, analicen y pregunten. Al cotizar te decimos el tamaño que conviene según el formato y el equipo disponible.",
  },
  {
    question: "¿Entregan constancia?",
    answer: "Sí. Al terminar recibes la constancia del curso. En los cursos de certificación, el proceso sigue los lineamientos de la norma ISO 18436 por categoría.",
  },
];

const POR_FORMATO: Record<string, FaqCurso[]> = {
  formacion: [
    {
      question: "¿Necesito experiencia previa en la técnica?",
      answer: "No. La formación técnica empieza desde los principios y llega al uso del equipo y la interpretación de resultados. Ayuda tener experiencia en mantenimiento, pero no es requisito.",
    },
    {
      question: "¿Cómo es la práctica?",
      answer: "Primero en pantalla, con casos reales de equipos que hemos inspeccionado, y después con el instrumental, midiendo e interpretando como se hace en planta.",
    },
    {
      question: "¿Me sirve para certificarme después?",
      answer: "Sí. Es la base para presentar la certificación por categoría; cuando cumplas la experiencia que pide la norma, sigues con el curso de certificación de la misma técnica.",
    },
  ],
  practica: [
    {
      question: "¿Qué debo saber antes de tomar el taller?",
      answer: "El taller es para quien ya conoce la técnica y quiere practicarla con casos reales. Si apenas empiezas, conviene primero la formación técnica de la misma técnica.",
    },
    {
      question: "¿Puedo traer mi propio equipo?",
      answer: "Sí, y es lo recomendable: así aprendes con el instrumento que vas a usar en tu planta. Si no tienes, se trabaja con el instrumental de DIAPSA.",
    },
    {
      question: "¿Se trabaja con mis equipos de planta?",
      answer: "Cuando el taller se da en tu planta, sí: se miden tus motores, bombas, tableros o líneas, y los hallazgos se quedan contigo.",
    },
  ],
  certificacion: [
    {
      question: "¿Qué pide cada categoría?",
      answer: "La norma ISO 18436 pide formación y meses de experiencia distintos para cada categoría. Al inscribirte revisamos tu experiencia y te decimos a qué categoría puedes presentarte.",
    },
    {
      question: "¿Hay examen?",
      answer: "Sí. El curso cubre los temas de la norma y termina con el examen de la categoría. Quien lo aprueba recibe su certificación.",
    },
    {
      question: "¿Cuánto dura la certificación?",
      answer: "Conforme a ISO 18436, la certificación se renueva cada cinco años, acreditando que se ha seguido trabajando con la técnica.",
    },
  ],
  gestion: [
    {
      question: "¿Es un curso técnico?",
      answer: "No. Es para quien decide y administra el mantenimiento: explica qué aporta cada técnica, cómo se organiza un programa y cómo se mide su resultado, sin entrar a operar el equipo.",
    },
    {
      question: "¿Para quién es?",
      answer: "Jefes y gerentes de mantenimiento, confiabilidad, producción y compras, y supervisores que necesitan entender lo que reportan sus analistas y proveedores.",
    },
  ],
  especialidad: [
    {
      question: "¿Necesito dominar la técnica?",
      answer: "Sí, al menos la base. La especialidad aplica la técnica a un caso concreto, así que se da por hecho que ya sabes medir e interpretar.",
    },
  ],
};

export function faqsDe(formato?: string): FaqCurso[] {
  return [...(formato ? POR_FORMATO[formato] ?? [] : []), ...COMUNES];
}
