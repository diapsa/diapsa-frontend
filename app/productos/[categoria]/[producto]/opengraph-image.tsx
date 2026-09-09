import { getProductBySlug } from "@/lib/api/products";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/renderOgImage";

export const alt = "Equipo distribuido por Grupo DIAPSA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>;
}) {
  const { producto } = await params;
  const item = await getProductBySlug(producto).catch(() => null);

  return renderOgImage({
    seccion: item?.brand?.name ?? "Equipos y cámaras",
    titulo: item?.name ?? "Equipos de diagnóstico industrial",
    pie: "Asesoría de selección · Grupo DIAPSA",
  });
}
