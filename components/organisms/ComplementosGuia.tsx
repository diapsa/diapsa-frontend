import DiagramaServicio from "./DiagramaServicio";
import ModosDeFalla from "./ModosDeFalla";
import Semaforo from "./Semaforo";
import type { Guia } from "@/types/guia";

/**
 * ComplementosGuia
 * Los bloques técnicos que acompañan a una guía del blog: la curva P-F, los
 * modos de falla con su espectro y el semáforo de severidad.
 *
 * Por qué viven aquí y no en la página de servicio: la página de servicio se
 * volvió comercial y corta, al estilo de Dynamox y Fracttal, que no explican
 * la disciplina sino lo que hacen. Lo educativo se mudó a la guía del blog,
 * que es donde llega quien todavía está aprendiendo. El texto del artículo
 * viene del CMS; estos bloques se agregan desde código según el slug, para
 * que sumar uno no exija tocar el CMS.
 *
 * Sin número de paso en los antetítulos: dentro de un artículo no hay una
 * secuencia que numerar.
 */

type Props = {
  guia: Guia;
};

export default function ComplementosGuia({ guia }: Props) {
  return (
    <div className="mt-10 border-t border-gray-100 pt-8 lg:pt-10">
      <p className="text-xs font-bold uppercase tracking-widest text-secondary">En imágenes</p>
      <h2 className="mt-2 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">
        {guia.titulo}
      </h2>
      {guia.subtitulo && (
        <p className="mt-3 text-justify text-base leading-relaxed text-tertiary lg:text-lg">
          {guia.subtitulo}
        </p>
      )}

      {/* Los organismos traen su propio <section> con márgenes de página;
          aquí van encadenados dentro de la columna del artículo. */}
      <div className="-mx-6 mt-4 lg:-mx-8">
        {guia.diagramas?.includes("curva-pf") && <DiagramaServicio clave="curva-pf" />}
        {guia.tabla && <ModosDeFalla tabla={guia.tabla} />}
        {guia.semaforo && (
          <Semaforo
            titulo={guia.semaforo.titulo}
            subtitulo={guia.semaforo.subtitulo}
            zonas={guia.semaforo.zonas}
          />
        )}
      </div>
    </div>
  );
}
