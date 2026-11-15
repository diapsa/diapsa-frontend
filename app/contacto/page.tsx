import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactFormGeneral from "@/components/organisms/ContactFormGeneral";
import ContactoWhatsApp from "@/components/organisms/ContactoWhatsApp";
import PageHeader from "@/components/organisms/PageHeader";
import { SITE_CONFIG } from "@/lib/constants";
import clientes from "@/data/clients.json";
import presencia from "@/data/presencia-mexico.json";

export const metadata: Metadata = {
    title: "Contacto: diagnóstico sin costo",
    description: "Escríbenos por WhatsApp, teléfono o formulario y un especialista en mantenimiento predictivo te responde en un día hábil. Diagnóstico sin costo.",
    alternates: {
        canonical: "/contacto",
    },
    openGraph: {
        title: "Contacto — Grupo DIAPSA",
        description: "Habla con un especialista en mantenimiento predictivo. Respuesta en un día hábil.",
        url: "/contacto",
        type: "website",
    },
};

/*
 * Página de contacto (Emiliano, 2026-10-06). Las tres cifras de antes
 * ("+500 plantas", "98 % de satisfacción", "24 h") no salían de ningún dato
 * y no aparecían en otra página; se sustituyen por las que ya usa todo el
 * sitio (años, estados y países de data/presencia-mexico.json) y por los
 * logotipos de clientes. Se agregan WhatsApp y la dirección con "Cómo
 * llegar" a la lista de contacto, la tira de qué pasa después de enviar y
 * el selector de motivo en el formulario. Sin guiones medios en los textos.
 *
 * WhatsApp primero (Emiliano, 2026-11-15). Del 16 de octubre al 12 de
 * noviembre la página tuvo 4 clics a WhatsApp y 0 formularios enviados; en
 * Clarity el 25 % se regresa enseguida (el sitio promedia 4 %) y el 25 % hace
 * clic en algo que no es enlace (promedio 12 %). Cambios: WhatsApp sale de la
 * lista y va solo, arriba de todo y visible sin scroll en celular, con el
 * mensaje ya escrito según ?motivo= e ?interes= (ContactoWhatsApp, que lee la
 * URL en el cliente para que la página siga estática). El formulario queda
 * como segunda opción y en celular va antes que teléfono, correo y dirección.
 * La etiqueta de arriba deja de verse como botón y los logotipos dejan de
 * reaccionar al pasar el mouse (parecían enlaces); abajo va un enlace real a
 * los casos de éxito.
 */

const DIRECCION = "C. Alfalfa 128, Las Praderas, 25295 Saltillo, Coah.";
const MAPA = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Grupo DIAPSA, ${DIRECCION}`)}`;
const TELEFONO_HREF = `tel:+${SITE_CONFIG.contact.whatsapp}`;
const TELEFONO = "+52 (81) 4590-3792";
const CORREO = "info@grupodiapsa.com";

const ESTADOS = presencia.estados.filter((e) => e.trabajamos).length;
const PAISES = presencia.internacional.length + 1;
const CIFRAS = [
    { valor: "+20", etiqueta: "años midiendo equipos" },
    { valor: String(ESTADOS), etiqueta: "estados de México" },
    { valor: String(PAISES), etiqueta: "países" },
];

const LOGOS = (clientes.clients as { name: string; logo: string | null }[]).filter(
    (c): c is { name: string; logo: string } => Boolean(c.logo),
);

const ARGUMENTOS = [
    {
        icono: "M13 10V3L4 14h7v7l9-11h-7z",
        titulo: "Respuesta en un día hábil",
        texto: "Un especialista revisa tu caso y te contesta por el medio que dejaste, no un formulario automático.",
    },
    {
        icono: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
        titulo: "La técnica correcta para cada activo",
        texto: "Vibraciones, termografía, ultrasonido, aceite, estudios eléctricos y monitoreo en línea, en ruta o instalado en tus equipos críticos.",
    },
    {
        icono: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        titulo: "Servicio o equipo, según lo que necesites",
        texto: "Programas completos de monitoreo o la venta de cámaras acústicas, cámaras térmicas y sensores de vibración, con la asesoría de quien los usa a diario.",
    },
    {
        icono: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
        titulo: "Especialistas certificados",
        texto: "Analistas Categoría 3 que trabajan en manufactura, energía y proceso continuo, con más de 20 años en campo.",
    },
];

const DESPUES = [
    { titulo: "Te respondemos", texto: "En un día hábil, por el teléfono o el correo que dejaste." },
    { titulo: "Entendemos tu caso", texto: "Una llamada corta para saber qué equipos tienes, qué te preocupa y dónde está la planta." },
    { titulo: "Recibes una propuesta", texto: "Con alcance, tiempos y precio, de un servicio, de un equipo o de un curso." },
];

