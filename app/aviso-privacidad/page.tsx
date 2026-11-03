import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/organisms/PageHeader";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Aviso de privacidad integral.
 *
 * Por qué existe: todos los formularios del sitio (contacto, descargas,
 * cursos, IDAP, expo) y el pie de página enlazan a /aviso-privacidad y la
 * ruta daba 404 (docs/preguntas-para-diapsa.md, punto 24). Sigue los
 * elementos que pide la Ley Federal de Protección de Datos Personales en
 * Posesión de los Particulares: responsable, datos, finalidades, negativa,
 * transferencias, derechos ARCO, revocación, tecnologías de rastreo y cambios.
 *
 * La razón social y el RFC están por confirmar con DIAPSA; mientras, el
 * responsable se identifica con el nombre comercial y el domicilio que el
 * sitio publica en contacto.
 */

const ACTUALIZACION = "3 de noviembre de 2026";
const DOMICILIO = "C. Alfalfa 128, colonia Las Praderas, C.P. 25295, Saltillo, Coahuila, México";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo trata Grupo DIAPSA los datos personales que recibe por su sitio, sus formularios, WhatsApp y correo, y cómo ejercer tus derechos ARCO.",
  alternates: { canonical: "/aviso-privacidad" },
};

type Seccion = { titulo: string; parrafos: React.ReactNode[] };

const correo = SITE_CONFIG.contact.email;
const Correo = () => (
  <a href={`mailto:${correo}`} className="font-semibold text-secondary hover:underline">
    {correo}
  </a>
);

