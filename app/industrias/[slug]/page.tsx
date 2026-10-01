import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaginaIndustria from "@/components/organisms/PaginaIndustria";
import { getIndustria, getIndustrias } from "@/lib/industrias";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamicParams = false;

export function generateStaticParams() {
  return getIndustrias().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industria = getIndustria(slug);
  if (!industria) return {};
  return {
    title: industria.seoTitle,
    description: industria.seoDescription,
    alternates: { canonical: `${SITE_CONFIG.baseUrl}/industrias/${industria.slug}` },
    openGraph: {
      title: `${industria.seoTitle} | Grupo DIAPSA`,
      description: industria.seoDescription,
      url: `${SITE_CONFIG.baseUrl}/industrias/${industria.slug}`,
      type: "website",
      locale: "es_MX",
      siteName: "Grupo DIAPSA",
      images: [{ url: "/images/og-images/og-image.jpg", width: 1200, height: 630, type: "image/jpeg", alt: `${industria.nombre} Grupo DIAPSA` }],
    },
  };
}

export default async function IndustriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industria = getIndustria(slug);
  if (!industria) notFound();
  return <PaginaIndustria industria={industria} />;
}
