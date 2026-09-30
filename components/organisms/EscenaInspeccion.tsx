"use client";

import { useEffect, useRef } from "react";

/**
 * EscenaInspeccion
 * La inspección integral de IDAP de /servicios/idap (lib/escena-inspeccion.js),
 * hecha por Emiliano en Claude Diseño: cinco técnicas, resumen con costo de
 * falla y una pestaña por técnica que se recorren en bucle.
 *
 * Se monta al acercarse a la pantalla (con respaldo por scroll si el
 * IntersectionObserver no avisa): inserta el CSS y el marcado del diseño,
 * pone las imágenes térmicas en sus huecos data-slot, usa la tipografía
 * del sitio y llama a montar(); al desmontar limpia todo. La escena vieja
 * (EscenaIdap) sigue en las páginas de servicio.
 */

type Props = {
  /** Imágenes para los huecos data-slot del diseño (termica-principal, termica-anterior, termica-1…3). */
  imagenes?: Record<string, string>;
};

export default function EscenaInspeccion({ imagenes = {} }: Props) {
  const cuadro = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = cuadro.current;
    if (!root) return;
    let cancelado = false;
    let iniciada = false;
    let limpiar: (() => void) | null = null;

    const iniciar = () => {
      if (iniciada || cancelado) return;
      iniciada = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      import("@/lib/escena-inspeccion")
        .then(({ CSS, HTML, montar }) => {
          if (cancelado) return;
          const estilo = document.createElement("style");
          estilo.textContent = CSS;
          root.appendChild(estilo);
          const cont = document.createElement("div");
          cont.innerHTML = HTML;
          const raiz = cont.firstElementChild as HTMLElement;
          raiz.style.fontFamily = getComputedStyle(document.body).fontFamily;
          root.appendChild(raiz);
          Object.entries(imagenes).forEach(([slot, src]) => {
            raiz.querySelector(`img[data-slot="${slot}"]`)?.setAttribute("src", src);
          });
          try {
            const fin = montar(raiz);
            limpiar = () => {
              fin();
              raiz.remove();
              estilo.remove();
            };
          } catch (e) {
            console.warn("[inspección idap] no pudo montarse:", e);
          }
        })
        .catch((e) => console.warn("[inspección idap] no se pudo cargar:", e));
    };
    const comprobar = () => {
      const r = root.getBoundingClientRect();
      if (r.bottom > -300 && r.top < window.innerHeight + 300) iniciar();
    };
    const observador = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) iniciar();
    }, { rootMargin: "300px" });
    observador.observe(root);
    window.addEventListener("scroll", comprobar, { passive: true });
    comprobar();

    return () => {
      cancelado = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      limpiar?.();
    };
    // las imágenes se fijan una sola vez al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={cuadro} className="min-h-[640px] w-full lg:min-h-[1000px]" />;
}
