import type { Industria } from "@/types/industria";
import generacionDeEnergia from "@/data/industrias/generacion-de-energia.json";
import petroleoYGas from "@/data/industrias/petroleo-y-gas.json";
import petroquimica from "@/data/industrias/petroquimica.json";
import alimentosYBebidas from "@/data/industrias/alimentos-y-bebidas.json";
import automotriz from "@/data/industrias/automotriz.json";
import manufactura from "@/data/industrias/manufactura.json";
import cementoYMateriales from "@/data/industrias/cemento-y-materiales.json";
import tratamientoDeAgua from "@/data/industrias/tratamiento-de-agua.json";
import energiasRenovables from "@/data/industrias/energias-renovables.json";

/**
 * Landings por industria (2026-10-01). Cada una vive en
 * data/industrias/<slug>.json; aquí se registran las que ya están
 * publicadas. La lista completa de giros, con el nombre que se ve en la
 * portada, sigue en data/industrias.json: las que no tienen landing se
 * muestran sin enlace.
 */
const INDUSTRIAS: Industria[] = [generacionDeEnergia, petroleoYGas, petroquimica, alimentosYBebidas, automotriz, manufactura, cementoYMateriales, tratamientoDeAgua, energiasRenovables] as unknown as Industria[];

export function getIndustrias(): Industria[] {
  return INDUSTRIAS;
}

export function getIndustria(slug: string): Industria | undefined {
  return INDUSTRIAS.find((i) => i.slug === slug);
}
