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
  url: "https://grupodiapsa.com",
  logo: "https://grupodiapsa.com/images/logo.png",
  description:
    "Empresa líder en mantenimiento predictivo industrial con más de 22 años de experiencia en termografía, análisis de vibraciones, ultrasonido y estudios eléctricos.",
  foundingDate: "2002",
  areaServed: {
    "@type": "Country",
    name: "México",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Spanish"],
  },
  sameAs: [
    "https://www.facebook.com/grupodiapsa",
    "https://www.linkedin.com/company/grupodiapsa",
    "https://www.youtube.com/@grupodiapsa",
  ],
  knowsAbout: [
    "Mantenimiento Predictivo",
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
  "@id": "https://grupodiapsa.com/#organization",
  name: "Grupo DIAPSA",
  image: "https://grupodiapsa.com/images/logo.png",
  url: "https://grupodiapsa.com",
  description:
    "Servicios de mantenimiento predictivo industrial: termografía, vibraciones, ultrasonido y estudios eléctricos.",
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
};

export function createProductSchema(product: {
  name: string;
  description: string;
  image: string;
  brand?: string;
  sku?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://grupodiapsa.com${product.image}`,
    brand: {
      "@type": "Brand",
      name: product.brand || "HIKMIKRO",
    },
    sku: product.sku,
    category: product.category || "Cámaras Termográficas",
    manufacturer: {
      "@type": "Organization",
      name: "HIKMIKRO",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "MXN",
      seller: {
        "@type": "Organization",
        name: "Grupo DIAPSA",
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
    image: service.image ? `https://grupodiapsa.com${service.image}` : undefined,
    serviceType: service.serviceType || "Mantenimiento Predictivo",
    provider: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
      url: "https://grupodiapsa.com",
    },
    areaServed: {
      "@type": "Country",
      name: "México",
    },
  };
}

export function createCourseSchema(course: {
  name: string;
  description: string;
  duration?: string;
  mode?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
      url: "https://grupodiapsa.com",
    },
    courseMode: course.mode || "Blended",
    timeRequired: course.duration,
    educationalLevel: "Professional",
    inLanguage: "es",
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
      item: `https://grupodiapsa.com${item.url}`,
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
    image: `https://grupodiapsa.com${article.image}`,
    datePublished: article.datePublished,
    author: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
    },
    publisher: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
      logo: {
        "@type": "ImageObject",
        url: "https://grupodiapsa.com/images/logo.png",
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
    url: "https://grupodiapsa.com",
    description:
      "Mantenimiento predictivo industrial: termografía, vibraciones, ultrasonido y estudios eléctricos.",
    publisher: {
      "@type": "Organization",
      name: "Grupo DIAPSA",
    },
    inLanguage: "es-MX",
  };
}