function Icono({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
    return (
        <svg className={`${className} shrink-0 text-secondary`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
        </svg>
    );
}

export default function ContactPage() {
    return (
        <main className="bg-white">
            <PageHeader
                title="Hablemos de tu planta"
                subtitle="Un diagnóstico a tiempo puede evitar una parada de producción. Cuéntanos tu caso."
                breadcrumbs={[
                    { label: "Inicio", link: "/" },
                    { label: "Contacto", link: "/contacto" },
                ]}
            />

            {/* Primera opción: WhatsApp, pegado al encabezado para que en celular
                se vea sin scroll (2026-11-15, 0 formularios en 28 días) */}
            <section className="w-full bg-primary pt-6 lg:pt-10" aria-label="Escríbenos por WhatsApp">
                <div className="max-w-7xl mx-auto px-6">
                    <ContactoWhatsApp />
                </div>
            </section>

            {/* Sección principal, en oscuro */}
            <section className="w-full bg-primary pt-10 pb-16 lg:pt-14 lg:pb-24 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-100 h-100 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Izquierda: los demás canales directos. En celular van después
                            del formulario (order-2) para que este quede como segunda opción */}
                        <div className="order-2 flex flex-col gap-8 lg:order-1 lg:sticky lg:top-28">
                            {/* Antes era una pastilla con borde que parecía botón (clics en falso) */}
                            <p className="text-secondary text-xs font-semibold tracking-widest uppercase">
                                Otras formas de hablar con nosotros
                            </p>

                            <div>
                                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                                    LLÁMANOS, ESCRÍBENOS <span className="text-secondary">O VISÍTANOS</span>
                                </h2>
                                <p className="text-justify text-white/70 text-lg leading-relaxed">
                                    Cada hora de paro no programado cuesta más que un año de mantenimiento predictivo. Cuéntanos qué equipos tienes y qué te preocupa, por teléfono, por correo o en nuestra oficina de Saltillo, y un especialista te responde en un día hábil.
                                </p>
                            </div>

                            {/* Canales directos, en grande; cada tarjeta es un enlace (tel:, mailto: y mapa) */}
                            <ul className="grid grid-cols-1 gap-4">
                                <li>
                                    <a href={TELEFONO_HREF} className="flex h-full items-center gap-4 rounded-sm bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:ring-secondary/60">
                                        <Icono className="h-9 w-9" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        <span className="min-w-0">
                                            <span className="block text-xs font-bold uppercase tracking-widest text-secondary">Llámanos</span>
                                            <span className="block text-lg font-extrabold leading-tight text-white lg:text-xl">{TELEFONO}</span>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${CORREO}`} className="flex h-full items-center gap-4 rounded-sm bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:ring-secondary/60">
                                        <Icono className="h-9 w-9" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        <span className="min-w-0">
                                            <span className="block text-xs font-bold uppercase tracking-widest text-secondary">Correo</span>
                                            <span className="block text-lg font-extrabold leading-tight text-white lg:text-xl">{CORREO}</span>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href={MAPA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-sm bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:ring-secondary/60">
                                        <Icono className="h-9 w-9" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <span className="min-w-0">
                                            <span className="block text-xs font-bold uppercase tracking-widest text-secondary">Visítanos en Saltillo</span>
                                            <span className="block text-base font-extrabold leading-snug text-white lg:text-lg">{DIRECCION}</span>
                                            <span className="block text-sm font-bold text-secondary">Cómo llegar</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>

                            {/* Cifras ya publicadas en el resto del sitio */}
                            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                                {CIFRAS.map((c) => (
                                    <div key={c.etiqueta} className="text-center">
                                        <span className="block text-2xl font-extrabold text-secondary">{c.valor}</span>
                                        <span className="block text-xs uppercase tracking-wider text-white/60 mt-1">{c.etiqueta}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Argumentos, compactos */}
                            <ul className="flex flex-col gap-2 border-t border-white/10 pt-6">
                                {ARGUMENTOS.map((a) => (
                                    <li key={a.titulo} className="flex items-start gap-3">
                                        <span className="mt-0.5"><Icono className="w-4 h-4" d={a.icono} /></span>
                                        <p className="text-justify text-sm leading-relaxed text-white/60">
                                            <span className="font-bold text-white">{a.titulo}. </span>
                                            {a.texto}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Derecha: formulario y qué pasa después. Segunda opción después de
                            WhatsApp (2026-11-15); el texto dice para qué conviene escribir aquí */}
                        <div className="order-1 flex flex-col gap-6 lg:order-2">
                            <div className="bg-white p-8 space-y-6 shadow-2xl shadow-secondary/50 ring-1 ring-secondary rounded-sm">
                                <div className="mb-6 border-b border-gray-100 pb-5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-secondary-dark">Segunda opción: el formulario</p>
                                    <h3 className="mt-1 text-xl font-extrabold text-primary">Mándanos el detalle por escrito</h3>
                                    <p className="text-justify text-tertiary text-sm mt-1">Conviene cuando quieres enviar el detalle técnico de tus equipos (cuáles son, cuántos y qué síntomas tienen) o pedir una cotización formal. Un especialista te contesta en un día hábil.</p>
                                </div>
                                <ContactFormGeneral />
                            </div>

                            <div className="rounded-sm bg-white/10 p-6 ring-1 ring-white/15">
                                <p className="text-xs uppercase tracking-widest text-secondary font-semibold">Qué pasa después de enviar</p>
                                <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    {DESPUES.map((d, i) => (
                                        <li key={d.titulo} className="flex gap-3 sm:flex-col sm:gap-2">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-extrabold text-primary" aria-hidden="true">{i + 1}</span>
                                            <span>
                                                <span className="block text-sm font-bold text-white">{d.titulo}</span>
                                                <span className="block text-justify text-sm leading-relaxed text-white/60">{d.texto}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quién ya confía */}
            <section className="w-full bg-white py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-semibold uppercase tracking-widest text-tertiary">Plantas que ya miden con nosotros</p>
                    <ul className="mt-8 grid grid-cols-3 items-center gap-x-8 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
                        {LOGOS.map((c) => (
                            <li key={c.name} className="flex items-center justify-center">
                                {/* Sin efecto al pasar el mouse: parecían enlaces y no lo son (2026-11-15) */}
                                <Image src={c.logo} alt={c.name} width={160} height={64} className="h-10 w-auto max-w-[9rem] object-contain brightness-0 opacity-60" />
                            </li>
                        ))}
                    </ul>
                    <p className="mt-10 text-center">
                        <Link href="/casos-exito" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary underline decoration-secondary decoration-2 underline-offset-4 hover:text-secondary-dark">
                            Ver casos de éxito
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
