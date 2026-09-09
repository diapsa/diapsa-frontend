import { SITE_CONFIG } from "@/lib/constants";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Componente para inyectar datos estructurados JSON-LD
 * Usado para SEO y rich snippets en buscadores
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Esquemas predefinidos para reutilizar

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Grupo DIAPSA",
  alternateName: "DIAPSA",
  url: SITE_CONFIG.baseUrl,
  logo: `${SITE_CONFIG.baseUrl}/images/logo-diapsa.webp`,
  description:
    "Empresa líder en mantenimiento predictivo industrial, monitoreo de condición y servicios de mantenimiento para Mexico y Sudamérica.",
  foundingDate: "2002",
  areaServed: [
    {
      "@type": "Country",
      name: "Mexico",
    },
    {
      "@type": "Place",
      name: "Sudamérica",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    availableLanguage: ["Spanish"],
  },
  sameAs: [
    "https://www.facebook.com/grupodiapsa",
    "https://www.linkedin.com/company/grupodiapsa",
    "https://www.youtube.com/@grupodiapsa",
  ],
  knowsAbout: [
    "Mantenimiento Predictivo",
    "Monitoreo de Condición",
    "Servicios de Mantenimiento",
    "Termografía Infrarroja",
    "Análisis de Vibraciones",
    "Ultrasonido Industrial",
    "Estudios Eléctricos",
    "Diagnóstico de Maquinaria",
  ],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_CONFIG.baseUrl}/#organization`,
  name: "Grupo DIAPSA",
  telephone: SITE_CONFIG.contact.phone,
  image: `${SITE_CONFIG.baseUrl}/images/logo-diapsa.webp`,
  url: SITE_CONFIG.baseUrl,
  description:
    "Servicios de mantenimiento predictivo industrial, monitoreo de condición, termografía, vibraciones, ultrasonido y estudios eléctricos para Mexico y Sudamérica.",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 19.4326,
    longitude: -99.1332,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  areaServed: [
    {
      "@type": "Country",
      name: "Mexico",
    },
    {
      "@type": "Place",
      name: "Sudamérica",
    },
  ],
};

export function createProductSchema(product: {
  name: string;
  description: string;
  image: string;
  brand?: string;
  sku?: string;
  category?: string;
  url?: string; // Added for @id field
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": product.url ? `${SITE_CONFIG.baseUrl}${product.url}` : undefined,
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `${SITE_CONFIG.baseUrl}${product.image}`,
    brand: {
      "@type": "Brand",
      name: product.brand || "HIKMIKRO",
    },
    sku: product.sku,
    category: product.category || "Cámaras Termográficas",
    manufacturer: {
      "@type": "Organization",
      name: product.brand || "HIKMIKRO",
    },
    offers: {
      "@type": "Offer",
      url: product.url ? `${SITE_CONFIG.baseUrl}${product.url}` : undefined,
      availability: "https://schema.org/InStock",
      priceCurrency: "MXN",
      seller: {
        "@type": "Organization",
        name: "Grupo DIAPSA",
        url: SITE_CONFIG.baseUrl,
      },
    },
  };
}

export function createServiceSchema(service: {
  name: string;
  description: string;
  image?: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    image: service.image 
      ? (service.image.startsWith('http') ? service.image : `${SITE_CONFIG.baseUrl}${service.image}`)
      : undefined,
    serviceType: service.serviceType || "Mantenimiento Predictivo",
    provider: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
      url: SITE_CONFIG.baseUrl,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Mexico",
      },
      {
        "@type": "Place",
        name: "Sudamérica",
      },
    ],
  };
}

export function createCourseSchema(course: {
  name: string;
  description: string;
  url?: string;
  provider?: string;
  courseModes?: string[];
  duration?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    ...(course.url ? { url: course.url.startsWith('http') ? course.url : `${SITE_CONFIG.baseUrl}${course.url}` } : {}),
    provider: {
      "@type": "Organization",
      name: course.provider || "Grupo DIAPSA",
      url: SITE_CONFIG.baseUrl,
    },
    educationalLevel: "Professional",
    inLanguage: "es-MX",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.courseModes ?? ["Onsite", "Online"],
      // Solo se incluye la carga horaria cuando el CMS la provee (> 0).
      ...(course.duration
        ? { courseWorkload: `PT${course.duration}H` }
        : {}),
    },
  };
}

export function createFaqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.baseUrl}${item.url}`,
    })),
  };
}

export function createArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: article.image.startsWith('http') ? article.image : `${SITE_CONFIG.baseUrl}${article.image}`,
    datePublished: article.datePublished,
    author: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
      url: SITE_CONFIG.baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
      url: SITE_CONFIG.baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.baseUrl}/images/logo-diapsa.webp`,
      },
    },
    articleSection: article.category,
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Grupo DIAPSA",
    url: SITE_CONFIG.baseUrl,
    description:
      "Mantenimiento predictivo industrial, monitoreo de condición y servicios de mantenimiento para Mexico y Sudamérica.",
    publisher: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
      url: SITE_CONFIG.baseUrl,
    },
    inLanguage: "es-MX",
  };
}
