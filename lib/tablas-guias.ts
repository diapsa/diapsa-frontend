/**
 * Tablas dibujadas dentro de una guía del blog (Emiliano, 2026-10-21, para
 * subir del puesto 4 al 10). Google favorece la página que trae la tabla
 * de verdad, no una lista. El renderizador del blog no dibuja tablas, así
 * que se insertan desde la página justo después del encabezado que diga
 * `despuesDe`, conservando `saltar` bloques (por ejemplo, el párrafo que la
 * presenta). Se asocian por slug para no tocar el CMS.
 */

export type TablaGuia = {
  despuesDe: string;
  saltar?: number;
  titulo: string;
  columnas: string[];
  filas: string[][];
  pie?: string;
};

const TABLAS: Record<string, TablaGuia> = {
  "tabla-iso-10816-3-y-20816-3-limites-de-vibracion": {
    despuesDe: "Tabla de severidad de vibraciones ISO 10816-3",
    saltar: 1,
    titulo: "Límites entre zonas, en mm/s RMS",
    columnas: ["Grupo y base", "A / B", "B / C", "C / D"],
    filas: [
      ["Grupo 1 (de 300 kW a 50 MW), base rígida", "2.3", "4.5", "7.1"],
      ["Grupo 1 (de 300 kW a 50 MW), base flexible", "3.5", "7.1", "11.0"],
      ["Grupo 2 (de 15 a 300 kW), base rígida", "1.4", "2.8", "4.5"],
      ["Grupo 2 (de 15 a 300 kW), base flexible", "2.3", "4.5", "7.1"],
    ],
    pie: "Zona A: máquina nueva o recién reparada. Zona B: aceptable para operar sin restricción. Zona C: no apta para operar continuamente; programar la corrección. Zona D: la vibración puede causar daño.",
  },
};

export const tablaDeGuia = (slug: string): TablaGuia | null => TABLAS[slug] ?? null;
