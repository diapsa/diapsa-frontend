import type { MetadataRoute } from "next";
import camerasData from "@/data/camaras.json";
import blogData from "@/data/blog.json";

const BASE_URL = "https://grupodiapsa.com";

// Lista de servicios disponibles
const serviceSlugs = [
  "termografia-infrarroja",
  "vibraciones-mecanicas",
  "diagnostico-de-maquinaria",
  "analisis-de-ultrasonido",
  "estudios-electricos",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/acerca-de`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/metodologia`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cursos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/camaras`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios-productos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Páginas de servicios
  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/servicios-productos/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Páginas de cámaras (productos)
  const cameraPages: MetadataRoute.Sitemap = [];
  camerasData.series.forEach((serie) => {
    serie.cameras.forEach((camera) => {
      cameraPages.push({
        url: `${BASE_URL}/camaras/${camera.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });

  // Páginas de blog (cuando se implemente)
  const blogPages: MetadataRoute.Sitemap = blogData.posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...cameraPages, ...blogPages];
}
