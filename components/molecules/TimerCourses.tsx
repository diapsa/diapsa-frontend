'use client';

import { useState, useEffect } from 'react';
import { getNextCourse } from '@/lib/api/courses';
import type { CourseDetail } from '@/types/course';

interface TimeLeft {
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
}

export function TimerCourses() {

    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [course, setCourse] = useState<CourseDetail | null>(null);

    useEffect(() => {
        getNextCourse()
            .then((data) => setCourse(data))
            .catch(() => setCourse(null));
    }, []);

    useEffect(() => {
        if (!course?.next_date) return;

        const calculateTimeLeft = (): TimeLeft | null => {
            const targetDate = new Date(course.next_date);
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                setIsExpired(true);
                return null;
            }

            const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
            const horas = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((difference % (1000 * 60)) / 1000);

            return { dias, horas, minutos, segundos };
        };

        // Calcular inmediatamente al recibir el curso
        const initialTime = calculateTimeLeft();
        setTimeLeft(initialTime);

        // Actualizar cada segundo
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [course]);

    // No mostrar nada si no hay curso, está expirado o aún cargando
    if (!course || isExpired || !timeLeft) {
        return null;
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 p-6 bg-linear-to-br from-primary to-primary/90 rounded-lg shadow-lg">
            <p className="text-white text-center font-semibold text-xl">
                Falta poco para el curso de: <span className="text-secondary">{course.name}</span>
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
                {new Date(course.next_date).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </p>
        </div>
    );
}