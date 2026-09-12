/**
 * IconoTarjeta
 * Ícono para las tarjetas de contenido de una página de servicio.
 *
 * Por qué existe: las ocho tarjetas eran ocho bloques de prosa idénticos entre
 * sí, un muro de texto donde nada guiaba la vista. Un ícono por tarjeta le da
 * ritmo a la cuadrícula y permite reconocer de un vistazo de qué trata cada
 * una, sin tener que leerlas todas.
 *
 * La clave es el `id` del bloque en el JSON del servicio. Si un bloque nuevo no
 * tiene ícono, no se dibuja nada y la tarjeta se ve como antes.
 */

const TRAZOS: Record<string, string> = {
  // Engrane: dónde se aplica.
  aplicaciones:
    "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964",
  // Alerta triangular: fallas que detecta.
  fallas:
    "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  // Documento con sello: metodología y normas.
  metodologia:
    "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  // Flecha ascendente: beneficios.
  beneficios:
    "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
  // Hoja de reporte: qué recibes.
  entregable:
    "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  // Flechas en ciclo: puntual o continuo.
  modalidades:
    "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
  // Campana: si aparece algo grave.
  "aviso-inmediato":
    "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
  // Nube con datos: plataforma IDAP.
  "plataforma-idap":
    "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z",
};

type Props = {
  id: string;
  className?: string;
};

export default function IconoTarjeta({ id, className = "" }: Props) {
  const trazo = TRAZOS[id];
  if (!trazo) return null;

  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-secondary/10 ${className}`}
      aria-hidden="true"
    >
      <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={trazo} />
      </svg>
    </span>
  );
}
