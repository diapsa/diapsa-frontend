"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ServiceEscena360 } from "@/types/servicio";

/**
 * Escena360
 * El motor del diagnóstico integral, con el mismo estilo que la escena de
 * vibraciones, y las cuatro técnicas como instrumentos sobre el mismo
 * rodamiento: la válvula con su frasco de aceite, el detector de
 * ultrasonido, el sensor de vibración y la cámara térmica. Cada una se
 * activa en el orden en que detecta la falla, despliega su panel y se
 * compacta; al cerrar, los cuatro hilos convergen en el rodamiento y
 * aparece el diagnóstico integrado. Bucle de catorce segundos.
 *
 * Historia. El flyer comercial explica el integral como un "360": la
 * máquina al centro y las disciplinas alrededor. La primera versión fue
 * HTML con fotos en círculo; la segunda, una órbita 3D con esferas sobre
 * fondo oscuro. Esta es la tercera, generada en Claude Diseño con el brief
 * de la página (docs/designs/diagnostico-integral-instrumentos.html): cada
 * técnica es su instrumento real tocando la máquina, y la escena es
 * hermana de la de vibraciones en cámara, materiales y paneles.
 *
 * Se porta igual que las demás escenas: la lógica vive en
 * lib/escena-integral.js, Three.js se carga por import dinámico solo
 * cuando la escena se acerca a la pantalla (con una comprobación manual de
 * respaldo, porque en algunos navegadores emulados el observador no
 * dispara), y todo se limpia al desmontar. Los textos de los paneles y del
 * diagnóstico vienen del JSON. Mientras carga, y sin WebGL, se ve el
 * render plano del motor. El estado queda en `data-escena` para
 * diagnosticar en campo.
 */

type Props = {
  escena: ServiceEscena360;
};

export default function Escena360({ escena }: Props) {
  const marco = useRef<HTMLDivElement>(null);
  const capa = useRef<HTMLDivElement>(null);
  const hilos = useRef<SVGSVGElement>(null);
  const [montada, setMontada] = useState(false);

  useEffect(() => {
    const root = marco.current;
    const escenaEl = capa.current;
    const svg = hilos.current;
    if (!root || !escenaEl || !svg) return;
    let cancelado = false;
    let iniciada = false;
    let limpiar: (() => void) | null = null;

    const datos = {
      satelites: escena.satelites.map((s) => ({ titulo: s.nombre, pildora: s.estado, valor: s.valor, detalle: s.detalle ?? "" })),
      resultado: escena.resultado,
    };

    const iniciar = () => {
      if (iniciada || cancelado) return;
      iniciada = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      window.removeEventListener("resize", comprobar);
      root.dataset.escena = "cargando";
      Promise.all([import("three"), import("@/lib/escena-integral")])
        .then(([THREE, { montarEscenaIntegral }]) => {
          if (cancelado) return;
          try {
            limpiar = montarEscenaIntegral(THREE, root, escenaEl, svg, datos);
            root.dataset.escena = "montada";
            setMontada(true);
          } catch (e) {
            root.dataset.escena = "error";
            console.warn("[escint] la escena no pudo montarse:", e);
          }
        })
        .catch((e) => {
          root.dataset.escena = "error";
          console.warn("[escint] no se pudo cargar la escena:", e);
        });
    };
    const comprobar = () => {
      const r = root.getBoundingClientRect();
      if (r.bottom > -400 && r.top < window.innerHeight + 400) iniciar();
    };
    const observador = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) iniciar();
    }, { rootMargin: "400px" });

    root.dataset.escena = "esperando";
    observador.observe(root);
    window.addEventListener("scroll", comprobar, { passive: true });
    window.addEventListener("resize", comprobar);
    comprobar();

    return () => {
      cancelado = true;
      observador.disconnect();
      window.removeEventListener("scroll", comprobar);
      window.removeEventListener("resize", comprobar);
      limpiar?.();
    };
  }, [escena]);

  return (
    <figure>
      <div
        ref={marco}
        className="escint mx-auto rounded-sm shadow-xl ring-1 ring-black/10"
        role="img"
        aria-label={`${escena.centro.nombre}. Cuatro técnicas miden el mismo rodamiento: ${escena.satelites
          .map((s) => `${s.nombre}, ${s.valor}${s.detalle ? ` ${s.detalle}` : ""}, ${s.estado}`)
          .join("; ")}. ${escena.resultado.titulo}, ${escena.resultado.coinciden}: ${escena.resultado.texto}`}
      >
        {/* Render plano mientras carga la escena, y si no hay WebGL */}
        <div
          aria-hidden="true"
          className={`absolute inset-[18%] flex items-center justify-center transition-opacity duration-700 ${
            montada ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image src={escena.centro.foto} alt="" width={900} height={600} sizes="(min-width: 1024px) 28vw, 60vw" className="h-auto w-full" priority />
        </div>
        <div ref={capa} className="escena" aria-hidden="true">
          <svg ref={hilos} className="hilos" viewBox="0 0 720 540" />
        </div>
      </div>
      {escena.pie && <figcaption className="mt-3 text-justify text-xs leading-relaxed text-tertiary/80">{escena.pie}</figcaption>}
    </figure>
  );
}