const SECCIONES: Seccion[] = [
  {
    titulo: "Quién es responsable de tus datos",
    parrafos: [
      <>
        Grupo DIAPSA, con domicilio en {DOMICILIO}, es responsable del tratamiento de los datos personales que nos
        proporcionas por este sitio, por WhatsApp, por correo electrónico o en eventos. Para cualquier asunto relacionado
        con tus datos puedes escribirnos a <Correo /> o llamarnos al {SITE_CONFIG.contact.phone}.
      </>,
    ],
  },
  {
    titulo: "Qué datos recabamos",
    parrafos: [
      "Datos de identificación y contacto: nombre, correo electrónico, teléfono o WhatsApp, empresa, puesto, ciudad y país. Datos sobre tu solicitud: el servicio, curso o tema que te interesa, la industria de tu empresa y el mensaje que nos escribes. Datos de navegación: páginas visitadas, origen de la visita y parámetros de campaña, dispositivo, navegador y la forma en que recorres el sitio.",
      "No te pedimos datos personales sensibles, como los de salud, origen étnico, creencias o datos biométricos, ni datos financieros o patrimoniales. Te pedimos no incluirlos en tus mensajes.",
    ],
  },
  {
    titulo: "Para qué usamos tus datos",
    parrafos: [
      "Usamos tus datos para estas finalidades, que son necesarias para la relación que nos pides: atender tu solicitud de información, cotización, servicio, curso o clínica técnica; contactarte por el medio que elegiste para darle seguimiento; enviarte el documento que pediste descargar, como un temario o un folleto; inscribirte y darte acceso a cursos y clínicas, y emitir tus constancias; preparar, ejecutar y facturar los servicios que contrates; y cumplir obligaciones legales.",
      "Además, si no te opones, los usamos para estas finalidades secundarias: enviarte información sobre servicios, cursos, guías técnicas y eventos de Grupo DIAPSA; invitarte a webinars y clínicas; y elaborar estadísticas internas para mejorar el sitio y nuestros servicios.",
    ],
  },
  {
    titulo: "Cómo negarte a las finalidades secundarias",
    parrafos: [
      <>
        Si no quieres que usemos tus datos para las finalidades secundarias, escríbenos en cualquier momento a <Correo />{" "}
        con el asunto «No enviar promociones». También puedes darte de baja desde el enlace que trae cada correo
        informativo. Negarte no afecta la atención de tu solicitud ni los servicios que contrates con nosotros.
      </>,
    ],
  },
  {
    titulo: "Con quién compartimos tus datos",
    parrafos: [
      "No vendemos ni cedemos tus datos. Los compartimos solo con proveedores que nos prestan servicios y que los tratan por cuenta nuestra y bajo nuestras instrucciones, como alojamiento del sitio y de nuestro sistema de gestión, correo electrónico, mensajería, analítica web y herramientas de apoyo para redactar y organizar respuestas. Algunos de estos proveedores pueden estar fuera de México. Estas remisiones no requieren tu consentimiento.",
      "Fuera de eso, solo transferiríamos tus datos cuando la ley lo exija o lo ordene una autoridad competente, o cuando sea necesario para cumplir un contrato celebrado en tu interés, casos en que la ley tampoco exige tu consentimiento. Si alguna vez necesitáramos transferirlos para otra finalidad, te pediremos antes tu autorización.",
    ],
  },
  {
    titulo: "Cómo ejercer tus derechos ARCO",
    parrafos: [
      "Tienes derecho a saber qué datos tuyos tenemos y para qué los usamos (acceso), a pedir que los corrijamos si están desactualizados o son inexactos (rectificación), a pedir que los eliminemos de nuestros registros cuando ya no sean necesarios (cancelación) y a oponerte a que los usemos para fines específicos (oposición).",
      <>
        Para ejercerlos, envía una solicitud a <Correo /> con tu nombre, un medio para responderte, una copia de tu
        identificación oficial o, si actúas en nombre de alguien más, el documento que acredite tu representación, la
        descripción clara de los datos y del derecho que quieres ejercer, y cualquier documento que ayude a localizarlos.
        Te responderemos en un plazo máximo de veinte días hábiles desde que recibamos tu solicitud completa y, si procede,
        la haremos efectiva dentro de los quince días hábiles siguientes.
      </>,
    ],
  },
  {
    titulo: "Cómo revocar tu consentimiento o limitar el uso",
    parrafos: [
      <>
        Puedes revocar el consentimiento que nos diste o pedirnos que limitemos el uso o la divulgación de tus datos con
        una solicitud a <Correo />, con los mismos requisitos y plazos que una solicitud ARCO. Ten en cuenta que, si la
        revocación afecta datos necesarios para un servicio en curso o para una obligación legal, puede que no podamos
        atenderla de inmediato o que debamos concluir esa relación.
      </>,
    ],
  },
  {
    titulo: "Cookies y tecnologías de rastreo",
    parrafos: [
      "El sitio usa cookies y tecnologías similares para funcionar y para medir su uso. Usamos Microsoft Clarity, que registra de forma agregada cómo se recorren las páginas, como clics, desplazamiento y mapas de calor, para encontrar lo que no se entiende y mejorarlo; Clarity oculta los campos de los formularios. También guardamos en tu navegador preferencias simples, como si ya cerraste un aviso, y los parámetros de campaña con que llegaste, para saber qué anuncio o publicación te trajo.",
      "Puedes bloquear o borrar las cookies desde la configuración de tu navegador. El sitio seguirá funcionando, aunque algunos avisos podrían volver a aparecer.",
    ],
  },
  {
    titulo: "Cambios a este aviso",
    parrafos: [
      "Podemos actualizar este aviso por cambios en la ley, en nuestros servicios o en la forma en que tratamos los datos. La versión vigente estará siempre en esta página, con la fecha de su última actualización.",
      "Si consideras que tus derechos no fueron atendidos, puedes acudir a la autoridad en materia de protección de datos personales.",
    ],
  },
];

export default function AvisoPrivacidadPage() {
  return (
    <main>
      <PageHeader title="Aviso de privacidad" subtitle={`Última actualización: ${ACTUALIZACION}`} />
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-justify text-base leading-relaxed text-tertiary lg:text-lg">
            En Grupo DIAPSA cuidamos los datos personales que nos confías. Este aviso explica qué datos recabamos, para qué
            los usamos, con quién los compartimos y cómo puedes ejercer tus derechos, conforme a la Ley Federal de Protección
            de Datos Personales en Posesión de los Particulares.
          </p>

          {SECCIONES.map((s) => (
            <div key={s.titulo} className="mt-10">
              <h2 className="text-xl font-extrabold text-primary lg:text-2xl">{s.titulo}</h2>
              {s.parrafos.map((p, i) => (
                <p key={i} className="mt-4 text-justify text-base leading-relaxed text-tertiary">
                  {p}
                </p>
              ))}
            </div>
          ))}

          <p className="mt-12 border-t border-gray-100 pt-6 text-justify text-sm leading-relaxed text-tertiary">
            ¿Dudas sobre este aviso? Escríbenos a <Correo /> o visita nuestra{" "}
            <Link href="/contacto" className="font-semibold text-secondary hover:underline">
              página de contacto
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
