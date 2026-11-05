"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { fechaGrupo, proximosGrupos } from "@/lib/cursos";

/**
 * AvisoCurso
 * Ficha de esquina de la portada con el próximo curso abierto (Emiliano,
 * 2026-11-04: Termografía Infrarroja Categoría I, del 8 al 11 de diciembre).
 * Sustituye al aviso de las clínicas. La fecha sale del grupo en
 * data/cursos-extra.json, así que la ficha deja de mostrarse sola en cuanto
 * el curso empieza. Una vez cerrada no vuelve a salir en ese navegador.
 */

const SLUG = "termografia-infrarroja-curso-de-certificacion";
const TITULO = "Termografía Infrarroja, Categoría I";
const CLAVE = `aviso-curso-${SLUG}-2026-12`;
const RETRASO = 6000;

export default function AvisoCurso() {
    const [abierto, setAbierto] = useState(false);
    const grupo = proximosGrupos(SLUG)[0];

    useEffect(() => {
        if (!grupo || Date.now() >= new Date(`${grupo.inicio}T00:00:00`).getTime()) return;
        try {
            if (window.localStorage.getItem(CLAVE)) return;
        } catch {
            // sin acceso al almacenamiento: se muestra igual
        }
        const id = window.setTimeout(() => setAbierto(true), RETRASO);
        return () => window.clearTimeout(id);
    }, [grupo]);

    const cerrar = () => {
        setAbierto(false);
        try {
            window.localStorage.setItem(CLAVE, "1");
        } catch {
            // no pasa nada si no se puede guardar
        }
    };

    if (!abierto || !grupo) return null;

    const fecha = fechaGrupo(grupo);
    const whatsapp = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(
        `Hola, me interesa el curso de ${TITULO} del ${fecha}. ¿Me dan informes de costo e inscripción?`,
    )}`;

    return (
        <aside
            aria-label={`Próximo curso: ${TITULO}`}
            className="fixed bottom-4 left-4 z-40 w-[min(22rem,calc(100%-6.5rem))] overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10 motion-safe:animate-[aparecer_.4s_ease-out]"
        >
            <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar anuncio del curso"
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-primary shadow hover:bg-secondary"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="relative h-24 w-full">
                <Image src="/images/cursos/termografia/termografia-01.webp" alt="" fill sizes="352px" className="object-cover" />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <span className="inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        Próximo curso
                    </span>
                    <p className="mt-1 text-lg font-extrabold leading-tight text-white">{TITULO}</p>
                </div>
            </div>
            <div className="p-4 text-primary">
                <p className="text-sm font-extrabold">{fecha}</p>
                <p className="mt-1 text-justify text-sm leading-relaxed">
                    Curso de certificación conforme a ISO 18436-7 para inspectores termográficos, con más de cien ejercicios con imágenes reales.
                </p>
                <div className="mt-3 flex gap-2">
                    <Link
                        href={`/cursos/${SLUG}`}
                        prefetch={false}
                        onClick={cerrar}
                        className="inline-flex flex-1 items-center justify-center rounded-xs bg-primary px-3 py-2 text-sm font-bold text-white transition-colors duration-300 hover:bg-secondary hover:text-primary"
                    >
                        Ver el curso
                    </Link>
                    <a
                        href={whatsapp}
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
