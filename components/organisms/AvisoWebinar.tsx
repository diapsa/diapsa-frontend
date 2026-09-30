"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/atoms/Modal";

/**
 * AvisoWebinar
 * Ventana emergente en la página de inicio que anuncia el webinar de
 * Herramientas Predictivas del 6 de octubre de 2026 (Emiliano, 2026-09-30).
 * Aparece a los pocos segundos, no interrumpe la carga, y una vez cerrada no
 * vuelve a salir en ese navegador. Deja de mostrarse sola cuando el webinar
 * termina, así que no hace falta quitarla a mano al día siguiente.
 */

const CLAVE = "aviso-webinar-2026-10-06";
// 6 de octubre de 2026, 12:30 p.m. hora del centro de México (UTC-6)
const FIN = Date.parse("2026-10-06T18:30:00Z");
const RETRASO = 4000;

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

    return (
        <Modal isOpen={abierto} onClose={cerrar} className="w-[calc(100%-2rem)] max-w-lg">
            <div className="relative aspect-[16/9] w-full">
                <Image
                    src="/images/gallery/capacitacion-img-2.jpg"
                    alt="Sesión de capacitación de Grupo DIAPSA"
                    fill
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/55" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                        Webinar gratuito
                    </span>
                    <p className="mt-2 text-2xl font-extrabold leading-tight text-white drop-shadow sm:text-3xl">
                        Herramientas Predictivas
                    </p>
                </div>
            </div>
            <div className="p-6 text-primary">
                <p className="text-lg font-bold">Martes 6 de octubre · 11:00 a.m.</p>
                <p className="text-sm text-tertiary">Hora del centro de México · en línea · 60 minutos más preguntas</p>
                <p className="mt-4 text-base leading-relaxed text-tertiary text-justify">
                    Qué herramienta predictiva conviene en cada equipo de tu planta y cómo interpretar lo que te dice. Sin costo.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/webinar"
                        onClick={cerrar}
                        className="inline-flex flex-1 items-center justify-center rounded-xs bg-primary px-6 py-3 font-bold text-white transition-colors duration-300 hover:bg-secondary hover:text-primary"
                    >
                        Quiero registrarme
                    </Link>
                    <a
                        href="/webinar-herramientas-predictivas.ics"
                        download
                        className="inline-flex flex-1 items-center justify-center rounded-xs border-2 border-primary px-6 py-2.5 font-bold text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
                    >
                        Agregar a mi calendario
                    </a>
                </div>
            </div>
        </Modal>
    );
}
