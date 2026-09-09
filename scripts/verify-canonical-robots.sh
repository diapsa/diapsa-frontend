#!/bin/bash
# Script de verificación: Canonical tags y robots.txt
# Ejecutar después del deploy

echo "🔍 VERIFICACIÓN: Canonical Tags y robots.txt"
echo "=============================================="
echo ""

BASE_URL="https://www.grupodiapsa.com.mx"
LOCALHOST="http://localhost:3000"

# Usar localhost si está disponible, sino producción
if curl -s --connect-timeout 2 "$LOCALHOST" > /dev/null 2>&1; then
    URL="$LOCALHOST"
    echo "✅ Usando servidor local: $LOCALHOST"
else
    URL="$BASE_URL"
    echo "✅ Usando producción: $BASE_URL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Verificar robots.txt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ROBOTS_RESPONSE=$(curl -s "$URL/robots.txt")

if echo "$ROBOTS_RESPONSE" | grep -q "Sitemap: https://www.grupodiapsa.com.mx/sitemap.xml"; then
    echo "✅ robots.txt contiene sitemap correcto"
else
    echo "❌ robots.txt NO contiene sitemap"
fi

if echo "$ROBOTS_RESPONSE" | grep -q "Disallow: /images/"; then
    echo "❌ robots.txt bloquea /images/ (saca al sitio de Google Images y rompe la imagen OG)"
else
    echo "✅ robots.txt NO bloquea /images/"
fi

if echo "$ROBOTS_RESPONSE" | grep -qiE "fbclid|utm_source|gclid"; then
    echo "❌ robots.txt bloquea parametros de campana (impide rastrear landings legitimas)"
else
    echo "✅ robots.txt NO bloquea parametros de campana"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Verificar canonical tag en homepage"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

HOMEPAGE_CANONICAL=$(curl -s "$URL" | grep -o '<link rel="canonical"[^>]*>' | head -1)

if echo "$HOMEPAGE_CANONICAL" | grep -q "https://www.grupodiapsa.com.mx\""; then
    echo "✅ Homepage tiene canonical correcto:"
    echo "   $HOMEPAGE_CANONICAL"
else
    echo "❌ Homepage NO tiene canonical correcto"
    echo "   Encontrado: $HOMEPAGE_CANONICAL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Verificar sitemap.xml"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SITEMAP_RESPONSE=$(curl -s "$URL/sitemap.xml")

if echo "$SITEMAP_RESPONSE" | grep -q "<urlset"; then
    echo "✅ sitemap.xml es válido (contiene <urlset>)"
else
    echo "❌ sitemap.xml NO es válido"
fi

URL_COUNT=$(echo "$SITEMAP_RESPONSE" | grep -c "<loc>")
echo "📊 URLs en sitemap: $URL_COUNT"

# Verificar que NO haya query params en sitemap
QUERY_PARAMS=$(echo "$SITEMAP_RESPONSE" | grep "<loc>" | grep -c "?")
if [ "$QUERY_PARAMS" -eq 0 ]; then
    echo "✅ Sitemap NO contiene query params"
else
    echo "❌ Sitemap contiene $QUERY_PARAMS URLs con query params"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Verificar canonical en páginas dinámicas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Páginas de prueba (ajustar según disponibilidad real)
PAGES=(
    "/cursos"
    "/productos"
    "/servicios"
    "/blog"
)

for PAGE in "${PAGES[@]}"; do
    CANONICAL=$(curl -s "$URL$PAGE" | grep -o '<link rel="canonical"[^>]*>' | head -1)
    
    if echo "$CANONICAL" | grep -q "https://www.grupodiapsa.com.mx"; then
        echo "✅ $PAGE → canonical correcto"
    else
        echo "❌ $PAGE → canonical incorrecto o ausente"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Verificar Open Graph URLs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

OG_URL=$(curl -s "$URL" | grep -o 'property="og:url"[^>]*content="[^"]*"' | cut -d'"' -f4)

if echo "$OG_URL" | grep -q "https://www.grupodiapsa.com.mx"; then
    echo "✅ og:url correcto: $OG_URL"
else
    echo "❌ og:url incorrecto: $OG_URL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Servidor verificado: $URL"
echo ""
echo "Siguiente paso:"
echo "1. Si estás en local, hacer deploy a producción"
echo "2. Ejecutar nuevamente contra producción"
echo "3. Reenviar robots.txt y sitemap.xml en Google Search Console"
echo "4. Monitorear URLs indexadas en las próximas 2-4 semanas"
echo ""
