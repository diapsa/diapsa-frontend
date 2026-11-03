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
  "tipos-de-mantenimiento-industrial": {
    despuesDe: "Tabla comparativa de los tipos de mantenimiento",
    saltar: 1,
    titulo: "Los cuatro tipos, comparados",
    columnas: ["Tipo", "Cuándo interviene", "Qué información usa", "Costo típico", "Para qué equipos"],
    filas: [
      ["Correctivo", "Después de la falla", "Ninguna", "Bajo si es planificado; muy alto si es emergencia", "Redundantes, baratos, de bajo impacto"],
      ["Preventivo", "Por calendario u horas de uso", "El manual y el historial de fallas", "Medio; cambia piezas que a veces aún sirven", "Desgaste proporcional al uso, importancia media"],
      ["Predictivo", "Cuando la medición muestra que la falla empezó", "Vibraciones, termografía, ultrasonido, aceite, pruebas eléctricas", "Medio al inicio, el más bajo por paro evitado", "Críticos y caros de parar"],
      ["Prescriptivo", "En el momento óptimo que recomienda el sistema", "Todo lo anterior más criticidad, producción y refacciones", "Requiere plataforma y datos ordenados", "Críticos con historial y monitoreo en marcha"],
    ],
    pie: "Una planta sana combina los tres primeros según el equipo; el prescriptivo llega cuando el predictivo ya tiene historial.",
  },
  "mantenimiento-predictivo-que-es-tecnicas-y-ejemplos-reales": {
    despuesDe: "Las cinco técnicas del mantenimiento predictivo",
    saltar: 1,
    titulo: "Qué detecta cada técnica y en qué equipos",
    columnas: ["Técnica", "Qué detecta", "En qué equipos", "Cuánto avisa antes"],
    filas: [
      ["Termografía", "Conexiones flojas, sobrecarga, desbalance de fases, fricción", "Tableros, CCM, transformadores, subestaciones, motores", "Semanas a meses"],
      ["Vibraciones", "Desbalance, desalineación, holguras, rodamientos, engranes", "Motores, bombas, ventiladores, compresores, reductores", "Semanas a meses"],
      ["Ultrasonido", "Fugas de aire y gas, corona, trampas de vapor, rodamientos en etapa temprana", "Redes de aire comprimido, tableros de media tensión, rodamientos", "Meses"],
      ["Análisis de aceite", "Partículas de desgaste, agua, polvo, aceite degradado", "Reductores, sistemas hidráulicos, motores de combustión", "Meses"],
      ["Pruebas eléctricas", "Aislamiento degradado, barras rotas, desbalance de voltaje, armónicos", "Motores, transformadores, cables", "Meses a años"],
    ],
    pie: "El tiempo de aviso es el orden de magnitud habitual entre la primera señal y la falla funcional; varía con la carga y el tipo de equipo.",
  },
};

export const tablaDeGuia = (slug: string): TablaGuia | null => TABLAS[slug] ?? null;
