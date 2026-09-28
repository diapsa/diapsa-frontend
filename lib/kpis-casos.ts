import type { SuccessCase } from "@/types/post";
import type { Kpi } from "@/components/organisms/InicioPresencia";

/**
 * Las cuatro cifras de la franja de presencia de la portada, leídas de los
 * casos de éxito publicados en el CMS (decisión de Emiliano, 2026-09-27:
 * solo cifras documentadas). Cada una se busca por el caso y la etiqueta
 * de la métrica; si el caso o la métrica cambian de nombre en el CMS, esa
 * tarjeta simplemente no aparece.
 */
const ELEGIDAS = [
  { caso: "generadora", metrica: "reducción de condiciones críticas", etiqueta: "Menos condiciones críticas" },
  { caso: "vision-predictiva", metrica: "reducción de criticidad", etiqueta: "Reducción de criticidad" },
  { caso: "vision-predictiva", metrica: "retorno de inversión", etiqueta: "Retorno de la inversión" },
  { caso: "generadora", metrica: "ahorro estimado", etiqueta: "Ahorro estimado" },
];

// "12,251,300 USD" se lee mejor como "12.2 M USD"; sin redondear hacia arriba.
function corto(valor: string) {
  const m = valor.match(/^([\d,.]+)\s*(USD|MXN)?$/i);
  if (!m) return valor;
  const n = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 1_000_000) return valor;
  return `${(Math.floor(n / 100_000) / 10).toString()} M${m[2] ? " " + m[2].toUpperCase() : ""}`;
}

export function kpisDeCasos(casos: SuccessCase[]): Kpi[] {
  const salida: Kpi[] = [];
  for (const e of ELEGIDAS) {
    const c = casos.find((x) => x.slug.includes(e.caso));
    const m = c?.success_case.metrics?.find((x) => x.label.toLowerCase().includes(e.metrica));
    if (c && m) salida.push({ valor: corto(m.number), etiqueta: e.etiqueta, industria: c.success_case.industry, href: `/casos-exito/${c.slug}` });
  }
  return salida;
}
