"use client";

import { useSyncExternalStore } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { esMotivo, type Motivo } from "@/lib/contacto-opciones";

/**
 * ContactoWhatsApp
 * WhatsApp como primera opción de /contacto (Emiliano, 2026-11-15).
 *
 * Por qué existe: del 16 de octubre al 12 de noviembre de 2026 la página tuvo
 * 4 clics a WhatsApp y 0 formularios enviados. En Clarity el 25 % se regresa
 * enseguida (el sitio promedia 4 %). WhatsApp va arriba del formulario y
 * visible sin scroll en celular, con el mensaje ya escrito según lo que la
 * persona venía viendo (las guías y fichas llegan con ?motivo= e ?interes=).
 *
 * La URL se lee en el cliente con useSyncExternalStore, como en
 * TiendaProductos: en el servidor sale el mensaje genérico y la página sigue
 * siendo estática (ISR). Al hidratar, React cambia al mensaje de la URL.
 *
 * El clic lo cuenta el oyente global de components/atoms/ClicsWhatsApp.tsx
 * (montado en app/layout.tsx) porque el enlace es wa.me; la etiqueta que llega
 * al CMS es el aria-label, fija a propósito para que no se parta por mensaje.
 */

const NUMERO = SITE_CONFIG.contact.whatsapp;
const TELEFONO = "+52 (81) 4590-3792";

// Mismo texto que el botón flotante (WhatsAppButton): corto y en el lenguaje
// del comprador.
const GENERICO = "Hola, necesito información para mi planta.";

const suscribir = () => () => {};
const leerUrl = () => window.location.search;
const leerUrlServidor = () => "";

/**
 * El interés viene de la URL y lo puede escribir cualquiera: se quitan
 * caracteres de control y se corta a 80 para que el mensaje siga siendo corto.
 * Las opciones de cursos usan " · " ("Vibraciones · Categoría I"); en un
 * mensaje se lee mejor con coma.
 */
function limpiarInteres(v: string | null): string {
    if (!v) return "";
    const limpio = v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
    return limpio.slice(0, 80).replace(/ · /g, ", ");
}

function mensajeWhatsApp(motivo: Motivo | null, interes: string): string {
    switch (motivo) {
        case "servicios":
            return interes ? `Hola, quiero cotizar ${interes}.` : "Hola, quiero cotizar un servicio para mi planta.";
        case "equipos":
            return interes ? `Hola, quiero cotizar ${interes}.` : "Hola, quiero cotizar un equipo.";
        case "cursos":
            return interes ? `Hola, quiero información de ${interes}.` : "Hola, quiero información de sus cursos.";
        case "proveedor":
            return "Hola, soy proveedor y quiero presentarles lo que ofrezco.";
        default:
            return interes ? `Hola, quiero información de ${interes}.` : GENERICO;
    }
}

export default function ContactoWhatsApp() {
    const busqueda = useSyncExternalStore(suscribir, leerUrl, leerUrlServidor);
    const q = new URLSearchParams(busqueda);
    const m = q.get("motivo");
    const mensaje = mensajeWhatsApp(esMotivo(m) ? m : null, limpiarInteres(q.get("interes")));
    const href = `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="La forma más rápida: escríbenos por WhatsApp"
            aria-describedby="contacto-whatsapp-mensaje"
            className="group flex flex-col gap-4 rounded-sm bg-[#25D366] p-5 text-primary shadow-lg transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-6 lg:p-7"
        >
            <span className="flex items-center gap-4 sm:flex-1">
                <svg className="h-11 w-11 shrink-0 lg:h-14 lg:w-14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-widest text-primary/70">La forma más rápida</span>
                    <span className="block text-2xl font-extrabold leading-tight lg:text-3xl">Escríbenos por WhatsApp</span>
                    <span className="block text-base font-bold text-primary/80 lg:text-lg">{TELEFONO}</span>
                </span>
            </span>

            <span className="flex flex-col gap-3 sm:max-w-sm sm:items-end">
                <span id="contacto-whatsapp-mensaje" className="block rounded-sm bg-white/70 px-3 py-2 text-sm leading-snug text-primary">
                    <span className="font-semibold">Mensaje listo para enviar: </span>
                    “{mensaje}”
                </span>
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-xs bg-primary px-5 py-3 text-sm font-bold text-white transition-colors group-hover:bg-white group-hover:text-primary sm:w-auto">
                    Abrir WhatsApp
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </span>
            </span>
        </a>
    );
}
