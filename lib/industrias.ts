import type { Industria } from "@/types/industria";
import generacionDeEnergia from "@/data/industrias/generacion-de-energia.json";

/**
 * Landings por industria (2026-10-01). Cada una vive en
 * data/industrias/<slug>.json; aquí se registran las que ya están
 * publicadas. La lista completa de giros, con el nombre que se ve en la
 * portada, sigue en data/industrias.json: las que no tienen landing se
 * muestran sin enlace.
 */
const INDUSTRIAS: Industria[] = [generacionDeEnergia as unknown as Industria];

export function getIndustrias(): Industria[] {
  return INDUSTRIAS;
}

export function getIndustria(slug: string): Industria | undefined {
  return INDUSTRIAS.find((i) => i.slug === slug);
}
