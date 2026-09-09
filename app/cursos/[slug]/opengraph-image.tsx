import { getCourseBySlug } from "@/lib/api/courses";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/renderOgImage";

export const alt = "Curso de Grupo DIAPSA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Si el CMS no responde, se genera igual con un título genérico en vez de
  // romper la ruta.
  const curso = await getCourseBySlug(slug).catch(() => null);

  return renderOgImage({
    seccion: "Cursos y certificaciones",
    titulo: curso?.name ?? "Capacitación en mantenimiento predictivo",
    pie: "Certificación profesional · 22 años de experiencia",
  });
}
