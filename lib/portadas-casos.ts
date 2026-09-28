/**
 * Portadas propias para algunos casos de éxito, con fotos reales de campo,
 * en lugar de la imagen del CMS (la de PTAR era una foto genérica de otra
 * planta). La usan la portada, el listado de casos y la página de cada caso.
 * Cuando el CMS tenga la foto nueva, basta con borrar la entrada de aquí.
 */
export const PORTADAS_CASOS: Record<string, { src: string; posicion?: string }> = {
  "diapsa-start-en-planta-de-tratamiento-de-agua-residual": {
    src: "/images/casos-exito/ptar-analista-clarificador.webp",
    posicion: "object-[center_30%]",
  },
};

