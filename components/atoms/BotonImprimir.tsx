"use client";

/** Botón que abre el diálogo de impresión, para guardar la hoja como PDF. */
export default function BotonImprimir({ texto = "Guardar como PDF" }: { texto?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center rounded-xs bg-secondary px-5 py-2.5 font-bold text-primary transition-colors hover:bg-primary hover:text-white print:hidden"
    >
      {texto}
    </button>
  );
}
