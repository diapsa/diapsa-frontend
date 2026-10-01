"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * AvisoWebinar
 * Aviso en la página de inicio del webinar de Herramientas Predictivas del
 * 6 de octubre de 2026 (Emiliano, 2026-09-30). Era una ventana emergente que
 * tapaba la portada a los 4 segundos; el 2026-10-01 Clarity marcó la portada
 * con solo 16 % de tiempo activo en los mismos días, así que pasó a una
 * tarjeta en la esquina que no tapa la lectura (la de WhatsApp va a la
 * derecha). Una vez cerrada no vuelve a salir en ese navegador y deja de
 * mostrarse sola cuando el webinar termina.
 */

const CLAVE = "aviso-webinar-2026-10-06";
// 6 de octubre de 2026, 12:30 p.m. hora del centro de México (UTC-6)
const FIN = Date.parse("2026-10-06T18:30:00Z");
const RETRASO = 6000;

export default function AvisoWebinar() {
    const [abierto, setAbierto] = useState(false);

    useEffect(() => {
        if (Date.now() > FIN) return;
        try {
            if (window.localStorage.getItem(CLAVE)) return;
        } catch {
            // sin acceso al almacenamiento: se muestra igual
        }
        const id = window.setTimeout(() => setAbierto(true), RETRASO);
        return () => window.clearTimeout(id);
    }, []);

    const cerrar = () => {
        setAbierto(false);
        try {
            window.localStorage.setItem(CLAVE, "1");
        } catch {
            // no pasa nada si no se puede guardar
        }
    };

    if (!abierto) return null;

    return (
        <aside
            aria-label="Webinar Herramientas Predictivas"
            className="fixed bottom-4 left-4 z-40 w-[min(22rem,calc(100%-6.5rem))] overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10 motion-safe:animate-[aparecer_.4s_ease-out]"
        >
            <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar aviso del webinar"
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-primary shadow hover:bg-secondary"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="relative h-24 w-full">
                <Image src="/images/webinar/webinar-herramientas-mesa.webp" alt="" fill sizes="352px" className="object-cover object-[75%_30%]" />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <span className="inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        Webinar gratuito
                    </span>
                    <p className="mt-1 text-lg font-extrabold leading-tight text-white">Herramientas Predictivas</p>
                </div>
            </div>
            <div className="p-4 text-primary">
                <p className="text-sm font-bold">Martes 6 de octubre · 11:00 a.m. (centro de México)</p>
                <div className="mt-3 flex gap-2">
                    <Link
                        href="/webinar"
                        onClick={cerrar}
                        className="inline-flex flex-1 items-center justify-center rounded-xs bg-primary px-3 py-2 text-sm font-bold text-white transition-colors duration-300 hover:bg-secondary hover:text-primary"
                    >
                        Registrarme
                    </Link>
                    <a
                        href="/webinar-herramientas-predictivas.ics"
                        download
                        className="inline-flex flex-1 items-center justify-center rounded-xs border-2 border-primary px-3 py-1.5 text-sm font-bold text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
                    >
                        Al calendario
                    </a>
                </div>
            </div>
        </aside>
    );
}
