import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * robots.txt del sitio.
 *
 * Esta es la unica fuente: no debe existir tambien un public/robots.txt,
 * porque los dos resuelven a la misma URL y el estatico gana, dejando
 * este archivo sin efecto y el dominio del sitemap desactualizado.
 *
 * Nota sobre lo que NO se bloquea a proposito:
 * - /images/ se deja abierto. Bloquearlo saca al sitio de Google Images
 *   y ademas impide rastrear la imagen Open Graph, lo que rompe las
 *   vistas previas en LinkedIn y WhatsApp.
 * - manifest.json se deja abierto porque el layout lo referencia como
 *   manifest PWA.
 * - Los parametros de campana (utm_*, gclid, fbclid) tampoco se bloquean:
 *   Google los consolida con la URL canonica que ya declara cada pagina,
 *   y bloquearlos impediria rastrear paginas de destino legitimas.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          // Rutas spam del sitio anterior que el middleware responde con 404.
          "/f/special/",
          "/guide/",
          "/politician",
          "/mandate",
          "/sponsor",
          "/technical",
          // Ruta invalida generada por un subdominio mal enlazado.
          "/mail.grupodiapsa",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.baseUrl}/sitemap.xml`,
    host: SITE_CONFIG.baseUrl,
  };
}
