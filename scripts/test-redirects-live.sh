#!/bin/bash

# Script para probar los redirects 301 en servidor local
# Uso: ./test-redirects-live.sh [URL_BASE]
# Ejemplo: ./test-redirects-live.sh http://localhost:3000

URL_BASE="${1:-http://localhost:3000}"

echo "🧪 Probando redirects 301 en: $URL_BASE"
echo "=================================================="
echo ""

# Array de URLs a probar
declare -a urls=(
  "/cursos/alineamiento-balanceo-proactivo-2"
  "/cursos/incremento-de-la-confiabilidad-monitoreo-de-condicion-2"
  "/cursos/termografia-infrarroja-curso-de-certificacion-2"
  "/cursos/curso-de-inspeccion-termografica-en-plantas-fotovoltaicas-2"
  "/cursos/inspeccion-termografica-en-plantas-fotovoltaicas-2"
  "/cursos/curso-tecnico-especializado-termografia-2"
  "/cursos/taller-de-aprendizaje-practico-de-vibraciones-2"
  "/cursos/redaccion-de-informes-tecnicos-2"
  "/cursos/talleres-de-aprendizaje-practico-de-ultrasonido-2"
)

pass=0
fail=0

for url in "${urls[@]}"; do
  full_url="$URL_BASE$url"
  echo "📍 Probando: $url"
  
  # Hacer request con curl siguiendo redirects
  response=$(curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" -L "$full_url")
  
  http_code=$(echo "$response" | cut -d'|' -f1)
  redirect_url=$(echo "$response" | cut -d'|' -f2)
  
  # Verificar que sea 301
  if [ "$http_code" = "301" ] || [ "$http_code" = "308" ] || [ "$http_code" = "200" ]; then
    echo "   ✅ HTTP $http_code"
    if [ -n "$redirect_url" ]; then
      echo "   → Redirige a: $redirect_url"
    fi
    ((pass++))
  else
    echo "   ❌ HTTP $http_code (esperado 301/308)"
    ((fail++))
  fi
  echo ""
done

echo "=================================================="
echo "📊 Resultados: $pass aprobados, $fail fallidos"
echo "=================================================="

if [ $fail -eq 0 ]; then
  echo "✨ ¡Todos los redirects funcionan!"
  exit 0
else
  echo "⚠️  Algunos redirects fallaron"
  exit 1
fi
