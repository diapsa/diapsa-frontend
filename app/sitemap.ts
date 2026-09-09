import type { MetadataRoute } from "next";
import serviciosData from "@/data/servicios.json";
import { getBlogs } from "@/lib/api/posts";
import { getCourses } from "@/lib/api/courses";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { SITE_CONFIG } from "@/lib/constants";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";


type ServiceItem = {
  href: string;
  children?: ServiceItem[];
};

function getServiceHrefs(services: ServiceItem[]): string[] {
  return services.flatMap((service) => [
    service.href,
    ...(service.children ? getServiceHrefs(service.children) : []),
  ]);
}

function getRootCategorySlugs(categories: Category[]): string[] {
  return categories
    .filter((category) => !category.parent)
    .map((category) => category.slug);
}

async function getAllProducts(): Promise<Product[]> {
  const firstPage = await getProducts({ page: 1, per_page: 100 });
  const products = [...firstPage.data];

  for (let page = 2; page <= firstPage.meta.last_page; page++) {
    const response = await getProducts({ page, per_page: 100 });
    products.push(...response.data);
  }

  return products;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Fecha de última revisión del contenido que no trae fecha propia del CMS.
  // Antes aquí iba `new Date()`, evaluado en CADA petición: el sitemap le decía
  // a Google que todas las URLs habían cambiado hoy, en cada rastreo. Eso es
  // señal de baja calidad y enseña al buscador a ignorar nuestras fechas.
  // Actualiza esta constante cuando cambies contenido de páginas estáticas.
  const ULTIMA_REVISION = new Date("2026-09-01T00:00:00Z");
  const [blogs, courses, categories, products] = await Promise.all([
    getBlogs(),
    getCourses(),
    getCategories(),
    getAllProducts(),
  ]);

  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.baseUrl,
      lastModified: ULTIMA_REVISION,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.baseUrl}/acerca-de`,
      lastModified: ULTIMA_REVISION,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.baseUrl}/metodologia`,
      lastModified: ULTIMA_REVISION,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.baseUrl}/cursos`,
      lastModified: ULTIMA_REVISION,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.baseUrl}/servicios`,
      lastModified: ULTIMA_REVISION,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.baseUrl}/productos`,
      lastModified: ULTIMA_REVISION,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Páginas de servicios
  const servicePages: MetadataRoute.Sitemap = getServiceHrefs(serviciosData).map((href) => ({
    url: `${SITE_CONFIG.baseUrl}${href}`,
    lastModified: ULTIMA_REVISION,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));


  const categoryPages: MetadataRoute.Sitemap = [...new Set(getRootCategorySlugs(categories))].map((slug) => ({
    url: `${SITE_CONFIG.baseUrl}/productos/${slug}`,
    lastModified: ULTIMA_REVISION,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_CONFIG.baseUrl}/productos/${product.category.slug}/${product.slug}`,
    lastModified: ULTIMA_REVISION,
    changeFrequency: "monthly" as const,
    priority: 0.8, // Aumentado de 0.7 → 0.8 (son páginas de conversión)
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${SITE_CONFIG.baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const cursosPages: MetadataRoute.Sitemap = courses.data.map((course) => ({
    url: `${SITE_CONFIG.baseUrl}/cursos/${course.slug}`,
    lastModified: ULTIMA_REVISION, // faltaba por completo
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...categoryPages, ...productPages, ...blogPages, ...cursosPages];


}
