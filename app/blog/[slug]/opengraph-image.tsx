import { getBlogBySlug } from "@/lib/api/posts";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/renderOgImage";

export const alt = "Artículo de Grupo DIAPSA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug).catch(() => null);

  return renderOgImage({
    seccion: "Blog",
    titulo: post?.title ?? "Mantenimiento predictivo industrial",
    pie: "Grupo DIAPSA · México y Sudamérica",
  });
}
