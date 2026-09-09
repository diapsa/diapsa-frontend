"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal
 * Aparición al entrar en pantalla: fundido + subida corta.
 *
 * Por qué existe: es el movimiento que hace que un sitio "se sienta vivo" al
 * recorrerlo, y el que usan las referencias del sector (Fracttal, MaintainX).
 * Acompaña la lectura, no compite con ella.
 *
 * DISEÑADO PARA FALLAR VISIBLE, NO INVISIBLE. Una animación de entrada mal
 * hecha deja secciones en blanco, que es mucho peor que no tener animación:
 *
 * - El HTML del servidor viene VISIBLE. El ocultamiento ocurre solo en el
 *   cliente y solo para lo que está bajo el pliegue, así que si el JavaScript
 *   no corre o falla al hidratar, todo el contenido se ve igual.
 * - Se comprueba la POSICIÓN del elemento, no la transición de intersección.
 *   IntersectionObserver solo avisa cuando la intersección cambia: en un salto
 *   de scroll (ancla #contacto, restauración al recargar, Ctrl+End) un elemento
 *   pasa de "abajo" a "arriba" sin intersectar nunca, el aviso no llega y la
 *   sección quedaba oculta para siempre. Comprobar la posición no tiene ese hueco.
 * - `prefers-reduced-motion` desactiva todo y deja el contenido visible.
 */

type Estado = "inicial" | "oculto" | "visible";

type Props = {
  children: React.ReactNode;
  /** Retraso en ms, para escalonar elementos hermanos. */
  delay?: number;
  className?: string;
};

// Margen para que la animación arranque un poco antes de que el borde inferior
// lo alcance, y no justo cuando ya se está leyendo.
const MARGEN = 60;

export default function Reveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // "inicial" = lo que sirve el servidor: visible y sin transición.
  const [estado, setEstado] = useState<Estado>("inicial");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEstado("visible");
      return;
    }

    const nodo = ref.current;
    if (!nodo) return;

    // Entró en pantalla, o el usuario ya pasó de largo. En ambos casos: mostrar.
    const yaLeCorresponde = () => nodo.getBoundingClientRect().top < window.innerHeight - MARGEN;

    if (yaLeCorresponde()) {
      setEstado("visible");
      return;
    }

    setEstado("oculto");

    let pendiente = false;
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        if (yaLeCorresponde()) {
          setEstado("visible");
          limpiar();
        }
      });
    };

    const limpiar = () => {
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
    };

    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar, { passive: true });
    return limpiar;
  }, []);

  const oculto = estado === "oculto";
  const conTransicion = estado !== "inicial";

  return (
    <div
      ref={ref}
      className={`${conTransicion ? "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out" : ""} ${
        oculto ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
      } ${className}`}
      style={{ transitionDelay: estado === "visible" ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
