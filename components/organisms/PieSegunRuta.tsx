"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FONDO_IDAP, ORO_IDAP, RUTA_IDAP } from "@/lib/idap-estilo";

/**
 * PieSegunRuta
 * Envuelve el pie de página y, solo en la página de IDAP, le pone la
 * identidad de la plataforma (Emiliano, 2026-09-29): el azul radial de
 * IDAP de fondo y el dorado del logo en lugar del naranja de DIAPSA.
 *
 * El pie usa bg-primary y text-secondary, que en globals.css salen de las
 * variables --primary y --secondary; aquí se redefinen para su contenido.
 * --primary queda transparente para que se vea el degradado del contenedor
 * (el pie no usa --primary para texto). En las demás páginas no hace nada.
 */
export default function PieSegunRuta({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  if (!ruta?.startsWith(RUTA_IDAP)) return <>{children}</>;
  const estilo = {
    "--primary": "transparent",
    "--secondary": ORO_IDAP,
    background: FONDO_IDAP,
  } as CSSProperties;
  return <div style={estilo}>{children}</div>;
}
