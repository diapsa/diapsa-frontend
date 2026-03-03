'use client';

import { useState, useEffect } from 'react';
import dataCurso from '@/data/cursos.json';

interface TimeLeft {
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
}

// Función pura fuera del componente para evitar setState síncrono en useEffect
const calculateTimeLeft = (): TimeLeft | null => {
    // Parsear la fecha como fecha local, no UTC
    const [year, month, day] = dataCurso.proximoCurso.dateStart.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day); // month es 0-indexed en JavaScript
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) return null;

    const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
    const horas = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((difference % (1000 * 60)) / 1000);

    return { dias, horas, minutos, segundos };
};

export function TimerCourses() {
    // Inicialización lazy: se calcula una sola vez al montar, sin pasar por useEffect
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft());

    useEffect(() => {
        // Actualizar cada segundo
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Limpiar el intervalo al desmontar
        return () => clearInterval(timer);
    }, []);

    // Si la fecha ya pasó o aún no hay valor, no mostrar nada
    if (!timeLeft) {
        return null;
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 p-6 bg-linear-to-br from-primary to-primary/90 rounded-lg shadow-lg">
            <p className="text-white text-center font-semibold text-xl">
                Falta poco para el curso de: <span className="text-secondary">{dataCurso.proximoCurso.name}</span>
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-20">
                    <span className="text-5xl font-bold text-secondary">{timeLeft.dias}</span>
                    <span className="text-white text-sm mt-1">Días</span>
                </div>

                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-20">
                    <span className="text-5xl font-bold text-secondary">{timeLeft.horas}</span>
                    <span className="text-white text-sm mt-1">Horas</span>
                </div>

                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-20">
                    <span className="text-5xl font-bold text-secondary">{timeLeft.minutos}</span>
                    <span className="text-white text-sm mt-1">Minutos</span>
                </div>

                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-20">
                    <span className="text-5xl font-bold text-secondary">{timeLeft.segundos}</span>
                    <span className="text-white text-sm mt-1">Segundos</span>
                </div>
            </div>

            <p className="text-white/80 text-sm text-center">
                {(() => {
                    const [year, month, day] = dataCurso.proximoCurso.dateStart.split('-').map(Number);
                    return new Date(year, month - 1, day).toLocaleDateString('es-MX', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                })()} - {dataCurso.proximoCurso.loation}
            </p>
        </div>
    );
}