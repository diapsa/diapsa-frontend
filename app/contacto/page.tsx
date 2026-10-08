import type { Metadata } from "next";
import Image from "next/image";
import ContactFormGeneral from "@/components/organisms/ContactFormGeneral";
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
 */

const DIRECCION = "C. Alfalfa 128, Las Praderas, 25295 Saltillo, Coah.";
const MAPA = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Grupo DIAPSA, ${DIRECCION}`)}`;
const WHATSAPP = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent("Hola, vengo del sitio de DIAPSA y quiero información.")}`;
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

            {/* Sección principal, en oscuro */}
            <section className="w-full bg-primary py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-100 h-100 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Izquierda: los canales directos como protagonistas, al mismo
                            nivel que el formulario (Emiliano, 2026-10-06: "es uno u otro") */}
                        <div className="flex flex-col gap-8 lg:sticky lg:top-28">
                            <span className="inline-block self-start text-secondary text-xs font-semibold tracking-widest uppercase border border-secondary/40 rounded-full px-3 py-1 bg-secondary/10">
                                Habla con un especialista
                            </span>

                            <div>
                                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                                    ESCRÍBENOS POR DONDE <span className="text-secondary">TE QUEDE MÁS CERCA</span>
                                </h2>
                                <p className="text-justify text-white/70 text-lg leading-relaxed">
                                    Cada hora de paro no programado cuesta más que un año de mantenimiento predictivo. Cuéntanos qué equipos tienes y qué te preocupa, por WhatsApp, por teléfono, por correo o en el formulario, y un especialista te responde en un día hábil.
                                </p>
                            </div>

                            {/* Canales directos, en grande */}
                            <ul className="grid grid-cols-1 gap-4">
                                <li>
                                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 rounded-sm bg-[#25D366] p-5 text-primary shadow-lg transition-transform hover:-translate-y-0.5 lg:p-6">
                                        <svg className="h-12 w-12 shrink-0 lg:h-14 lg:w-14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        <span className="min-w-0">
                                            <span className="block text-xs font-bold uppercase tracking-widest text-primary/70">WhatsApp, el más rápido</span>
                                            <span className="block text-2xl font-extrabold leading-tight lg:text-3xl">{TELEFONO}</span>
                                            <span className="block text-sm font-semibold text-primary/80">Escríbenos y te contesta un especialista</span>
                                        </span>
                                    </a>
                                </li>
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

                        {/* Derecha: formulario y qué pasa después */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white p-8 space-y-6 shadow-2xl shadow-secondary/50 ring-1 ring-secondary rounded-sm">
                                <div className="mb-6 border-b border-gray-100 pb-5">
                                    <h3 className="text-xl font-extrabold text-primary">Cuéntanos tu caso</h3>
                                    <p className="text-tertiary text-sm mt-1">Completa el formulario y un especialista te contactará en un día hábil.</p>
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
                                <Image src={c.logo} alt={c.name} width={160} height={64} className="h-10 w-auto max-w-[9rem] object-contain brightness-0 opacity-60 transition-opacity hover:opacity-100" />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}
