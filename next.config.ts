import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'diapsa-cms.test',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'cms-dipasa.test',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.grupodiapsa.com.mx',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'diapsa-storage.sfo3.cdn.digitaloceanspaces.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/storage/**',
      }
    ],
    // Desactivar optimización en desarrollo para permitir IPs privadas
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === 'true',
  },

  /**
   * Redirecciones 301 (permanentes) del sitio anterior hacia las páginas
   * actuales. Se usa statusCode: 301 explícito (con `permanent: true` Next
   * emitiría 308); ambos son permanentes, pero mantenemos 301 por consistencia
   * con el mapa de migración.
   *
   * Cada URL se declara con y sin slash final. Con la config por defecto
   * (trailingSlash: false) Next normaliza "/ruta/" -> "/ruta" antes de aplicar
   * estas reglas, por lo que la variante con slash encadena un salto extra pero
   * igualmente llega al destino; la dejamos declarada de forma explícita.
   *
   * NOTA: pronto llega el resto del mapa desde Search Console; agregar las
   * nuevas entradas dentro de este mismo bloque, ordenadas por sección.
   */
  async redirects() {
    return [
      // --- Página vieja de cámaras (borrada 2026-09-28) ---
      // Las cámaras HIKMICRO viven ahora en la tienda de /productos. Los
      // modelos que siguen a la venta van a su ficha; los demás, al catálogo.
      {
        source: '/camaras/hikmikro-m11',
        destination: '/productos/camaras-termograficas/hikmicro-m11',
        statusCode: 301,
      },
      {
        source: '/camaras/hikmikro-m11w',
        destination: '/productos/camaras-termograficas/hikmicro-m11w',
        statusCode: 301,
      },
      {
        source: '/camaras/hikmikro-m20',
        destination: '/productos/camaras-termograficas/hikmicro-m20',
        statusCode: 301,
      },
      {
        source: '/camaras/hikmikro-m20w',
        destination: '/productos/camaras-termograficas/hikmicro-m20w',
        statusCode: 301,
      },
      {
        source: '/camaras/hikmikro-m31',
        destination: '/productos/camaras-termograficas/hikmicro-m31',
        statusCode: 301,
      },
      {
        source: '/camaras/hikmikro-sp60',
        destination: '/productos/camaras-termograficas/hikmicro-sp60',
        statusCode: 301,
      },
      {
        source: '/camaras/:slug*',
        destination: '/productos?categoria=camaras-termograficas',
        statusCode: 301,
      },

      // --- Cursos y certificaciones ---
      {
        source: '/cursos-y-certificaciones/curso-vibraciones-mecanicas',
        destination: '/cursos/vibraciones-mecanicas-curso-de-certificacion',
        statusCode: 301,
      },
      {
        source: '/cursos-y-certificaciones/curso-vibraciones-mecanicas/',
        destination: '/cursos/vibraciones-mecanicas-curso-de-certificacion',
        statusCode: 301,
      },

      // --- Redirects de URLs duplicadas de cursos (sufijo -2) ---
      // Redirige URLs antiguas con sufijo '-2' a sus versiones canónicas sin sufijo.
      // Estas URLs duplicadas fueron creadas accidentalmente y generaban 404.
      // Patrón regex: captura cualquier slug de curso que termine en '-2' y redirige
      // a la versión sin el sufijo, manteniendo el resto del slug intacto.
      {
        source: '/cursos/:slug(.*)-2',
        destination: '/cursos/:slug',
        statusCode: 301,
      },
      {
        source: '/cursos/:slug(.*)-2/',
        destination: '/cursos/:slug',
        statusCode: 301,
      },

      // --- Webinar: variantes con mayúsculas o en plural que se comparten a mano ---
      {
        source: '/Webinar',
        destination: '/webinar',
        statusCode: 301,
      },
      {
        source: '/WEBINAR',
        destination: '/webinar',
        statusCode: 301,
      },
      {
        source: '/webinars',
        destination: '/webinar',
        statusCode: 301,
      },
      {
        source: '/Webinars',
        destination: '/webinar',
        statusCode: 301,
      },

      // --- Servicios renombrados ---
      {
        source: '/servicios/monitoreo-condicion/estudios-electricos',
        destination: '/servicios/monitoreo-condicion/calidad-de-energia',
        statusCode: 301,
      },
      {
        source: '/servicios/monitoreo-condicion/estudios-electricos/',
        destination: '/servicios/monitoreo-condicion/calidad-de-energia',
        statusCode: 301,
      },

      // --- Servicios y soluciones ---
      {
        source: '/servicios-y-soluciones/termografia-infrarroja',
        destination: '/servicios/monitoreo-condicion/termografia-infrarroja',
        statusCode: 301,
      },
      {
        source: '/servicios-y-soluciones/termografia-infrarroja/',
        destination: '/servicios/monitoreo-condicion/termografia-infrarroja',
        statusCode: 301,
      },
      {
        source: '/servicios-y-soluciones/vibraciones-mecanicas',
        destination: '/servicios/monitoreo-condicion/vibraciones-mecanicas',
        statusCode: 301,
      },
      {
        source: '/servicios-y-soluciones/vibraciones-mecanicas/',
        destination: '/servicios/monitoreo-condicion/vibraciones-mecanicas',
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
