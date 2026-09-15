/**
 * dolares
 * Formatea un monto en dólares con la coma de los miles.
 *
 * Por qué no se usa toLocaleString: este texto se arma en el servidor y en el
 * navegador, y si los dos no formatean igual React marca el desajuste al
 * hidratar. Así el resultado es el mismo en los dos lados, sin depender del
 * idioma que traiga el equipo del visitante.
 */
export function dolares(n: number) {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
