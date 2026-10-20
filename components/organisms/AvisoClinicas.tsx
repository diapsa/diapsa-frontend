"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RUTA_CLINICAS, whatsappClinica } from "@/lib/clinicas";

/**
 * AvisoClinicas
 * Anuncio de las clínicas técnicas en la portada (Emiliano, 2026-10-10),
 * en el lugar del aviso del webinar que ya pasó. Misma forma: tarjeta en la
 * esquina que aparece a los pocos segundos y no tapa la lectura. Una vez
 * cerrada no vuelve a salir en ese navegador. Para retirarlo, quitarlo de
 * app/page.tsx o poner fecha en FIN.
 */

const CLAVE = "aviso-clinicas-2026-10";
/** Fecha en que deja de mostrarse sola; null para que siga. */
const FIN: number | null = null;
const RETRASO = 6000;

export default function AvisoClinicas() {
    const [abierto, setAbierto] = useState(false);

    useEffect(() => {
        if (FIN && Date.now() > FIN) return;
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
            aria-label="Nuevas clínicas técnicas en vivo"
            className="fixed bottom-4 left-4 z-40 w-[min(22rem,calc(100%-6.5rem))] overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10 motion-safe:animate-[aparecer_.4s_ease-out]"
        >
            <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar anuncio de las clínicas técnicas"
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-primary shadow hover:bg-secondary"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="relative h-24 w-full">
                <Image src="/images/cursos/clinicas/configuracion-de-la-camara-termografica.webp" alt="" fill sizes="352px" className="object-cover" />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <span className="inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        Nuevo
                    </span>
                    <p className="mt-1 text-lg font-extrabold leading-tight text-white">Clínicas técnicas en vivo</p>
                </div>
            </div>
            <div className="p-4 text-primary">
                <p className="text-justify text-sm leading-relaxed">
                    Un tema puntual en dos horas, en línea, con un especialista y tu propio caso. Vibraciones, termografía y ultrasonido.
                </p>
                <div className="mt-3 flex gap-2">
                    <Link
                        href={RUTA_CLINICAS}
                        prefetch={false}
                        onClick={cerrar}
                        className="inline-flex flex-1 items-center justify-center rounded-xs bg-primary px-3 py-2 text-sm font-bold text-white transition-colors duration-300 hover:bg-secondary hover:text-primary"
                    >
                        Ver los temas
                    </Link>
                    <a
                        href={whatsappClinica()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={cerrar}
                        className="inline-flex flex-1 items-center justify-center rounded-xs border-2 border-primary px-3 py-1.5 text-sm font-bold text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
                    >
                        Preguntar
                    </a>
                </div>
            </div>
        </aside>
    );
}
