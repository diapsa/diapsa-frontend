"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Aparece
 * Muestra su contenido con un deslizamiento suave cuando entra en pantalla.
 * Con prefers-reduced-motion aparece sin moverse. El contenido está en el
 * HTML desde el servidor: solo cambia la opacidad, así que los buscadores
 * lo leen igual.
 */
export default function Aparece({
  children,
  retraso = 0,
  desde = "abajo",
  className = "",
}: {
  children: ReactNode;
  retraso?: number;
  desde?: "abajo" | "izquierda" | "derecha" | "zoom";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mostrar = () => {
      setVisto(true);
      io.disconnect();
      window.removeEventListener("scroll", comprobar);
      window.removeEventListener("resize", comprobar);
    };
    // Respaldo por scroll: en algunos navegadores el IntersectionObserver no
    // avisa y el contenido se quedaba invisible
    const comprobar = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) mostrar();
    };
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) mostrar();
      },
      { rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", comprobar, { passive: true });
    window.addEventListener("resize", comprobar);
    const primero = requestAnimationFrame(comprobar);
    return () => {
      cancelAnimationFrame(primero);
      io.disconnect();
      window.removeEventListener("scroll", comprobar);
      window.removeEventListener("resize", comprobar);
    };
  }, []);

  const oculto = {
    abajo: "translate-y-8",
    izquierda: "-translate-x-10",
    derecha: "translate-x-10",
    zoom: "scale-95",
  }[desde];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
        visto ? "translate-x-0 translate-y-0 scale-100 opacity-100" : `${oculto} opacity-0`
      } ${className}`}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      {children}
    </div>
  );
}
