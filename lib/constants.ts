/**
 * Site configuration constants
 * 
 * IMPORTANT: This is the single source of truth for domain/URL configuration.
 * All files (robots.ts, sitemap.ts, JSON-LD schemas, etc.) MUST import from here.
 * 
 * Canonical domain: https://www.grupodiapsa.com.mx
 * - All other variants (grupodiapsa.com, grupodiapsa.com.mx without www) redirect 301
 * - Sitemap, robots.txt, and structured data MUST use this exact URL
 */

export const SITE_CONFIG = {
  /**
   * Canonical base URL (with www)
   * DO NOT use trailing slash
   */
  baseUrl: "https://www.grupodiapsa.com.mx",
  
  name: "Grupo DIAPSA",
  
  slogan: "Mantenimiento Predictivo Industrial",
  
  description:
    "Empresa líder en mantenimiento predictivo industrial, monitoreo de condición y servicios de mantenimiento para México y Sudamérica.",
  
  /**
   * Primary contact info
   */
  contact: {
    email: "info@grupodiapsa.com.mx",
    phone: "+52 81 4590 3792",
    /** Solo dígitos con lada de país, formato que exige wa.me. */
    whatsapp: "528145903792",
  },
  
  /**
   * Social media
   */
  social: {
    linkedin: "https://www.linkedin.com/company/grupo-diapsa",
    facebook: "https://www.facebook.com/grupodiapsa",
    // Add others as needed
  },
  
  /**
   * Default Open Graph image
   */
  defaultOgImage: "/images/og-images/og-image.jpg",
} as const;
