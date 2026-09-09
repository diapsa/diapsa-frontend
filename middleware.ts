import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware para limpiar URLs spam y normalizar el dominio.
 *
 * Funcionalidades:
 * 1. Bloquear rutas spam con 404
 * 2. Redirect 301 de parámetros query spam a URL limpia
 * 3. Normalizar el host al dominio canónico (www)
 * 4. Preservar parámetros legítimos de Next.js, de campañas y de analítica
 */

// ============================================================================
// CONFIGURACIÓN: Parámetros spam y rutas bloqueadas
// ============================================================================

/**
 * Lista de parámetros query considerados spam.
 * Estos serán removidos de la URL con redirect 301.
 *
 * IMPORTANTE: aquí NO van los parámetros de campaña ni de analítica
 * (utm_*, gclid, fbclid, msclkid). Removerlos con un 301 rompe la
 * atribución en GA4 y en Google/Meta Ads, porque el parámetro
 * desaparece antes de que la página cargue y el tag lo lea. Para SEO no
 * hacen falta: Google los ignora al consolidar en la URL canónica, que
 * ya declaramos en cada página.
 */
const SPAM_PARAMS = [
  'm',    // ?m= - parámetro spam común
  'r',    // ?r= - parámetro spam común
  'l',    // ?l= - parámetro spam común
  '_g',   // ?_g= - parámetro spam común
  'w',    // ?w= - parámetro spam común
];

/**
 * Patrones de rutas que deben ser bloqueadas con 404
 * Estas rutas son consideradas spam o maliciosas
 *
 * politician, mandate, sponsor y technical se comparan por prefijo a
 * proposito: las URLs spam reales que aparecen en Search Console llevan
 * sufijo (/politician-test, /politicians, /mandate-123, /sponsor-abc,
 * /technical-docs). Si algun dia el sitio necesita una ruta que empiece
 * con alguna de esas palabras, hay que acotar el patron.
 */
const SPAM_PATH_PATTERNS = [
  /^\/f\/special\//i,     // /f/special/*
  /^\/guide\//i,          // /guide/*
  /^\/politician/i,       // /politician*
  /^\/mandate/i,          // /mandate*
  /^\/sponsor/i,          // /sponsor*
  /^\/technical/i,        // /technical*
  /^\/e\/\d+\/?$/i,       // /e/[números]/ - URLs con números largos
  /^\/[a-z]\/\d{8,}\/?$/i, // Patrones como /x/12345678/ (letra + números largos)
];

/**
 * Dominio canónico del sitio. Debe coincidir con SITE_CONFIG.baseUrl
 * en lib/constants.ts.
 */
const CANONICAL_DOMAIN = 'www.grupodiapsa.com.mx';
const FORCE_WWW = true;

// ============================================================================
// MIDDLEWARE PRINCIPAL
// ============================================================================

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // -------------------------------------------------------------------------
  // 1. BLOQUEAR RUTAS SPAM (404)
  // -------------------------------------------------------------------------

  /**
   * Verifica si la ruta coincide con patrones spam conocidos
   * Retorna 404 para evitar indexación
   */
  for (const pattern of SPAM_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      // Retornar 404 - esto evita que Google indexe estas URLs
      return new NextResponse(null, { status: 404 });
    }
  }

  // -------------------------------------------------------------------------
  // 2. LIMPIAR PARÁMETROS QUERY SPAM
  // -------------------------------------------------------------------------

  /**
   * Analiza los parámetros query y remueve los spam
   * Preserva parámetros legítimos de la aplicación
   */
  const searchParams = new URLSearchParams(search);
  let hasSpamParams = false;

  // Crear lista de parámetros a eliminar
  const paramsToDelete: string[] = [];

  // Iterar sobre los parámetros de forma compatible
  searchParams.forEach((value, key) => {
    if (SPAM_PARAMS.includes(key.toLowerCase())) {
      paramsToDelete.push(key);
      hasSpamParams = true;
    }
  });

  // Eliminar parámetros spam
  if (hasSpamParams) {
    paramsToDelete.forEach(param => searchParams.delete(param));

    // Construir nueva URL sin parámetros spam
    const cleanSearch = searchParams.toString();
    url.search = cleanSearch ? `?${cleanSearch}` : '';

    // Redirect 301 permanente a URL limpia
    return NextResponse.redirect(url, { status: 301 });
  }

  // -------------------------------------------------------------------------
  // 3. NORMALIZAR EL DOMINIO CANÓNICO (www)
  // -------------------------------------------------------------------------

  /**
   * Red de seguridad por si la regla de Cloudflare se llegara a quitar.
   * Cloudflare ya resuelve hoy grupodiapsa.com y grupodiapsa.com.mx con
   * un 301 hacia www.grupodiapsa.com.mx.
   *
   * No se fuerza el protocolo aquí: la terminación TLS ocurre en
   * Cloudflare y el origen recibe la petición en claro, así que
   * redirigir a https:// desde el origen puede producir un bucle.
   * HTTPS lo garantizan Cloudflare y el proxy inverso.
   */
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  if (!isLocalhost && FORCE_WWW && hostname !== CANONICAL_DOMAIN) {
    const hostnameWithoutWww = hostname.replace(/^www\./, '');
    const canonicalWithoutWww = CANONICAL_DOMAIN.replace(/^www\./, '');

    // Solo redirigir si es el mismo dominio base pero sin www
    if (hostnameWithoutWww === canonicalWithoutWww) {
      url.hostname = CANONICAL_DOMAIN;
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // -------------------------------------------------------------------------
  // 4. PERMITIR TRÁFICO LEGÍTIMO
  // -------------------------------------------------------------------------

  /**
   * Si llegamos aquí, la URL es legítima
   * Continuar con el procesamiento normal de Next.js
   */
  return NextResponse.next();
}

// ============================================================================
// CONFIGURACIÓN DEL MATCHER
// ============================================================================

/**
 * Configuración de rutas donde se aplicará el middleware
 *
 * Excluye:
 * - /api/* - API routes
 * - /_next/* - Recursos internos de Next.js
 * - /favicon.ico, /robots.txt, etc. - Archivos estáticos
 * - /*.* - Archivos con extensión (imágenes, CSS, JS, etc.)
 */
export const config = {
  matcher: [
    /*
     * Aplica middleware a todas las rutas EXCEPTO:
     * - API routes (/api/*)
     * - Recursos de Next.js (/_next/*)
     * - Archivos estáticos (imágenes, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*$).*)',
  ],
};
