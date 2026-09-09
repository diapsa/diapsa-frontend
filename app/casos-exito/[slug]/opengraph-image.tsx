import { getSuccessCaseBySlug } from "@/lib/api/posts";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/renderOgImage";

export const alt = "Caso de éxito de Grupo DIAPSA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caso = await getSuccessCaseBySlug(slug).catch(() => null);

  return renderOgImage({
    seccion: "Caso de éxito",
    titulo: caso?.title ?? "Resultados en planta con monitoreo predictivo",
    pie: "Grupo DIAPSA · +1,500 servicios realizados",
  });
}
