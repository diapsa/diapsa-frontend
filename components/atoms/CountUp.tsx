"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CountUp
 * Cuenta de 0 al valor final cuando el número entra en pantalla.
 *
 * Por qué existe: DIAPSA tiene cifras fuertes (+50,000 fallas detectadas,
 * +1,500 servicios, +20 años) que hoy se leen como texto estático. Verlas subir
 * las convierte en un momento y hace que se registren.
 *
 * Reglas que respeta:
 * - `prefers-reduced-motion`: muestra el número final de golpe, sin contar.
 * - El valor final SIEMPRE queda en el DOM desde el primer render, así que
 *   Google y los lectores de pantalla leen la cifra real, no un cero.
 * - Usa requestAnimationFrame, no setInterval: no pelea con el hilo principal.
 */

type Props = {
  /** Valor final, en número. Ej: 50000 */
  valor: number;
  /** Texto antes del número. Ej: "+" */
  prefijo?: string;
  /** Duración de la cuenta en ms. */
  duracion?: number;
  className?: string;
};

// Desaceleración: rápido al principio, suave al final. Da sensación de
// "aterrizar" en la cifra en vez de cortarse de golpe.
const suavizar = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountUp({ valor, prefijo = "", duracion = 1600, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [actual, setActual] = useState(valor);
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sinMovimiento || typeof IntersectionObserver === "undefined") return;

    const nodo = ref.current;
    if (!nodo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setAnimar(true);
          observador.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!animar) return;
    let cuadro = 0;
    const inicio = performance.now();

    const paso = (ahora: number) => {
      const avance = Math.min((ahora - inicio) / duracion, 1);
      setActual(Math.round(suavizar(avance) * valor));
      if (avance < 1) cuadro = requestAnimationFrame(paso);
    };

    setActual(0);
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [animar, valor, duracion]);

  return (
    <span ref={ref} className={className}>
      {prefijo}
      {actual.toLocaleString("es-MX")}
    </span>
  );
}
