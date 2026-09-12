type Props = {
  /** Número de paso en la línea argumentativa de la página, ej. "03". */
  paso?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Antetitulo
 * El renglón pequeño en mayúsculas que va encima de cada H2, con el número
 * del paso delante.
 *
 * Por qué existe: la página de servicio tiene ocho secciones y se leía como
 * una colección de bloques sueltos. Numerarlas hace visible que hay un
 * argumento (qué es, por qué medir, qué detectamos, cómo lo calificamos, cómo
 * trabajamos, qué recibes, cómo contratar) y no una lista. El número lo asigna
 * la plantilla en orden de aparición, así que si a un servicio le falta una
 * sección la numeración no salta.
 *
 * Hereda el color del contexto: en banda oscura se pasa la clase del texto.
 */
export default function Antetitulo({ paso, children, className = "text-secondary" }: Props) {
  return (
    <p className={`text-xs font-bold uppercase tracking-widest ${className}`}>
      {paso && (
        <span className="mr-3 opacity-60" aria-hidden="true">
          {paso}
        </span>
      )}
      {children}
    </p>
  );
}
